import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OrderLine {
  id: string
  name: string
  price: number
  qty: number
}

export interface Order {
  number: string
  createdAt: number
  status: 'processing' | 'shipping' | 'delivered'
  lines: OrderLine[]
  total: number
  delivery: string
  payment: string
  address: string
  xp: number
}

interface UserState {
  name: string
  email: string
  phone: string
  city: string
  orders: Order[]
  bonusXp: number
  setProfile: (p: Partial<Pick<UserState, 'name' | 'email' | 'phone' | 'city'>>) => void
  addOrder: (o: Order) => void
  addXp: (xp: number) => void
}

const demoOrders: Order[] = [
  {
    number: 'SP-240913',
    createdAt: Date.now() - 34 * 86400000,
    status: 'delivered',
    lines: [
      { id: 'p0105', name: 'Фильтр масляный', price: 790, qty: 2 },
      { id: 'p0125', name: 'Масло моторное 5W-40, 4 л', price: 5490, qty: 1 },
    ],
    total: 7070,
    delivery: 'Пункт выдачи',
    payment: 'СБП',
    address: 'Москва',
    xp: 70,
  },
  {
    number: 'SP-241002',
    createdAt: Date.now() - 6 * 86400000,
    status: 'shipping',
    lines: [{ id: 'p0001', name: 'Колодки тормозные передние', price: 4290, qty: 1 }],
    total: 4290,
    delivery: 'Курьер до двери',
    payment: 'Картой онлайн',
    address: 'Москва',
    xp: 42,
  },
]

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      name: 'Гость-сан',
      email: '',
      phone: '',
      city: 'Москва',
      orders: demoOrders,
      bonusXp: 50,
      setProfile: (p) => set(p),
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      addXp: (xp) => set((s) => ({ bonusXp: s.bonusXp + xp })),
    }),
    { name: 'senpai-user' },
  ),
)

export const levels = [
  { level: 1, title: 'Кохай', jp: '後輩', xp: 0, perk: 'Доступ к закрытым дропам' },
  { level: 2, title: 'Гонщик выходного дня', jp: '週末レーサー', xp: 200, perk: 'Кешбэк 2% баллами' },
  { level: 3, title: 'Дрифтер', jp: 'ドリフター', xp: 600, perk: 'Кешбэк 3% + бесплатная доставка от 3 000 ₽' },
  { level: 4, title: 'Сэмпай', jp: '先輩', xp: 1500, perk: 'Кешбэк 5% + персональный менеджер' },
  { level: 5, title: 'Легенда Ванган', jp: '湾岸伝説', xp: 4000, perk: 'Кешбэк 7% + Tofu Express бесплатно' },
]

export function levelFor(xp: number) {
  let current = levels[0]
  for (const l of levels) if (xp >= l.xp) current = l
  const next = levels.find((l) => l.xp > xp) ?? null
  const progress = next ? (xp - current.xp) / (next.xp - current.xp) : 1
  return { current, next, progress }
}

export const useXp = () => {
  const orders = useUser((s) => s.orders)
  const bonus = useUser((s) => s.bonusXp)
  return orders.reduce((s, o) => s + o.xp, 0) + bonus
}
