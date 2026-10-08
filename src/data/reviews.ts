import { carGens, carTitle } from './cars'
import type { Product } from './products'
import { createRng, hashString } from '@/lib/utils'

export interface Review {
  id: string
  author: string
  car: string
  rating: number
  date: number
  text: string
  pros?: string
  cons?: string
  likes: number
  verified: boolean
}

export interface Question {
  id: string
  author: string
  text: string
  answer: string
  date: number
}

const nicknames = [
  'drift_kun', 'supra_tyan', 'evo_na_vibe', 'ae86_tofu', 'boost_baka', 'rotary_chan', 'mark2_enjoyer', 'jdm_mom',
  'vtec_yo', 'sr20_senpai', 'kei_car_queen', 'Лёха_1JZ', 'Настя_GT86', 'Дима_Импреза', 'stance_neko', 'tokyo_drifter_spb',
  'nightrun_ekb', 'Ваня_Сильвия', 'Катя_Jimny', 'wangan_midnight', 'обычный_гаражник', 'Марк_на_Марке', 'бабушкин_Prius', 'Kaito_RX7',
]

const positives = [
  'Пришло быстрее, чем обещали, упаковано как подарок на день рождения. Встало без доработок.',
  'Брал на свою, всё село идеально. Разницы с оригиналом не заметил вообще, только по цене.',
  'Сначала сомневался, но менеджер в чате всё объяснил и проверил по номеру кузова. Подошло — 10/10.',
  'Качество огонь. Японцы как всегда: каждая деталь в отдельном пакетике, инструкция с картинками.',
  'Поставил неделю назад, проехал 800 км — полёт нормальный. Машина буквально стала тише.',
  'Это имба. Друг брал в другом месте за +40%, теперь страдает.',
  'Курьер на вайбе, коробка целая, наклейка с котиком в подарок. Мелочь, а приятно.',
  'Третий раз заказываю тут. Пока ни одного косяка, подбор по VIN реально работает.',
  'Звук/ощущения — как в видосах с японских треков. Жена говорит, я стал чаще улыбаться.',
]

const neutral = [
  'В целом норм, но доставка задержалась на два дня — предупредили заранее, так что без претензий.',
  'Деталь хорошая, но инструкция только на японском. Спасибо переводчику в телефоне.',
  'Всё ок, но коробка пришла помятой. Сама деталь целая, так что звезду снимаю чисто за упаковку.',
]

const pros = ['Цена', 'Скорость доставки', 'Качество сборки', 'Посадка 1 в 1', 'Поддержка в чате', 'Упаковка', 'Тишина в работе']
const cons = ['Нет', 'Не нашёл', 'Хотелось бы инструкцию на русском', 'Доставка в регионы чуть дольше', 'Слишком быстро закончились деньги']

const questions: [string, string][] = [
  ['Подойдёт на праворульную версию?', 'Да, деталь не зависит от расположения руля. Если сомневаетесь — пришлите номер кузова в чат, проверим за 5 минут.'],
  ['Есть ли в наличии в Москве?', 'Да, на складе в Москве есть остаток. Если оформите до 16:00 — отправим сегодня.'],
  ['Это оригинал или реплика?', 'Только оригинальная продукция от официальных дистрибьюторов. Каждая партия проходит проверку, сертификаты готовы показать.'],
  ['Можно ли вернуть, если не подойдёт?', 'Конечно, 14 дней на возврат, если деталь не была в установке и сохранена упаковка. Но лучше проверим совместимость заранее :)'],
  ['Какой ресурс у этой детали?', 'При нормальной эксплуатации — как у оригинала. Конкретные цифры указаны во вкладке «Характеристики».'],
]

export function getReviews(p: Product): Review[] {
  const r = createRng(hashString(p.id + 'reviews'))
  const count = Math.min(p.reviews, 8)
  const pool = p.universal ? carGens : carGens.filter((g) => p.compat.includes(g.id))
  return Array.from({ length: count }, (_, i) => {
    const rating = r.chance(0.82) ? 5 : r.chance(0.7) ? 4 : 3
    const text = rating >= 4 ? r.pick(positives) : r.pick(neutral)
    const gen = r.pick(pool.length ? pool : carGens)
    return {
      id: `${p.id}-r${i}`,
      author: r.pick(nicknames),
      car: carTitle(gen),
      rating,
      date: Date.now() - r.int(2, 400) * 86400000,
      text,
      pros: r.chance(0.6) ? r.sample(pros, 2).join(', ') : undefined,
      cons: r.chance(0.5) ? r.pick(cons) : undefined,
      likes: r.int(0, 64),
      verified: r.chance(0.85),
    }
  }).sort((a, b) => b.date - a.date)
}

export function getQuestions(p: Product): Question[] {
  const r = createRng(hashString(p.id + 'qa'))
  return r.sample(questions, r.int(1, 3)).map(([text, answer], i) => ({
    id: `${p.id}-q${i}`,
    author: r.pick(nicknames),
    text,
    answer,
    date: Date.now() - r.int(5, 300) * 86400000,
  }))
}

export const testimonials = [
  { author: 'Настя_GT86', car: 'Toyota GT86', text: 'Собрала тут весь стенс-сетап: Tein, TE37 и выхлоп. Девочки в клубе теперь спрашивают, где брала. Отвечаю: у сэмпая 💅', rating: 5 },
  { author: 'Лёха_1JZ', car: 'Toyota Mark II JZX100', text: 'Контрактный 1JZ-GTE пришёл с видео запуска и замером компрессии. Завёлся с полоборота. Это уровень.', rating: 5 },
  { author: 'Kaito_RX7', car: 'Mazda RX-7 FD3S', text: 'Найти запчасти на ротор — квест. Тут нашли апексы и уплотнения за 2 дня по номеру кузова. Аригато!', rating: 5 },
  { author: 'Катя_Jimny', car: 'Suzuki Jimny JB64', text: 'Заказывала лифт-кит и фары, менеджер помог подобрать всё по совместимости. Поддержка отвечает быстрее, чем мои друзья.', rating: 5 },
  { author: 'drift_kun', car: 'Nissan Silvia S15', text: 'Цены честные, доставка шустрая. Минус звезда — коробка с LSD весила как моя жизнь, курьер страдал.', rating: 4 },
  { author: 'бабушкин_Prius', car: 'Toyota Prius ZVW30', text: 'Да, тут продают не только тюнинг. Взял колодки и фильтры на Приус — дёшево, оригинал, приехало на следующий день.', rating: 5 },
]
