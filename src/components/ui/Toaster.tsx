import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, Sparkles, TriangleAlert, X } from 'lucide-react'
import { useToasts } from '@/store/ui'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToasts()
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass-strong pointer-events-auto flex items-start gap-3 rounded-2xl p-3.5 pr-10"
            role="status"
          >
            <span
              className={cn(
                'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                t.tone === 'error' ? 'bg-red/20 text-red' : t.tone === 'kawaii' ? 'bg-violet/20 text-violet' : 'bg-lime/15 text-lime',
              )}
            >
              {t.tone === 'error' ? <TriangleAlert size={18} /> : t.tone === 'kawaii' ? <Sparkles size={18} /> : <CheckCircle2 size={18} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">{t.title}</p>
              {t.description && <p className="mt-0.5 line-clamp-2 text-xs text-muted">{t.description}</p>}
              {t.action && (
                <Link to={t.action.to} onClick={() => dismiss(t.id)} className="mt-1.5 inline-block text-xs font-extrabold text-pink hover:underline">
                  {t.action.label} →
                </Link>
              )}
            </div>
            <button onClick={() => dismiss(t.id)} className="absolute right-2.5 top-2.5 text-faint hover:text-fg" aria-label="Закрыть уведомление">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
