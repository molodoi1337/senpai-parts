import { useState } from 'react'
import { articles } from '@/data/blog'
import { Container, PageHeader } from '@/components/layout/Container'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

export default function Blog() {
  usePageTitle('Журнал')
  const tags = ['Все', ...Array.from(new Set(articles.map((a) => a.tag)))]
  const [tag, setTag] = useState('Все')
  const list = [...articles].sort((a, b) => b.date.localeCompare(a.date)).filter((a) => tag === 'Все' || a.tag === tag)
  const [first, ...rest] = list
  return (
    <Container className="pt-4">
      <PageHeader jp="ジャーナル" title="Журнал сэмпая" subtitle="Гайды без воды, тюнинг-разборы и культура JDM. Читается быстрее, чем греется турбина." />
      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)} className={cn('chip h-10 px-4', tag === t && 'chip-active')}>
            {t}
          </button>
        ))}
      </div>
      {first && <ArticleCard article={first} featured />}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </Container>
  )
}
