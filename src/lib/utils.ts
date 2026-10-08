import clsx, { type ClassValue } from 'clsx'

export const cn = (...inputs: ClassValue[]) => clsx(inputs)

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

export const formatPrice = (value: number) => `${rub.format(Math.round(value))} ₽`

export const formatNumber = (value: number) => rub.format(value)

/** Русская плюрализация: plural(5, ['товар', 'товара', 'товаров']) → «товаров» */
export function plural(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return forms[2]
  if (last > 1 && last < 5) return forms[1]
  if (last === 1) return forms[0]
  return forms[2]
}

export const pluralize = (n: number, forms: [string, string, string]) => `${formatNumber(n)} ${plural(n, forms)}`

/** Детерминированный ГПСЧ (mulberry32) — каталог одинаковый при каждой сборке */
export function createRng(seed: number) {
  let a = seed >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min,
    pick: <T,>(arr: readonly T[]): T => arr[Math.floor(next() * arr.length)],
    chance: (p: number) => next() < p,
    sample: <T,>(arr: readonly T[], count: number): T[] => {
      const copy = [...arr]
      const out: T[] = []
      while (out.length < count && copy.length) {
        out.push(copy.splice(Math.floor(next() * copy.length), 1)[0])
      }
      return out
    },
  }
}

export function hashString(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const translit: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => translit[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Нормализация для поиска: регистр, ё, дефисы и пробелы в артикулах */
export const normalize = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/[\s\-_.]/g, '')

const dayFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })
const fullFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export function addDays(days: number, from = new Date()) {
  const d = new Date(from)
  d.setDate(d.getDate() + days)
  return d
}

export const formatDay = (d: Date) => dayFmt.format(d)
export const formatDate = (d: Date | string | number) => fullFmt.format(new Date(d))

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const discountPercent = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0
