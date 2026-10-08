import { Check, X } from 'lucide-react'
import type { Product } from '@/data/products'
import { fitsCar } from '@/data/products'
import { genById } from '@/data/cars'
import { useActiveCar } from '@/store/garage'
import { cn } from '@/lib/utils'

export function compatLabel(p: Product) {
  if (p.universal) return 'Универсальная'
  const first = genById[p.compat[0]]
  if (!first) return ''
  const rest = p.compat.length - 1
  return `${first.model} ${first.gen}${rest > 0 ? ` +${rest}` : ''}`
}

export function FitBadge({ product, className }: { product: Product; className?: string }) {
  const active = useActiveCar()
  if (!active) {
    return <span className={cn('block truncate text-xs font-semibold text-faint', className)}>{product.universal ? 'Универсальная — для любых авто' : `для ${compatLabel(product)}`}</span>
  }
  const ok = fitsCar(product, active.gen.id)
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 truncate rounded-lg px-2 py-1 text-[0.7rem] font-extrabold',
        ok ? 'bg-lime/15 text-lime' : 'bg-red/10 text-red',
        className,
      )}
    >
      {ok ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      <span className="truncate">{ok ? `Подходит к ${active.gen.model} ${active.gen.gen}` : `Не для ${active.gen.model}`}</span>
    </span>
  )
}
