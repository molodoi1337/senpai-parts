import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QtyStepper({ value, onChange, max = 99, size = 'md' }: { value: number; onChange: (v: number) => void; max?: number; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  return (
    <div className={cn('inline-flex items-center rounded-2xl border border-line bg-[var(--glass)]', h)}>
      <button className={cn('grid aspect-square h-full place-items-center rounded-l-2xl hover:text-pink')} onClick={() => onChange(value - 1)} aria-label="Уменьшить">
        <Minus size={16} />
      </button>
      <span className="min-w-8 text-center font-display text-sm font-bold tabular-nums">{value}</span>
      <button
        className="grid aspect-square h-full place-items-center rounded-r-2xl hover:text-pink disabled:opacity-40"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Увеличить"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
