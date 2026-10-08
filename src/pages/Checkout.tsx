import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Lock, MapPin, User, Wallet, ClipboardCheck } from 'lucide-react'
import { deliveryOptions, paymentOptions } from '@/data/site'
import { Container, PageHeader } from '@/components/layout/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { PromoField, SummaryRows } from '@/components/cart/Summary'
import { useCart, useCartTotals } from '@/store/cart'
import { useUser, type Order } from '@/store/user'
import { toast } from '@/store/ui'
import { addDays, cn, formatDay, formatPrice, sleep } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'
import { ProductImage } from '@/components/product/ProductImage'

const steps = [
  { id: 'contacts', label: 'Контакты', icon: User },
  { id: 'delivery', label: 'Доставка', icon: MapPin },
  { id: 'payment', label: 'Оплата', icon: Wallet },
  { id: 'confirm', label: 'Проверка', icon: ClipboardCheck },
] as const

interface FormState {
  name: string
  phone: string
  email: string
  delivery: string
  city: string
  address: string
  slot: string
  payment: string
  comment: string
  agree: boolean
}

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7')) d = '7' + d
  d = d.slice(0, 11)
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)]
  let out = '+7'
  if (p[0]) out += ` (${p[0]}`
  if (p[0].length === 3) out += ')'
  if (p[1]) out += ` ${p[1]}`
  if (p[2]) out += `-${p[2]}`
  if (p[3]) out += `-${p[3]}`
  return out
}

function validate(step: number, f: FormState) {
  const e: Partial<Record<keyof FormState, string>> = {}
  if (step === 0) {
    if (f.name.trim().length < 2) e.name = 'Как к тебе обращаться?'
    if (f.phone.replace(/\D/g, '').length !== 11) e.phone = 'Нужен номер целиком: +7 (XXX) XXX-XX-XX'
    if (!/^\S+@\S+\.\S{2,}$/.test(f.email)) e.email = 'Проверь e-mail — туда придёт чек'
  }
  if (step === 1) {
    if (!f.delivery) e.delivery = 'Выбери способ доставки'
    if (f.delivery !== 'store' && f.city.trim().length < 2) e.city = 'Укажи город'
    if (f.delivery !== 'store' && f.address.trim().length < 5) e.address = f.delivery === 'pickup' ? 'Укажи адрес или название ПВЗ' : 'Укажи улицу, дом и квартиру'
  }
  if (step === 2 && !f.payment) e.payment = 'Выбери способ оплаты'
  if (step === 3 && !f.agree) e.agree = 'Нужно согласие с условиями'
  return e
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-bold text-red">{error}</span>}
    </label>
  )
}

function OptionCard({ active, onClick, title, subtitle, right, emoji }: { active: boolean; onClick: () => void; title: string; subtitle: string; right?: ReactNode; emoji?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition', active ? 'border-pink bg-pink/10' : 'border-line bg-[var(--glass)] hover:border-pink/40')}
      aria-pressed={active}
    >
      <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', active ? 'border-pink bg-pink' : 'border-line')}>{active && <span className="h-2 w-2 rounded-full bg-white" />}</span>
      {emoji && <span className="text-2xl">{emoji}</span>}
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold">{title}</span>
        <span className="block text-xs text-muted">{subtitle}</span>
      </span>
      {right && <span className="shrink-0 text-right text-sm font-bold">{right}</span>}
    </button>
  )
}

const slots = ['10:00–14:00', '14:00–18:00', '18:00–22:00']

export default function Checkout() {
  usePageTitle('Оформление заказа')
  const totals = useCartTotals()
  const clear = useCart((s) => s.clear)
  const user = useUser()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [f, setF] = useState<FormState>({
    name: user.name === 'Гость-сан' ? '' : user.name,
    phone: user.phone,
    email: user.email,
    delivery: 'pickup',
    city: user.city,
    address: '',
    slot: slots[1],
    payment: 'card',
    comment: '',
    agree: false,
  })
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF((s) => ({ ...s, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const delivery = deliveryOptions.find((d) => d.id === f.delivery)!
  const shipping = useMemo(() => {
    if (delivery.id === 'pickup' && totals.freeShipping) return 0
    if (totals.promo?.kind === 'shipping') return 0
    return delivery.price
  }, [delivery, totals])

  if (!totals.items.length && !submitting) {
    return (
      <Container className="pt-12">
        <EmptyState
          title="Нечего оформлять"
          text="Корзина пуста. Добавь что-нибудь — и возвращайся."
          action={
            <Link to="/catalog" className="btn btn-primary">
              В каталог
            </Link>
          }
        />
      </Container>
    )
  }

  const go = (to: number) => {
    if (to > step) {
      const e = validate(step, f)
      if (Object.keys(e).length) {
        setErrors(e)
        toast({ title: 'Проверь поля, сэмпай', description: Object.values(e)[0], tone: 'error' })
        return
      }
    }
    setDir(to > step ? 1 : -1)
    setStep(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async () => {
    const e = validate(3, f)
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    setSubmitting(true)
    await sleep(1400)
    const now = new Date()
    const number = `SP-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${Math.floor(Math.random() * 900 + 100)}`
    const total = totals.total + shipping
    const order: Order = {
      number,
      createdAt: Date.now(),
      status: 'processing',
      lines: totals.items.map(({ product, qty }) => ({ id: product.id, name: product.name, price: product.price, qty })),
      total,
      delivery: delivery.title,
      payment: paymentOptions.find((p) => p.id === f.payment)!.title,
      address: f.delivery === 'store' ? 'Шоурум SENPAI' : `${f.city}, ${f.address}`,
      xp: Math.max(10, Math.round(total / 100)),
    }
    user.addOrder(order)
    user.setProfile({ name: f.name, phone: f.phone, email: f.email, city: f.city })
    clear()
    navigate(`/checkout/success/${number}`, { replace: true })
  }

  return (
    <Container className="pt-4">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-pink">
        <ArrowLeft size={15} /> Вернуться в корзину
      </Link>
      <PageHeader jp="チェックアウト" title="Оформление заказа" />

      {/* степпер */}
      <ol className="mb-6 grid grid-cols-4 gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon
          const done = i < step
          return (
            <li key={s.id}>
              <button
                onClick={() => i < step && go(i)}
                disabled={i > step}
                className={cn('flex w-full flex-col items-center gap-2 rounded-2xl p-2 text-center sm:flex-row sm:p-3 sm:text-left', i === step ? 'glass' : '')}
              >
                <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl transition', done ? 'bg-lime text-[#0b1a05]' : i === step ? 'bg-gradient-to-br from-pink to-violet text-white' : 'bg-[var(--glass-strong)] text-faint')}>
                  {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                </span>
                <span className={cn('text-xs font-extrabold sm:text-sm', i > step && 'text-faint')}>{s.label}</span>
              </button>
              <div className="mx-2 mt-1 h-1 overflow-hidden rounded-full bg-[var(--glass-strong)]">
                <div className="h-full bg-gradient-to-r from-pink to-violet transition-all duration-500" style={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }} />
              </div>
            </li>
          )
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="glass overflow-hidden rounded-[30px] p-5 sm:p-7">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }} transition={{ duration: 0.25 }}>
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <h2 className="font-display text-xl font-extrabold sm:col-span-2">Кто забирает?</h2>
                  <Field label="Имя" error={errors.name}>
                    <input className={cn('input', errors.name && 'input-error')} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Например, Такуми" autoComplete="name" />
                  </Field>
                  <Field label="Телефон" error={errors.phone}>
                    <input className={cn('input', errors.phone && 'input-error')} value={f.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} placeholder="+7 (900) 000-00-00" inputMode="tel" autoComplete="tel" />
                  </Field>
                  <Field label="E-mail для чека" error={errors.email}>
                    <input className={cn('input', errors.email && 'input-error')} value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="takumi@akina.jp" type="email" autoComplete="email" />
                  </Field>
                  <div className="flex items-end">
                    <p className="rounded-2xl bg-[var(--glass)] p-3 text-xs text-muted">Пришлём SMS со статусом заказа. Никакого спама — только по делу, честное слово.</p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-extrabold">Как доставить?</h2>
                  <div className="grid gap-2">
                    {deliveryOptions.map((d) => {
                      const price = d.id === 'pickup' && totals.freeShipping ? 0 : totals.promo?.kind === 'shipping' ? 0 : d.price
                      return (
                        <OptionCard
                          key={d.id}
                          active={f.delivery === d.id}
                          onClick={() => set('delivery', d.id)}
                          emoji={d.emoji}
                          title={d.title}
                          subtitle={`${d.subtitle} · ${d.days}`}
                          right={price === 0 ? <span className="text-lime">Бесплатно</span> : formatPrice(price)}
                        />
                      )
                    })}
                  </div>
                  {f.delivery !== 'store' && (
                    <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                      <Field label="Город" error={errors.city}>
                        <input className={cn('input', errors.city && 'input-error')} value={f.city} onChange={(e) => set('city', e.target.value)} autoComplete="address-level2" />
                      </Field>
                      <Field label={f.delivery === 'pickup' ? 'Пункт выдачи' : 'Адрес'} error={errors.address}>
                        <input className={cn('input', errors.address && 'input-error')} value={f.address} onChange={(e) => set('address', e.target.value)} placeholder={f.delivery === 'pickup' ? 'Ближайший к метро «Акихабара» 😉' : 'Улица, дом, квартира'} autoComplete="street-address" />
                      </Field>
                    </div>
                  )}
                  {(f.delivery === 'courier' || f.delivery === 'tofu') && (
                    <div>
                      <span className="label">Интервал · {formatDay(addDays(f.delivery === 'tofu' ? 1 : 2))}</span>
                      <div className="flex flex-wrap gap-2">
                        {slots.map((s) => (
                          <button key={s} type="button" onClick={() => set('slot', s)} className={cn('chip h-10 px-4', f.slot === s && 'chip-active')}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <Field label="Комментарий курьеру">
                    <input className="input" value={f.comment} onChange={(e) => set('comment', e.target.value)} placeholder="Домофон не работает, звоните — выйду" />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-extrabold">Как оплатишь?</h2>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {paymentOptions.map((p) => (
                      <OptionCard
                        key={p.id}
                        active={f.payment === p.id}
                        onClick={() => set('payment', p.id)}
                        title={p.title}
                        subtitle={p.id === 'split' ? `4 × ${formatPrice(Math.ceil((totals.total + shipping) / 4))}` : p.subtitle}
                      />
                    ))}
                  </div>
                  <p className="flex items-start gap-2 rounded-2xl bg-[var(--glass)] p-4 text-sm text-muted">
                    <Lock size={16} className="mt-0.5 shrink-0 text-lime" />
                    {f.payment === 'card' || f.payment === 'sbp'
                      ? 'После подтверждения откроется защищённая страница банка. Это демо-магазин, поэтому оплата только имитируется — реальные данные вводить не нужно.'
                      : 'Оплата при получении или частями — без переплат и скрытых комиссий.'}
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-display text-xl font-extrabold">Всё верно?</h2>
                  <dl className="grid gap-3 sm:grid-cols-3">
                    {[
                      ['Получатель', `${f.name}\n${f.phone}\n${f.email}`, 0],
                      ['Доставка', `${delivery.title}\n${f.delivery === 'store' ? 'Шоурум SENPAI' : `${f.city}, ${f.address}`}`, 1],
                      ['Оплата', paymentOptions.find((p) => p.id === f.payment)!.title, 2],
                    ].map(([k, v, s]) => (
                      <div key={k as string} className="rounded-2xl border border-line bg-[var(--glass)] p-4">
                        <dt className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-faint">
                          {k}
                          <button onClick={() => go(s as number)} className="normal-case tracking-normal text-pink hover:underline">
                            изменить
                          </button>
                        </dt>
                        <dd className="mt-1 whitespace-pre-line text-sm font-bold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="divide-y divide-line rounded-2xl border border-line">
                    {totals.items.map(({ product, qty, sum }) => (
                      <li key={product.id} className="flex items-center gap-3 p-3">
                        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--glass)]">
                          <ProductImage product={product} width={60} />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-bold">{product.name}</span>
                        <span className="shrink-0 text-sm text-muted">× {qty}</span>
                        <span className="w-24 shrink-0 text-right font-display text-sm font-bold">{formatPrice(sum)}</span>
                      </li>
                    ))}
                  </ul>
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input type="checkbox" checked={f.agree} onChange={(e) => set('agree', e.target.checked)} className="mt-0.5 h-5 w-5 accent-[var(--pink)]" />
                    <span className={cn(errors.agree && 'text-red')}>Согласен с условиями продажи и обработкой персональных данных (в демо — просто галочка, но на настоящем сайте тут ссылки на документы).</span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
            <button onClick={() => go(step - 1)} disabled={step === 0} className="btn btn-ghost">
              <ArrowLeft size={16} /> Назад
            </button>
            {step < 3 ? (
              <button onClick={() => go(step + 1)} className="btn btn-primary">
                Дальше <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={submit} disabled={submitting} className="btn btn-primary btn-lg">
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Оформляем…
                  </>
                ) : (
                  <>
                    Подтвердить · {formatPrice(totals.total + shipping)}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass space-y-4 rounded-[28px] p-5">
            <h2 className="font-display text-lg font-extrabold">Заказ</h2>
            <ul className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {totals.items.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--glass)]">
                    <ProductImage product={product} width={60} />
                    <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-full bg-pink px-1 text-[0.6rem] font-extrabold text-white">{qty}</span>
                  </span>
                  <span className="line-clamp-2 text-xs font-bold">{product.name}</span>
                </li>
              ))}
            </ul>
            <PromoField />
            <SummaryRows totals={totals} shipping={shipping} />
            <p className="rounded-xl bg-violet/15 px-3 py-2 text-xs font-bold text-violet">+{Math.max(10, Math.round((totals.total + shipping) / 100))} XP к уровню сэмпая за этот заказ ✨</p>
          </div>
        </aside>
      </div>
    </Container>
  )
}
