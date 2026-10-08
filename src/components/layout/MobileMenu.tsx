import { Link } from 'react-router-dom'
import { BookOpen, Car, CircleHelp, Flower2, Heart, Moon, Scale, ScanLine, Sun, User, Warehouse, X } from 'lucide-react'
import { categories } from '@/data/catalog-meta'
import { Drawer } from '@/components/ui/Overlay'
import { PartArt } from '@/components/art/PartArt'
import { Logo } from '@/components/art/Logo'
import { useUi } from '@/store/ui'

const links = [
  { to: '/cars', label: 'Подбор по авто', icon: Car },
  { to: '/vin', label: 'Поиск по VIN / Frame', icon: ScanLine },
  { to: '/garage', label: 'Мой гараж', icon: Warehouse },
  { to: '/wishlist', label: 'Избранное', icon: Heart },
  { to: '/compare', label: 'Сравнение', icon: Scale },
  { to: '/account', label: 'Профиль и заказы', icon: User },
  { to: '/blog', label: 'Журнал', icon: BookOpen },
  { to: '/help', label: 'Помощь и FAQ', icon: CircleHelp },
]

export function MobileMenu() {
  const { menuOpen, setMenuOpen, theme, toggleTheme, sakura, toggleSakura } = useUi()
  const close = () => setMenuOpen(false)
  return (
    <Drawer open={menuOpen} onClose={close} side="left" label="Меню">
      <div className="flex items-center justify-between border-b border-line p-4">
        <span onClick={close}>
          <Logo />
        </span>
        <button onClick={close} className="icon-btn" aria-label="Закрыть меню">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="label">Категории</p>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((c) => (
            <Link key={c.id} to={`/catalog/${c.id}`} onClick={close} className="flex items-center gap-2 rounded-2xl border border-line bg-[var(--glass)] p-2">
              <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                <PartArt kind={c.art} hue={c.hue} className="h-full w-full" />
              </span>
              <span className="truncate text-xs font-bold">{c.name}</span>
            </Link>
          ))}
        </div>
        <p className="label mt-6">Разделы</p>
        <nav className="flex flex-col">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={close} className="flex items-center gap-3 rounded-xl px-2 py-3 font-bold hover:bg-[var(--glass)]">
              <Icon size={18} className="text-pink" /> {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
        <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Светлая' : 'Тёмная'}
        </button>
        <button onClick={toggleSakura} className="btn btn-ghost btn-sm">
          <Flower2 size={16} /> Сакура: {sakura ? 'вкл' : 'выкл'}
        </button>
      </div>
    </Drawer>
  )
}
