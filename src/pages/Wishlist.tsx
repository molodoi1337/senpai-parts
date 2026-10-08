import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useProductsByIds } from '@/api/hooks'
import { Container, PageHeader } from '@/components/layout/Container'
import { ProductGrid } from '@/components/product/ProductGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import { useWishlist } from '@/store/collections'
import { useCart } from '@/store/cart'
import { toast } from '@/store/ui'
import { formatPrice, pluralize } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

export default function Wishlist() {
  usePageTitle('Избранное')
  const { ids, clear } = useWishlist()
  const add = useCart((s) => s.add)
  const { data, isLoading } = useProductsByIds(ids)
  const items = data?.filter((p) => ids.includes(p.id))
  const total = items?.reduce((s, p) => s + p.price, 0) ?? 0

  return (
    <Container className="pt-4">
      <PageHeader jp="お気に入り" title="Избранное" subtitle={ids.length ? `${pluralize(ids.length, ['деталь', 'детали', 'деталей'])} на ${formatPrice(total)}` : undefined}>
        {ids.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                items?.filter((p) => p.stock > 0).forEach((p) => add(p.id))
                toast({ title: 'Всё в наличии — в корзине ✿', action: { label: 'Корзина', to: '/cart' } })
              }}
            >
              <ShoppingBag size={15} /> Всё в корзину
            </button>
            <button className="btn btn-ghost btn-sm" onClick={clear}>
              <Trash2 size={15} /> Очистить
            </button>
          </div>
        )}
      </PageHeader>
      {ids.length === 0 ? (
        <EmptyState
          mood="love"
          title="Тут будут детали твоей мечты"
          text="Жми ♥ на карточках — сохраним, чтобы не потерять. Можно копить на TE37 хоть полгода."
          action={
            <Link to="/catalog" className="btn btn-primary">
              Смотреть каталог
            </Link>
          }
        />
      ) : (
        <ProductGrid items={items} loading={isLoading} skeletons={ids.length} />
      )}
    </Container>
  )
}
