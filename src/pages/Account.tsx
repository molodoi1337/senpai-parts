import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Crown, Flower2, Lock, Moon, Package, Sun, Trophy } from 'lucide-react'
import { productById } from '@/data/products'
import { Container, PageHeader } from '@/components/layout/Container'
import { Mascot } from '@/components/art/Mascot'
import { levelFor, levels, useUser, useXp, type Order } from '@/store/user'
import { useGarage } from '@/store/garage'
import { useCompare, useWishlist } from '@/store/collections'
import { toast, useUi } from '@/store/ui'
import { cn, formatDate, formatNumber, formatPrice, pluralize } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

const statusMeta: Record<Order['status'], { label: string; cls: string }> = {
  processing: { label: 'Собираем', cls: 'bg-sun/15 text-sun' },
  shipping: { label: 'В пути', cls: 'bg-cyan/15 text-cyan' },
  delivered: { label: 'Получен', cls: 'bg-lime/15 text-lime' },
}

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const s = statusMeta[order.status]
  return (
    <li className="glass rounded-3xl">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-4 text-left" aria-expanded={open}>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--glass-strong)] text-pink">
          <Package size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-extrabold">{order.number}</span>
          <span className="text-xs text-muted">
            {formatDate(order.createdAt)} · {pluralize(order.lines.reduce((a, l) => a + l.qty, 0), ['товар', 'товара', 'товаров'])}
          </span>
        </span>
        <span className={cn('rounded-lg px-2.5 py-1 text-xs font-extrabold', s.cls)}>{s.label}</span>
        <span className="font-display font-extrabold">{formatPrice(order.total)}</span>
        <ChevronDown size={18} className={cn('text-faint transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="border-t border-line p-4 text-sm">
          <ul className="space-y-1.5">
            {order.lines.map((l) => {
              const p = productById[l.id]
              return (
                <li key={l.id} className="flex justify-between gap-3">
                  {p ? (
                    <Link to={`/product/${p.slug}`} className="truncate hover:text-pink">
                      {l.name}
                    </Link>
                  ) : (
                    <span className="truncate">{l.name}</span>
                  )}
                  <span className="shrink-0 text-muted">
                    {l.qty} × {formatPrice(l.price)}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-xs text-muted">
            {order.delivery} · {order.address} · {order.payment} · <span className="font-bold text-violet">+{order.xp} XP</span>
          </p>
        </div>
      )}
    </li>
  )
}

export default function Account() {
  usePageTitle('Профиль')
  const user = useUser()
  const xp = useXp()
  const { current, next, progress } = levelFor(xp)
  const garage = useGarage((s) => s.cars.length)
  const wish = useWishlist((s) => s.ids.length)
  const cmp = useCompare((s) => s.ids.length)
  const { theme, toggleTheme, sakura, toggleSakura } = useUi()
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone, city: user.city })
  const spent = user.orders.reduce((s, o) => s + o.total, 0)

  const achievements = [
    { title: 'Первый заказ', jp: '初注文', done: user.orders.length > 0, text: 'Оформи первый заказ' },
    { title: 'Постоянный клиент', jp: '常連', done: user.orders.length >= 3, text: '3 заказа и больше' },
    { title: 'Гаражный король', jp: 'ガレージ王', done: garage >= 2, text: '2+ машины в гараже' },
    { title: 'Коллекционер', jp: 'コレクター', done: wish >= 5, text: '5+ товаров в избранном' },
    { title: 'Аналитик', jp: 'アナリスト', done: cmp >= 2, text: 'Сравни 2+ детали' },
    { title: 'Хайроллер', jp: '太客', done: spent >= 50000, text: 'Потрать 50 000 ₽' },
  ]

  return (
    <Container className="pt-4">
      <PageHeader jp="マイページ" title={<>Привет, <span className="text-gradient">{user.name}</span></>} subtitle="Заказы, уровень сэмпая, ачивки и настройки — всё тут." />

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <section className="glass relative overflow-hidden rounded-[32px] p-6">
          <span aria-hidden className="pointer-events-none absolute -right-4 -top-6 select-none font-jp text-[8rem] font-black text-pink/10">
            {current.jp}
          </span>
          <div className="relative flex flex-wrap items-center gap-5">
            <div className="relative">
              <Mascot mood="happy" className="h-24 w-24" />
              <span className="sticker sticker-violet absolute -bottom-1 -right-2">Lv.{current.level}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted">
                <Crown size={14} className="text-sun" /> Уровень {current.level}
              </p>
              <p className="font-display text-2xl font-extrabold">{current.title}</p>
              <p className="text-sm text-muted">{current.perk}</p>
            </div>
          </div>
          <div className="relative mt-6">
            <div className="flex justify-between text-xs font-bold">
              <span>{formatNumber(xp)} XP</span>
              <span className="text-muted">{next ? `до «${next.title}» — ${formatNumber(next.xp - xp)} XP` : 'Максимальный уровень!'}</span>
            </div>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-[var(--glass-strong)] p-0.5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(4, progress * 100)}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-pink via-violet to-cyan" />
            </div>
          </div>
          <ol className="relative mt-6 grid grid-cols-5 gap-1.5">
            {levels.map((l) => (
              <li key={l.level} className={cn('rounded-xl border p-2 text-center', l.level <= current.level ? 'border-pink/50 bg-pink/10' : 'border-line opacity-60')}>
                <p className="truncate font-jp text-[0.7rem] font-bold" title={l.title}>{l.jp}</p>
                <p className="mt-0.5 text-[0.6rem] font-bold text-faint">{formatNumber(l.xp)} XP</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="glass rounded-[32px] p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
            <Trophy size={18} className="text-sun" /> Ачивки
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {achievements.map((a) => (
              <li key={a.title} className={cn('relative rounded-2xl border p-3', a.done ? 'border-sun/50 bg-sun/10' : 'border-line bg-[var(--glass)]')}>
                {!a.done && <Lock size={13} className="absolute right-3 top-3 text-faint" />}
                <p className="font-jp text-xs font-bold text-pink">{a.jp}</p>
                <p className={cn('text-sm font-extrabold', !a.done && 'text-muted')}>{a.title}</p>
                <p className="text-[0.7rem] text-faint">{a.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <h2 className="mb-3 font-display text-xl font-extrabold">Мои заказы</h2>
          <ul className="space-y-2.5">
            {user.orders.map((o) => (
              <OrderRow key={o.number} order={o} />
            ))}
          </ul>
        </section>
        <section className="space-y-4">
          <form
            className="glass space-y-3 rounded-[32px] p-6"
            onSubmit={(e) => {
              e.preventDefault()
              user.setProfile(form)
              toast({ title: 'Профиль сохранён ✨', tone: 'kawaii' })
            }}
          >
            <h2 className="font-display text-lg font-extrabold">Профиль</h2>
            {(
              [
                ['name', 'Имя'],
                ['email', 'E-mail'],
                ['phone', 'Телефон'],
                ['city', 'Город'],
              ] as const
            ).map(([k, l]) => (
              <label key={k} className="block">
                <span className="label">{l}</span>
                <input className="input h-11" value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </label>
            ))}
            <button className="btn btn-primary w-full">Сохранить</button>
          </form>
          <div className="glass rounded-[32px] p-6">
            <h2 className="font-display text-lg font-extrabold">Вайб-настройки</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />} {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              </button>
              <button onClick={toggleSakura} className="btn btn-ghost btn-sm">
                <Flower2 size={15} /> Сакура {sakura ? 'вкл' : 'выкл'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </Container>
  )
}
