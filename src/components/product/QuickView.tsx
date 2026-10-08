import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react'
import { productById } from '@/data/products'
import { brandById, categoryById } from '@/data/catalog-meta'
import { Modal } from '@/components/ui/Overlay'
import { PartArt } from '@/components/art/PartArt'
import { Price } from '@/components/ui/Price'
import { Rating } from '@/components/ui/Rating'
import { useUi } from '@/store/ui'
import { cn } from '@/lib/utils'
import { useProductActions } from './useProductActions'
import { FitBadge } from './FitBadge'
import { ProductStickers } from './ProductStickers'
import { StockLabel } from './StockLabel'

function QuickViewBody({ id }: { id: string }) {
  const product = productById[id]
  const setQuickView = useUi((s) => s.setQuickView)
  const { addToCart, liked, like } = useProductActions(product)
  const cat = categoryById[product.categoryId]
  return (
    <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-6">
      <div className="aspect-square overflow-hidden rounded-3xl bg-[var(--glass)]">
        <PartArt kind={product.art} hue={product.hue} label={cat.jp} className="h-full w-full" />
      </div>
      <div className="flex flex-col">
        <ProductStickers product={product} />
        <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-muted">
          {brandById[product.brandId].name} · {cat.name}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold leading-tight">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <Rating value={product.rating} showValue />
          <span className="text-xs text-faint">{product.reviews} отзывов</span>
        </div>
        <p className="mt-3 line-clamp-4 text-sm text-muted">{product.description}</p>
        <div className="mt-3 flex flex-col gap-2">
          <FitBadge product={product} />
          <StockLabel product={product} />
        </div>
        <Price price={product.price} oldPrice={product.oldPrice} size="lg" className="mt-4" />
        <div className="mt-4 flex gap-2">
          <button className="btn btn-primary flex-1" onClick={() => addToCart()}>
            <ShoppingBag size={18} /> В корзину
          </button>
          <button onClick={like} className={cn('icon-btn h-12 w-12', liked && 'text-pink')} aria-label="В избранное">
            <Heart size={18} className={cn(liked && 'fill-pink')} />
          </button>
        </div>
        <Link to={`/product/${product.slug}`} onClick={() => setQuickView(null)} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-pink hover:underline">
          Все характеристики <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export function QuickView() {
  const id = useUi((s) => s.quickViewId)
  const setQuickView = useUi((s) => s.setQuickView)
  // держим последний id, чтобы контент не пропадал во время exit-анимации
  const last = useRef(id)
  if (id) last.current = id
  return (
    <Modal open={Boolean(id)} onClose={() => setQuickView(null)} className="max-w-3xl" label="Быстрый просмотр">
      {last.current && <QuickViewBody id={last.current} />}
    </Modal>
  )
}
