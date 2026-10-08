export interface PromoCode {
  code: string
  title: string
  kind: 'percent' | 'fixed' | 'shipping'
  value: number
  minTotal?: number
  onlyType?: 'tuning'
}

export const promoCodes: PromoCode[] = [
  { code: 'SENPAI10', title: '−10% на весь заказ', kind: 'percent', value: 10 },
  { code: 'ARIGATO500', title: '−500 ₽ при заказе от 3 000 ₽', kind: 'fixed', value: 500, minTotal: 3000 },
  { code: 'TOFU', title: 'Бесплатная доставка', kind: 'shipping', value: 0 },
  { code: 'DRIFT15', title: '−15% на тюнинг', kind: 'percent', value: 15, onlyType: 'tuning' },
]

export const FREE_SHIPPING_FROM = 5000

export interface DeliveryOption {
  id: string
  title: string
  subtitle: string
  price: number
  days: string
  emoji: string
}

export const deliveryOptions: DeliveryOption[] = [
  { id: 'pickup', title: 'Пункт выдачи', subtitle: '3 400+ пунктов по всей России', price: 249, days: '1–5 дней', emoji: '📦' },
  { id: 'courier', title: 'Курьер до двери', subtitle: 'Удобный интервал, примерка на месте', price: 449, days: '1–3 дня', emoji: '🛵' },
  { id: 'tofu', title: 'Tofu Express', subtitle: 'Москва и СПб, привезём за 24 часа', price: 990, days: '24 часа', emoji: '🚗' },
  { id: 'store', title: 'Самовывоз из шоурума', subtitle: 'Москва, Кожевническая 14 (это пример)', price: 0, days: 'Сегодня', emoji: '⛩️' },
]

export interface PaymentOption {
  id: string
  title: string
  subtitle: string
}

export const paymentOptions: PaymentOption[] = [
  { id: 'card', title: 'Картой онлайн', subtitle: 'Visa, Mastercard, МИР' },
  { id: 'sbp', title: 'СБП', subtitle: 'Оплата по QR за пару секунд' },
  { id: 'split', title: 'Частями', subtitle: '4 платежа без переплаты' },
  { id: 'cash', title: 'При получении', subtitle: 'Картой или наличными' },
]

export const faq: { q: string; a: string; group: string }[] = [
  { group: 'Подбор', q: 'Как понять, что деталь подойдёт к моей машине?', a: 'Добавь авто в «Гараж» — и на каждом товаре появится отметка «подходит / не подходит». Для 100% уверенности используй поиск по VIN или номеру кузова (frame), например JZX100-0123456.' },
  { group: 'Подбор', q: 'Что такое номер кузова (frame) и где его найти?', a: 'У машин японского рынка часто нет VIN — вместо него номер кузова вида JZX100-0123456. Он есть в СТС/ПТС и на табличке в моторном отсеке.' },
  { group: 'Подбор', q: 'Чем OEM отличается от аналога?', a: 'OEM — детали от поставщиков японских заводов (Denso, Aisin, Akebono…). Аналоги — качественные детали других брендов без переплаты за логотип. Мы продаём только проверенные бренды.' },
  { group: 'Доставка', q: 'Сколько идёт доставка?', a: 'Со склада в Москве — 1–3 дня, по регионам — до 7 дней. Контрактные детали из Японии — 10–21 день. Срок для конкретного товара указан в карточке.' },
  { group: 'Доставка', q: 'Есть ли бесплатная доставка?', a: 'Да, при заказе от 5 000 ₽ доставка в пункт выдачи бесплатная. Ещё есть промокод TOFU, но тсс 🤫' },
  { group: 'Оплата', q: 'Можно ли оплатить частями?', a: 'Да, выбери «Частями» при оформлении — 4 платежа раз в две недели без переплаты.' },
  { group: 'Возврат', q: 'Что если деталь не подошла?', a: '14 дней на возврат, если деталь не была в установке. Если ошиблись мы — заберём за свой счёт и привезём правильную.' },
  { group: 'Возврат', q: 'Какая гарантия на контрактные агрегаты?', a: '30 дней на запуск с момента получения. Каждый мотор и КПП идут с видео запуска на доноре и номером аукционного лота.' },
]

export const socials = [
  { id: 'tg', label: 'Telegram', handle: '@senpai_parts' },
  { id: 'vk', label: 'VK', handle: 'vk.com/senpai.parts' },
  { id: 'yt', label: 'YouTube', handle: '@senpaiparts' },
  { id: 'tt', label: 'TikTok', handle: '@senpai.parts' },
] as const
