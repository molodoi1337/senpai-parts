import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { promoCodes } from '@/data/site'
import { useCart, type CartTotals } from '@/store/cart'
import { toast } from '@/store/ui'
import { formatPrice } from '@/lib/utils'

export function PromoField() {
  const { promo, applyPromo, clearPromo } = useCart()
  const [code, setCode] = useState('')
  if (promo) {
    const p = promoCodes.find((x) => x.code === promo)
    return (
      <div className="flex items-center justify-between rounded-2xl border border-lime/40 bg-lime/10 px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2 font-bold">
          <Tag size={15} className="text-lime" /> {promo} <span className="font-medium text-muted">· {p?.title}</span>
        </span>
        <button onClick={clearPromo} className="text-faint hover:text-red" aria-label="Убрать промокод">
          <X size={16} />
        </button>
      </div>
    )
  }
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const ok = applyPromo(code)
        toast(ok ? { title: `Промокод ${ok.code} активирован 🎉`, description: ok.title, tone: 'kawaii' } : { title: 'Такого промокода нет', description: 'Подсказка: попробуй SENPAI10', tone: 'error' })
        if (ok) setCode('')
      }}
    >
      <input className="input h-11 uppercase placeholder:normal-case" placeholder="Промокод" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Промокод" />
      <button className="btn btn-ghost h-11 shrink-0" disabled={!code.trim()}>
        Применить
      </button>
    </form>
  )
}

export function SummaryRows({ totals, shipping }: { totals: CartTotals; shipping?: number }) {
  const ship = shipping ?? 0
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Товары ({totals.count})</dt>
        <dd className="font-bold">{formatPrice(totals.subtotal + totals.savings)}</dd>
      </div>
      {totals.savings > 0 && (
        <div className="flex justify-between">
          <dt className="text-muted">Скидки</dt>
          <dd className="font-bold text-lime">−{formatPrice(totals.savings)}</dd>
        </div>
      )}
      {totals.discount > 0 && (
        <div className="flex justify-between">
          <dt className="text-muted">Промокод {totals.promo?.code}</dt>
          <dd className="font-bold text-lime">−{formatPrice(totals.discount)}</dd>
        </div>
      )}
      {totals.promoError && <p className="rounded-xl bg-sun/15 px-3 py-2 text-xs font-bold text-sun">{totals.promoError}</p>}
      {shipping != null && (
        <div className="flex justify-between">
          <dt className="text-muted">Доставка</dt>
          <dd className="font-bold">{ship === 0 ? <span className="text-lime">Бесплатно</span> : formatPrice(ship)}</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between border-t border-dashed border-line pt-3">
        <dt className="font-extrabold">Итого</dt>
        <dd className="font-display text-3xl font-extrabold">{formatPrice(totals.total + ship)}</dd>
      </div>
    </dl>
  )
}
