import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, X } from 'lucide-react'
import { useProductsByIds } from '@/api/hooks'
import { brandById, categoryById } from '@/data/catalog-meta'
import { Container, PageHeader } from '@/components/layout/Container'
import { PartArt } from '@/components/art/PartArt'
import { Rating } from '@/components/ui/Rating'
import { EmptyState } from '@/components/ui/EmptyState'
import { FitBadge, compatLabel } from '@/components/product/FitBadge'
import { useCompare, COMPARE_LIMIT } from '@/store/collections'
import { useCart } from '@/store/cart'
import { toast } from '@/store/ui'
import { cn, formatPrice } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

export default function Compare() {
  usePageTitle('Сравнение')
  const { ids, remove, clear } = useCompare()
  const add = useCart((s) => s.add)
  const { data } = useProductsByIds(ids)
  const items = data?.filter((p) => ids.includes(p.id)) ?? []

  if (!ids.length) {
    return (
      <Container className="pt-12">
        <EmptyState
          mood="wink"
          title="Нечего сравнивать"
          text={`Нажми ⚖ на карточках товаров (до ${COMPARE_LIMIT} штук) — и сравним их характеристики бок о бок.`}
          action={
            <Link to="/catalog" className="btn btn-primary">
              В каталог
            </Link>
          }
        />
      </Container>
    )
  }

  const specKeys = Array.from(new Set(items.flatMap((p) => p.specs.map(([k]) => k))))
  const minPrice = Math.min(...items.map((p) => p.price))
  const maxRating = Math.max(...items.map((p) => p.rating))

  const rows: { label: string; render: (p: (typeof items)[number]) => React.ReactNode; best?: (p: (typeof items)[number]) => boolean }[] = [
    { label: 'Цена', render: (p) => <span className="font-display font-extrabold">{formatPrice(p.price)}</span>, best: (p) => p.price === minPrice },
    { label: 'Рейтинг', render: (p) => <Rating value={p.rating} showValue />, best: (p) => p.rating === maxRating },
    { label: 'Бренд', render: (p) => brandById[p.brandId].name },
    { label: 'Категория', render: (p) => categoryById[p.categoryId].name },
    { label: 'Совместимость', render: (p) => compatLabel(p) },
    { label: 'Моя тачка', render: (p) => <FitBadge product={p} /> },
    { label: 'Наличие', render: (p) => (p.stock > 0 ? `${p.stock} шт` : 'Под заказ') },
    ...specKeys.map((k) => ({ label: k, render: (p: (typeof items)[number]) => p.specs.find(([sk]) => sk === k)?.[1] ?? '—' })),
  ]

  return (
    <Container className="pt-4">
      <PageHeader jp="比較" title="Сравнение">
        <button onClick={clear} className="btn btn-ghost btn-sm mt-4">
          <Trash2 size={15} /> Очистить
        </button>
      </PageHeader>
      <div className="glass overflow-x-auto rounded-[28px]">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-44 p-4" />
              {items.map((p) => (
                <th key={p.id} className="p-4 align-top font-normal">
                  <div className="relative text-left">
                    <button onClick={() => remove(p.id)} className="icon-btn absolute right-0 top-0 h-8 w-8" aria-label="Убрать">
                      <X size={14} />
                    </button>
                    <Link to={`/product/${p.slug}`} className="block aspect-square w-28 overflow-hidden rounded-2xl bg-[var(--glass)]">
                      <PartArt kind={p.art} hue={p.hue} className="h-full w-full" />
                    </Link>
                    <Link to={`/product/${p.slug}`} className="mt-2 line-clamp-2 font-bold hover:text-pink">
                      {p.name}
                    </Link>
                    <button
                      className="btn btn-primary btn-sm mt-2"
                      onClick={() => {
                        add(p.id)
                        toast({ title: 'В корзине ✿', description: p.name })
                      }}
                    >
                      <ShoppingBag size={14} /> В корзину
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} className={cn(i % 2 === 0 && 'bg-[var(--glass)]')}>
                <th className="p-4 text-left text-xs font-extrabold uppercase tracking-wider text-muted">{r.label}</th>
                {items.map((p) => (
                  <td key={p.id} className={cn('p-4', r.best?.(p) && items.length > 1 && 'text-lime')}>
                    {r.render(p)}
                    {r.best?.(p) && items.length > 1 && <span className="ml-2 text-xs font-extrabold">★ лучше</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  )
}
