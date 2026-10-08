import type { Product } from '@/data/products'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { ProductCard } from './ProductCard'

interface Props {
  items?: Product[]
  loading?: boolean
  view?: 'grid' | 'list'
  skeletons?: number
  /** narrow — когда рядом сайдбар с фильтрами */
  narrow?: boolean
  className?: string
}

export function ProductGrid({ items, loading, view = 'grid', skeletons = 8, narrow, className }: Props) {
  const cls =
    view === 'list'
      ? 'flex flex-col gap-3'
      : cn('grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3', narrow ? '2xl:grid-cols-4' : 'xl:grid-cols-4')
  if (loading && !items?.length) {
    return (
      <div className={cn(cls, className)}>
        {Array.from({ length: skeletons }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  return (
    <div className={cn(cls, loading && 'pointer-events-none opacity-60 transition-opacity', className)}>
      {items?.map((p) => <ProductCard key={p.id} product={p} view={view} />)}
    </div>
  )
}
