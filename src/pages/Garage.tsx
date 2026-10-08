import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Pencil, ScanLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { carTitle, carYears, genById, makeById } from '@/data/cars'
import { products, fitsCar } from '@/data/products'
import { Container, PageHeader } from '@/components/layout/Container'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { CarPicker } from '@/components/garage/CarPicker'
import { EmptyState } from '@/components/ui/EmptyState'
import { useGarage } from '@/store/garage'
import { toast } from '@/store/ui'
import { cn, formatNumber } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

export default function Garage() {
  usePageTitle('Мой гараж')
  const { cars, activeId, add, remove, setActive, rename } = useGarage()
  const [editing, setEditing] = useState<string | null>(null)

  return (
    <Container className="pt-4">
      <PageHeader jp="マイガレージ" title="Мой гараж" subtitle="Добавь свои машины — и каталог будет подсвечивать, что к ним подходит. Можно хранить хоть весь автопарк." />

      <div className="glass mb-8 rounded-[28px] p-4 sm:p-6">
        <p className="mb-3 font-display font-extrabold">Добавить машину</p>
        <CarPicker
          cta="В гараж"
          onPick={(genId, engine) => {
            add({ genId, engine })
            toast({ title: 'Добро пожаловать в гараж!', description: carTitle(genById[genId]), tone: 'kawaii' })
          }}
        />
        <p className="mt-3 text-xs text-muted">
          Не помнишь кузов? <Link to="/vin" className="font-bold text-pink hover:underline"><ScanLine size={12} className="inline" /> Найди по VIN или номеру кузова</Link>
        </p>
      </div>

      {cars.length === 0 ? (
        <EmptyState mood="wink" title="Гараж пока пустой" text="Добавь первую тачку — Нэко-сэнсэй будет проверять совместимость каждой детали за тебя." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cars.map((c, i) => {
            const g = genById[c.genId]
            const make = makeById[g.makeId]
            const active = c.id === activeId
            const fitting = products.filter((p) => !p.universal && fitsCar(p, g.id)).length
            return (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn('glass relative overflow-hidden rounded-[30px] p-5', active && 'ring-2 ring-pink')}
              >
                <span aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(100% 60% at 50% 100%, hsl(${make.hue} 100% 60% / .3), transparent 70%)` }} />
                <div className="relative flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-jp text-xs font-bold tracking-[0.2em] text-pink">{g.jp ?? make.jp}</p>
                    {editing === c.id ? (
                      <input
                        autoFocus
                        defaultValue={c.nickname ?? ''}
                        placeholder="Имя тачки"
                        className="input mt-1 h-9 text-sm"
                        onBlur={(e) => {
                          rename(c.id, e.target.value.trim())
                          setEditing(null)
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                      />
                    ) : (
                      <h3 className="truncate font-display text-xl font-extrabold">{c.nickname || `${g.model} ${g.gen}`}</h3>
                    )}
                    <p className="truncate text-sm text-muted">{carTitle(g)}</p>
                  </div>
                  {active && (
                    <span className="sticker sticker-lime shrink-0">
                      <Check size={12} /> Активна
                    </span>
                  )}
                </div>
                <div className="relative -mx-2 my-3">
                  <CarSilhouette shape={g.shape} hue={make.hue} plate={g.chassis[0].slice(0, 6)} />
                </div>
                <dl className="relative grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    [c.engine ?? g.engines[0], 'мотор'],
                    [carYears(g), 'годы'],
                    [formatNumber(fitting), 'деталей'],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-xl border border-line bg-[var(--glass)] p-2">
                      <dt className="truncate font-display text-sm font-bold">{v}</dt>
                      <dd className="text-faint">{l}</dd>
                    </div>
                  ))}
                </dl>
                <div className="relative mt-4 flex gap-2">
                  {active ? (
                    <Link to="/catalog?fit=1" className="btn btn-primary btn-sm flex-1">
                      Детали для неё
                    </Link>
                  ) : (
                    <button onClick={() => setActive(c.id)} className="btn btn-ghost btn-sm flex-1">
                      Сделать активной
                    </button>
                  )}
                  <button onClick={() => setEditing(c.id)} className="icon-btn h-10 w-10" aria-label="Переименовать">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(c.id)} className="icon-btn h-10 w-10 hover:text-red" aria-label="Удалить">
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </Container>
  )
}
