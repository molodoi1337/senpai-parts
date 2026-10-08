import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { productById, type Product } from '@/data/products'
import { FREE_SHIPPING_FROM, promoCodes, type PromoCode } from '@/data/site'

export interface CartLine {
  id: string
  qty: number
}

interface CartState {
  lines: CartLine[]
  promo: string | null
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  applyPromo: (code: string) => PromoCode | null
  clearPromo: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      promo: null,
      add: (id, qty = 1) =>
        set((s) => {
          const max = Math.max(1, productById[id]?.stock || 10)
          const existing = s.lines.find((l) => l.id === id)
          if (existing) {
            return { lines: s.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(max, l.qty + qty) } : l)) }
          }
          return { lines: [...s.lines, { id, qty: Math.min(max, qty) }] }
        }),
      setQty: (id, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty } : l)),
        })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      clear: () => set({ lines: [], promo: null }),
      applyPromo: (code) => {
        const promo = promoCodes.find((p) => p.code === code.trim().toUpperCase()) ?? null
        if (promo) set({ promo: promo.code })
        return promo
      },
      clearPromo: () => set({ promo: null }),
    }),
    { name: 'senpai-cart' },
  ),
)

export interface CartTotals {
  items: { product: Product; qty: number; sum: number }[]
  count: number
  subtotal: number
  savings: number
  discount: number
  promo: PromoCode | null
  promoError: string | null
  freeShipping: boolean
  toFreeShipping: number
  total: number
}

export function computeTotals(lines: CartLine[], promoCode: string | null): CartTotals {
  const items = lines
    .map((l) => ({ product: productById[l.id], qty: l.qty }))
    .filter((x) => x.product)
    .map((x) => ({ ...x, sum: x.product.price * x.qty }))

  const subtotal = items.reduce((s, x) => s + x.sum, 0)
  const savings = items.reduce((s, x) => s + ((x.product.oldPrice ?? x.product.price) - x.product.price) * x.qty, 0)
  const count = items.reduce((s, x) => s + x.qty, 0)

  const promo = promoCodes.find((p) => p.code === promoCode) ?? null
  let discount = 0
  let promoError: string | null = null
  if (promo) {
    if (promo.minTotal && subtotal < promo.minTotal) {
      promoError = `Промокод работает от ${promo.minTotal.toLocaleString('ru-RU')} ₽`
    } else if (promo.kind === 'percent') {
      const base = promo.onlyType ? items.filter((x) => x.product.type === promo.onlyType).reduce((s, x) => s + x.sum, 0) : subtotal
      if (promo.onlyType && base === 0) promoError = 'В корзине нет тюнинг-деталей'
      discount = Math.round((base * promo.value) / 100)
    } else if (promo.kind === 'fixed') {
      discount = Math.min(promo.value, subtotal)
    }
  }

  const freeShipping = subtotal >= FREE_SHIPPING_FROM || promo?.kind === 'shipping'
  return {
    items,
    count,
    subtotal,
    savings,
    discount,
    promo,
    promoError,
    freeShipping,
    toFreeShipping: Math.max(0, FREE_SHIPPING_FROM - subtotal),
    total: Math.max(0, subtotal - discount),
  }
}

export const useCartTotals = () => {
  const lines = useCart((s) => s.lines)
  const promo = useCart((s) => s.promo)
  return computeTotals(lines, promo)
}
