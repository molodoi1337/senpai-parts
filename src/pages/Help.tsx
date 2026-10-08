import { useState } from 'react'
import { ChevronDown, CreditCard, MessageCircle, RotateCcw, Truck } from 'lucide-react'
import { deliveryOptions, faq, paymentOptions } from '@/data/site'
import { Container, PageHeader } from '@/components/layout/Container'
import { Mascot } from '@/components/art/Mascot'
import { toast } from '@/store/ui'
import { cn, formatPrice } from '@/lib/utils'
import { usePageTitle } from '@/lib/hooks'

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn('glass rounded-3xl transition', open && 'border-pink/40')}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold" aria-expanded={open}>
        {q}
        <ChevronDown size={18} className={cn('shrink-0 text-pink transition-transform', open && 'rotate-180')} />
      </button>
      <div className={cn('grid transition-[grid-template-rows] duration-300', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Help() {
  usePageTitle('Помощь и FAQ')
  const groups = Array.from(new Set(faq.map((f) => f.group)))
  return (
    <Container className="pt-4">
      <PageHeader jp="ヘルプ" title="Помощь и FAQ" subtitle="Ответы на частые вопросы. Не нашёл свой — пиши в чат, отвечаем за 5 минут." />

      <div className="grid gap-4 md:grid-cols-3">
        <section id="delivery" className="glass scroll-mt-24 rounded-[28px] p-6">
          <Truck className="text-pink" />
          <h2 className="mt-3 font-display text-xl font-extrabold">Доставка</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {deliveryOptions.map((d) => (
              <li key={d.id} className="flex justify-between gap-3">
                <span>
                  {d.emoji} {d.title} <span className="text-faint">· {d.days}</span>
                </span>
                <span className="shrink-0 font-bold">{d.price ? formatPrice(d.price) : 'Бесплатно'}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">В пункт выдачи — бесплатно от 5 000 ₽.</p>
        </section>
        <section id="payment" className="glass scroll-mt-24 rounded-[28px] p-6">
          <CreditCard className="text-cyan" />
          <h2 className="mt-3 font-display text-xl font-extrabold">Оплата</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {paymentOptions.map((p) => (
              <li key={p.id}>
                <b>{p.title}</b> <span className="text-muted">— {p.subtitle}</span>
              </li>
            ))}
          </ul>
        </section>
        <section id="returns" className="glass scroll-mt-24 rounded-[28px] p-6">
          <RotateCcw className="text-lime" />
          <h2 className="mt-3 font-display text-xl font-extrabold">Возврат и гарантия</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>14 дней на возврат, если деталь не устанавливалась.</li>
            <li>365 дней гарантии на новые детали.</li>
            <li>30 дней гарантии на запуск контрактных агрегатов.</li>
            <li>Ошиблись мы — заберём и привезём правильную за свой счёт.</li>
          </ul>
        </section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g}>
              <h2 className="mb-3 font-display text-xl font-extrabold">{g}</h2>
              <div className="space-y-2">
                {faq
                  .filter((f) => f.group === g)
                  .map((f) => (
                    <Accordion key={f.q} q={f.q} a={f.a} />
                  ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-[28px] p-6 text-center">
            <Mascot mood="happy" className="mx-auto h-28 w-28" />
            <p className="mt-2 font-display text-lg font-extrabold">Нэко-сэнсэй на связи</p>
            <p className="mt-1 text-sm text-muted">Подберём деталь по фото, номеру кузова или голосовому сообщению с описанием стука 🙃</p>
            <button onClick={() => toast({ title: 'Чат откроется на реальном сайте', description: 'А пока — демо-режим (=^･ω･^=)', tone: 'kawaii' })} className="btn btn-primary mt-4 w-full">
              <MessageCircle size={17} /> Написать в чат
            </button>
          </div>
        </aside>
      </div>
    </Container>
  )
}
