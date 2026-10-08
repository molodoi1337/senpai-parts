import { Link } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Mascot } from '@/components/art/Mascot'
import { usePageTitle } from '@/lib/hooks'

export default function NotFound() {
  usePageTitle('Страница не найдена')
  return (
    <Container className="grid min-h-[70vh] place-items-center pt-8">
      <div className="glass relative w-full max-w-xl overflow-hidden rounded-[36px] p-8 text-center sm:p-12">
        <span aria-hidden className="speedlines absolute inset-0 opacity-60" />
        <p className="relative font-jp text-2xl font-black text-pink">迷子になった…</p>
        <h1 className="relative mt-2 font-display text-[7rem] font-black leading-none text-transparent [-webkit-text-stroke:3px_var(--fg)] sm:text-[9rem]">
          4<span className="text-gradient [-webkit-text-stroke:0]">0</span>4
        </h1>
        <Mascot mood="dizzy" className="relative mx-auto -mt-4 h-28 w-28 animate-wiggle" />
        <p className="relative mt-3 text-muted">Мы уехали не туда на этом серпантине. Страницы нет, но детали — есть.</p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className="btn btn-primary">
            На главную
          </Link>
          <Link to="/catalog" className="btn btn-ghost">
            В каталог
          </Link>
        </div>
      </div>
    </Container>
  )
}
