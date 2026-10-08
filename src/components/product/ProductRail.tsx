import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/data/products'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { ProductCard } from './ProductCard'

/** Горизонтальная карусель товаров со snap-скроллом */
export function ProductRail({ items, loading }: { items?: Product[]; loading?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-4 pt-1 sm:gap-4">
        {loading && !items
          ? Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]">
                <ProductCardSkeleton />
              </div>
            ))
          : items?.map((p) => (
              <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]">
                <ProductCard product={p} />
              </div>
            ))}
      </div>
      <button onClick={() => scroll(-1)} className="icon-btn glass-strong absolute -left-3 top-[38%] hidden lg:grid" aria-label="Назад">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => scroll(1)} className="icon-btn glass-strong absolute -right-3 top-[38%] hidden lg:grid" aria-label="Вперёд">
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
