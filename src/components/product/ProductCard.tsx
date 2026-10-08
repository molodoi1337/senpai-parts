import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Eye, Heart, Scale, ShoppingBag } from 'lucide-react'
import type { Product } from '@/data/products'
import { brandById, categoryById } from '@/data/catalog-meta'
import { PartArt } from '@/components/art/PartArt'
import { Price } from '@/components/ui/Price'
import { Rating } from '@/components/ui/Rating'
import { useUi } from '@/store/ui'
import { cn, formatNumber } from '@/lib/utils'
import { useProductActions } from './useProductActions'
import { FitBadge } from './FitBadge'
import { ProductStickers } from './ProductStickers'
import { StockLabel } from './StockLabel'

interface Props {
  product: Product
  view?: 'grid' | 'list'
  className?: string
}

function ProductCardBase({ product, view = 'grid', className }: Props) {
  const { addToCart, inCart, liked, like, compared, compare } = useProductActions(product)
  const setQuickView = useUi((s) => s.setQuickView)
  const brand = brandById[product.brandId]
  const cat = categoryById[product.categoryId]
  const href = `/product/${product.slug}`

  if (view === 'list') {
    return (
      <article className={cn('glass glass-hover group grid grid-cols-[110px_1fr] gap-4 rounded-3xl p-3 sm:grid-cols-[180px_1fr_auto] sm:p-4', className)}>
        <Link to={href} className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--glass)]">
          <PartArt kind={product.art} hue={product.hue} label={cat.jp} className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
        </Link>
        <div className="min-w-0">
          <ProductStickers product={product} max={2} />
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted">
            {brand.name} · {cat.name}
          </p>
          <Link to={href} className="mt-1 line-clamp-2 font-bold leading-snug hover:text-pink">
            {product.name}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating value={product.rating} />
            <span className="text-xs text-faint">{formatNumber(product.reviews)} отзывов</span>
            <span className="text-xs text-faint">OEM {product.oem}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <FitBadge product={product} />
            <StockLabel product={product} />
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center">
          <Price price={product.price} oldPrice={product.oldPrice} size="lg" className="sm:justify-end" />
          <div className="flex gap-2">
            <button onClick={like} className={cn('icon-btn', liked && 'text-pink')} aria-label="В избранное" aria-pressed={liked}>
              <Heart size={18} className={cn(liked && 'fill-pink')} />
            </button>
            <button onClick={compare} className={cn('icon-btn', compared && 'text-cyan')} aria-label="Сравнить" aria-pressed={compared}>
              <Scale size={18} />
            </button>
            <button onClick={() => addToCart()} className="btn btn-primary btn-sm h-11">
              {inCart ? <Check size={16} /> : <ShoppingBag size={16} />}
              {inCart ? 'Ещё' : 'В корзину'}
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <motion.article
      layout="position"
      className={cn('glass glass-hover group relative flex flex-col rounded-[26px] p-2.5 sm:p-3', className)}
    >
      <div className="shine relative aspect-square overflow-hidden rounded-[20px] bg-[var(--glass)]">
        <Link to={href} aria-label={product.name} className="block h-full w-full">
          <PartArt kind={product.art} hue={product.hue} label={cat.jp} className="h-full w-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2" />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2">
          <ProductStickers product={product} max={2} />
        </div>
        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          <button onClick={like} className={cn('icon-btn h-9 w-9 backdrop-blur-md', liked && 'text-pink')} aria-label="В избранное" aria-pressed={liked}>
            <Heart size={16} className={cn(liked && 'fill-pink')} />
          </button>
          <button
            onClick={compare}
            className={cn('icon-btn h-9 w-9 backdrop-blur-md transition sm:opacity-0 sm:group-hover:opacity-100', compared && 'text-cyan sm:opacity-100')}
            aria-label="Сравнить"
            aria-pressed={compared}
          >
            <Scale size={16} />
          </button>
        </div>
        <button
          onClick={() => setQuickView(product.id)}
          className="btn btn-ghost btn-sm absolute bottom-2 left-1/2 hidden -translate-x-1/2 translate-y-3 opacity-0 backdrop-blur-xl transition group-hover:translate-y-0 group-hover:opacity-100 sm:inline-flex"
        >
          <Eye size={15} /> Быстрый просмотр
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="truncate text-[0.68rem] font-extrabold uppercase tracking-wider text-muted">
          {brand.name} <span className="text-faint">·</span> {cat.name}
        </p>
        <Link to={href} className="mt-1 line-clamp-2 min-h-[2.6em] text-[0.92rem] font-bold leading-snug hover:text-pink">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Rating value={product.rating} size={12} />
          <span className="text-[0.7rem] font-bold text-faint">({formatNumber(product.reviews)})</span>
        </div>
        <div className="mt-2 min-w-0">
          <FitBadge product={product} />
        </div>
        <StockLabel product={product} className="mt-1.5" />
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <Price price={product.price} oldPrice={product.oldPrice} size="sm" className="flex-col !items-start gap-0" />
          <button
            onClick={() => addToCart()}
            className={cn('btn btn-primary h-11 w-11 shrink-0 !p-0', inCart && '!bg-none !bg-lime !text-[#0b1a05]')}
            aria-label={inCart ? 'Добавить ещё' : 'В корзину'}
          >
            {inCart ? <Check size={18} strokeWidth={3} /> : <ShoppingBag size={18} />}
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export const ProductCard = memo(ProductCardBase)
