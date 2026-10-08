import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Gauge, Plus, Warehouse } from 'lucide-react'
import { carTitle, carYears, genById, makeById } from '@/data/cars'
import { categories } from '@/data/catalog-meta'
import { products } from '@/data/products'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useGarage } from '@/store/garage'
import { toast } from '@/store/ui'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

export default function CarPage() {
  const { genId = '' } = useParams()
  const g = genById[genId]
  const [cat, setCat] = useState('')
  const add = useGarage((s) => s.add)
  const inGarage = useGarage((s) => s.cars.some((c) => c.genId === genId))
  usePageTitle(g ? `Детали для ${carTitle(g)}` : 'Авто не найдено')

  const fitting = useMemo(() => products.filter((p) => !p.universal && p.compat.includes(genId)).sort((a, b) => b.sold - a.sold), [genId])
  const shown = cat ? fitting.filter((p) => p.categoryId === cat) : fitting
  const cats = categories.filter((c) => fitting.some((p) => p.categoryId === c.id))

  if (!g) {
    return (
      <Container className="pt-16">
        <EmptyState title="Машина не найдена" text="Такого кузова нет в базе." action={<Link to="/cars" className="btn btn-primary">Все авто</Link>} />
      </Container>
    )
  }
  const m = makeById[g.makeId]

  return (
    <Container className="pt-4">
      <Breadcrumbs items={[{ label: 'Подбор по авто', to: '/cars' }, { label: m.name, to: `/cars?make=${m.id}` }, { label: `${g.model} ${g.gen}` }]} />
      <section className="glass relative mt-5 overflow-hidden rounded-[36px] p-5 sm:p-10">
        <span aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(80% 80% at 70% 100%, hsl(${m.hue} 100% 60% / .35), transparent 70%)` }} />
        <span aria-hidden className="speedlines absolute inset-0 opacity-40" />
        <span aria-hidden className="kanji-vertical pointer-events-none absolute right-6 top-6 hidden text-6xl font-black text-fg/10 md:block">
          {g.jp}
        </span>
        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-jp text-sm font-bold tracking-[0.25em] text-pink">{m.jp}</p>
            {g.nickname && <span className="sticker sticker-pink mt-3">{g.nickname}</span>}
            <h1 className="section-title mt-3 text-4xl sm:text-6xl">
              {g.model} <span className="text-gradient">{g.gen}</span>
            </h1>
            <p className="mt-2 text-muted">{carTitle(g)} · {carYears(g)}</p>
            {g.blurb && <p className="mt-4 max-w-md">{g.blurb}</p>}
            <dl className="mt-6 grid max-w-md grid-cols-3 gap-2">
              {[
                [g.power, 'л.с.'],
                [g.engines[0], 'мотор'],
                [g.chassis[0], 'кузов'],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-line bg-[var(--glass)] p-3">
                  <dt className="truncate font-display text-lg font-extrabold">{v}</dt>
                  <dd className="text-xs text-faint">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  add({ genId: g.id })
                  toast({ title: inGarage ? 'Сделали активной 🚗' : 'Тачка в гараже 🚗', description: carTitle(g), tone: 'kawaii' })
                }}
                className="btn btn-primary"
              >
                {inGarage ? <Warehouse size={17} /> : <Plus size={17} />} {inGarage ? 'Сделать активной' : 'Добавить в гараж'}
              </button>
              <a href="#parts" className="btn btn-ghost">
                <Gauge size={17} /> {fitting.length} деталей
              </a>
            </div>
          </div>
          <div className="animate-float-slow">
            <CarSilhouette shape={g.shape} hue={m.hue} plate={g.chassis[0].slice(0, 6)} />
          </div>
        </div>
      </section>

      <section id="parts" className="mt-10 scroll-mt-24">
        <h2 className="section-title text-2xl sm:text-3xl">Детали для {g.model} {g.gen}</h2>
        <p className="mt-1 text-sm text-muted">Плюс универсальные расходники (масла, лампы, АКБ) — их ищи в каталоге с фильтром «моя тачка».</p>
        <div className="no-scrollbar -mx-4 my-5 flex gap-2 overflow-x-auto px-4">
          <button onClick={() => setCat('')} className={cn('chip h-10 shrink-0', !cat && 'chip-active')}>
            Все · {fitting.length}
          </button>
          {cats.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={cn('chip h-10 shrink-0', cat === c.id && 'chip-active')}>
              {c.name} · {fitting.filter((p) => p.categoryId === c.id).length}
            </button>
          ))}
        </div>
        {shown.length ? <ProductGrid items={shown} /> : <EmptyState title="Пусто" text="В этой категории пока нет деталей для этого кузова." />}
      </section>
    </Container>
  )
}
