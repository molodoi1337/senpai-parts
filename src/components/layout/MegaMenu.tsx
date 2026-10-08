import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/data/catalog-meta'
import { products } from '@/data/products'
import { PartArt } from '@/components/art/PartArt'
import { Mascot } from '@/components/art/Mascot'
import { useUi } from '@/store/ui'

const countByCat = products.reduce<Record<string, number>>((acc, p) => {
  acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1
  return acc
}, {})

export function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const setGarageOpen = useUi((s) => s.setGarageOpen)
  return (
    <div className="glass-strong grid grid-cols-[1fr_260px] gap-4 rounded-[28px] p-4">
      <div className="grid grid-cols-4 gap-1.5">
        {categories.map((c) => (
          <Link key={c.id} to={`/catalog/${c.id}`} onClick={onNavigate} className="group flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-[var(--glass-strong)]">
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--glass)]">
              <PartArt kind={c.art} hue={c.hue} className="h-full w-full transition-transform group-hover:scale-110" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold group-hover:text-pink">{c.name}</span>
              <span className="block truncate font-jp text-[0.7rem] text-faint">
                {c.jp} · {countByCat[c.id] ?? 0}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-pink/30 via-violet/25 to-cyan/20 p-5">
        <span className="halftone absolute inset-0 opacity-30" />
        <p className="relative font-jp text-xs font-bold tracking-[0.25em] text-pink">ヘルプ</p>
        <p className="relative mt-1 font-display text-lg font-extrabold leading-tight">Не знаешь, что подойдёт?</p>
        <p className="relative mt-1 text-xs text-muted">Добавь авто в гараж — подсветим совместимые детали.</p>
        <Mascot mood="wink" className="relative mx-auto my-2 h-24 w-24" />
        <button
          onClick={() => {
            onNavigate()
            setGarageOpen(true)
          }}
          className="btn btn-primary btn-sm relative mt-auto"
        >
          Добавить авто <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
