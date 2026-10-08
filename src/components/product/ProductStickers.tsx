import type { Product } from '@/data/products'
import { discountPercent } from '@/lib/utils'

export function ProductStickers({ product, max = 3 }: { product: Product; max?: number }) {
  const out: { key: string; label: string; cls: string }[] = []
  const d = discountPercent(product.price, product.oldPrice)
  if (product.tags.includes('hot')) out.push({ key: 'hot', label: `🔥 −${d}%`, cls: 'sticker-pink' })
  else if (d > 0) out.push({ key: 'sale', label: `−${d}%`, cls: 'sticker-pink' })
  if (product.condition === 'contract') out.push({ key: 'ct', label: '🇯🇵 Контракт', cls: 'sticker-cyan' })
  if (product.tags.includes('new')) out.push({ key: 'new', label: 'New drop', cls: 'sticker-lime' })
  if (product.tags.includes('hit')) out.push({ key: 'hit', label: 'Хит', cls: '' })
  if (product.type === 'tuning') out.push({ key: 'jdm', label: 'JDM', cls: 'sticker-violet' })
  return (
    <div className="flex flex-wrap gap-1.5">
      {out.slice(0, max).map((s, i) => (
        <span key={s.key} className={`sticker ${s.cls}`} style={{ transform: `rotate(${i % 2 ? 2 : -3}deg)` }}>
          {s.label}
        </span>
      ))}
    </div>
  )
}
