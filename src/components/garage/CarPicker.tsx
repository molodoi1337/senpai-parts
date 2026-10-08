import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { carMakes, carYears, genById, gensByMake } from '@/data/cars'
import { cn } from '@/lib/utils'

interface Props {
  onPick: (genId: string, engine?: string) => void
  cta?: string
  layout?: 'row' | 'stack'
  className?: string
}

/** Подбор авто: марка → модель/поколение → двигатель */
export function CarPicker({ onPick, cta = 'Подобрать детали', layout = 'row', className }: Props) {
  const [make, setMake] = useState('')
  const [genId, setGenId] = useState('')
  const [engine, setEngine] = useState('')
  const gens = useMemo(() => (make ? gensByMake(make) : []), [make])
  const gen = genId ? genById[genId] : null

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (genId) onPick(genId, engine || undefined)
      }}
      className={cn(layout === 'row' ? 'grid gap-2 sm:grid-cols-[1fr_1.3fr_1fr]' : 'flex flex-col gap-3', className)}
    >
      <label className="block">
        <span className={cn(layout === 'row' ? 'sr-only' : 'label')}>Марка</span>
        <select
          className="input"
          value={make}
          onChange={(e) => {
            setMake(e.target.value)
            setGenId('')
            setEngine('')
          }}
        >
          <option value="">Марка</option>
          {carMakes.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} · {m.jp}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={cn(layout === 'row' ? 'sr-only' : 'label')}>Модель и кузов</span>
        <select
          className="input"
          value={genId}
          disabled={!make}
          onChange={(e) => {
            setGenId(e.target.value)
            setEngine('')
          }}
        >
          <option value="">{make ? 'Модель и кузов' : 'Сначала марка'}</option>
          {gens.map((g) => (
            <option key={g.id} value={g.id}>
              {g.model} {g.gen} ({carYears(g)})
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={cn(layout === 'row' ? 'sr-only' : 'label')}>Двигатель</span>
        <select className="input" value={engine} disabled={!gen} onChange={(e) => setEngine(e.target.value)}>
          <option value="">Любой мотор</option>
          {gen?.engines.map((en) => (
            <option key={en} value={en}>
              {en}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className={cn('btn btn-primary', layout === 'row' && 'sm:col-span-3')} disabled={!genId}>
        <Search size={18} />
        {cta}
      </button>
    </form>
  )
}
