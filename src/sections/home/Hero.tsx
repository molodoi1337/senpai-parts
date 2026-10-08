import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hash, ScanLine, Search, Star, Zap } from 'lucide-react'
import { CarPicker } from '@/components/garage/CarPicker'
import { Photo } from '@/components/art/Photo'
import { heroPhoto } from '@/data/photos'
import { Mascot } from '@/components/art/Mascot'
import { PartArt } from '@/components/art/PartArt'
import { Container } from '@/components/layout/Container'
import { carTitle, genById } from '@/data/cars'
import { useGarage } from '@/store/garage'
import { toast } from '@/store/ui'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'car', label: 'По авто', icon: Search },
  { id: 'vin', label: 'VIN / кузов', icon: ScanLine },
  { id: 'oem', label: 'Артикул', icon: Hash },
] as const

function HeroScene() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const far = { x: useTransform(sx, (v) => v * -10), y: useTransform(sy, (v) => v * -6) }
  const mid = { x: useTransform(sx, (v) => v * 14), y: useTransform(sy, (v) => v * 8) }
  const near = { x: useTransform(sx, (v) => v * 26), y: useTransform(sy, (v) => v * 14) }

  return (
    <div
      className="relative aspect-[6/5.4] w-full"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <div className="glass absolute inset-0 overflow-hidden rounded-[36px] p-0">
        <motion.div className="absolute -inset-[6%]" style={far}>
          <Photo id={heroPhoto} alt="Два Nissan Skyline GT-R R34 на фоне горы Фудзи" width={900} eager className="h-full w-full" imgClassName="object-[50%_78%]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0820]/55 via-transparent to-[#0d0820]/25" />
        <div className="absolute inset-0 bg-gradient-to-tr from-pink/30 via-transparent to-cyan/20 mix-blend-overlay" />
        <div className="halftone absolute inset-x-0 bottom-0 h-1/3 opacity-25 [mask-image:linear-gradient(transparent,black)]" />
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 right-4 rounded-xl border border-white/25 bg-black/35 px-3 py-1.5 text-[0.7rem] font-bold text-white backdrop-blur-md"
        >
          📍 富士山 · Skyline GT-R R34
        </motion.span>
      </div>

      {/* неоновая вывеска */}
      <motion.div style={mid} className="absolute right-[5%] top-[7%]">
        <div className="glass-strong rounded-2xl px-2.5 py-3">
          <span className="kanji-vertical neon-pink text-2xl font-black sm:text-3xl">部品屋</span>
        </div>
      </motion.div>

      {/* стикер */}
      <motion.div style={mid} className="absolute left-[6%] top-[6%]">
        <span className="sticker animate-wiggle text-[0.8rem]">New drop! 新作</span>
      </motion.div>

      {/* мини-карточка товара */}
      <motion.div style={near} className="absolute right-[3%] top-[42%] hidden sm:block">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-strong flex w-52 items-center gap-3 rounded-2xl p-2.5">
          <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--glass)]">
            <PartArt kind="coilover" hue={190} className="h-full w-full" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-bold">Койловеры Tein Flex Z</span>
            <span className="flex items-center gap-1 text-[0.65rem] text-muted">
              <Star size={10} className="fill-sun text-sun" /> 4.9 · 312 отзывов
            </span>
            <span className="mt-0.5 block font-display text-sm font-extrabold text-pink">89 990 ₽</span>
          </span>
        </motion.div>
      </motion.div>

      {/* маскот с репликой */}
      <motion.div style={mid} className="absolute left-[3%] top-[15%] flex items-end gap-1">
        <Mascot mood="wink" className="h-20 w-20 animate-float sm:h-24 sm:w-24" />
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.9, type: 'spring' }} className="bubble mb-14 max-w-[170px] origin-bottom-left text-[0.72rem] leading-snug sm:mb-16 sm:text-xs">
          Сэмпай, твоей Supra нужны новые колодки~ (◕‿◕)
        </motion.div>
      </motion.div>
    </div>
  )
}

export function Hero() {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('car')
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const addCar = useGarage((s) => s.add)

  return (
    <section className="relative overflow-hidden pb-10 pt-6 sm:pt-10">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute -left-2 -top-10 select-none font-jp text-[5.5rem] font-black leading-none text-transparent opacity-20 [-webkit-text-stroke:1.5px_var(--pink)] sm:text-[8rem]">
            日本車
          </span>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative flex flex-wrap items-center gap-2">
            <span className="chip">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lime" /> 1 284 гаражника онлайн
            </span>
            <span className="chip font-jp">🍁 秋 2026 · новый сезон</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="section-title relative mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl xl:text-7xl"
          >
            Запчасти для <span className="text-gradient">японцев.</span>
            <br />
            Вайб <span className="relative whitespace-nowrap">
              — бесплатно
              <svg viewBox="0 0 300 20" className="absolute -bottom-2 left-0 w-full" aria-hidden>
                <path d="M4,14 Q80,2 150,10 T296,8" fill="none" stroke="var(--cyan)" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="relative mt-6 max-w-xl text-base text-muted sm:text-lg">
            OEM, тюнинг и контрактные агрегаты с аукционов Японии. Подбор по кузову за 5 секунд, доставка — от 24 часов. Без кринжа и переплат.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="glass relative mt-7 rounded-[26px] p-3 sm:p-4">
            <div className="mb-3 flex gap-1.5" role="tablist">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn('chip h-9', tab === id && 'chip-active')}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
            {tab === 'car' ? (
              <CarPicker
                onPick={(genId, engine) => {
                  addCar({ genId, engine })
                  toast({ title: 'Тачка в гараже 🚗', description: `${carTitle(genById[genId])} — показываем подходящие детали`, tone: 'kawaii' })
                  navigate('/catalog?fit=1')
                }}
              />
            ) : (
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!value.trim()) return
                  navigate(tab === 'vin' ? `/vin?code=${encodeURIComponent(value.trim())}` : `/catalog?q=${encodeURIComponent(value.trim())}`)
                }}
              >
                <input
                  className="input font-display uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                  placeholder={tab === 'vin' ? 'JZX100-0123456 или JT2…' : 'Например: 04465-33471'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  aria-label={tab === 'vin' ? 'VIN или номер кузова' : 'Артикул'}
                />
                <button className="btn btn-primary shrink-0" type="submit">
                  <Zap size={18} /> {tab === 'vin' ? 'Расшифровать' : 'Найти'}
                </button>
              </form>
            )}
          </motion.div>

          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="relative mt-7 grid max-w-lg grid-cols-3 gap-3">
            {[
              ['120k+', 'артикулов'],
              ['2–7 дн', 'из Японии'],
              ['4.9★', '18 000 отзывов'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-extrabold sm:text-3xl">{v}</dt>
                <dd className="text-xs font-semibold text-muted">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}>
          <HeroScene />
        </motion.div>
      </Container>
    </section>
  )
}
