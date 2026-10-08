import { NavLink } from 'react-router-dom'
import { Car, Home, LayoutGrid, Search, ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useUi } from '@/store/ui'
import { cn } from '@/lib/utils'

/** Нижний таб-бар в стиле приложения — только на мобилках */
export function BottomNav() {
  const count = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0))
  const setSearchOpen = useUi((s) => s.setSearchOpen)
  const item = 'relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.65rem] font-bold text-muted transition'
  const activeCls = ({ isActive }: { isActive: boolean }) => cn(item, isActive && 'text-pink')
  return (
    <nav className="fixed inset-x-2 bottom-2 z-40 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Нижнее меню">
      <div className="glass-strong flex h-16 items-stretch rounded-[22px] px-1">
        <NavLink to="/" end className={activeCls}>
          <Home size={20} /> Главная
        </NavLink>
        <NavLink to="/catalog" className={activeCls}>
          <LayoutGrid size={20} /> Каталог
        </NavLink>
        <button onClick={() => setSearchOpen(true)} className={item} aria-label="Поиск">
          <span className="-mt-7 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pink to-violet text-white shadow-[0_10px_30px_-8px_var(--pink)]">
            <Search size={22} />
          </span>
        </button>
        <NavLink to="/garage" className={activeCls}>
          <Car size={20} /> Гараж
        </NavLink>
        <NavLink to="/cart" className={activeCls}>
          <span className="relative">
            <ShoppingBag size={20} />
            {count > 0 && <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-pink px-1 text-[0.6rem] text-white">{count}</span>}
          </span>
          Корзина
        </NavLink>
      </div>
    </nav>
  )
}
