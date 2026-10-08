import { Link } from 'react-router-dom'
import { ArrowRight, Heart, ShieldCheck, Trash2, Truck } from 'lucide-react'
import { brandById } from '@/data/catalog-meta'
import { useShowcase } from '@/api/hooks'
import { Container, PageHeader } from '@/components/layout/Container'
import { QtyStepper } from '@/components/ui/QtyStepper'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductRail } from '@/components/product/ProductRail'
import { FitBadge } from '@/components/product/FitBadge'
import { StockLabel } from '@/components/product/StockLabel'
import { FreeShippingBar } from '@/components/cart/FreeShippingBar'
import { PromoField, SummaryRows } from '@/components/cart/Summary'
import { useCart, useCartTotals } from '@/store/cart'
import { useWishlist } from '@/store/collections'
import { toast } from '@/store/ui'
import { formatPrice, pluralize } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'
import { ProductImage } from '@/components/product/ProductImage'

export default function Cart() {
  usePageTitle('Корзина')
  const { setQty, remove, clear } = useCart()
  const totals = useCartTotals()
  const toggleLike = useWishlist((s) => s.toggle)
  const { data: recs } = useShowcase('best', 10)

  if (!totals.items.length) {
    return (
      <Container className="pt-12">
        <EmptyState
          title="Корзина пустая (｡•́︿•̀｡)"
          text="Но это легко исправить. Загляни в каталог или проверь хиты недели."
          action={
            <Link to="/catalog" className="btn btn-primary">
              В каталог <ArrowRight size={16} />
            </Link>
          }
        />
        <section className="mt-16">
          <SectionHeading jp="人気" title="Может, вот это?" />
          <ProductRail items={recs} loading={!recs} />
        </section>
      </Container>
    )
  }

  return (
    <Container className="pt-4">
      <PageHeader jp="カート" title="Корзина" subtitle={pluralize(totals.count, ['товар', 'товара', 'товаров']) + ' на сумму ' + formatPrice(totals.total)} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">
          <div className="glass rounded-3xl p-5">
            <FreeShippingBar subtotal={totals.subtotal} unlocked={totals.freeShipping} />
          </div>
          {totals.items.map(({ product, qty, sum }) => (
            <article key={product.id} className="glass grid grid-cols-[96px_1fr] gap-4 rounded-3xl p-3 sm:grid-cols-[130px_1fr_auto] sm:p-4">
              <Link to={`/product/${product.slug}`} className="aspect-square overflow-hidden rounded-2xl bg-[var(--glass)]">
                <ProductImage product={product} width={160} />
              </Link>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">{brandById[product.brandId].name}</p>
                <Link to={`/product/${product.slug}`} className="mt-0.5 line-clamp-2 font-bold hover:text-pink">
                  {product.name}
                </Link>
                <p className="mt-1 text-xs text-faint">OEM {product.oem}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <FitBadge product={product} />
                  <StockLabel product={product} />
                </div>
                <div className="mt-3 flex gap-3 text-xs font-bold">
                  <button
                    onClick={() => {
                      toggleLike(product.id)
                      remove(product.id)
                      toast({ title: 'Перенесли в избранное 💖', tone: 'kawaii' })
                    }}
                    className="flex items-center gap-1 text-muted hover:text-pink"
                  >
                    <Heart size={13} /> Отложить
                  </button>
                  <button onClick={() => remove(product.id)} className="flex items-center gap-1 text-muted hover:text-red">
                    <Trash2 size={13} /> Удалить
                  </button>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-between">
                <QtyStepper value={qty} max={product.condition === 'contract' ? 1 : Math.max(1, product.stock || 10)} onChange={(v) => setQty(product.id, v)} />
                <div className="text-right">
                  <p className="font-display text-xl font-extrabold">{formatPrice(sum)}</p>
                  {qty > 1 && <p className="text-xs text-faint">{formatPrice(product.price)} / шт</p>}
                  {product.oldPrice && <p className="text-xs font-bold text-lime">экономия {formatPrice((product.oldPrice - product.price) * qty)}</p>}
                </div>
              </div>
            </article>
          ))}
          <button onClick={clear} className="text-sm font-bold text-muted hover:text-red">
            Очистить корзину
          </button>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass space-y-4 rounded-[28px] p-5">
            <h2 className="font-display text-xl font-extrabold">Твой заказ</h2>
            <PromoField />
            <SummaryRows totals={totals} />
            <Link to="/checkout" className="btn btn-primary btn-lg w-full">
              Оформить заказ <ArrowRight size={18} />
            </Link>
            <ul className="space-y-2 text-xs text-muted">
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-lime" /> Безопасная оплата, данные карты мы не храним
              </li>
              <li className="flex items-center gap-2">
                <Truck size={14} className="text-cyan" /> {totals.freeShipping ? 'Доставка в пункт выдачи бесплатно' : 'Бесплатная доставка от 5 000 ₽'}
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <section className="mt-16">
        <SectionHeading jp="おすすめ" title="Добавь к заказу" />
        <ProductRail items={recs} loading={!recs} />
      </section>
    </Container>
  )
}
