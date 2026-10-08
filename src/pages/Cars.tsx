import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { carGens, carMakes, carTitle, carYears, makeById } from '@/data/cars'
import { Container, PageHeader } from '@/components/layout/Container'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { normalize, cn } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

export default function Cars() {
  usePageTitle('Подбор по авто')
  const [params, setParams] = useSearchParams()
  const make = params.get('make') ?? ''
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const t = normalize(q)
    return carGens.filter(
      (g) => (!make || g.makeId === make) && (!t || normalize(`${carTitle(g)} ${g.chassis.join(' ')} ${g.engines.join(' ')} ${g.jp ?? ''}`).includes(t)),
    )
  }, [make, q])

  return (
    <Container className="pt-4">
      <PageHeader jp="車種から探す" title="Подбор по авто" subtitle="Выбери свою машину — покажем все детали, которые к ней подходят. Ищи по модели, кузову (JZX100) или мотору (SR20DET)." />

      <div className="glass sticky top-[5.5rem] z-20 mb-6 rounded-3xl p-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink" />
          <input className="input pl-11" placeholder="Supra, BNR34, 2JZ-GTE…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Поиск авто" />
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          <button onClick={() => setParams({})} className={cn('chip h-9 shrink-0', !make && 'chip-active')}>
            Все марки
          </button>
          {carMakes.map((m) => (
            <button key={m.id} onClick={() => setParams({ make: m.id })} className={cn('chip h-9 shrink-0', make === m.id && 'chip-active')}>
              {m.name} <span className="font-jp text-[0.7rem] opacity-70">{m.jp}</span>
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="py-16 text-center text-muted">Такой машины пока нет в базе. Напиши нам — добавим (￣▽￣)ノ</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((g) => {
            const m = makeById[g.makeId]
            return (
              <Link key={g.id} to={`/cars/${g.id}`} className="glass glass-hover group relative overflow-hidden rounded-[26px] p-4">
                <span aria-hidden className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(100% 60% at 50% 100%, hsl(${m.hue} 100% 60% / .25), transparent 70%)` }} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-muted">{m.name}</p>
                    <h3 className="font-display text-lg font-extrabold leading-tight">
                      {g.model} <span className="text-pink">{g.gen}</span>
                    </h3>
                    <p className="text-xs text-muted">{carYears(g)} · {g.power} л.с.</p>
                  </div>
                  {g.legend && <span className="sticker sticker-pink">Легенда</span>}
                </div>
                <div className="relative -mx-2 mt-2 transition-transform duration-500 group-hover:translate-x-1.5">
                  <CarSilhouette shape={g.shape} hue={m.hue} glow={false} />
                </div>
                <p className="relative mt-1 truncate font-mono text-[0.7rem] text-faint">
                  {g.chassis.join(' · ')} — {g.engines.join(' / ')}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </Container>
  )
}
