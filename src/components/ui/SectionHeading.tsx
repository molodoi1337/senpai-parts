import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

export function SectionHeading({ jp, title, subtitle, to, linkLabel = 'Смотреть все', right }: { jp: string; title: ReactNode; subtitle?: string; to?: string; linkLabel?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div className="max-w-2xl">
        <p className="mb-2 flex items-center gap-2 font-jp text-sm font-bold tracking-[0.25em] text-pink">
          <span className="h-px w-8 bg-pink" />
          {jp}
        </p>
        <h2 className="section-title text-[1.7rem] sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p>}
      </div>
      {(right || to) && (
        <div className="flex flex-wrap items-center gap-2">
          {right}
          {to && (
            <Link to={to} className="btn btn-ghost btn-sm group">
              {linkLabel}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
