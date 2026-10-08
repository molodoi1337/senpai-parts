import type { CarGen } from '@/data/cars'
import { carTitle, makeById } from '@/data/cars'
import { carPhotos } from '@/data/photos'
import { cn } from '@/lib/utils'
import { CarSilhouette } from './CarSilhouette'
import { Photo } from './Photo'

interface Props {
  gen: CarGen
  width: number
  /** соотношение сторон блока, например 'aspect-[16/10]' */
  aspect?: string
  className?: string
  hue?: number
}

/** Фото конкретного кузова, если есть; иначе — неоновый силуэт на фирменном фоне */
export function CarVisual({ gen, width, aspect = 'aspect-[16/10]', className, hue }: Props) {
  const h = hue ?? makeById[gen.makeId].hue
  const id = carPhotos[gen.id]
  const silhouette = (
    <div className={cn('relative grid h-full w-full place-items-center overflow-hidden', aspect, className)} style={{ background: `radial-gradient(120% 90% at 50% 100%, hsl(${h} 100% 60% / .35), transparent 70%)` }}>
      <span aria-hidden className="speedlines absolute inset-0 opacity-50" />
      <CarSilhouette shape={gen.shape} hue={h} plate={gen.chassis[0].slice(0, 6)} className="relative w-[88%]" />
    </div>
  )
  if (!id) return silhouette
  const ratio = aspect.match(/\[(\d+)\/(\d+)\]/)
  const height = ratio ? Math.round((width * Number(ratio[2])) / Number(ratio[1])) : undefined
  return <Photo id={id} alt={carTitle(gen)} width={width} height={height} className={cn(aspect, className)} imgClassName="transition-transform duration-700 group-hover:scale-105" fallback={silhouette} />
}
