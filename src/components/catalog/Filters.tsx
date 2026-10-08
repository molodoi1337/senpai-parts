import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ChevronDown, RotateCcw, Search } from 'lucide-react'
import type { Facets } from '@/api/catalog'
import { carMakes } from '@/data/cars'
import { brandById, categories, partBrands } from '@/data/catalog-meta'
import { priceBounds } from '@/data/products'
import { useActiveCar } from '@/store/garage'
import { useUi } from '@/store/ui'
import { cn, formatNumber } from '@/lib/utils'
import { useCatalogParams } from './useCatalogParams'

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-line py-4 last:border-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left text-sm font-extrabold" aria-expanded={open}>
        {title}
        <ChevronDown size={16} className={cn('text-faint transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: ReactNode; count?: number }) {
  const disabled = !checked && count === 0
  return (
    <label className={cn('group flex cursor-pointer items-center gap-2.5 rounded-lg py-1.5 text-sm', disabled && 'cursor-default opacity-40')}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} disabled={disabled} />
      <span
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-cyan',
          checked ? 'border-pink bg-pink text-white' : 'border-line group-hover:border-pink/60',
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
            <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1 truncate font-semibold">{label}</span>
      {count != null && <span className="text-xs font-bold text-faint">{formatNumber(count)}</span>}
    </label>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5 text-sm font-semibold">
      {label}
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span className={cn('relative h-6 w-11 shrink-0 rounded-full transition peer-focus-visible:ring-2 peer-focus-visible:ring-cyan', checked ? 'bg-gradient-to-r from-pink to-violet' : 'bg-[var(--glass-strong)]')}>
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </span>
    </label>
  )
}

const toggleIn = (arr: string[] = [], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

const priceChips: [string, number | undefined, number | undefined][] = [
  ['до 3 000', undefined, 3000],
  ['3–15 тыс', 3000, 15000],
  ['15–80 тыс', 15000, 80000],
  ['80 тыс+', 80000, undefined],
]

export function Filters({ facets }: { facets?: Facets }) {
  const { query, update, reset, fit } = useCatalogParams()
  const active = useActiveCar()
  const setGarageOpen = useUi((s) => s.setGarageOpen)
  const [brandSearch, setBrandSearch] = useState('')
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [min, setMin] = useState(query.priceMin?.toString() ?? '')
  const [max, setMax] = useState(query.priceMax?.toString() ?? '')

  useEffect(() => {
    setMin(query.priceMin?.toString() ?? '')
    setMax(query.priceMax?.toString() ?? '')
  }, [query.priceMin, query.priceMax])

  const brands = useMemo(() => {
    const list = partBrands
      .filter((b) => (facets?.brands[b.id] ?? 0) > 0 || query.brand?.includes(b.id))
      .filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
      .sort((a, b) => (facets?.brands[b.id] ?? 0) - (facets?.brands[a.id] ?? 0))
    return showAllBrands || brandSearch ? list : list.slice(0, 8)
  }, [facets, brandSearch, showAllBrands, query.brand])

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="font-display text-lg font-extrabold">Фильтры</p>
        <button onClick={reset} className="flex items-center gap-1 text-xs font-bold text-pink hover:underline">
          <RotateCcw size={13} /> Сбросить
        </button>
      </div>

      <Group title="Моя тачка">
        {active ? (
          <Toggle checked={fit} onChange={() => update({ fit: !fit })} label={<span>Только для {active.gen.model} {active.gen.gen}</span>} />
        ) : (
          <button onClick={() => setGarageOpen(true)} className="w-full rounded-xl border border-dashed border-pink/50 p-3 text-left text-sm font-semibold text-muted hover:bg-pink/5">
            <span className="text-pink">+ Добавь авто</span>, чтобы видеть только подходящие детали
          </button>
        )}
        <select className="input mt-3 h-10 text-sm" value={query.make ?? ''} onChange={(e) => update({ make: e.target.value || undefined })} aria-label="Марка авто">
          <option value="">Любая марка авто</option>
          {carMakes.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </Group>

      <Group title="Категория">
        <div className="max-h-72 overflow-y-auto pr-1">
          {categories.map((c) => (
            <Check key={c.id} checked={query.cat?.includes(c.id) ?? false} onChange={() => update({ cat: toggleIn(query.cat, c.id) })} label={c.name} count={facets?.categories[c.id] ?? 0} />
          ))}
        </div>
      </Group>

      <Group title="Цена, ₽">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            update({ min: min || undefined, max: max || undefined })
          }}
        >
          <input className="input h-10 text-sm" inputMode="numeric" placeholder={`от ${formatNumber(priceBounds.min)}`} value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))} aria-label="Цена от" />
          <span className="text-faint">—</span>
          <input className="input h-10 text-sm" inputMode="numeric" placeholder={`до ${formatNumber(priceBounds.max)}`} value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))} aria-label="Цена до" />
          <button className="icon-btn h-10 w-10 shrink-0" aria-label="Применить цену">
            <Search size={15} />
          </button>
        </form>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {priceChips.map(([label, a, b]) => {
            const on = query.priceMin === a && query.priceMax === b
            return (
              <button key={label} onClick={() => update(on ? { min: undefined, max: undefined } : { min: a, max: b })} className={cn('chip h-7 text-xs', on && 'chip-active')}>
                {label}
              </button>
            )
          })}
        </div>
      </Group>

      <Group title="Тип детали">
        {(
          [
            ['oem', 'Оригинал / OEM'],
            ['analog', 'Аналог'],
            ['tuning', 'Тюнинг 🏁'],
          ] as const
        ).map(([id, label]) => (
          <Check key={id} checked={query.type?.includes(id) ?? false} onChange={() => update({ type: toggleIn(query.type, id) })} label={label} count={facets?.types[id] ?? 0} />
        ))}
        <div className="mt-2 border-t border-dashed border-line pt-2">
          {(
            [
              ['new', 'Новая'],
              ['contract', 'Контрактная 🇯🇵'],
            ] as const
          ).map(([id, label]) => (
            <Check key={id} checked={query.condition?.includes(id) ?? false} onChange={() => update({ cond: toggleIn(query.condition, id) })} label={label} count={facets?.conditions[id] ?? 0} />
          ))}
        </div>
      </Group>

      <Group title="Бренд">
        <input className="input mb-2 h-9 text-sm" placeholder="Найти бренд" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} aria-label="Поиск бренда" />
        {brands.map((b) => (
          <Check key={b.id} checked={query.brand?.includes(b.id) ?? false} onChange={() => update({ brand: toggleIn(query.brand, b.id) })} label={brandById[b.id].name} count={facets?.brands[b.id] ?? 0} />
        ))}
        {!brandSearch && (
          <button onClick={() => setShowAllBrands((v) => !v)} className="mt-1 text-xs font-bold text-pink hover:underline">
            {showAllBrands ? 'Свернуть' : 'Показать все'}
          </button>
        )}
      </Group>

      <Group title="Ещё">
        <Toggle checked={query.inStock ?? false} onChange={() => update({ stock: !query.inStock })} label="Только в наличии" />
        <Toggle checked={query.sale ?? false} onChange={() => update({ sale: !query.sale })} label="Со скидкой 🔥" />
        <Toggle checked={query.rating === 4.5} onChange={() => update({ rating: query.rating === 4.5 ? undefined : 4.5 })} label="Рейтинг 4.5+" />
      </Group>
    </div>
  )
}
