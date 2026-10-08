import type { Product } from '@/data/products'
import { categoryById } from '@/data/catalog-meta'
import { PartArt } from '@/components/art/PartArt'
import { Photo } from '@/components/art/Photo'
import { cn } from '@/lib/utils'

/** Фото товара, если есть; иначе — фирменная иллюстрация. Её же показываем, если фото не загрузилось */
export function ProductImage({ product, width = 400, className, variant = 0 }: { product: Product; width?: number; className?: string; variant?: number }) {
  const art = <PartArt kind={product.art} hue={product.hue} variant={variant} label={categoryById[product.categoryId].jp} className={cn('h-full w-full', className)} />
  const photo = product.images?.[0]
  if (!photo) return art
  return <Photo id={photo} alt={product.name} width={width} height={width} className={cn('h-full w-full', className)} fallback={art} />
}
