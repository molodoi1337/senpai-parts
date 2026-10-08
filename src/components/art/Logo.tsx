import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-2.5', className)} aria-label="SENPAI.PARTS — на главную">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pink to-violet font-jp text-xl font-black text-white shadow-[0_8px_24px_-6px_var(--pink)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        先
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-cyan" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[1.05rem] font-extrabold tracking-tight">
            SENPAI<span className="text-pink">.</span>PARTS
          </span>
          <span className="mt-0.5 block font-jp text-[0.62rem] font-bold tracking-[0.3em] text-muted">先輩パーツ · 日本車</span>
        </span>
      )}
    </Link>
  )
}
