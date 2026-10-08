import { useState } from 'react'
import { useShowcase } from '@/api/hooks'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductGrid } from '@/components/product/ProductGrid'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'best', label: '🏆 Хиты' },
  { id: 'new', label: '✨ Новинки' },
  { id: 'jdm', label: '🏁 JDM-тюнинг' },
] as const

export function Showcase() {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('best')
  const { data, isFetching } = useShowcase(tab, 8)
  return (
    <section className="py-12">
      <Container>
        <SectionHeading
          jp="人気"
          title="Что берут прямо сейчас"
          to="/catalog?sort=popular"
          right={
            <div className="flex gap-1.5" role="tablist">
              {tabs.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn('chip h-10 px-4', tab === t.id && 'chip-active')}>
                  {t.label}
                </button>
              ))}
            </div>
          }
        />
        <ProductGrid items={data} loading={isFetching} />
      </Container>
    </section>
  )
}
