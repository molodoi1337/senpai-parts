import { carGens, carTitle, genById, makeById, type CarGen } from '@/data/cars'
import { brandById, categories, categoryById } from '@/data/catalog-meta'
import { productBySlug, products, type Condition, type PartType, type Product } from '@/data/products'
import { articles } from '@/data/blog'
import { normalize, sleep } from '@/lib/utils'

/* Мок-бэкенд: та же форма ответа, что отдавал бы реальный REST API.
   Чтобы подключить настоящий сервер, достаточно заменить тела функций на fetch(). */

const latency = () => sleep(220 + Math.random() * 260)

export type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'new' | 'discount'

export interface CatalogQuery {
  q?: string
  cat?: string[]
  brand?: string[]
  type?: PartType[]
  condition?: Condition[]
  car?: string
  make?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  sale?: boolean
  rating?: number
  sort?: SortKey
  page?: number
  perPage?: number
}

export interface Facets {
  categories: Record<string, number>
  brands: Record<string, number>
  types: Record<string, number>
  conditions: Record<string, number>
}

export interface CatalogResult {
  items: Product[]
  total: number
  page: number
  pages: number
  facets: Facets
}

const searchIndex = new Map<string, string>(
  products.map((p) => {
    const cars = p.compat.map((id) => genById[id]).filter(Boolean) as CarGen[]
    const hay = [
      p.name,
      p.sku,
      p.oem,
      brandById[p.brandId].name,
      categoryById[p.categoryId].name,
      categoryById[p.categoryId].jp,
      ...cars.flatMap((g) => [carTitle(g), g.model, g.gen, ...g.chassis, ...g.engines]),
      ...p.specs.map(([, v]) => v),
    ].join(' ')
    return [p.id, normalize(hay)]
  }),
)

function scoreProduct(p: Product, terms: string[]) {
  const hay = searchIndex.get(p.id)!
  let score = 0
  for (const t of terms) {
    if (!hay.includes(t)) return 0
    score += 1
    if (normalize(p.name).includes(t)) score += 3
    if (normalize(p.oem) === t || normalize(p.sku) === t) score += 20
  }
  return score + p.sold / 10000
}

const splitTerms = (q: string) =>
  q
    .toLowerCase()
    .split(/\s+/)
    .map(normalize)
    .filter((t) => t.length > 0)

function matches(p: Product, q: CatalogQuery, skip?: keyof CatalogQuery) {
  if (skip !== 'cat' && q.cat?.length && !q.cat.includes(p.categoryId)) return false
  if (skip !== 'brand' && q.brand?.length && !q.brand.includes(p.brandId)) return false
  if (skip !== 'type' && q.type?.length && !q.type.includes(p.type)) return false
  if (skip !== 'condition' && q.condition?.length && !q.condition.includes(p.condition)) return false
  if (q.car && !(p.universal || p.compat.includes(q.car))) return false
  if (q.make && !(p.universal || p.compat.some((id) => genById[id]?.makeId === q.make))) return false
  if (q.priceMin != null && p.price < q.priceMin) return false
  if (q.priceMax != null && p.price > q.priceMax) return false
  if (q.inStock && p.stock <= 0) return false
  if (q.sale && !p.oldPrice) return false
  if (q.rating && p.rating < q.rating) return false
  return true
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.sold - a.sold,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  new: (a, b) => b.createdAt - a.createdAt,
  discount: (a, b) => (b.oldPrice ? 1 - b.price / b.oldPrice : 0) - (a.oldPrice ? 1 - a.price / a.oldPrice : 0),
}

function count<T extends string>(items: Product[], key: (p: Product) => T) {
  const out: Record<string, number> = {}
  for (const p of items) out[key(p)] = (out[key(p)] ?? 0) + 1
  return out
}

export function queryCatalog(q: CatalogQuery): CatalogResult {
  const terms = q.q ? splitTerms(q.q) : []
  const base = terms.length ? products.filter((p) => scoreProduct(p, terms) > 0) : products

  const filtered = base.filter((p) => matches(p, q))
  const sort = q.sort ?? 'popular'
  const sorted =
    terms.length && sort === 'popular'
      ? [...filtered].sort((a, b) => scoreProduct(b, terms) - scoreProduct(a, terms))
      : [...filtered].sort(sorters[sort])

  const perPage = q.perPage ?? 24
  const pages = Math.max(1, Math.ceil(sorted.length / perPage))
  const page = Math.min(Math.max(1, q.page ?? 1), pages)

  // Фасеты считаются «без себя», чтобы чекбоксы показывали реальное число вариантов
  const facets: Facets = {
    categories: count(base.filter((p) => matches(p, q, 'cat')), (p) => p.categoryId),
    brands: count(base.filter((p) => matches(p, q, 'brand')), (p) => p.brandId),
    types: count(base.filter((p) => matches(p, q, 'type')), (p) => p.type),
    conditions: count(base.filter((p) => matches(p, q, 'condition')), (p) => p.condition),
  }

  return { items: sorted.slice((page - 1) * perPage, page * perPage), total: sorted.length, page, pages, facets }
}

export async function fetchCatalog(q: CatalogQuery) {
  await latency()
  return queryCatalog(q)
}

export interface ProductDetails {
  product: Product
  related: Product[]
  bundle: Product[]
}

export async function fetchProduct(slug: string): Promise<ProductDetails | null> {
  await latency()
  const product = productBySlug[slug]
  if (!product) return null
  const related = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .sort((a, b) => overlap(b, product) - overlap(a, product) || b.sold - a.sold)
    .slice(0, 10)

  const bundleCats: Record<string, string[]> = {
    brakes: ['oils', 'brakes'],
    engine: ['filters', 'oils', 'timing'],
    filters: ['oils', 'filters'],
    oils: ['filters'],
    suspension: ['suspension', 'wheels'],
    turbo: ['exhaust', 'filters', 'cooling'],
    exhaust: ['turbo', 'filters'],
    ignition: ['ignition', 'filters'],
    timing: ['cooling', 'timing'],
  }
  const wanted = bundleCats[product.categoryId] ?? ['oils', 'filters']
  const bundle = wanted
    .map((cat) =>
      products
        .filter((p) => p.categoryId === cat && p.id !== product.id && p.stock > 0 && (p.universal || overlap(p, product) > 0))
        .sort((a, b) => b.sold - a.sold)[0],
    )
    .filter((p): p is Product => Boolean(p))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 2)

  return { product, related, bundle }
}

const overlap = (a: Product, b: Product) => a.compat.filter((id) => b.compat.includes(id)).length

export async function fetchShowcase(kind: 'hot' | 'best' | 'new' | 'jdm', limit = 12) {
  await latency()
  const pick = {
    hot: () => [...products].filter((p) => p.oldPrice && p.stock > 0).sort(sorters.discount),
    best: () => [...products].sort(sorters.popular),
    new: () => [...products].sort(sorters.new),
    jdm: () => [...products].filter((p) => p.type === 'tuning').sort(sorters.rating),
  }[kind]
  return pick().slice(0, limit)
}

export async function fetchByIds(ids: string[]) {
  await latency()
  return ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p))
}

/* ───────── Мгновенный поиск для Command Palette ───────── */

export interface QuickResults {
  products: Product[]
  categories: typeof categories
  cars: CarGen[]
  articles: typeof articles
}

export function quickSearch(q: string, limit = 6): QuickResults {
  const terms = splitTerms(q)
  if (!terms.length) return { products: [], categories: [], cars: [], articles: [] }
  const has = (s: string) => terms.every((t) => normalize(s).includes(t))
  return {
    products: products
      .map((p) => [p, scoreProduct(p, terms)] as const)
      .filter(([, s]) => s > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([p]) => p),
    categories: categories.filter((c) => has(`${c.name} ${c.jp} ${c.blurb}`)).slice(0, 4),
    cars: carGens.filter((g) => has(`${carTitle(g)} ${g.chassis.join(' ')} ${g.engines.join(' ')} ${g.jp ?? ''} ${g.nickname ?? ''}`)).slice(0, 4),
    articles: articles.filter((a) => has(`${a.title} ${a.tag}`)).slice(0, 3),
  }
}

/* ───────── Расшифровка VIN / номера кузова ───────── */

export interface VinResult {
  input: string
  kind: 'vin' | 'frame'
  make?: string
  year?: number
  candidates: CarGen[]
  serial?: string
}

const wmi: Record<string, string> = {
  JT: 'toyota', JTH: 'lexus', JTJ: 'lexus', JN: 'nissan', JNK: 'infiniti', JH: 'honda', JM: 'mazda', JF: 'subaru',
  JA: 'mitsubishi', JMB: 'mitsubishi', JS: 'suzuki', JD: 'daihatsu', SJN: 'nissan', VNK: 'toyota', MR0: 'toyota',
}

const yearCodes = 'ABCDEFGHJKLMNPRSTVWXY123456789'

export async function decodeVin(raw: string): Promise<VinResult> {
  await sleep(900)
  const input = raw.toUpperCase().replace(/\s+/g, '')
  const frame = input.match(/^([A-Z0-9]{2,7})-?(\d{4,7})$/)

  if (input.length !== 17 && frame) {
    const [, chassis, serial] = frame
    const candidates = carGens.filter((g) => g.chassis.some((c) => c === chassis || chassis.startsWith(c) || c.startsWith(chassis)))
    return { input, kind: 'frame', candidates, make: candidates[0]?.makeId, serial }
  }

  if (input.length === 17) {
    const makeId = wmi[input.slice(0, 3)] ?? wmi[input.slice(0, 2)]
    const yc = input[9]
    let year: number | undefined
    const pos = yearCodes.indexOf(yc)
    if (pos >= 0) {
      year = 2010 + pos
      if (year > new Date().getFullYear() + 1) year -= 30
    }
    const candidates = carGens.filter(
      (g) => g.makeId === makeId && (!year || (g.years[0] <= year && (g.years[1] ?? 9999) >= year)),
    )
    return { input, kind: 'vin', make: makeId, year, candidates }
  }

  return { input, kind: 'frame', candidates: [] }
}

export const makeName = (id?: string) => (id ? makeById[id]?.name : undefined)
