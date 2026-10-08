import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import { useCatalog } from '@/api/hooks'
import type { SortKey } from '@/api/catalog'
import { categories, categoryById, brandById } from '@/data/catalog-meta'
import { makeById } from '@/data/cars'
import { Container, PageHeader } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Overlay'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Filters } from '@/components/catalog/Filters'
import { useCatalogParams } from '@/components/catalog/useCatalogParams'
import { PartArt } from '@/components/art/PartArt'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { useActiveCar } from '@/store/garage'
import { useUi } from '@/store/ui'
import { cn, formatPrice, pluralize } from '@/lib/utils'

const sorts: { id: SortKey; label: string }[] = [
  { id: 'popular', label: 'Популярные' },
  { id: 'price-asc', label: 'Сначала дешёвые' },
  { id: 'price-desc', label: 'Сначала дорогие' },
  { id: 'rating', label: 'По рейтингу' },
  { id: 'discount', label: 'По скидке' },
  { id: 'new', label: 'Новинки' },
]

const typeLabel: Record<string, string> = { oem: 'OEM', analog: 'Аналог', tuning: 'Тюнинг', new: 'Новая', contract: 'Контрактная' }

export default function Catalog() {
  const { query, update, reset, fit, category, view } = useCatalogParams()
  const { data, isFetching, isLoading } = useCatalog(query)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const active = useActiveCar()
  const setGarageOpen = useUi((s) => s.setGarageOpen)
  const cat = category ? categoryById[category] : null

  useEffect(() => {
    document.title = `${cat ? cat.name : query.q ? `«${query.q}»` : 'Каталог'} — SENPAI.PARTS`
  }, [cat, query.q])

  const chips: { label: string; clear: () => void }[] = [
    ...(query.q ? [{ label: `Поиск: ${query.q}`, clear: () => update({ q: undefined }) }] : []),
    ...(!category ? (query.cat ?? []).map((c) => ({ label: categoryById[c]?.name ?? c, clear: () => update({ cat: query.cat!.filter((x) => x !== c) }) })) : []),
    ...(query.brand ?? []).map((b) => ({ label: brandById[b]?.name ?? b, clear: () => update({ brand: query.brand!.filter((x) => x !== b) }) })),
    ...(query.type ?? []).map((t) => ({ label: typeLabel[t], clear: () => update({ type: query.type!.filter((x) => x !== t) }) })),
    ...(query.condition ?? []).map((t) => ({ label: typeLabel[t], clear: () => update({ cond: query.condition!.filter((x) => x !== t) }) })),
    ...(query.make ? [{ label: `Марка: ${makeById[query.make]?.name}`, clear: () => update({ make: undefined }) }] : []),
    ...(query.priceMin != null || query.priceMax != null
      ? [{ label: `${query.priceMin != null ? `от ${formatPrice(query.priceMin)}` : ''} ${query.priceMax != null ? `до ${formatPrice(query.priceMax)}` : ''}`.trim(), clear: () => update({ min: undefined, max: undefined }) }]
      : []),
    ...(query.inStock ? [{ label: 'В наличии', clear: () => update({ stock: false }) }] : []),
    ...(query.sale ? [{ label: 'Со скидкой', clear: () => update({ sale: false }) }] : []),
    ...(query.rating ? [{ label: `Рейтинг ${query.rating}+`, clear: () => update({ rating: undefined }) }] : []),
  ]

  const title = cat ? cat.name : query.q ? <>Результаты по «<span className="text-gradient">{query.q}</span>»</> : 'Каталог запчастей'

  return (
    <Container className="pt-4">
      <Breadcrumbs items={cat ? [{ label: 'Каталог', to: '/catalog' }, { label: cat.name }] : [{ label: 'Каталог' }]} />

      <div className="relative">
        {cat && <PartArt kind={cat.art} hue={cat.hue} bare className="pointer-events-none absolute -top-6 right-0 hidden h-40 w-40 opacity-80 md:block" />}
        <PageHeader
          jp={cat ? cat.jp : 'カタログ'}
          title={title}
          subtitle={data ? `${pluralize(data.total, ['деталь', 'детали', 'деталей'])} ${cat ? `· ${cat.blurb}` : 'для японских авто — от фильтров до моторов'}` : ' '}
        />
      </div>

      {/* быстрые категории */}
      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4">
        <Link to={{ pathname: '/catalog' }} className={cn('chip h-10 shrink-0', !category && !query.cat?.length && 'chip-active')}>
          Все
        </Link>
        {categories.map((c) => (
          <Link key={c.id} to={`/catalog/${c.id}`} className={cn('chip h-10 shrink-0 pl-1.5', category === c.id && 'chip-active')}>
            <span className="h-7 w-7 overflow-hidden rounded-full bg-[var(--glass)]">
              <PartArt kind={c.art} hue={c.hue} bare className="h-full w-full" />
            </span>
            {c.name}
          </Link>
        ))}
      </div>

      {/* баннер активной машины */}
      {active && (
        <div className={cn('glass mb-5 flex flex-wrap items-center gap-4 rounded-3xl p-3 pr-4', fit && 'border-lime/40')}>
          <div className="w-28 shrink-0">
            <CarSilhouette shape={active.gen.shape} hue={makeById[active.gen.makeId].hue} glow={false} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">{fit ? 'Показываем детали для' : 'Твоя активная тачка'}</p>
            <p className="truncate font-display font-extrabold">
              {makeById[active.gen.makeId].name} {active.gen.model} {active.gen.gen}
              {active.car.engine && <span className="text-muted"> · {active.car.engine}</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => update({ fit: !fit })} className={cn('btn btn-sm', fit ? 'btn-ghost' : 'btn-primary')}>
              <Car size={15} /> {fit ? 'Показать всё' : 'Только для неё'}
            </button>
            <button onClick={() => setGarageOpen(true)} className="btn btn-ghost btn-sm">
              Сменить
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="glass sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[26px] px-5 py-4">
            <Filters facets={data?.facets} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button onClick={() => setFiltersOpen(true)} className="btn btn-ghost btn-sm lg:hidden">
              <SlidersHorizontal size={15} /> Фильтры {chips.length > 0 && <span className="rounded-full bg-pink px-1.5 text-xs text-white">{chips.length}</span>}
            </button>
            <select className="input h-10 w-auto text-sm" value={query.sort} onChange={(e) => update({ sort: e.target.value === 'popular' ? undefined : e.target.value })} aria-label="Сортировка">
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <span className="ml-auto hidden text-sm font-semibold text-muted sm:block">{data && pluralize(data.total, ['товар', 'товара', 'товаров'])}</span>
            <div className="flex rounded-xl border border-line bg-[var(--glass)] p-1">
              {(
                [
                  ['grid', LayoutGrid],
                  ['list', List],
                ] as const
              ).map(([v, Icon]) => (
                <button key={v} onClick={() => update({ view: v === 'grid' ? undefined : v }, { keepPage: true })} className={cn('grid h-8 w-9 place-items-center rounded-lg transition', view === v ? 'bg-pink text-white' : 'text-muted')} aria-label={v === 'grid' ? 'Сеткой' : 'Списком'} aria-pressed={view === v}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={c.label} onClick={c.clear} className="chip border-pink/40 bg-pink/10">
                  {c.label} <X size={13} />
                </button>
              ))}
              <button onClick={reset} className="chip text-pink">
                Сбросить всё
              </button>
            </div>
          )}

          {data && data.total === 0 ? (
            <EmptyState
              title="Ничего не нашлось"
              text="Попробуй ослабить фильтры или поискать иначе. А ещё можно спросить нас в чате — найдём даже редкий апекс-сил для 13B."
              action={
                <button onClick={reset} className="btn btn-primary">
                  Сбросить фильтры
                </button>
              }
            />
          ) : (
            <ProductGrid items={data?.items} loading={isLoading || isFetching} view={view} skeletons={12} narrow />
          )}

          {data && (
            <div className="mt-8">
              <Pagination
                page={data.page}
                pages={data.pages}
                onChange={(p) => {
                  update({ page: p > 1 ? p : undefined })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          )}
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} side="bottom" label="Фильтры">
        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-5">
          <Filters facets={data?.facets} />
        </div>
        <div className="border-t border-line p-4">
          <button onClick={() => setFiltersOpen(false)} className="btn btn-primary w-full">
            Показать {data ? pluralize(data.total, ['товар', 'товара', 'товаров']) : ''}
          </button>
        </div>
      </Drawer>
    </Container>
  )
}
