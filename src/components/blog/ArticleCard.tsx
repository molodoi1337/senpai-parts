import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { Article } from '@/data/blog'
import { PartArt } from '@/components/art/PartArt'
import { Photo } from '@/components/art/Photo'
import { articlePhotos } from '@/data/photos'
import { cn, formatDate } from '@/lib/utils'

export function ArticleCard({ article: a, featured }: { article: Article; featured?: boolean }) {
  return (
    <Link to={`/blog/${a.slug}`} className={cn('glass glass-hover group flex flex-col overflow-hidden rounded-[28px]', featured && 'md:flex-row')}>
      <div className={cn('relative overflow-hidden', featured ? 'aspect-[16/10] md:aspect-auto md:w-1/2' : 'aspect-[16/10]')}>
        {articlePhotos[a.slug] && (
          <Photo id={articlePhotos[a.slug]} alt={a.title} width={featured ? 700 : 420} height={featured ? 440 : 262} className="!absolute inset-0 h-full w-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 mix-blend-multiply" style={{ background: `linear-gradient(135deg, hsl(${a.hue} 90% 55% / .55), hsl(${(a.hue + 60) % 360} 90% 40% / .35))` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="halftone absolute inset-0 opacity-25" />
        <span aria-hidden className="absolute bottom-2 left-4 select-none whitespace-nowrap font-jp text-3xl font-black text-white/25 sm:text-4xl">
          {a.jp}
        </span>
        {!articlePhotos[a.slug] && (
          <PartArt kind={a.art} hue={a.hue} bare className="absolute -right-4 top-1/2 h-[80%] w-auto -translate-y-1/2 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
        )}
        <span className="sticker sticker-pink absolute left-4 top-4">{a.tag}</span>
      </div>
      <div className={cn('flex flex-1 flex-col p-5', featured && 'md:justify-center md:p-8')}>
        <p className="flex items-center gap-3 text-xs font-bold text-muted">
          <span>{formatDate(a.date)}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {a.minutes} мин
          </span>
        </p>
        <h3 className={cn('mt-2 font-display font-extrabold leading-tight group-hover:text-pink', featured ? 'text-2xl sm:text-3xl' : 'text-lg')}>{a.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{a.excerpt}</p>
        <p className="mt-auto pt-4 text-xs font-bold text-faint">Автор: {a.author}</p>
      </div>
    </Link>
  )
}
