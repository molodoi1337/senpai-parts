import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, Plus, ScanLine } from 'lucide-react'
import { decodeVin, type VinResult } from '@/api/catalog'
import { carTitle, carYears, makeById } from '@/data/cars'
import { Container, PageHeader } from '@/components/layout/Container'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { Mascot } from '@/components/art/Mascot'
import { useGarage } from '@/store/garage'
import { toast } from '@/store/ui'
import { usePageTitle } from '@/lib/hooks'

const examples = ['JZX100-0123456', 'BNR34-004321', 'FD3S-312345', 'GDB-020202', 'CT9A-0456789', 'JTNKARJE1J0012345']

export default function Vin() {
  usePageTitle('Поиск по VIN и номеру кузова')
  const [params, setParams] = useSearchParams()
  const [value, setValue] = useState(params.get('code') ?? '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VinResult | null>(null)
  const add = useGarage((s) => s.add)

  const run = async (code: string) => {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    setParams({ code: code.trim() }, { replace: true })
    const r = await decodeVin(code)
    setResult(r)
    setLoading(false)
  }

  useEffect(() => {
    const c = params.get('code')
    if (c) run(c)
    // запускаем только при первом заходе с ?code=
  }, [])

  return (
    <Container className="pt-4">
      <PageHeader jp="車台番号検索" title={<>Поиск по <span className="text-gradient">VIN</span> и номеру кузова</>} subtitle="У машин японского рынка часто нет VIN — вместо него номер кузова (frame) вида JZX100-0123456. Подходит и то, и другое." />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass relative overflow-hidden rounded-[30px] p-5 sm:p-7">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              run(value)
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              className="input h-14 font-display text-lg uppercase tracking-[0.15em] placeholder:font-sans placeholder:text-base placeholder:normal-case placeholder:tracking-normal"
              placeholder="VIN (17 символов) или номер кузова"
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              maxLength={20}
              aria-label="VIN или номер кузова"
            />
            <button className="btn btn-primary h-14 px-6" disabled={loading}>
              <ScanLine size={18} /> {loading ? 'Сканируем…' : 'Расшифровать'}
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-xs font-bold text-faint">Примеры:</span>
            {examples.map((e) => (
              <button
                key={e}
                onClick={() => {
                  setValue(e)
                  run(e)
                }}
                className="chip h-7 font-mono text-[0.7rem]"
              >
                {e}
              </button>
            ))}
          </div>

          <div className="relative mt-6 min-h-64 overflow-hidden rounded-3xl border border-line bg-[var(--glass)] p-5">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-56 flex-col items-center justify-center gap-3">
                  <div className="relative w-64 overflow-hidden rounded-xl">
                    <CarSilhouette shape="coupe" hue={190} glow={false} />
                    <span className="absolute inset-x-0 top-0 h-1/4 animate-[scan_1.2s_ease-in-out_infinite_alternate] bg-gradient-to-b from-transparent via-cyan/50 to-transparent" />
                  </div>
                  <p className="font-mono text-sm text-cyan">Сверяем с базой японских кузовов…</p>
                </motion.div>
              )}
              {!loading && !result && (
                <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-56 flex-col items-center justify-center gap-2 text-center">
                  <Mascot mood="happy" className="h-24 w-24" />
                  <p className="text-sm text-muted">Введи номер — Нэко-сэнсэй найдёт твою тачку</p>
                </motion.div>
              )}
              {!loading && result && (
                <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      ['Тип', result.kind === 'vin' ? 'VIN' : 'Frame №'],
                      ['Марка', result.make ? makeById[result.make]?.name : '—'],
                      [result.kind === 'vin' ? 'Модельный год' : 'Серийный №', result.kind === 'vin' ? (result.year ?? '—') : (result.serial ?? '—')],
                      ['Совпадений', result.candidates.length],
                    ].map(([k, v]) => (
                      <div key={k as string} className="rounded-xl bg-[var(--glass-strong)] p-2.5">
                        <dt className="text-[0.65rem] font-bold uppercase text-faint">{k}</dt>
                        <dd className="font-display font-bold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {result.candidates.length === 0 ? (
                    <p className="mt-5 text-sm text-muted">Не смогли распознать номер (╥﹏╥). Проверь символы или напиши нам в чат — найдём вручную.</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {result.candidates.slice(0, 6).map((g) => (
                        <li key={g.id} className="flex items-center gap-3 rounded-2xl border border-line bg-[var(--glass-strong)] p-2.5">
                          <div className="w-20 shrink-0">
                            <CarSilhouette shape={g.shape} hue={makeById[g.makeId].hue} glow={false} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold">{carTitle(g)}</p>
                            <p className="truncate text-xs text-muted">
                              {carYears(g)} · {g.engines.join(' / ')}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              add({ genId: g.id })
                              toast({ title: 'Тачка в гараже 🚗', description: carTitle(g), tone: 'kawaii', action: { label: 'Детали', to: '/catalog?fit=1' } })
                            }}
                            className="icon-btn h-9 w-9"
                            aria-label="Добавить в гараж"
                          >
                            <Plus size={16} />
                          </button>
                          <Link to={`/cars/${g.id}`} className="btn btn-primary btn-sm hidden sm:inline-flex">
                            Детали
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <aside className="space-y-3">
          {[
            ['Где найти номер кузова?', 'В СТС/ПТС в графе «Кузов», на табличке в моторном отсеке или на стойке двери. Формат — буквы, дефис и цифры: JZX100-0123456.'],
            ['А если у меня VIN?', '17 символов, начинается на J (Япония): JT — Toyota, JN — Nissan, JH — Honda, JM — Mazda, JF — Subaru. Его тоже понимаем.'],
            ['Это безопасно?', 'Номер кузова не персональные данные: по нему нельзя узнать владельца. Мы используем его только для подбора деталей.'],
          ].map(([q, a]) => (
            <div key={q} className="glass rounded-3xl p-5">
              <p className="flex items-center gap-2 font-extrabold">
                <Info size={16} className="text-pink" /> {q}
              </p>
              <p className="mt-1.5 text-sm text-muted">{a}</p>
            </div>
          ))}
        </aside>
      </div>
    </Container>
  )
}
