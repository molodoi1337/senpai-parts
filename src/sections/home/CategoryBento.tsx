import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { categories } from '@/data/catalog-meta'
import { products } from '@/data/products'
import { categoryPhotos } from '@/data/photos'
import { PartArt } from '@/components/art/PartArt'
import { Photo } from '@/components/art/Photo'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn, pluralize } from '@/lib/utils'

const counts = products.reduce<Record<string, number>>((a, p) => ((a[p.categoryId] = (a[p.categoryId] ?? 0) + 1), a), {})

export function CategoryBento() {
  return (
    <section className="py-12">
      <Container>
        <SectionHeading jp="カテゴリー" title="Каталог по категориям" subtitle="От фильтра за 390 ₽ до контрактного 2JZ. Всё разложено по полочкам, как в японском гараже." to="/catalog" />
        <div className="grid grid-flow-row-dense auto-rows-[150px] grid-cols-2 gap-2.5 sm:auto-rows-[170px] sm:gap-3 md:grid-cols-4">
          {categories.map((c, i) => {
            const big = i === 0 || i === 6
            const photo = categoryPhotos[c.id]
            const art = <PartArt kind={c.art} hue={c.hue} className="absolute inset-0 h-full w-full opacity-60" />
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 4) * 0.05 }}
                className={cn(big && 'col-span-2 row-span-2')}
              >
                <Link to={`/catalog/${c.id}`} className="glass glass-hover group relative flex h-full flex-col overflow-hidden rounded-[26px] p-4 text-white sm:p-5">
                  {photo ? (
                    <Photo
                      id={photo}
                      alt={c.name}
                      width={big ? 640 : 340}
                      height={big ? 640 : 340}
                      className="!absolute inset-0 h-full w-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-110"
                      fallback={art}
                    />
                  ) : (
                    art
                  )}
                  {/* затемнение для читаемости + фирменный неоновый оттенок */}
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0d0820]/90 via-[#0d0820]/35 to-[#0d0820]/20" />
                  <span aria-hidden className="absolute inset-0 opacity-70 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, hsl(${c.hue} 100% 60% / .55), transparent 60%)` }} />
                  <span aria-hidden className="halftone absolute inset-x-0 bottom-0 h-1/2 opacity-20 [mask-image:linear-gradient(transparent,black)]" />

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-jp text-[0.7rem] font-bold tracking-[0.2em] text-pink [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">{c.jp}</p>
                      <h3 className={cn('font-display font-extrabold leading-tight [text-shadow:0_2px_14px_rgba(0,0,0,.6)]', big ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg')}>{c.name}</h3>
                      {big && <p className="mt-1 max-w-[16rem] text-sm text-white/80">{c.blurb}</p>}
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-md transition group-hover:rotate-45 group-hover:bg-pink">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <span className="relative z-10 mt-auto text-xs font-bold text-white/85">{pluralize(counts[c.id] ?? 0, ['товар', 'товара', 'товаров'])}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
