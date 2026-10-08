import { cn, discountPercent, formatPrice } from '@/lib/utils'

export function Price({ price, oldPrice, size = 'md', className }: { price: number; oldPrice?: number; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const d = discountPercent(price, oldPrice)
  const main = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl', xl: 'text-4xl' }[size]
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-display font-extrabold tracking-tight', main, d > 0 && 'text-pink')}>{formatPrice(price)}</span>
      {oldPrice && d > 0 && (
        <>
          <span className="text-sm font-semibold text-faint line-through">{formatPrice(oldPrice)}</span>
          {size !== 'sm' && <span className="rounded-md bg-pink/15 px-1.5 py-0.5 text-xs font-extrabold text-pink">−{d}%</span>}
        </>
      )}
    </div>
  )
}
