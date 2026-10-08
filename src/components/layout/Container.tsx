import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1400px] px-4 sm:px-6', className)}>{children}</div>
}

export function PageHeader({ jp, title, subtitle, children }: { jp: string; title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <div className="relative mb-6 mt-4 sm:mb-8">
      <p className="font-jp text-sm font-bold tracking-[0.3em] text-pink">{jp}</p>
      <h1 className="section-title mt-1 text-3xl sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{subtitle}</p>}
      {children}
    </div>
  )
}
