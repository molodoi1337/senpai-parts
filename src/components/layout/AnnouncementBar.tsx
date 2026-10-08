import { Marquee } from '@/components/ui/Marquee'

const items = [
  '🌸 Бесплатная доставка от 5 000 ₽',
  '🎌 Контрактные моторы с аукционов Японии',
  '💸 Промокод SENPAI10 — минус 10% на первый заказ',
  '🚗 Tofu Express: доставка за 24 часа по Москве и СПб',
  '🔍 Подбор по VIN и номеру кузова — бесплатно',
  '✨ 365 дней гарантии на новые детали',
]

export function AnnouncementBar() {
  return (
    <div className="relative z-[41] border-b border-line bg-gradient-to-r from-pink/25 via-violet/20 to-cyan/20 py-2 text-xs font-bold backdrop-blur-md">
      <Marquee speed={45}>
        {items.map((t) => (
          <span key={t} className="mx-6 whitespace-nowrap">
            {t}
            <span className="ml-12 font-jp text-pink">✿</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
