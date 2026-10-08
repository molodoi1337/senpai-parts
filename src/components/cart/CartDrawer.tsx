import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/ui/Overlay'
import { PartArt } from '@/components/art/PartArt'
import { QtyStepper } from '@/components/ui/QtyStepper'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCart, useCartTotals } from '@/store/cart'
import { useUi } from '@/store/ui'
import { formatPrice, pluralize } from '@/lib/utils'
import { FreeShippingBar } from './FreeShippingBar'

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen)
  const setOpen = useUi((s) => s.setCartOpen)
  const { setQty, remove } = useCart()
  const totals = useCartTotals()
  const close = () => setOpen(false)

  return (
    <Drawer open={open} onClose={close} label="Корзина">
      <header className="flex items-center gap-3 border-b border-line p-5 pr-16">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-pink to-violet text-white">
          <ShoppingBag size={20} />
        </span>
        <div>
          <h2 className="font-display text-lg font-extrabold">Корзина</h2>
          <p className="text-xs text-muted">{pluralize(totals.count, ['товар', 'товара', 'товаров'])}</p>
        </div>
        <button onClick={close} className="icon-btn absolute right-4 top-4" aria-label="Закрыть корзину">
          <X size={18} />
        </button>
      </header>

      {totals.items.length === 0 ? (
        <div className="flex flex-1 items-center p-5">
          <EmptyState
            title="Тут пока пусто"
            text="Корзина грустит без деталей. Самое время найти что-нибудь для своей тачки!"
            action={
              <Link to="/catalog" onClick={close} className="btn btn-primary">
                В каталог
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="border-b border-line p-5">
            <FreeShippingBar subtotal={totals.subtotal} unlocked={totals.freeShipping} />
          </div>
          <ul className="flex-1 space-y-3 overflow-y-auto p-5">
            {totals.items.map(({ product, qty, sum }) => (
              <li key={product.id} className="flex gap-3 rounded-2xl border border-line bg-[var(--glass)] p-2.5">
                <Link to={`/product/${product.slug}`} onClick={close} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--glass-strong)]">
                  <PartArt kind={product.art} hue={product.hue} className="h-full w-full" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link to={`/product/${product.slug}`} onClick={close} className="line-clamp-2 text-sm font-bold leading-snug hover:text-pink">
                    {product.name}
                  </Link>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <QtyStepper size="sm" value={qty} max={Math.max(1, product.stock || 10)} onChange={(v) => setQty(product.id, v)} />
                    <span className="font-display text-sm font-extrabold">{formatPrice(sum)}</span>
                  </div>
                </div>
                <button onClick={() => remove(product.id)} className="self-start p-1 text-faint hover:text-red" aria-label="Удалить">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <footer className="space-y-3 border-t border-line p-5">
            {totals.savings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted">Экономия по скидкам</span>
                <span className="font-bold text-lime">−{formatPrice(totals.savings)}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <span className="font-bold">Итого</span>
              <span className="font-display text-2xl font-extrabold">{formatPrice(totals.total)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/cart" onClick={close} className="btn btn-ghost">
                В корзину
              </Link>
              <Link to="/checkout" onClick={close} className="btn btn-primary">
                Оформить <ArrowRight size={16} />
              </Link>
            </div>
          </footer>
        </>
      )}
    </Drawer>
  )
}
