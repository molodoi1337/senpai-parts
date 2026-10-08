import { partBrands } from '@/data/catalog-meta'
import { Marquee } from '@/components/ui/Marquee'

export function BrandMarquee() {
  const first = partBrands.filter((b) => b.id !== 'genuine').slice(0, 20)
  const second = partBrands.slice(20)
  return (
    <section className="py-8" aria-label="Бренды">
      <Marquee speed={60}>
        {first.map((b) => (
          <span key={b.id} className="mx-5 flex items-center gap-5 whitespace-nowrap font-display text-2xl font-extrabold text-transparent [-webkit-text-stroke:1px_var(--muted)] sm:text-4xl">
            {b.name}
            <span className="text-base text-pink [-webkit-text-stroke:0]">✦</span>
          </span>
        ))}
      </Marquee>
      <Marquee speed={70} reverse className="mt-3">
        {second.map((b) => (
          <span key={b.id} className="mx-5 flex items-center gap-5 whitespace-nowrap font-display text-2xl font-extrabold text-muted/70 sm:text-4xl">
            {b.name}
            <span className="font-jp text-base text-cyan">✿</span>
          </span>
        ))}
      </Marquee>
    </section>
  )
}
