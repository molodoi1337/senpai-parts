import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { ArrowLeft, Clock, Share2 } from 'lucide-react'
import { articleBySlug, articles } from '@/data/blog'
import { Container } from '@/components/layout/Container'
import { PartArt } from '@/components/art/PartArt'
import { Photo } from '@/components/art/Photo'
import { articlePhotos } from '@/data/photos'
import { Mascot } from '@/components/art/Mascot'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { toast } from '@/store/ui'
import { formatDate } from '@/lib/utils'

export default function Article() {
  const { slug = '' } = useParams()
  const a = articleBySlug[slug]
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    if (a) document.title = `${a.title} — Журнал SENPAI.PARTS`
  }, [a])

  if (!a) {
    return (
      <Container className="pt-16">
        <EmptyState title="Статья не найдена" text="Может, её унёс ветер вместе с лепестками сакуры." action={<Link to="/blog" className="btn btn-primary">Все статьи</Link>} />
      </Container>
    )
  }

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-pink via-violet to-cyan" style={{ scaleX: scrollYProgress }} />
      <Container className="pt-4">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-pink">
          <ArrowLeft size={15} /> Журнал
        </Link>
        <header className="glass relative mt-4 overflow-hidden rounded-[36px] p-6 sm:p-12">
          {articlePhotos[a.slug] ? (
            <>
              <Photo id={articlePhotos[a.slug]} alt={a.title} width={1200} height={600} eager className="!absolute inset-0 h-full w-full" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-[var(--bg-0)] via-[var(--bg-0)]/85 to-[var(--bg-0)]/20" />
            </>
          ) : (
            <PartArt kind={a.art} hue={a.hue} bare className="absolute -right-10 top-1/2 hidden h-[120%] w-auto -translate-y-1/2 opacity-80 md:block" />
          )}
          <span aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${a.hue} 90% 55% / .3), transparent 60%)` }} />
          <span aria-hidden className="halftone absolute inset-0 opacity-30 [mask-image:linear-gradient(90deg,transparent,black)]" />
          <div className="relative max-w-2xl">
            <span className="sticker sticker-pink">{a.tag}</span>
            <p className="mt-4 font-jp text-lg font-bold tracking-[0.2em] text-pink">{a.jp}</p>
            <h1 className="section-title mt-2 text-3xl sm:text-5xl">{a.title}</h1>
            <p className="mt-4 text-muted">{a.excerpt}</p>
            <p className="mt-5 flex flex-wrap items-center gap-4 text-sm font-bold text-muted">
              <span>{a.author}</span>
              <span>{formatDate(a.date)}</span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {a.minutes} мин
              </span>
            </p>
          </div>
        </header>

        <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[1fr_220px]">
          <article className="prose-senpai text-[1.05rem]">
            {a.body.map((b, i) => {
              if (b.t === 'p') return <p key={i}>{b.text}</p>
              if (b.t === 'h2') return <h2 key={i}>{b.text}</h2>
              if (b.t === 'quote') return <blockquote key={i}>{b.text}</blockquote>
              return (
                <ul key={i}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              )
            })}
          </article>
          <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-3xl p-4 text-center">
              <Mascot mood="wink" className="mx-auto h-20 w-20" />
              <p className="mt-2 text-sm font-bold">Понравилось? Поделись с корешами по гаражу</p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href).catch(() => {})
                  toast({ title: 'Ссылка скопирована 🔗', tone: 'kawaii' })
                }}
                className="btn btn-primary btn-sm mt-3 w-full"
              >
                <Share2 size={14} /> Скопировать ссылку
              </button>
            </div>
            <Link to="/catalog" className="glass block rounded-3xl p-4 text-sm font-bold hover:text-pink">
              🛒 К деталям из статьи →
            </Link>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="section-title mb-5 text-2xl">Читай также</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {articles
              .filter((x) => x.slug !== a.slug)
              .slice(0, 3)
              .map((x) => (
                <ArticleCard key={x.slug} article={x} />
              ))}
          </div>
        </section>
      </Container>
    </>
  )
}
