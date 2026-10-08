import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto px-1 text-xs font-bold text-muted">
      <Link to="/" className="shrink-0 hover:text-pink">
        Главная
      </Link>
      {items.map((it, i) => (
        <span key={i} className="flex shrink-0 items-center gap-1">
          <ChevronRight size={12} className="text-faint" />
          {it.to ? (
            <Link to={it.to} className="hover:text-pink">
              {it.label}
            </Link>
          ) : (
            <span className="max-w-[46ch] truncate text-fg">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
