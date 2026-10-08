import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null
  const nums: (number | '…')[] = []
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i)
    else if (nums[nums.length - 1] !== '…') nums.push('…')
  }
  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Страницы">
      <button className="icon-btn" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Предыдущая">
        <ChevronLeft size={18} />
      </button>
      {nums.map((n, i) =>
        n === '…' ? (
          <span key={`e${i}`} className="w-8 text-center text-faint">
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn('icon-btn font-display text-sm font-bold', n === page && 'border-transparent !bg-gradient-to-br from-pink to-violet text-white')}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </button>
        ),
      )}
      <button className="icon-btn" disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Следующая">
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
