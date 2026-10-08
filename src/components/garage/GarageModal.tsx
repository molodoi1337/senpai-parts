import { Link, useNavigate } from 'react-router-dom'
import { Check, Trash2, Warehouse } from 'lucide-react'
import { carTitle, carYears, genById, makeById } from '@/data/cars'
import { Modal } from '@/components/ui/Overlay'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { useGarage } from '@/store/garage'
import { toast, useUi } from '@/store/ui'
import { cn } from '@/lib/utils'
import { CarPicker } from './CarPicker'

export function GarageModal() {
  const open = useUi((s) => s.garageOpen)
  const setOpen = useUi((s) => s.setGarageOpen)
  const { cars, activeId, add, remove, setActive } = useGarage()
  const navigate = useNavigate()

  return (
    <Modal open={open} onClose={() => setOpen(false)} className="max-w-2xl" label="Мой гараж">
      <div className="p-5 sm:p-7">
        <p className="font-jp text-sm font-bold tracking-[0.25em] text-pink">マイガレージ</p>
        <h3 className="section-title mt-1 text-2xl">Мой гараж</h3>
        <p className="mt-1 text-sm text-muted">Добавь машину — и мы будем показывать, какие детали к ней подходят.</p>

        <div className="mt-5 rounded-3xl border border-line bg-[var(--glass)] p-4">
          <CarPicker
            layout="stack"
            cta="Добавить в гараж"
            onPick={(genId, engine) => {
              add({ genId, engine })
              toast({ title: 'Тачка в гараже 🚗', description: carTitle(genById[genId]), tone: 'kawaii' })
            }}
          />
        </div>

        {cars.length > 0 && (
          <ul className="mt-5 flex flex-col gap-2.5">
            {cars.map((c) => {
              const g = genById[c.genId]
              const active = c.id === activeId
              return (
                <li key={c.id} className={cn('flex items-center gap-3 rounded-2xl border p-2.5 transition', active ? 'border-pink/60 bg-pink/10' : 'border-line bg-[var(--glass)]')}>
                  <button onClick={() => setActive(c.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <div className="w-24 shrink-0">
                      <CarSilhouette shape={g.shape} hue={makeById[g.makeId].hue} glow={false} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold">{carTitle(g)}</p>
                      <p className="truncate text-xs text-muted">
                        {carYears(g)} · {c.engine ?? g.engines.join(' / ')}
                      </p>
                    </div>
                  </button>
                  {active ? (
                    <span className="chip chip-active shrink-0">
                      <Check size={14} /> Активна
                    </span>
                  ) : (
                    <button className="chip shrink-0" onClick={() => setActive(c.id)}>
                      Выбрать
                    </button>
                  )}
                  <button className="icon-btn h-9 w-9 shrink-0 hover:text-red" onClick={() => remove(c.id)} aria-label="Удалить из гаража">
                    <Trash2 size={16} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {activeId && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setOpen(false)
                navigate('/catalog?fit=1')
              }}
            >
              Детали для моей тачки
            </button>
          )}
          <Link to="/garage" onClick={() => setOpen(false)} className="btn btn-ghost">
            <Warehouse size={18} /> Открыть гараж
          </Link>
        </div>
      </div>
    </Modal>
  )
}
