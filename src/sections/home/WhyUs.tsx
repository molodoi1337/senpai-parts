import { motion } from 'framer-motion'
import { BadgeCheck, Gavel, ShieldCheck, Truck } from 'lucide-react'
import { Container } from '@/components/layout/Container'

const items = [
  { icon: Gavel, title: 'Аукционы Японии', text: 'Прямой доступ к USS, TAA, JU. Контрактные агрегаты с подтверждённым пробегом и видео запуска.', stat: '14', unit: 'аукционов' },
  { icon: BadgeCheck, title: 'Только оригинал', text: 'Работаем напрямую с дистрибьюторами Denso, Aisin, NGK, Akebono. Ноль подделок.', stat: '100%', unit: 'сертификатов' },
  { icon: Truck, title: 'Tofu Express', text: 'Свой склад в Москве и Владивостоке. Отгрузка в день заказа, курьер за 24 часа.', stat: '24ч', unit: 'по Москве' },
  { icon: ShieldCheck, title: 'Гарантия 365', text: 'Год гарантии на новые детали, 30 дней — на запуск контрактных. Возврат без нервов.', stat: '365', unit: 'дней' },
]

export function WhyUs() {
  return (
    <section className="py-12">
      <Container>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text, stat, unit }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass glass-hover relative overflow-hidden rounded-[26px] p-5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink/25 to-violet/25 text-pink">
                <Icon size={22} />
              </span>
              <p className="mt-5 font-display text-4xl font-extrabold">{stat}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">{unit}</p>
              <h3 className="mt-2 font-display text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
