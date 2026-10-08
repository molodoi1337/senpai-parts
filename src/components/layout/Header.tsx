import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Car, ChevronDown, Heart, Menu, Moon, Scale, Search, ShoppingBag, Sun, User } from 'lucide-react'
import { Logo } from '@/components/art/Logo'
import { useCart } from '@/store/cart'
import { useCompare, useWishlist } from '@/store/collections'
import { useActiveCar } from '@/store/garage'
import { useUi } from '@/store/ui'
import { cn } from '@/lib/utils'
import { MegaMenu } from './MegaMenu'

const nav = [
  { to: '/cars', label: 'Подбор по авто', cls: 'flex' },
  { to: '/vin', label: 'VIN / Frame', cls: 'hidden xl:flex' },
  { to: '/blog', label: 'Журнал', cls: 'hidden xl:flex' },
  { to: '/help', label: 'Помощь', cls: 'hidden 2xl:flex' },
]

const Count = ({ n }: { n: number }) =>
  n > 0 ? (
    <span key={n} className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 animate-pop place-items-center rounded-full border-2 border-[var(--bg-0)] bg-pink px-1 text-[0.65rem] font-extrabold text-white">
      {n > 99 ? '99+' : n}
    </span>
  ) : null

export function Header() {
  const [mega, setMega] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme, setCartOpen, setSearchOpen, setMenuOpen, setGarageOpen } = useUi()
  const cartCount = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0))
  const wish = useWishlist((s) => s.ids.length)
  const cmp = useCompare((s) => s.ids.length)
  const active = useActiveCar()
  const location = useLocation()
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => setMega(false), [location.pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const openMega = () => {
    clearTimeout(timer.current)
    setMega(true)
  }
  const closeMega = () => {
    timer.current = setTimeout(() => setMega(false), 160)
  }

  return (
    <header className="sticky top-0 z-40 px-2 pt-2 sm:px-4">
      <div
        aria-hidden
        className={cn('pointer-events-none absolute inset-x-0 -top-2 h-[calc(100%+1.5rem)] transition-opacity duration-300', scrolled ? 'opacity-100' : 'opacity-0')}
        style={{ background: 'linear-gradient(var(--bg-0) 35%, transparent)' }}
      />
      <div
        className={cn(
          'relative mx-auto flex h-16 max-w-[1400px] items-center gap-2 rounded-[22px] px-3 transition-all duration-300 sm:gap-3 sm:px-4',
          scrolled ? 'glass-strong' : 'border border-transparent',
        )}
      >
        <Logo className="mr-1 xl:mr-3" />

        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={closeMega}>
          <button
            onMouseEnter={openMega}
            onClick={() => setMega((v) => !v)}
            className={cn('flex h-10 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-extrabold transition', mega ? 'bg-pink/15 text-pink' : 'hover:bg-[var(--glass)]')}
            aria-expanded={mega}
          >
            Каталог <ChevronDown size={15} className={cn('transition-transform', mega && 'rotate-180')} />
          </button>
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onMouseEnter={closeMega}
              className={({ isActive }) => cn(n.cls, 'h-10 items-center whitespace-nowrap rounded-xl px-3 text-sm font-bold transition hover:bg-[var(--glass)]', isActive && 'text-pink')}
            >
              {n.label}
            </NavLink>
          ))}
          <AnimatePresence>
            {mega && (
              <motion.div
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-1/2 top-[4.6rem] w-[min(1100px,calc(100vw-2rem))] -translate-x-1/2"
              >
                <MegaMenu onNavigate={() => setMega(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <button
          onClick={() => setSearchOpen(true)}
          className="ml-auto hidden h-11 min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-line bg-[var(--glass)] px-4 text-sm text-faint transition hover:border-pink/50 md:flex md:max-w-[260px] xl:max-w-[340px]"
        >
          <Search size={17} className="shrink-0 text-pink" />
          <span className="truncate">Поиск: деталь, OEM, кузов…</span>
          <kbd className="ml-auto shrink-0 rounded-md border border-line px-1.5 py-0.5 text-[0.65rem] font-bold">⌘K</kbd>
        </button>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <button
            onClick={() => setGarageOpen(true)}
            className={cn('hidden h-11 max-w-[190px] items-center gap-2 rounded-2xl border px-3 text-sm font-bold transition sm:flex', active ? 'border-lime/40 bg-lime/10' : 'border-line bg-[var(--glass)] hover:border-pink/50')}
          >
            <Car size={18} className={active ? 'text-lime' : 'text-pink'} />
            <span className="truncate">{active ? `${active.gen.model} ${active.gen.gen}` : 'Мой гараж'}</span>
          </button>
          <button onClick={() => setSearchOpen(true)} className="icon-btn md:hidden" aria-label="Поиск">
            <Search size={19} />
          </button>
          <Link to="/compare" className="icon-btn hidden xl:grid" aria-label="Сравнение">
            <Scale size={19} />
            <Count n={cmp} />
          </Link>
          <Link to="/wishlist" className="icon-btn hidden sm:grid" aria-label="Избранное">
            <Heart size={19} />
            <Count n={wish} />
          </Link>
          <button onClick={() => setCartOpen(true)} className="icon-btn" aria-label="Корзина">
            <ShoppingBag size={19} />
            <Count n={cartCount} />
          </button>
          <Link to="/account" className="icon-btn hidden lg:grid" aria-label="Профиль">
            <User size={19} />
          </Link>
          <button onClick={toggleTheme} className="icon-btn hidden sm:grid" aria-label="Сменить тему">
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button onClick={() => setMenuOpen(true)} className="icon-btn lg:hidden" aria-label="Меню">
            <Menu size={19} />
          </button>
        </div>
      </div>
    </header>
  )
}
