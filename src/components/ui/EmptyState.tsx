import type { ReactNode } from 'react'
import { Mascot } from '@/components/art/Mascot'

export function EmptyState({ title, text, action, mood = 'dizzy' }: { title: string; text: string; action?: ReactNode; mood?: 'dizzy' | 'wink' | 'happy' | 'love' }) {
  return (
    <div className="glass mx-auto flex max-w-lg flex-col items-center rounded-[28px] px-6 py-10 text-center">
      <Mascot mood={mood} className="h-32 w-32 animate-float" />
      <h3 className="mt-4 font-display text-xl font-extrabold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
