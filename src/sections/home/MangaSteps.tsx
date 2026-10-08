import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Mascot } from '@/components/art/Mascot'
import { CarSilhouette } from '@/components/art/CarSilhouette'
import { PartArt } from '@/components/art/PartArt'
import { cn } from '@/lib/utils'

const panels = [
  { n: '01', title: 'Добавь тачку в гараж', text: 'Марка, кузов, мотор — или просто номер кузова. Три клика.', sfx: 'ピッ!', art: 'car' },
  { n: '02', title: 'Выбирай без страха', text: 'Мы подсветим, что подходит именно тебе. Ошибиться сложно.', sfx: 'ドン!', art: 'part' },
  { n: '03', title: 'Оплати как удобно', text: 'Карта, СБП, частями или при получении. Без доплат.', sfx: 'キラッ', art: 'mascot' },
  { n: '04', title: 'Tofu Express уже едет', text: 'Москва и СПб — за 24 часа, регионы — от 2 дней.', sfx: 'ブーン!', art: 'speed' },
]

/** «Как это работает» в стиле манга-панелей */
export function MangaSteps() {
  return (
    <section className="py-12">
      <Container>
        <SectionHeading jp="使い方" title="Как это работает" subtitle="Короче, четыре панели — и детали у тебя. Читаем слева направо (не как в манге 😉)." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          {panels.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, rotate: i % 2 ? 2 : -2, y: 20 }}
              whileInView={{ opacity: 1, rotate: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 120 }}
              className={cn(
                'relative flex min-h-[280px] flex-col overflow-hidden rounded-[22px] border-[3px] border-fg/80 bg-[var(--surface)] p-5 shadow-[6px_6px_0_0_var(--pink)]',
                i === 1 && 'lg:mt-8',
                i === 2 && 'lg:-mt-2 shadow-[6px_6px_0_0_var(--cyan)]',
              )}
            >
              <span aria-hidden className="halftone absolute inset-0 opacity-50" />
              {p.art === 'speed' && <span aria-hidden className="speedlines absolute inset-0 opacity-90" />}
              <div className="relative flex items-start justify-between">
                <span className="font-display text-5xl font-black text-transparent [-webkit-text-stroke:2px_var(--fg)]">{p.n}</span>
                <span className="rotate-6 font-jp text-2xl font-black text-pink">{p.sfx}</span>
              </div>
              <div className="relative my-3 flex flex-1 items-center justify-center">
                {p.art === 'car' && <CarSilhouette shape="sedan" hue={200} glow={false} className="max-w-[220px]" />}
                {p.art === 'part' && <PartArt kind="brake" hue={340} bare className="h-28 w-28" />}
                {p.art === 'mascot' && <Mascot mood="love" className="h-28 w-28" />}
                {p.art === 'speed' && <CarSilhouette shape="hatch" hue={50} className="max-w-[230px] -skew-x-6" />}
              </div>
              <div className="relative">
                <h3 className="font-display text-lg font-extrabold">{p.title}</h3>
                <p className="mt-1 text-sm font-medium text-muted">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
