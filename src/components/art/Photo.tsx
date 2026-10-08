import { useState, type ReactNode } from 'react'
import { photoUrl } from '@/data/photos'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  alt: string
  /** ширина в CSS-пикселях, под которую режем картинку (×2 для ретины подставится сам) */
  width: number
  height?: number
  className?: string
  imgClassName?: string
  /** что показать, если фото не загрузилось (нет сети, CDN недоступен) */
  fallback?: ReactNode
  eager?: boolean
}

export function Photo({ id, alt, width, height, className, imgClassName, fallback, eager }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  if (state === 'error' && fallback) return <>{fallback}</>
  return (
    <div className={cn('relative overflow-hidden bg-[var(--glass-strong)]', className)}>
      {state === 'loading' && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-pink/10 via-violet/10 to-cyan/10" />}
      <img
        src={photoUrl(id, width, height)}
        srcSet={`${photoUrl(id, width, height)} 1x, ${photoUrl(id, width * 2, height ? height * 2 : undefined)} 2x`}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setState('ok')}
        onError={() => setState('error')}
        className={cn('h-full w-full object-cover transition-opacity duration-500', state === 'ok' ? 'opacity-100' : 'opacity-0', imgClassName)}
      />
    </div>
  )
}
