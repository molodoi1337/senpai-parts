import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Rating({ value, size = 14, className, showValue }: { value: number; size?: number; className?: string; showValue?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} aria-label={`Рейтинг ${value} из 5`}>
      <span className="inline-flex">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, value - i))
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-faint/50" style={{ width: size, height: size }} strokeWidth={2} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="fill-sun text-sun" style={{ width: size, height: size }} strokeWidth={2} />
              </span>
            </span>
          )
        })}
      </span>
      {showValue && <span className="text-sm font-extrabold">{value.toFixed(1)}</span>}
    </span>
  )
}
