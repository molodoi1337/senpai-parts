import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Gauge } from 'lucide-react'
import { legends, makeById } from '@/data/cars'
import { CarVisual } from '@/components/art/CarVisual'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

const hues = [330, 200, 50, 280, 160, 10, 230, 300, 120, 20, 260, 190]

export function Legends() {
  return (
    <section className="py-12" id="legends">
      <Container>
        <SectionHeading jp="伝説" title={<>JDM-легенды <span className="text-gradient">на запчастях</span></>} subtitle="Машины, по которым фанатеет весь интернет. У нас есть детали для каждой — от свечей до турбин." to="/cars" linkLabel="Все авто" />
      </Container>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 sm:px-6 xl:px-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))]">
        {legends.map((g, i) => {
          const hue = hues[i % hues.length]
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
              className="w-[82vw] max-w-[380px] shrink-0 snap-start"
            >
              <Link to={`/cars/${g.id}`} className="glass glass-hover group relative flex h-full flex-col overflow-hidden rounded-[30px] p-3">
                <div className="relative overflow-hidden rounded-[22px]">
                  <CarVisual gen={g} width={380} hue={hue} />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0d0820]/70 via-transparent to-transparent" />
                  <span className="sticker sticker-pink absolute left-3 top-3">{g.nickname}</span>
                  <span aria-hidden className="kanji-vertical absolute right-3 top-3 text-2xl font-black text-white/80 [text-shadow:0_2px_10px_rgba(0,0,0,.6)]">
                    {g.jp}
                  </span>
                </div>
                <div className="relative px-2 pt-4">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-muted">{makeById[g.makeId].name}</p>
                  <h3 className="font-display text-2xl font-extrabold leading-tight">
                    {g.model} <span className="text-pink">{g.gen}</span>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{g.blurb}</p>
                </div>
                <div className="relative mt-4 grid grid-cols-3 gap-2 px-2 text-center">
                  {[
                    [g.engines[0], 'мотор'],
                    [`${g.power}`, 'л.с.'],
                    [`${g.years[0]}`, 'год'],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-xl border border-line bg-[var(--glass)] px-1 py-2">
                      <p className="truncate font-display text-sm font-extrabold">{v}</p>
                      <p className="text-[0.65rem] font-bold text-faint">{l}</p>
                    </div>
                  ))}
                </div>
                <span className="relative mt-auto inline-flex items-center gap-1.5 px-2 pb-2 pt-4 text-sm font-extrabold text-pink">
                  <Gauge size={16} /> Детали для неё <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
