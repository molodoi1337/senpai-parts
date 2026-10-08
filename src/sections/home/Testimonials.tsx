import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { testimonials } from '@/data/reviews'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Rating } from '@/components/ui/Rating'

const gradients = ['from-pink to-violet', 'from-cyan to-violet', 'from-sun to-pink', 'from-lime to-cyan', 'from-violet to-pink', 'from-pink to-sun']

export function Testimonials() {
  return (
    <section className="py-12">
      <Container>
        <SectionHeading jp="レビュー" title="Говорят гаражники" subtitle="18 000+ отзывов со средней оценкой 4.9. Вот несколько любимых." />
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="glass mb-3 break-inside-avoid rounded-[26px] p-5"
            >
              <Rating value={t.rating} />
              <blockquote className="mt-3 text-[0.95rem] font-medium leading-relaxed">«{t.text}»</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} font-display text-sm font-extrabold text-white`}>
                  {t.author.replace(/[^a-zA-Zа-яА-Я]/g, '').slice(0, 2).toUpperCase()}
                </span>
                <span>
                  <span className="flex items-center gap-1 text-sm font-extrabold">
                    {t.author} <BadgeCheck size={14} className="text-cyan" />
                  </span>
                  <span className="block text-xs text-muted">{t.car}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
