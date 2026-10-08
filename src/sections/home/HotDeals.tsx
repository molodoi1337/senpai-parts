import { Flame } from 'lucide-react'
import { useShowcase } from '@/api/hooks'
import { Container } from '@/components/layout/Container'
import { Countdown } from '@/components/ui/Countdown'
import { ProductRail } from '@/components/product/ProductRail'
import { endOfDay } from '@/lib/hooks'

export function HotDeals() {
  const { data, isLoading } = useShowcase('hot', 12)
  return (
    <section className="py-12">
      <Container>
        <div className="glass relative overflow-hidden rounded-[34px] p-4 pt-6 sm:p-8">
          <span aria-hidden className="speedlines absolute inset-0 opacity-50" />
          <span aria-hidden className="pointer-events-none absolute -right-4 -top-8 select-none font-jp text-[7rem] font-black text-pink/10 sm:text-[11rem]">
            激安
          </span>
          <div className="relative mb-6 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="flex items-center gap-2 font-jp text-sm font-bold tracking-[0.25em] text-pink">
                <Flame size={16} /> タイムアタック
              </p>
              <h2 className="section-title mt-1 text-3xl sm:text-5xl">
                Тайм-аттак <span className="text-gradient-warm">скидок</span>
              </h2>
              <p className="mt-2 text-sm text-muted">Цены обнуляются в полночь. Успей, пока не превратились в тыкву.</p>
            </div>
            <Countdown target={endOfDay()} />
          </div>
          <div className="relative">
            <ProductRail items={data} loading={isLoading} />
          </div>
        </div>
      </Container>
    </section>
  )
}
