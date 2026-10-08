import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { carMakes, gensByMake } from '@/data/cars'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function CarMakes() {
  return (
    <section className="py-12">
      <Container>
        <SectionHeading jp="メーカー" title="Выбери марку" subtitle="Десять японских брендов, сотни кузовов и моторов. Тыкай — покажем всё, что подходит." to="/cars" linkLabel="Все модели" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {carMakes.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.04 }}>
              <Link
                to={`/cars?make=${m.id}`}
                className="glass glass-hover group relative flex h-32 flex-col justify-between overflow-hidden rounded-3xl p-4 sm:h-36"
                style={{ ['--h' as string]: m.hue }}
              >
                <span
                  aria-hidden
                  className="absolute -right-3 -top-3 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-80"
                  style={{ background: `hsl(${m.hue} 95% 60%)` }}
                />
                <span aria-hidden className="absolute -bottom-3 right-2 select-none font-jp text-5xl font-black text-fg/[0.07] transition-transform duration-500 group-hover:-translate-y-1 sm:text-6xl">
                  {m.jp}
                </span>
                <span className="relative font-jp text-xs font-bold tracking-[0.2em] text-pink">{m.jp}</span>
                <span className="relative">
                  <span className="block font-display text-xl font-extrabold">{m.name}</span>
                  <span className="text-xs font-semibold text-muted">{gensByMake(m.id).length} моделей · с {m.founded}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
