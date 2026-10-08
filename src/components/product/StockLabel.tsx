import type { Product } from '@/data/products'
import { addDays, cn, formatDay } from '@/lib/utils'

export function StockLabel({ product, className }: { product: Product; className?: string }) {
  const [from] = product.deliveryDays
  if (product.condition === 'contract') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold text-cyan', className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
        Из Японии · {product.deliveryDays[0]}–{product.deliveryDays[1]} дн.
      </span>
    )
  }
  if (product.stock > 0) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold text-lime', className)}>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
        {product.stock < 5 ? `Осталось ${product.stock} шт` : 'В наличии'} · {from === 1 ? 'завтра' : formatDay(addDays(from))}
      </span>
    )
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold text-sun', className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-sun" />
      Под заказ · {product.deliveryDays[0]}–{product.deliveryDays[1]} дн.
    </span>
  )
}
