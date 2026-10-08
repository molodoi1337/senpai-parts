import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { categories } from '@/data/catalog-meta'
import { socials } from '@/data/site'
import { Logo } from '@/components/art/Logo'
import { SocialIcon } from '@/components/art/SocialIcon'

const cols = [
  {
    title: 'Покупателям',
    links: [
      { to: '/help#delivery', label: 'Доставка' },
      { to: '/help#payment', label: 'Оплата' },
      { to: '/help#returns', label: 'Возврат и гарантия' },
      { to: '/account', label: 'Мои заказы' },
      { to: '/help', label: 'FAQ' },
    ],
  },
  {
    title: 'Сервисы',
    links: [
      { to: '/vin', label: 'Поиск по VIN / Frame' },
      { to: '/cars', label: 'Подбор по авто' },
      { to: '/garage', label: 'Мой гараж' },
      { to: '/compare', label: 'Сравнение' },
      { to: '/blog', label: 'Журнал' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative mt-24 px-2 pb-24 sm:px-4 lg:pb-6">
      <div className="glass relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px] p-6 sm:p-10">
        <span aria-hidden className="pointer-events-none absolute -bottom-16 -right-6 select-none font-jp text-[12rem] font-black leading-none text-pink/[0.06] sm:text-[18rem]">
          先輩
        </span>
        <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted">
              Запчасти для японских авто без кринжа: оригинал, тюнинг и контрактные агрегаты с аукционов Японии. Для тех, кто любит свою тачку как аниме-вайфу.
            </p>
            <ul className="mt-5 space-y-2 text-sm font-semibold">
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-pink" /> 8 800 000-00-00 <span className="text-faint">(демо)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-pink" /> hello@senpai.parts
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-pink" /> Москва · Владивосток · Иокогама
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a key={s.id} href="#" onClick={(e) => e.preventDefault()} className="icon-btn hover:text-pink" aria-label={s.label} title={`${s.label}: ${s.handle}`}>
                  <SocialIcon id={s.id} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="label">Каталог</p>
            <ul className="space-y-2 text-sm font-semibold">
              {categories.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link to={`/catalog/${c.id}`} className="text-muted hover:text-pink">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="label">{col.title}</p>
              <ul className="space-y-2 text-sm font-semibold">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-muted hover:text-pink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="divider-dashed relative mt-10 flex flex-col gap-4 pt-6 text-xs text-faint md:flex-row md:items-center md:justify-between">
          <p>© 2026 SENPAI.PARTS · Демо-магазин. Названия брендов принадлежат их владельцам. Сделано с 💖 и 2JZ.</p>
          <div className="flex flex-wrap gap-2">
            {['МИР', 'VISA', 'Mastercard', 'СБП', 'Сплит'].map((p) => (
              <span key={p} className="rounded-lg border border-line px-2.5 py-1 font-bold text-muted">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
