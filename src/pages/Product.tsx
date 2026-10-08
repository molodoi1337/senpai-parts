import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck, Car, Check, Copy, Gavel, Heart, MessageCircle, Package, PlayCircle, RotateCcw, Scale, ShieldCheck, ShoppingBag, Store, ThumbsUp, Truck, X, Zap,
} from 'lucide-react'
import { useProduct, useProductsByIds } from '@/api/hooks'
import { brandById, categoryById, tierLabel } from '@/data/catalog-meta'
import { carTitle, carYears, genById, makeById } from '@/data/cars'
import { fitsCar, type Product } from '@/data/products'
import { getQuestions, getReviews, type Review } from '@/data/reviews'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PartArt } from '@/components/art/PartArt'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { Price } from '@/components/ui/Price'
import { Rating } from '@/components/ui/Rating'
import { QtyStepper } from '@/components/ui/QtyStepper'
import { Skeleton } from '@/components/ui/Skeleton'
import { Modal } from '@/components/ui/Overlay'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductRail } from '@/components/product/ProductRail'
import { ProductStickers } from '@/components/product/ProductStickers'
import { StockLabel } from '@/components/product/StockLabel'
import { useProductActions } from '@/components/product/useProductActions'
import { useCart } from '@/store/cart'
import { useRecent } from '@/store/collections'
import { useActiveCar } from '@/store/garage'
import { toast, useUi } from '@/store/ui'
import { useUser } from '@/store/user'
import { addDays, cn, formatDate, formatDay, formatNumber, formatPrice, plural } from '@/lib/utils'

function Gallery({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0)
  const [origin, setOrigin] = useState<string | null>(null)
  const cat = categoryById[product.categoryId]
  const hues = [product.hue, product.hue, product.hue, (product.hue + 160) % 360]
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start">
      <div className="no-scrollbar flex gap-2 overflow-x-auto sm:flex-col">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={cn('h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 bg-[var(--glass)] transition sm:h-20 sm:w-20', idx === i ? 'border-pink' : 'border-transparent opacity-70 hover:opacity-100')}
            aria-label={`Фото ${i + 1}`}
          >
            <PartArt kind={product.art} hue={hues[i]} variant={i} className="h-full w-full" />
          </button>
        ))}
      </div>
      <div
        className="glass relative aspect-square w-full min-w-0 cursor-zoom-in overflow-hidden rounded-[32px] sm:flex-1"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
        }}
        onMouseLeave={() => setOrigin(null)}
      >
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="h-full w-full">
            <div className="h-full w-full transition-transform duration-200" style={{ transform: origin ? 'scale(1.6)' : 'scale(1)', transformOrigin: origin ?? 'center' }}>
              <PartArt kind={product.art} hue={hues[idx]} variant={idx} label={cat.jp} className="h-full w-full" />
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute left-4 top-4">
          <ProductStickers product={product} max={3} />
        </div>
        <span className="chip pointer-events-none absolute bottom-4 left-4 backdrop-blur-xl">
          <RotateCcw size={13} /> 360° · наведи для зума
        </span>
      </div>
    </div>
  )
}

function CopyValue({ label, value }: { label: string; value: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value).catch(() => {})
        toast({ title: `${label} скопирован`, description: value })
      }}
      className="group inline-flex items-center gap-1.5 rounded-lg border border-line bg-[var(--glass)] px-2 py-1 text-xs font-bold"
    >
      <span className="text-faint">{label}</span> {value}
      <Copy size={12} className="text-faint group-hover:text-pink" />
    </button>
  )
}

function FitPanel({ product }: { product: Product }) {
  const active = useActiveCar()
  const setGarageOpen = useUi((s) => s.setGarageOpen)
  if (product.universal) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-cyan/30 bg-cyan/10 p-3 text-sm font-semibold">
        <BadgeCheck className="shrink-0 text-cyan" size={20} /> Универсальная деталь — подходит к любому авто с нужными параметрами.
      </div>
    )
  }
  if (!active) {
    return (
      <button onClick={() => setGarageOpen(true)} className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-pink/50 p-3 text-left text-sm font-semibold hover:bg-pink/5">
        <Car className="shrink-0 text-pink" size={20} />
        <span>
          <span className="text-pink">Проверь совместимость</span> — добавь свою тачку в гараж
        </span>
      </button>
    )
  }
  const ok = fitsCar(product, active.gen.id)
  return (
    <div className={cn('flex items-center gap-3 rounded-2xl border p-3', ok ? 'border-lime/40 bg-lime/10' : 'border-red/40 bg-red/10')}>
      <div className="w-20 shrink-0">
        <CarSilhouette shape={active.gen.shape} hue={makeById[active.gen.makeId].hue} glow={false} />
      </div>
      <div className="min-w-0 flex-1 text-sm">
        <p className={cn('flex items-center gap-1 font-extrabold', ok ? 'text-lime' : 'text-red')}>
          {ok ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
          {ok ? 'Подходит к твоей тачке' : 'Не подходит к твоей тачке'}
        </p>
        <p className="truncate text-muted">{carTitle(active.gen)}</p>
      </div>
      <button onClick={() => setGarageOpen(true)} className="text-xs font-bold text-pink hover:underline">
        Сменить
      </button>
    </div>
  )
}

function Reviews({ product }: { product: Product }) {
  const base = useMemo(() => getReviews(product), [product])
  const [extra, setExtra] = useState<Review[]>([])
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const addXp = useUser((s) => s.addXp)
  const name = useUser((s) => s.name)
  const reviews = [...extra, ...base]
  const dist = [5, 4, 3, 2, 1].map((s) => reviews.filter((r) => r.rating === s).length)

  if (!reviews.length && !open) {
    return (
      <EmptyState
        mood="wink"
        title="Отзывов пока нет"
        text="Стань первым — и получи +50 XP к уровню сэмпая."
        action={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Написать отзыв
          </button>
        }
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="glass h-fit rounded-3xl p-5">
        <p className="font-display text-5xl font-extrabold">{product.rating.toFixed(1)}</p>
        <Rating value={product.rating} size={18} className="mt-1" />
        <p className="mt-1 text-sm text-muted">
          {formatNumber(product.reviews)} {plural(product.reviews, ['отзыв', 'отзыва', 'отзывов'])}
        </p>
        <div className="mt-4 space-y-1.5">
          {dist.map((n, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-bold">
              <span className="w-3">{5 - i}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--glass-strong)]">
                <div className="h-full rounded-full bg-gradient-to-r from-sun to-pink" style={{ width: `${reviews.length ? (n / reviews.length) * 100 : 0}%` }} />
              </div>
              <span className="w-4 text-right text-faint">{n}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-sm mt-5 w-full" onClick={() => setOpen(true)}>
          <MessageCircle size={15} /> Написать отзыв
        </button>
      </div>
      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="glass rounded-3xl p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink to-violet text-xs font-extrabold text-white">{r.author.slice(0, 2).toUpperCase()}</span>
              <span className="font-extrabold">{r.author}</span>
              {r.verified && (
                <span className="flex items-center gap-1 text-xs font-bold text-lime">
                  <BadgeCheck size={13} /> Купил тут
                </span>
              )}
              <span className="ml-auto text-xs text-faint">{formatDate(r.date)}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Rating value={r.rating} />
              <span className="text-xs font-semibold text-muted">{r.car}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
            {(r.pros || r.cons) && (
              <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                {r.pros && (
                  <div>
                    <dt className="text-xs font-extrabold text-lime">Плюсы</dt>
                    <dd className="text-muted">{r.pros}</dd>
                  </div>
                )}
                {r.cons && (
                  <div>
                    <dt className="text-xs font-extrabold text-red">Минусы</dt>
                    <dd className="text-muted">{r.cons}</dd>
                  </div>
                )}
              </dl>
            )}
            <button onClick={() => setLiked((s) => ({ ...s, [r.id]: !s[r.id] }))} className={cn('chip mt-3 h-8', liked[r.id] && 'border-pink/60 text-pink')}>
              <ThumbsUp size={13} /> Полезно · {r.likes + (liked[r.id] ? 1 : 0)}
            </button>
          </li>
        ))}
      </ul>

      <Modal open={open} onClose={() => setOpen(false)} className="max-w-lg" label="Новый отзыв">
        <form
          className="p-6"
          onSubmit={(e) => {
            e.preventDefault()
            if (text.trim().length < 10) {
              toast({ title: 'Напиши хотя бы пару слов (от 10 символов)', tone: 'error' })
              return
            }
            setExtra((x) => [{ id: `new-${Date.now()}`, author: name, car: 'Моя тачка', rating, date: Date.now(), text: text.trim(), likes: 0, verified: false }, ...x])
            addXp(50)
            setText('')
            setOpen(false)
            toast({ title: 'Спасибо за отзыв! +50 XP ✨', tone: 'kawaii' })
          }}
        >
          <h3 className="font-display text-xl font-extrabold">Твой отзыв</h3>
          <p className="mt-1 line-clamp-1 text-sm text-muted">{product.name}</p>
          <div className="mt-5 flex gap-1" role="radiogroup" aria-label="Оценка">
            {[1, 2, 3, 4, 5].map((s) => (
              <button type="button" key={s} onClick={() => setRating(s)} className={cn('text-3xl transition-transform hover:scale-110', s <= rating ? 'text-sun' : 'text-faint/40')} aria-label={`${s} из 5`} aria-checked={s === rating} role="radio">
                ★
              </button>
            ))}
          </div>
          <textarea className="input mt-4 h-32 resize-none py-3" placeholder="Как встала, как едет, что понравилось…" value={text} onChange={(e) => setText(e.target.value)} aria-label="Текст отзыва" />
          <button className="btn btn-primary mt-4 w-full">Опубликовать</button>
        </form>
      </Modal>
    </div>
  )
}

function Bundle({ product, items }: { product: Product; items: Product[] }) {
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(items.map((p) => [p.id, true])))
  const add = useCart((s) => s.add)
  const setCartOpen = useUi((s) => s.setCartOpen)
  if (!items.length) return null
  const chosen = [product, ...items.filter((p) => on[p.id])]
  const sum = chosen.reduce((s, p) => s + p.price, 0)
  return (
    <section className="mt-14">
      <SectionHeading jp="セット" title="С этим берут" subtitle="Собрали комплект, чтобы не ездить в магазин дважды." />
      <div className="glass grid items-center gap-4 rounded-[30px] p-4 sm:p-6 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-3">
          {[product, ...items].map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              {i > 0 && <span className="font-display text-2xl font-extrabold text-pink">+</span>}
              <label className={cn('relative flex w-40 cursor-pointer flex-col rounded-2xl border p-2 transition sm:w-48', i === 0 || on[p.id] ? 'border-pink/50 bg-pink/5' : 'border-line opacity-60')}>
                {i > 0 && <input type="checkbox" className="absolute right-3 top-3 h-4 w-4 accent-[var(--pink)]" checked={on[p.id]} onChange={() => setOn((s) => ({ ...s, [p.id]: !s[p.id] }))} />}
                <span className="aspect-square overflow-hidden rounded-xl bg-[var(--glass)]">
                  <PartArt kind={p.art} hue={p.hue} className="h-full w-full" />
                </span>
                <span className="mt-2 line-clamp-2 text-xs font-bold">{p.name}</span>
                <span className="mt-1 font-display text-sm font-extrabold">{formatPrice(p.price)}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-line bg-[var(--glass)] p-5 text-center lg:min-w-60">
          <p className="text-sm text-muted">Комплект из {chosen.length} шт</p>
          <p className="font-display text-3xl font-extrabold">{formatPrice(sum)}</p>
          <button
            className="btn btn-primary mt-3 w-full"
            onClick={() => {
              chosen.forEach((p) => add(p.id))
              setCartOpen(true)
            }}
          >
            <ShoppingBag size={17} /> Взять комплект
          </button>
        </div>
      </div>
    </section>
  )
}

const tabs = ['Описание', 'Характеристики', 'Совместимость', 'Отзывы', 'Вопросы'] as const

export default function ProductPage() {
  const { slug = '' } = useParams()
  const { data, isLoading } = useProduct(slug)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Описание')
  const [qty, setQty] = useState(1)
  const pushRecent = useRecent((s) => s.push)
  const recentIds = useRecent((s) => s.ids)
  const navigate = useNavigate()
  const product = data?.product

  useEffect(() => {
    if (product) {
      pushRecent(product.id)
      document.title = `${product.name} — SENPAI.PARTS`
      setQty(1)
      setTab('Описание')
    }
  }, [product, pushRecent])

  const recentQuery = useProductsByIds(recentIds.filter((id) => id !== product?.id).slice(0, 8))

  if (isLoading) {
    return (
      <Container className="grid gap-8 pt-8 lg:grid-cols-2">
        <Skeleton className="aspect-square rounded-[32px]" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </Container>
    )
  }

  if (!product || !data) {
    return (
      <Container className="pt-16">
        <EmptyState
          title="Деталь не найдена"
          text="Возможно, её уже раскупили, или ссылка битая. Попробуй найти в каталоге."
          action={
            <Link to="/catalog" className="btn btn-primary">
              В каталог
            </Link>
          }
        />
      </Container>
    )
  }

  return <ProductView key={product.id} product={product} related={data.related} bundle={data.bundle} tab={tab} setTab={setTab} qty={qty} setQty={setQty} recent={recentQuery.data} onBuyNow={() => navigate('/checkout')} />
}

interface ViewProps {
  product: Product
  related: Product[]
  bundle: Product[]
  tab: (typeof tabs)[number]
  setTab: (t: (typeof tabs)[number]) => void
  qty: number
  setQty: (n: number) => void
  recent?: Product[]
  onBuyNow: () => void
}

function ProductView({ product, related, bundle, tab, setTab, qty, setQty, recent, onBuyNow }: ViewProps) {
  const { addToCart, liked, like, compared, compare } = useProductActions(product)
  const brand = brandById[product.brandId]
  const cat = categoryById[product.categoryId]
  const questions = useMemo(() => getQuestions(product), [product])
  const max = product.condition === 'contract' ? 1 : Math.max(1, product.stock || 10)
  const xp = Math.max(5, Math.round(product.price / 100))
  const compatGens = product.compat.map((id) => genById[id]).filter(Boolean)

  return (
    <Container className="pt-4">
      <Breadcrumbs items={[{ label: 'Каталог', to: '/catalog' }, { label: cat.name, to: `/catalog/${cat.id}` }, { label: product.name }]} />

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:gap-12">
        <Gallery product={product} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
            <Link to={`/catalog?brand=${brand.id}`} className="text-pink hover:underline">
              {brand.name}
            </Link>
            <span className="text-faint">·</span>
            <span className="text-muted">{tierLabel[brand.tier]}</span>
            <span className="text-faint">·</span>
            <span className="text-muted">{brand.country}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button onClick={() => setTab('Отзывы')} className="flex items-center gap-2">
              <Rating value={product.rating} showValue />
              <span className="text-sm text-muted underline-offset-2 hover:underline">
                {formatNumber(product.reviews)} {plural(product.reviews, ['отзыв', 'отзыва', 'отзывов'])}
              </span>
            </button>
            <span className="text-sm text-muted">Купили {formatNumber(product.sold)} раз</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyValue label="OEM" value={product.oem} />
            <CopyValue label="Арт." value={product.sku} />
          </div>

          <div className="mt-5">
            <FitPanel product={product} />
          </div>

          {product.auction && (
            <div className="mt-3 rounded-2xl border border-cyan/30 bg-cyan/5 p-4">
              <p className="flex items-center gap-2 text-sm font-extrabold text-cyan">
                <Gavel size={16} /> Аукционный лист · オークション
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                {[
                  ['Аукцион', product.auction.house],
                  ['Лот', `#${product.auction.lot}`],
                  ['Оценка', product.auction.grade],
                  ['Пробег', `${formatNumber(product.mileage ?? 0)} км`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[var(--glass)] p-2">
                    <dt className="text-[0.65rem] font-bold uppercase text-faint">{k}</dt>
                    <dd className="font-display text-sm font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              <button onClick={() => toast({ title: 'Видео пришлём в чат после оформления', description: 'Это демо, но в жизни — обязательно 🎥', tone: 'kawaii' })} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-cyan hover:underline">
                <PlayCircle size={16} /> Видео запуска на доноре
              </button>
            </div>
          )}

          <div className="glass mt-5 rounded-[28px] p-5">
            <Price price={product.price} oldPrice={product.oldPrice} size="xl" />
            <p className="mt-1.5 text-sm text-muted">
              или <b className="text-fg">4 × {formatPrice(Math.ceil(product.price / 4))}</b> частями · <span className="font-bold text-violet">+{xp} XP</span> к уровню
            </p>
            <StockLabel product={product} className="mt-3" />
            <div className="mt-4 flex flex-wrap gap-2">
              <QtyStepper value={qty} max={max} onChange={(v) => setQty(Math.max(1, v))} />
              <button className="btn btn-primary btn-lg min-w-0 flex-1" onClick={() => addToCart(qty, true)}>
                <ShoppingBag size={19} /> В корзину
              </button>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                className="btn btn-cyan flex-1"
                onClick={() => {
                  addToCart(qty)
                  onBuyNow()
                }}
              >
                <Zap size={17} /> Купить в 1 клик
              </button>
              <button onClick={like} className={cn('icon-btn h-12 w-12', liked && 'text-pink')} aria-label="В избранное" aria-pressed={liked}>
                <Heart size={19} className={cn(liked && 'fill-pink')} />
              </button>
              <button onClick={compare} className={cn('icon-btn h-12 w-12', compared && 'text-cyan')} aria-label="Сравнить" aria-pressed={compared}>
                <Scale size={19} />
              </button>
            </div>
          </div>

          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {[
              { icon: Truck, title: product.stock > 0 && product.condition === 'new' ? 'Tofu Express — завтра' : `Доставка ${formatDay(addDays(product.deliveryDays[1]))}`, sub: 'по Москве и СПб, от 990 ₽' },
              { icon: Store, title: 'Пункт выдачи', sub: `с ${formatDay(addDays(product.deliveryDays[0] + 1))}, бесплатно от 5 000 ₽` },
              { icon: ShieldCheck, title: product.specs.find(([k]) => k === 'Гарантия')?.[1] ?? 'Гарантия', sub: 'официальная гарантия' },
              { icon: Package, title: '14 дней на возврат', sub: 'если деталь не ставили' },
            ].map(({ icon: Icon, title, sub }) => (
              <li key={title} className="flex items-start gap-3 rounded-2xl border border-line bg-[var(--glass)] p-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-pink" />
                <span>
                  <span className="block font-bold">{title}</span>
                  <span className="text-xs text-muted">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Табы */}
      <div className="mt-14">
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto border-b border-line px-4 pb-3" role="tablist">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn('chip h-10 shrink-0 px-4', tab === t && 'chip-active')}>
              {t}
              {t === 'Отзывы' && <span className="opacity-70">{product.reviews}</span>}
              {t === 'Совместимость' && <span className="opacity-70">{product.universal ? '∞' : compatGens.length}</span>}
            </button>
          ))}
        </div>
        <div className="pt-6">
          {tab === 'Описание' && (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="prose-senpai max-w-none">
                <p className="!text-lg !text-fg">{product.description}</p>
                <h2>Почему стоит взять</h2>
                <ul>
                  <li>Проверено механиками SENPAI на реальных японских авто.</li>
                  <li>Подбор по номеру кузова — менеджер подтвердит совместимость за 5 минут.</li>
                  <li>{product.condition === 'contract' ? 'Видео запуска и номер аукционного лота — полная прозрачность.' : 'Оригинальная упаковка, голограммы и сертификаты дистрибьютора.'}</li>
                </ul>
                <blockquote>Совет сэмпая: меняй парные детали попарно, а расходники — вместе с фильтрами. Машина скажет спасибо (◕ᴗ◕✿)</blockquote>
              </div>
              <div className="glass h-fit rounded-3xl p-5">
                <p className="label">Коротко</p>
                <dl className="space-y-2 text-sm">
                  {product.specs.slice(0, 5).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-dashed border-line pb-2 last:border-0">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-bold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {tab === 'Характеристики' && (
            <dl className="glass max-w-3xl overflow-hidden rounded-3xl">
              {[...product.specs, ['OEM-номер', product.oem] as [string, string], ['Артикул SENPAI', product.sku] as [string, string], ['Категория', cat.name] as [string, string]].map(([k, v], i) => (
                <div key={k} className={cn('grid grid-cols-2 gap-4 px-5 py-3 text-sm', i % 2 === 0 && 'bg-[var(--glass)]')}>
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === 'Совместимость' &&
            (product.universal ? (
              <p className="glass max-w-2xl rounded-3xl p-5 text-sm text-muted">Универсальная деталь: подходит к любому автомобилю с совпадающими параметрами (см. «Характеристики»). Сомневаешься — напиши нам в чат.</p>
            ) : (
              <div className="glass overflow-x-auto rounded-3xl">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-faint">
                    <tr className="border-b border-line">
                      <th className="px-5 py-3">Автомобиль</th>
                      <th className="px-5 py-3">Кузов</th>
                      <th className="px-5 py-3">Годы</th>
                      <th className="px-5 py-3">Двигатели</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {compatGens.map((g) => (
                      <tr key={g.id} className="border-b border-line last:border-0 hover:bg-[var(--glass)]">
                        <td className="px-5 py-3 font-bold">{carTitle(g)}</td>
                        <td className="px-5 py-3 font-mono text-xs">{g.chassis.join(', ')}</td>
                        <td className="px-5 py-3">{carYears(g)}</td>
                        <td className="px-5 py-3 text-muted">{g.engines.join(', ')}</td>
                        <td className="px-5 py-3 text-right">
                          <Link to={`/cars/${g.id}`} className="text-xs font-bold text-pink hover:underline">
                            Все детали →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

          {tab === 'Отзывы' && <Reviews product={product} />}

          {tab === 'Вопросы' && (
            <div className="max-w-3xl space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="glass rounded-3xl p-5">
                  <p className="text-xs text-faint">
                    {q.author} · {formatDate(q.date)}
                  </p>
                  <p className="mt-1 font-bold">{q.text}</p>
                  <div className="mt-3 rounded-2xl border-l-4 border-pink bg-[var(--glass)] p-3 text-sm">
                    <p className="mb-1 text-xs font-extrabold text-pink">Ответ SENPAI.PARTS</p>
                    {q.answer}
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost" onClick={() => toast({ title: 'Вопрос отправлен!', description: 'Ответим в течение 15 минут (в демо — мысленно)', tone: 'kawaii' })}>
                <MessageCircle size={16} /> Задать вопрос
              </button>
            </div>
          )}
        </div>
      </div>

      <Bundle product={product} items={bundle} />

      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading jp="似ている" title="Похожие детали" to={`/catalog/${cat.id}`} />
          <ProductRail items={related} />
        </section>
      )}

      {recent && recent.length > 0 && (
        <section className="mt-10">
          <SectionHeading jp="閲覧履歴" title="Ты недавно смотрел" />
          <ProductRail items={recent} />
        </section>
      )}
    </Container>
  )
}
