import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { categories } from '@/data/catalog-meta'
import { products } from '@/data/products'
import { PartArt } from '@/components/art/PartArt'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn, pluralize } from '@/lib/utils'

const counts = products.reduce<Record<string, number>>((a, p) => ((a[p.categoryId] = (a[p.categoryId] ?? 0) + 1), a), {})

export function CategoryBento() {
  return (
    <section className="py-12">
      <Container>
        <SectionHeading jp="カテゴリー" title="Каталог по категориям" subtitle="От фильтра за 390 ₽ до контрактного 2JZ. Всё разложено по полочкам, как в японском гараже." to="/catalog" />
        <div className="grid auto-rows-[150px] grid-cols-2 gap-2.5 sm:auto-rows-[170px] sm:gap-3 md:grid-cols-4">
          {categories.map((c, i) => {
            const big = i === 0 || i === 6
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 4) * 0.05 }}
                className={cn(big && 'col-span-2 row-span-2')}
              >
                <Link to={`/catalog/${c.id}`} className="glass glass-hover shine group relative flex h-full flex-col overflow-hidden rounded-[26px] p-4 sm:p-5">
                  <span aria-hidden className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 80% 70%, hsl(${c.hue} 100% 60% / .35), transparent 60%)` }} />
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-jp text-[0.7rem] font-bold tracking-[0.2em] text-pink">{c.jp}</p>
                      <h3 className={cn('font-display font-extrabold leading-tight [text-shadow:0_2px_12px_var(--bg-0)]', big ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg')}>{c.name}</h3>
                      {big && <p className="mt-1 max-w-[16rem] text-sm text-muted">{c.blurb}</p>}
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-[var(--glass)] transition group-hover:rotate-45 group-hover:bg-pink group-hover:text-white">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <span className="relative z-10 mt-auto text-xs font-bold text-muted">{pluralize(counts[c.id] ?? 0, ['товар', 'товара', 'товаров'])}</span>
                  <PartArt
                    kind={c.art}
                    hue={c.hue}
                    bare
                    className={cn(
                      'absolute transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6',
                      big ? '-bottom-6 -right-6 h-[72%] w-[72%]' : '-bottom-5 -right-5 h-[64%] w-[64%] opacity-90',
                    )}
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
