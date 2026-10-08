import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Car, CornerDownLeft, History, LayoutGrid, Search, Sparkles, X } from 'lucide-react'
import { quickSearch } from '@/api/catalog'
import { carTitle, makeById } from '@/data/cars'
import { brandById } from '@/data/catalog-meta'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { useHotkey, useLockBody } from '@/lib/hooks'
import { cn, formatPrice } from '@/lib/utils'
import { useUi } from '@/store/ui'
import { ProductImage } from '@/components/product/ProductImage'

const popular = ['2JZ-GTE', 'колодки Supra', 'TE37', 'SR20DET', 'JZX100', 'койловеры', 'Jimny', 'масло 0W-20']
const RECENT_KEY = 'senpai-recent-search'

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecent(q: string) {
  try {
    const next = [q, ...readRecent().filter((x) => x !== q)].slice(0, 6)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    /* приватный режим — просто не запоминаем */
  }
}

interface Item {
  key: string
  group: string
  label: string
  sub?: string
  to: string
  icon: React.ReactNode
  right?: string
}

export function CommandPalette() {
  const open = useUi((s) => s.searchOpen)
  const setOpen = useUi((s) => s.setSearchOpen)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  useLockBody(open)

  useHotkey(
    'k',
    (e) => {
      e.preventDefault()
      setOpen(!useUi.getState().searchOpen)
    },
    { meta: true },
  )

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const items = useMemo<Item[]>(() => {
    const r = quickSearch(q)
    return [
      ...r.products.map((p) => ({
        key: p.id,
        group: 'Товары',
        label: p.name,
        sub: `${brandById[p.brandId].name} · OEM ${p.oem}`,
        to: `/product/${p.slug}`,
        right: formatPrice(p.price),
        icon: <ProductImage product={p} width={88} />,
      })),
      ...r.categories.map((c) => ({
        key: c.id,
        group: 'Категории',
        label: c.name,
        sub: c.blurb,
        to: `/catalog/${c.id}`,
        icon: <LayoutGrid size={18} />,
      })),
      ...r.cars.map((g) => ({
        key: g.id,
        group: 'Автомобили',
        label: carTitle(g),
        sub: `${g.chassis.join(', ')} · ${g.engines.join(' / ')}`,
        to: `/cars/${g.id}`,
        icon: <CarSilhouette shape={g.shape} hue={makeById[g.makeId].hue} glow={false} />,
      })),
      ...r.articles.map((a) => ({
        key: a.slug,
        group: 'Журнал',
        label: a.title,
        sub: `${a.tag} · ${a.minutes} мин`,
        to: `/blog/${a.slug}`,
        icon: <BookOpen size={18} />,
      })),
    ]
  }, [q])

  useEffect(() => setActive(0), [q])

  const go = (to: string) => {
    if (q.trim()) saveRecent(q.trim())
    setOpen(false)
    navigate(to)
  }

  const submit = () => {
    if (items[active]) go(items[active].to)
    else if (q.trim()) go(`/catalog?q=${encodeURIComponent(q.trim())}`)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(items.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const recent = open ? readRecent() : []
  let lastGroup = ''

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-start justify-center p-3 pt-[8vh]" role="dialog" aria-modal aria-label="Поиск">
          <motion.div className="fixed inset-0 bg-[#07031a]/60 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div
            className="glass-strong relative flex max-h-[80dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px]"
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search size={20} className="shrink-0 text-pink" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Деталь, OEM-номер, мотор или кузов…"
                className="h-16 w-full bg-transparent text-base font-semibold outline-none placeholder:text-faint"
                aria-label="Поисковый запрос"
              />
              {q ? (
                <button onClick={() => setQ('')} className="text-faint hover:text-fg" aria-label="Очистить">
                  <X size={18} />
                </button>
              ) : (
                <kbd className="hidden rounded-lg border border-line px-2 py-1 text-xs font-bold text-faint sm:block">ESC</kbd>
              )}
            </div>

            <div ref={listRef} className="overflow-y-auto p-2.5">
              {!q && (
                <div className="p-2.5">
                  {recent.length > 0 && (
                    <>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-faint">
                        <History size={13} /> Недавно искали
                      </p>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button key={r} onClick={() => setQ(r)} className="chip">
                            {r}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-faint">
                    <Sparkles size={13} /> Сейчас ищут
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popular.map((r) => (
                      <button key={r} onClick={() => setQ(r)} className="chip">
                        {r}
                      </button>
                    ))}
                  </div>
                  <p className="mt-5 text-xs text-faint">
                    Подсказка: ищи по номеру кузова (JZX100), мотору (RB26DETT) или OEM-артикулу. Открыть поиск можно в любой момент — <b>Ctrl/⌘ + K</b>.
                  </p>
                </div>
              )}

              {q && items.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="font-display text-lg font-bold">Ничего не нашли (╥﹏╥)</p>
                  <p className="mt-1 text-sm text-muted">Попробуй иначе или поищи во всём каталоге.</p>
                  <button className="btn btn-primary btn-sm mt-4" onClick={() => go(`/catalog?q=${encodeURIComponent(q)}`)}>
                    Искать в каталоге
                  </button>
                </div>
              )}

              {items.map((it, idx) => {
                const header = it.group !== lastGroup ? it.group : null
                lastGroup = it.group
                return (
                  <div key={`${it.group}-${it.key}`}>
                    {header && <p className="px-3 pb-1.5 pt-3 text-xs font-extrabold uppercase tracking-wider text-faint">{header}</p>}
                    <button
                      data-idx={idx}
                      onMouseMove={() => setActive(idx)}
                      onClick={() => go(it.to)}
                      className={cn('flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition', idx === active ? 'bg-pink/12 ring-1 ring-pink/40' : 'hover:bg-[var(--glass)]')}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--glass-strong)] text-pink">{it.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">{it.label}</span>
                        {it.sub && <span className="block truncate text-xs text-muted">{it.sub}</span>}
                      </span>
                      {it.right && <span className="shrink-0 font-display text-sm font-bold">{it.right}</span>}
                      {idx === active && <CornerDownLeft size={15} className="shrink-0 text-pink" />}
                    </button>
                  </div>
                )
              })}
            </div>

            {q && items.length > 0 && (
              <button onClick={() => go(`/catalog?q=${encodeURIComponent(q)}`)} className="flex items-center justify-between border-t border-line px-5 py-3.5 text-sm font-bold text-pink hover:bg-[var(--glass)]">
                Все результаты по «{q}» в каталоге
                <Car size={16} />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

