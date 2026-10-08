import { useCallback } from 'react'
import type { Product } from '@/data/products'
import { useCart } from '@/store/cart'
import { useCompare, useWishlist } from '@/store/collections'
import { toast, useUi } from '@/store/ui'

export function useProductActions(product: Product) {
  const add = useCart((s) => s.add)
  const inCart = useCart((s) => s.lines.some((l) => l.id === product.id))
  const liked = useWishlist((s) => s.ids.includes(product.id))
  const compared = useCompare((s) => s.ids.includes(product.id))
  const toggleLike = useWishlist((s) => s.toggle)
  const toggleCompare = useCompare((s) => s.toggle)
  const setCartOpen = useUi((s) => s.setCartOpen)

  const addToCart = useCallback(
    (qty = 1, open = false) => {
      add(product.id, qty)
      if (open) setCartOpen(true)
      else
        toast({
          title: 'Закинули в корзину ✿',
          description: product.name,
          action: { label: 'Оформить', to: '/cart' },
        })
    },
    [add, product, setCartOpen],
  )

  const like = useCallback(() => {
    const added = toggleLike(product.id)
    toast({ title: added ? 'В избранном 💖' : 'Убрали из избранного', description: product.name, tone: added ? 'kawaii' : 'default', action: added ? { label: 'Избранное', to: '/wishlist' } : undefined })
  }, [toggleLike, product])

  const compare = useCallback(() => {
    const added = toggleCompare(product.id)
    toast({ title: added ? 'Добавили к сравнению' : 'Убрали из сравнения', description: product.name, action: added ? { label: 'Сравнить', to: '/compare' } : undefined })
  }, [toggleCompare, product])

  return { addToCart, inCart, liked, like, compared, compare }
}
