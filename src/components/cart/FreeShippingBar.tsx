import { FREE_SHIPPING_FROM } from '@/data/site'
import { formatPrice } from '@/lib/utils'

/** Прогресс до бесплатной доставки — с машинкой, которая едет по полоске */
export function FreeShippingBar({ subtotal, unlocked }: { subtotal: number; unlocked?: boolean }) {
  const pct = unlocked ? 100 : Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)
  const left = FREE_SHIPPING_FROM - subtotal
  return (
    <div>
      <p className="mb-2 text-sm font-bold">
        {pct >= 100 ? (
          <>
            Доставка <span className="text-lime">бесплатная</span> — ты великолепен ✨
          </>
        ) : (
          <>
            До бесплатной доставки <span className="text-pink">{formatPrice(left)}</span>
          </>
        )}
      </p>
      <div className="relative h-3 rounded-full bg-[var(--glass-strong)]">
        <div className="h-full rounded-full bg-gradient-to-r from-pink via-violet to-cyan transition-[width] duration-700" style={{ width: `${pct}%` }} />
        <span className="absolute -top-3 text-xl transition-[left] duration-700" style={{ left: `calc(${pct}% - 14px)` }} aria-hidden>
          🏎️
        </span>
        {pct < 100 && (
          <span className="absolute -right-1 -top-3 text-lg" aria-hidden>
            🏁
          </span>
        )}
      </div>
    </div>
  )
}
