import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Package, Sparkles, Truck } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Mascot } from '@/components/art/Mascot'
import { useUser, levelFor, useXp } from '@/store/user'
import { addDays, cn, formatDay, formatPrice } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

function Burst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        x: (Math.random() - 0.5) * 900,
        y: (Math.random() - 0.8) * 600,
        r: Math.random() * 720 - 360,
        d: Math.random() * 0.4,
        c: ['#ff4fa3', '#ffd84d', '#3de8ff', '#8f72ff', '#ffb3d6'][i % 5],
        s: 8 + Math.random() * 10,
      })),
    [],
  )
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-40 z-10">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-[60%_0_60%_0]"
          style={{ width: b.s, height: b.s, background: b.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: b.x, y: [0, b.y, b.y + 500], opacity: [1, 1, 0], rotate: b.r, scale: 1 }}
          transition={{ duration: 2.6, delay: b.d, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export default function OrderSuccess() {
  usePageTitle('Заказ оформлен')
  const { number } = useParams()
  const order = useUser((s) => s.orders.find((o) => o.number === number))
  const xp = useXp()
  const { current } = levelFor(xp)

  const timeline = [
    { icon: Check, label: 'Заказ принят', sub: 'только что', done: true },
    { icon: Package, label: 'Собираем на складе', sub: 'сегодня до 18:00', done: false },
    { icon: Truck, label: 'В пути', sub: formatDay(addDays(1)), done: false },
    { icon: Sparkles, label: 'У тебя в руках', sub: formatDay(addDays(3)), done: false },
  ]

  return (
    <Container className="relative pt-8">
      <Burst />
      <div className="glass relative mx-auto max-w-2xl overflow-hidden rounded-[36px] p-6 text-center sm:p-10">
        <span aria-hidden className="speedlines absolute inset-0 opacity-60" />
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="relative mx-auto w-fit">
          <Mascot mood="love" className="h-36 w-36" />
        </motion.div>
        <p className="relative mt-2 font-jp text-3xl font-black text-pink">ありがとう!</p>
        <h1 className="section-title relative mt-2 text-3xl sm:text-4xl">Заказ оформлен</h1>
        <p className="relative mt-2 text-muted">
          Номер заказа <b className="font-display text-fg">{number}</b>. Детали отправили на почту, статус будет в профиле.
        </p>
        {order && (
          <div className="relative mt-5 flex flex-wrap justify-center gap-2">
            <span className="chip">{formatPrice(order.total)}</span>
            <span className="chip">{order.delivery}</span>
            <span className="chip border-violet/50 bg-violet/15 text-violet">+{order.xp} XP · уровень «{current.title}»</span>
          </div>
        )}
        <ol className="relative mt-8 grid gap-3 text-left sm:grid-cols-4">
          {timeline.map(({ icon: Icon, label, sub, done }) => (
            <li key={label} className="rounded-2xl border border-line bg-[var(--glass)] p-3">
              <span className={cn('grid h-9 w-9 place-items-center rounded-xl', done ? 'bg-lime text-[#0b1a05]' : 'bg-[var(--glass-strong)] text-muted')}>
                <Icon size={16} />
              </span>
              <p className="mt-2 text-sm font-extrabold">{label}</p>
              <p className="text-xs text-muted">{sub}</p>
            </li>
          ))}
        </ol>
        <div className="relative mt-8 flex flex-wrap justify-center gap-2">
          <Link to="/account" className="btn btn-primary">
            Мои заказы
          </Link>
          <Link to="/catalog" className="btn btn-ghost">
            Продолжить покупки
          </Link>
        </div>
      </div>
    </Container>
  )
}
