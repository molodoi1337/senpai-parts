import { articles } from '@/data/blog'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArticleCard } from '@/components/blog/ArticleCard'

export function BlogTeaser() {
  return (
    <section className="py-12">
      <Container>
        <SectionHeading jp="ジャーナル" title="Журнал сэмпая" subtitle="Гайды, разборы и немного автомобильной философии." to="/blog" linkLabel="Все статьи" />
        <div className="grid gap-3 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Container>
    </section>
  )
}
