import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useLockBody } from '@/lib/hooks'
import { cn } from '@/lib/utils'

interface BaseProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  label: string
}

function useEsc(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
}

const Backdrop = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 bg-[#07031a]/55 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  />
)

export function Modal({ open, onClose, children, className, label }: BaseProps) {
  useLockBody(open)
  useEsc(open, onClose)
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-3 sm:p-6" role="dialog" aria-modal aria-label={label}>
          <Backdrop onClose={onClose} />
          <motion.div
            className={cn('glass-strong relative max-h-[92dvh] w-full overflow-y-auto rounded-[28px]', className)}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <button onClick={onClose} className="icon-btn absolute right-3 top-3 z-10 h-10 w-10" aria-label="Закрыть">
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function Drawer({ open, onClose, children, className, label, side = 'right' }: BaseProps & { side?: 'right' | 'left' | 'bottom' }) {
  useLockBody(open)
  useEsc(open, onClose)
  const from = side === 'right' ? { x: '100%' } : side === 'left' ? { x: '-100%' } : { y: '100%' }
  const pos =
    side === 'right'
      ? 'right-0 top-0 h-full w-full max-w-md rounded-l-[28px]'
      : side === 'left'
        ? 'left-0 top-0 h-full w-full max-w-sm rounded-r-[28px]'
        : 'bottom-0 left-0 max-h-[88dvh] w-full rounded-t-[28px]'
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal aria-label={label}>
          <Backdrop onClose={onClose} />
          <motion.aside
            className={cn('glass-strong absolute flex flex-col overflow-hidden', pos, className)}
            initial={from}
            animate={{ x: 0, y: 0 }}
            exit={from}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
