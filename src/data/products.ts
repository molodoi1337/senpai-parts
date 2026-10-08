import { carGens, genById, makeById, type CarGen } from './cars'
import { brandById, categoryById, type ArtKind } from './catalog-meta'
import { createRng, slugify } from '@/lib/utils'

export type PartType = 'oem' | 'analog' | 'tuning'
export type Condition = 'new' | 'contract'
export type Tag = 'hot' | 'new' | 'hit' | 'sale' | 'jdm'

export interface Product {
  id: string
  slug: string
  sku: string
  oem: string
  name: string
  brandId: string
  categoryId: string
  type: PartType
  condition: Condition
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  sold: number
  stock: number
  deliveryDays: [number, number]
  compat: string[]
  universal: boolean
  tags: Tag[]
  specs: [string, string][]
  hue: number
  art: ArtKind
  description: string
  mileage?: number
  auction?: { house: string; lot: string; grade: string }
  createdAt: number
}

type Rng = ReturnType<typeof createRng>

interface Ctx {
  r: Rng
  gen: CarGen
  makerId: string
}

interface Template {
  cat: string
  name: string
  makers: string[]
  price: [number, number]
  count: number
  lines?: string[]
  universal?: boolean
  sporty?: boolean
  contract?: 'engine' | 'gearbox' | 'generic'
  desc: string
  specs: (c: Ctx) => [string, string][]
}

/** Тюнинг-ателье, которые делают детали только под «свои» марки */
const makerRestrictions: Record<string, string[]> = {
  nismo: ['nissan', 'infiniti'],
  mugen: ['honda'],
  spoon: ['honda'],
  trd: ['toyota', 'lexus'],
}

const isSporty = (g: CarGen) =>
  Boolean(g.legend) ||
  g.shape === 'coupe' ||
  g.shape === 'roadster' ||
  /Type R|WRX|Evolution|Swift Sport|IS|Q50/.test(g.model)

const pick = <T,>(c: Ctx, arr: readonly T[]) => c.r.pick(arr)
const mm = (c: Ctx, a: number, b: number) => `${c.r.int(a, b)} мм`
const yesNo = (c: Ctx, p = 0.5) => (c.r.chance(p) ? 'Да' : 'Нет')
const engineOf = (c: Ctx) => pick(c, c.gen.engines)

const templates: Template[] = [
  // ─────────────── Тормоза
  {
    cat: 'brakes', name: 'Колодки тормозные передние', makers: ['akebono', 'advics', 'nisshinbo', 'genuine'],
    price: [2400, 7900], count: 7, lines: ['ProACT', 'Ultra Premium', 'Ceramic', 'Street+', 'Original'],
    desc: 'Тихие, почти не пылят и не скрипят на светофоре. Ровное усилие на педали и от холодного старта, и после серпантина.',
    specs: (c) => [['Ось', 'Передняя'], ['Материал', pick(c, ['Керамика', 'Полуметалл', 'Low-steel'])], ['Толщина', mm(c, 15, 18)], ['Датчик износа', yesNo(c)], ['Комплект', '4 шт']],
  },
  {
    cat: 'brakes', name: 'Колодки тормозные задние', makers: ['akebono', 'advics', 'nisshinbo', 'genuine'],
    price: [1900, 6200], count: 5, lines: ['ProACT', 'Ceramic', 'Original'],
    desc: 'Задние колодки с правильным коэффициентом трения: машина не клюёт носом и не уходит в сторону при экстренном торможении.',
    specs: (c) => [['Ось', 'Задняя'], ['Материал', pick(c, ['Керамика', 'Полуметалл'])], ['Толщина', mm(c, 13, 16)], ['Комплект', '4 шт']],
  },
  {
    cat: 'brakes', name: 'Диск тормозной вентилируемый', makers: ['advics', 'genuine', 'nisshinbo', 'akebono'],
    price: [3900, 11900], count: 6,
    desc: 'Литьё с высоким содержанием углерода: меньше биения и коробления после интенсивных торможений.',
    specs: (c) => [['Ось', pick(c, ['Передняя', 'Задняя'])], ['Диаметр', mm(c, 280, 355)], ['Толщина', mm(c, 24, 32)], ['Вентиляция', 'Да'], ['Крепёжных отверстий', '5']],
  },
  {
    cat: 'brakes', name: 'Тормозной кит Big Brake', makers: ['hks', 'cusco', 'trd', 'nismo', 'spoon'],
    price: [89000, 219000], count: 4, sporty: true, lines: ['Monoblock 6P', 'Street 4P', 'Sport 6POT'],
    desc: 'Монолитные суппорты, плавающие диски и колодки для трека. Для тех, кто разгоняет — и хочет так же уверенно оттормаживаться.',
    specs: (c) => [['Поршней', pick(c, ['4', '6'])], ['Диск', `${c.r.int(330, 380)}×${c.r.int(28, 34)} мм`], ['Цвет суппорта', pick(c, ['Красный', 'Золото', 'Чёрный', 'Синий'])], ['Минимальный диск колеса', pick(c, ['17"', '18"'])]],
  },
  {
    cat: 'brakes', name: 'Шланги тормозные армированные', makers: ['cusco', 'tein', 'hks'],
    price: [6900, 15900], count: 3, sporty: true,
    desc: 'Тефлон в стальной оплётке — педаль становится короткой и информативной, а шланги не раздуваются под нагрузкой.',
    specs: (c) => [['Материал', 'PTFE + нерж. оплётка'], ['Комплект', pick(c, ['4 шт', '6 шт'])], ['Сертификат', 'DOT/JIS']],
  },
  // ─────────────── Подвеска
  {
    cat: 'suspension', name: 'Койловеры', makers: ['tein', 'hks', 'cusco', 'blitz'],
    price: [69000, 189000], count: 8, sporty: true, lines: ['Flex Z', 'Hipermax S', 'Street Zero A', 'ZZ-R', 'Mono Sport', 'Street Basis'],
    desc: 'Регулируемая подвеска: занижай, настраивай жёсткость и клиренс под трек, город или стенс-встречу. Можно всё и сразу.',
    specs: (c) => [['Регулировка жёсткости', `${pick(c, ['16', '32', '40'])} позиций`], ['Регулировка высоты', 'Да, по корпусу'], ['Конструкция', pick(c, ['Моноблок', 'Двухтрубная'])], ['Пружины', `перед ${c.r.int(6, 12)} кг/мм, зад ${c.r.int(5, 10)} кг/мм`], ['Опоры', pick(c, ['Пиллобол', 'Резиновые'])]],
  },
  {
    cat: 'suspension', name: 'Амортизатор передний газомасляный', makers: ['kyb', 'genuine'],
    price: [4900, 12900], count: 7, lines: ['Excel-G', 'New SR Special', 'Original'],
    desc: 'Заводские характеристики демпфирования: машина снова едет как новая, без раскачки на волнах.',
    specs: (c) => [['Ось', 'Передняя'], ['Сторона', pick(c, ['Левая', 'Правая', 'L/R'])], ['Тип', 'Газомасляный'], ['Длина в сжатом', mm(c, 360, 420)]],
  },
  {
    cat: 'suspension', name: 'Амортизатор задний газомасляный', makers: ['kyb', 'genuine'],
    price: [3900, 10900], count: 5, lines: ['Excel-G', 'New SR Special', 'Original'],
    desc: 'Задний амортизатор с заводской настройкой. Убирает «козление» и пробои на неровностях.',
    specs: (c) => [['Ось', 'Задняя'], ['Тип', 'Газомасляный'], ['Длина в сжатом', mm(c, 300, 380)]],
  },
  {
    cat: 'suspension', name: 'Рычаг передний нижний', makers: ['genuine', 'ctr'],
    price: [3900, 14900], count: 5,
    desc: 'Рычаг в сборе с сайлент-блоками и шаровой. Возвращает чёткость руля и убирает стуки.',
    specs: (c) => [['Сторона', pick(c, ['Левая', 'Правая'])], ['Шаровая опора', yesNo(c, 0.7)], ['Материал', pick(c, ['Сталь', 'Алюминий'])]],
  },
  {
    cat: 'suspension', name: 'Стойка стабилизатора', makers: ['ctr', 'genuine', 'gmb'],
    price: [890, 2900], count: 5,
    desc: 'Самая частая причина «стука спереди». Меняется за 20 минут, а тишина в салоне — бесценна.',
    specs: (c) => [['Ось', pick(c, ['Передняя', 'Задняя'])], ['Длина', mm(c, 80, 320)], ['Пыльник', 'Усиленный']],
  },
  {
    cat: 'suspension', name: 'Распорка передних стоек', makers: ['cusco', 'trd', 'nismo', 'mugen', 'spoon'],
    price: [11900, 29900], count: 4, sporty: true,
    desc: 'Связывает чашки стоек и повышает жёсткость кузова. Руль становится острее, особенно на старых шасси.',
    specs: (c) => [['Материал', pick(c, ['Алюминий', 'Карбон + алюминий', 'Сталь'])], ['Регулировка', yesNo(c, 0.6)], ['Вес', `${(c.r.int(9, 26) / 10).toFixed(1)} кг`]],
  },
  // ─────────────── Двигатель
  {
    cat: 'engine', name: 'Двигатель контрактный', makers: ['genuine'],
    price: [120000, 690000], count: 9, contract: 'engine',
    desc: 'Мотор с японского аукциона: подтверждённый пробег, компрессия замерена, видео запуска в карточке заказа.',
    specs: (c) => [['Комплектация', pick(c, ['Без навесного', 'С навесным', 'Свап-кит (мозги, проводка, педаль)'])], ['Компрессия', `${c.r.int(11, 13)} бар по цилиндрам`], ['Видео запуска', 'Есть'], ['Гарантия на запуск', '30 дней']],
  },
  {
    cat: 'engine', name: 'Комплект прокладок ГБЦ', makers: ['genuine', 'tomei', 'hks'],
    price: [8900, 39000], count: 4,
    desc: 'Полный комплект для переборки головы. Металлическая многослойная прокладка держит наддув без пробоев.',
    specs: (c) => [['Двигатель', engineOf(c)], ['Толщина прокладки', `${(c.r.int(10, 20) / 10).toFixed(1)} мм`], ['Тип', 'MLS (многослойная сталь)']],
  },
  {
    cat: 'engine', name: 'Поршни кованые (комплект)', makers: ['tomei', 'hks', 'greddy'],
    price: [69000, 159000], count: 4, sporty: true,
    desc: 'Кованые поршни под серьёзный наддув. Для тех, кто считает стоковые 280 сил скорее разминкой.',
    specs: (c) => [['Двигатель', engineOf(c)], ['Диаметр', `${(c.r.int(820, 870) / 10).toFixed(1)} мм`], ['Степень сжатия', `${(c.r.int(85, 105) / 10).toFixed(1)}:1`], ['Пальцы и кольца', 'В комплекте']],
  },
  {
    cat: 'engine', name: 'Распредвалы Procam', makers: ['tomei', 'hks'],
    price: [59000, 129000], count: 3, sporty: true,
    desc: 'Валы с увеличенным подъёмом и фазой: верхи оживают, а мотор начинает звучать как надо.',
    specs: (c) => [['Двигатель', engineOf(c)], ['Фаза', `${c.r.int(256, 280)}°`], ['Подъём', `${(c.r.int(92, 112) / 10).toFixed(1)} мм`], ['Комплект', 'Впуск + выпуск']],
  },
  {
    cat: 'engine', name: 'Опора двигателя', makers: ['genuine', 'nismo', 'cusco'],
    price: [2900, 12900], count: 4,
    desc: 'Гасит вибрации на холостых и не даёт мотору «гулять» при резком старте.',
    specs: (c) => [['Положение', pick(c, ['Передняя', 'Задняя', 'Левая', 'Правая'])], ['Тип', pick(c, ['Гидроопора', 'Резиновая', 'Полиуретан'])]],
  },
  // ─────────────── Зажигание
  {
    cat: 'ignition', name: 'Свеча зажигания иридиевая', makers: ['ngk', 'denso'],
    price: [690, 2400], count: 8, lines: ['Iridium IX', 'Iridium TT', 'Laser Iridium', 'Racing R7'],
    desc: 'Тонкий иридиевый электрод — стабильная искра, ровный холостой и ресурс до 100 000 км.',
    specs: (c) => [['Калильное число', pick(c, ['6', '7', '8', '9'])], ['Зазор', `${(c.r.int(6, 11) / 10).toFixed(1)} мм`], ['Резьба', pick(c, ['M14×1.25', 'M12×1.25'])], ['Ресурс', `${pick(c, ['60', '80', '100'])} 000 км`]],
  },
  {
    cat: 'ignition', name: 'Катушка зажигания', makers: ['denso', 'genuine'],
    price: [3400, 9900], count: 6,
    desc: 'Индивидуальная катушка. Убирает пропуски, троение и чек «P0301» на панели.',
    specs: (c) => [['Двигатель', engineOf(c)], ['Тип', 'Индивидуальная'], ['Разъём', pick(c, ['3-pin', '4-pin'])]],
  },
  {
    cat: 'ignition', name: 'Провода высоковольтные', makers: ['ngk', 'nismo'],
    price: [2900, 8900], count: 3,
    desc: 'Силиконовая изоляция и низкое сопротивление. Для моторов с трамблёром и тех, кто ценит олдскул.',
    specs: (c) => [['Сопротивление', `${c.r.int(1, 8)} кОм/м`], ['Цвет', pick(c, ['Красный', 'Синий', 'Чёрный'])]],
  },
  // ─────────────── Фильтры
  {
    cat: 'filters', name: 'Фильтр масляный', makers: ['vic', 'js-asakashi', 'genuine', 'hks', 'denso'],
    price: [390, 1900], count: 9,
    desc: 'Фильтрующая бумага японской выделки и противодренажный клапан — масло на месте с первой секунды пуска.',
    specs: (c) => [['Высота', mm(c, 60, 100)], ['Резьба', pick(c, ['3/4-16 UNF', 'M20×1.5'])], ['Обратный клапан', 'Да'], ['Байпас', `${(c.r.int(8, 15) / 10).toFixed(1)} бар`]],
  },
  {
    cat: 'filters', name: 'Фильтр воздушный', makers: ['js-asakashi', 'vic', 'genuine', 'denso'],
    price: [790, 2900], count: 7,
    desc: 'Чистый воздух — довольный мотор. Плотная посадка, без подсоса пыли по краю.',
    specs: (c) => [['Форма', pick(c, ['Панельный', 'Круглый'])], ['Длина', mm(c, 180, 320)], ['Материал', 'Целлюлоза']],
  },
  {
    cat: 'filters', name: 'Фильтр нулевого сопротивления', makers: ['hks', 'apexi', 'blitz', 'greddy'],
    price: [6900, 18900], count: 5, sporty: true, lines: ['Super Power Flow', 'Power Intake', 'SUS Power', 'Airinx'],
    desc: 'Тот самый звук всасывания на открытии дросселя. Плюс пара лошадок и много эмоций.',
    specs: (c) => [['Тип', 'Конус «нулевик»'], ['Посадочный диаметр', mm(c, 70, 100)], ['Мойка', 'Многоразовый']],
  },
  {
    cat: 'filters', name: 'Фильтр салонный угольный', makers: ['denso', 'js-asakashi', 'vic'],
    price: [690, 2400], count: 6,
    desc: 'Угольный слой ловит запахи и выхлоп в пробке. Дышится заметно легче.',
    specs: (c) => [['Слой', 'Угольный'], ['Антибактериальная пропитка', yesNo(c, 0.6)], ['Размер', `${c.r.int(200, 240)}×${c.r.int(180, 220)} мм`]],
  },
  {
    cat: 'filters', name: 'Фильтр топливный', makers: ['vic', 'js-asakashi', 'genuine'],
    price: [890, 3900], count: 4,
    desc: 'Защищает форсунки от мусора из топлива. Особенно актуально, если заправляешься где попало.',
    specs: (c) => [['Тип', pick(c, ['Погружной', 'Магистральный'])], ['Тонкость очистки', `${c.r.int(5, 15)} мкм`]],
  },
  // ─────────────── Масла
  {
    cat: 'oils', name: 'Масло моторное 0W-20, 4 л', makers: ['idemitsu', 'eneos', 'genuine'],
    price: [3400, 6900], count: 5, universal: true, lines: ['Zepro Touring', 'Sustina', 'Fully Synthetic', 'SP Premium'],
    desc: 'Синтетика для современных японских моторов. Быстро прокачивается по системе на холодную.',
    specs: (c) => [['Вязкость', '0W-20'], ['Допуск', pick(c, ['API SP', 'API SP / ILSAC GF-6A'])], ['Объём', '4 л'], ['Тип', 'Синтетическое']],
  },
  {
    cat: 'oils', name: 'Масло моторное 5W-40, 4 л', makers: ['idemitsu', 'eneos', 'hks', 'nismo'],
    price: [3900, 9900], count: 5, universal: true, lines: ['Super Oil Premium', 'Sustina', 'Competition', 'Zepro Racing'],
    desc: 'Для турбомоторов и активной езды. Держит плёнку при высоких оборотах и температурах.',
    specs: (c) => [['Вязкость', '5W-40'], ['Допуск', pick(c, ['API SN', 'API SP', 'ACEA A3/B4'])], ['Объём', '4 л'], ['Тип', 'Синтетическое (PAO)']],
  },
  {
    cat: 'oils', name: 'Масло моторное 10W-60 Racing, 4 л', makers: ['nismo', 'hks', 'idemitsu'],
    price: [8900, 15900], count: 3, universal: true, lines: ['Competition Oil', 'Super Racing', 'Zepro Racing'],
    desc: 'Эстер + PAO для трек-дней и форсированных моторов. Ротору, кстати, тоже нравится.',
    specs: () => [['Вязкость', '10W-60'], ['Основа', 'Эстер + PAO'], ['Объём', '4 л']],
  },
  {
    cat: 'oils', name: 'Жидкость ATF', makers: ['genuine', 'idemitsu', 'eneos'],
    price: [990, 3900], count: 4, universal: true, lines: ['WS', 'Type T-IV', 'CVTF NS-3', 'Multi ATF'],
    desc: 'Трансмиссионная жидкость с правильными фрикционными свойствами: переключения мягкие, без пинков.',
    specs: (c) => [['Спецификация', pick(c, ['WS', 'T-IV', 'NS-3', 'DW-1'])], ['Объём', pick(c, ['1 л', '4 л'])]],
  },
  {
    cat: 'oils', name: 'Антифриз Super Long Life', makers: ['genuine', 'eneos'],
    price: [1200, 3400], count: 3, universal: true,
    desc: 'Розовый концентрат японского стандарта. Да, он реально розовый — и это вайб.',
    specs: (c) => [['Цвет', 'Розовый'], ['Тип', pick(c, ['Готовый −35°C', 'Концентрат'])], ['Объём', pick(c, ['2 л', '4 л'])]],
  },
  {
    cat: 'oils', name: 'Тормозная жидкость DOT 4', makers: ['genuine', 'akebono', 'advics'],
    price: [590, 2400], count: 3, universal: true,
    desc: 'Высокая температура кипения — педаль не проваливается даже после серии торможений на треке.',
    specs: (c) => [['Стандарт', pick(c, ['DOT 4', 'DOT 5.1'])], ['T кипения', `${c.r.int(260, 310)} °C`], ['Объём', pick(c, ['0.5 л', '1 л'])]],
  },
  // ─────────────── Турбо
  {
    cat: 'turbo', name: 'Турбокомпрессор', makers: ['hks', 'greddy', 'blitz', 'tomei'],
    price: [79000, 289000], count: 7, sporty: true, lines: ['GT III-RS', 'T518Z', 'TD06SH-20G', 'Arms MX8265', 'GTII 7460', 'BB 8270'],
    desc: 'Болт-он турбина: ставится на штатные места, а на диностенде показывает совсем не штатные цифры.',
    specs: (c) => [['Мощность до', `${c.r.int(42, 80) * 10} л.с.`], ['Компрессор', `${c.r.int(56, 72)} мм`], ['Подшипник', pick(c, ['Шариковый', 'Втулка'])], ['Фланец', pick(c, ['T25', 'T3', 'Штатный'])]],
  },
  {
    cat: 'turbo', name: 'Интеркулер фронтальный', makers: ['hks', 'greddy', 'blitz', 'apexi'],
    price: [39000, 99000], count: 5, sporty: true, lines: ['R-Type', 'Spec-LS', 'Type 29F', 'Racing'],
    desc: 'Большая сота и литые бачки. Холодный воздух — стабильный наддув даже в жару.',
    specs: (c) => [['Сота', `${c.r.int(550, 700)}×${c.r.int(220, 300)}×${c.r.int(65, 100)} мм`], ['Патрубки', 'В комплекте'], ['Материал', 'Алюминий']],
  },
  {
    cat: 'turbo', name: 'Блоу-офф клапан', makers: ['hks', 'greddy', 'blitz'],
    price: [16900, 34900], count: 4, sporty: true, lines: ['SSQV4', 'Type-RS', 'Super Sound BOV'],
    desc: '«Пшшш» при сбросе газа, которое слышно за квартал. Ну и защита турбины, конечно.',
    specs: (c) => [['Тип', pick(c, ['Атмосферный', 'Рециркуляционный', 'Гибрид'])], ['Регулировка', 'Да']],
  },
  {
    cat: 'turbo', name: 'Буст-контроллер электронный', makers: ['hks', 'blitz', 'greddy', 'apexi'],
    price: [24900, 54900], count: 3, universal: true, lines: ['EVC 7', 'SBC i-Color', 'Profec', 'AVC-R'],
    desc: 'Точное управление давлением наддува, несколько профилей и OLED-экран, который хочется трогать.',
    specs: () => [['Профилей', '4'], ['Дисплей', 'OLED'], ['Скремблирование', 'Есть']],
  },
  // ─────────────── Выхлоп
  {
    cat: 'exhaust', name: 'Выхлопная система Cat-back', makers: ['hks', 'tomei', 'blitz', 'apexi', 'greddy', 'nismo', 'mugen', 'trd', 'spoon', 'kakimoto'],
    price: [49000, 149000], count: 9, sporty: true, lines: ['Hi-Power', 'Super Turbo Muffler', 'Nur Spec', 'Expreme Ti', 'Legamax', 'Regu.06 & R', 'Revolution'],
    desc: 'Тот самый звук. Нержавейка или титан, а сертификат JASMA, чтобы и соседей не будить.',
    specs: (c) => [['Материал', pick(c, ['Нержавейка SUS304', 'Титан'])], ['Диаметр', mm(c, 60, 90)], ['Насадка', `${pick(c, ['Одна', 'Две'])}, ${mm(c, 100, 125)}`], ['Громкость', `${c.r.int(91, 99)} дБ`], ['JASMA', 'Да']],
  },
  {
    cat: 'exhaust', name: 'Даунпайп', makers: ['hks', 'tomei', 'greddy', 'blitz'],
    price: [24900, 59000], count: 4, sporty: true,
    desc: 'Освобождает выхлоп сразу за турбиной: быстрее раскрутка, ниже EGT.',
    specs: (c) => [['Диаметр', mm(c, 70, 90)], ['Катализатор', pick(c, ['Нет (Off-road)', 'Спорт-кат 200 cell'])], ['Материал', 'SUS304']],
  },
  {
    cat: 'exhaust', name: 'Глушитель основной', makers: ['genuine', 'kakimoto', 'hks'],
    price: [9900, 49000], count: 4,
    desc: 'Замена прогоревшей банки. Штатная геометрия, штатная тишина — или чуть веселее.',
    specs: (c) => [['Материал', pick(c, ['Алюминизированная сталь', 'Нержавейка'])], ['Посадка', 'Штатная']],
  },
  // ─────────────── Охлаждение
  {
    cat: 'cooling', name: 'Радиатор алюминиевый', makers: ['koyo', 'greddy', 'trd', 'nismo'],
    price: [24900, 69000], count: 6, sporty: true,
    desc: 'Цельноалюминиевый радиатор увеличенной толщины. Летний трек-день больше не повод для паники.',
    specs: (c) => [['Рядность', pick(c, ['2 ряда', '3 ряда'])], ['Толщина', mm(c, 36, 53)], ['Бачки', 'Алюминий, сварка TIG']],
  },
  {
    cat: 'cooling', name: 'Радиатор охлаждения', makers: ['denso', 'koyo', 'genuine'],
    price: [8900, 24900], count: 5,
    desc: 'Штатная замена: посадка без доработок, все крепления на своих местах.',
    specs: (c) => [['КПП', pick(c, ['АКПП', 'МКПП'])], ['Материал', 'Алюминий / пластик']],
  },
  {
    cat: 'cooling', name: 'Помпа водяная', makers: ['gmb', 'aisin', 'genuine'],
    price: [3400, 11900], count: 6,
    desc: 'Помпу меняют вместе с ГРМ — даже не обсуждается. Подшипник Koyo, крыльчатка металл.',
    specs: (c) => [['Двигатель', engineOf(c)], ['Крыльчатка', pick(c, ['Металл', 'Пластик'])], ['Прокладка', 'В комплекте']],
  },
  {
    cat: 'cooling', name: 'Термостат', makers: ['genuine', 'tomei', 'aisin'],
    price: [1400, 5900], count: 4,
    desc: 'Мотор быстрее прогревается и не перегревается. Есть низкотемпературные версии для тюнинга.',
    specs: (c) => [['Температура открытия', `${c.r.int(68, 88)} °C`], ['Прокладка', 'В комплекте']],
  },
  {
    cat: 'cooling', name: 'Маслоохладитель', makers: ['hks', 'greddy', 'blitz'],
    price: [29000, 64000], count: 3, sporty: true,
    desc: 'Выносной маслокулер с термостатом. Температура масла под контролем на любых оборотах.',
    specs: (c) => [['Рядов', `${c.r.int(10, 25)}`], ['Термостат', 'Да, 75 °C'], ['Шланги', 'AN-10']],
  },
  // ─────────────── Трансмиссия
  {
    cat: 'transmission', name: 'Комплект сцепления', makers: ['exedy', 'aisin', 'genuine'],
    price: [9900, 34900], count: 7,
    desc: 'Корзина, диск и выжимной — всё что нужно в одной коробке. Мягкое включение, правильный момент.',
    specs: (c) => [['Диаметр диска', mm(c, 212, 250)], ['Выжимной подшипник', 'В комплекте'], ['Шлицы', `${c.r.int(21, 26)}`]],
  },
  {
    cat: 'transmission', name: 'Сцепление спортивное двухдисковое', makers: ['exedy', 'hks', 'cusco', 'nismo', 'trd'],
    price: [79000, 189000], count: 5, sporty: true, lines: ['Hyper Multi', 'Stage 2', 'Twin Plate', 'Copper Mix'],
    desc: 'Держит большой момент и при этом не превращает пробку в тренировку левой ноги.',
    specs: (c) => [['Дисков', pick(c, ['2', '3'])], ['Момент', `до ${c.r.int(60, 110) * 10} Н·м`], ['Материал', pick(c, ['Металлокерамика', 'Органика/медь'])]],
  },
  {
    cat: 'transmission', name: 'Дифференциал LSD', makers: ['cusco', 'nismo', 'trd', 'mugen'],
    price: [69000, 159000], count: 4, sporty: true, lines: ['Type RS', '2-Way', '1.5-Way', 'GT Pro'],
    desc: 'Самоблок для дрифта и трека. Машина выходит из поворота, а не крутит внутреннее колесо.',
    specs: (c) => [['Тип', pick(c, ['1-way', '1.5-way', '2-way'])], ['Предзатяг', `${c.r.int(4, 15)} кгс·м`]],
  },
  {
    cat: 'transmission', name: 'АКПП контрактная', makers: ['genuine'],
    price: [69000, 249000], count: 4, contract: 'gearbox',
    desc: 'Автомат с японского донора. Проверен на стенде, есть видео работы на авто перед снятием.',
    specs: (c) => [['Тип', pick(c, ['АКПП 4-ст.', 'АКПП 5-ст.', 'АКПП 6-ст.', 'Вариатор CVT'])], ['Гидротрансформатор', 'В комплекте'], ['Гарантия', '30 дней']],
  },
  {
    cat: 'transmission', name: 'Маховик облегчённый', makers: ['exedy', 'tomei', 'nismo'],
    price: [29000, 69000], count: 3, sporty: true,
    desc: 'Хромомолибден, −40% веса. Мотор раскручивается быстрее — перегазовки в удовольствие.',
    specs: (c) => [['Вес', `${(c.r.int(45, 75) / 10).toFixed(1)} кг`], ['Материал', 'Cr-Mo сталь']],
  },
  {
    cat: 'transmission', name: 'ШРУС наружный', makers: ['gmb', 'genuine'],
    price: [3900, 12900], count: 4,
    desc: 'Хруст на поворотах? Это он. Новый ШРУС с пыльником и смазкой в комплекте.',
    specs: (c) => [['Шлицы внутр./наруж.', `${c.r.int(23, 30)}/${c.r.int(23, 30)}`], ['ABS кольцо', yesNo(c, 0.5)]],
  },
  // ─────────────── Электрика
  {
    cat: 'electrics', name: 'Аккумулятор', makers: ['gs-yuasa'],
    price: [8900, 21900], count: 5, universal: true, lines: ['80D23L', '55B24L', '95D31R', '46B19L', 'EcoR Long Life'],
    desc: 'Японская АКБ с ресурсом на годы. Заводится в −30, проверено сибирскими клиентами.',
    specs: (c) => [['Ёмкость', `${pick(c, ['45', '55', '65', '80'])} А·ч`], ['Пусковой ток', `${c.r.int(42, 75) * 10} А`], ['Полярность', pick(c, ['Обратная (L)', 'Прямая (R)'])], ['Клеммы', 'Азия (тонкие)']],
  },
  {
    cat: 'electrics', name: 'Генератор', makers: ['denso', 'genuine'],
    price: [14900, 49000], count: 5,
    desc: 'Новый генератор со штатным креплением. Стабильные 14 вольт даже с мощной аудиосистемой.',
    specs: (c) => [['Ток', `${pick(c, ['80', '100', '130', '150'])} А`], ['Напряжение', '12 В'], ['Шкив', 'Обгонная муфта']],
  },
  {
    cat: 'electrics', name: 'Стартер', makers: ['denso', 'genuine'],
    price: [9900, 34900], count: 4,
    desc: 'Редукторный стартер: бодро крутит даже в мороз. Щёлк — и поехали.',
    specs: (c) => [['Мощность', `${(c.r.int(10, 20) / 10).toFixed(1)} кВт`], ['Зубьев', `${c.r.int(8, 11)}`]],
  },
  {
    cat: 'electrics', name: 'Датчик кислорода (лямбда-зонд)', makers: ['denso', 'ngk'],
    price: [3900, 14900], count: 5,
    desc: 'Точный состав смеси — экономия топлива и никакого «чека». Прямая замена без переходников.',
    specs: (c) => [['Положение', pick(c, ['До катализатора', 'После катализатора'])], ['Тип', pick(c, ['Циркониевый', 'Широкополосный (A/F)'])], ['Проводов', pick(c, ['4', '5'])]],
  },
  {
    cat: 'electrics', name: 'Датчик ABS', makers: ['denso', 'genuine', 'gmb'],
    price: [1900, 6900], count: 3,
    desc: 'Лампа ABS горит — скорее всего, это он. Меняется за полчаса.',
    specs: (c) => [['Ось', pick(c, ['Передняя', 'Задняя'])], ['Сторона', pick(c, ['Левая', 'Правая'])]],
  },
  // ─────────────── Оптика
  {
    cat: 'lighting', name: 'Фара передняя контрактная', makers: ['koito', 'stanley'],
    price: [9900, 64900], count: 6, contract: 'generic',
    desc: 'Оригинальная японская фара с донора. Стекло без сколов, корректор рабочий, крепления целые.',
    specs: (c) => [['Сторона', pick(c, ['Левая', 'Правая'])], ['Тип', pick(c, ['Ксенон', 'Галоген', 'LED'])], ['Состояние', pick(c, ['Отличное', 'Хорошее, мелкие потёртости'])]],
  },
  {
    cat: 'lighting', name: 'Фара передняя LED', makers: ['koito', 'stanley'],
    price: [19900, 89000], count: 5,
    desc: 'Новая фара с LED-модулем и динамическим поворотником. Апгрейд, который видно ночью за километр.',
    specs: (c) => [['Сторона', pick(c, ['Левая', 'Правая', 'Комплект L+R'])], ['Цветовая температура', `${pick(c, ['5500', '6000', '6500'])} K`], ['Корректор', 'Электрический']],
  },
  {
    cat: 'lighting', name: 'Фонарь задний', makers: ['koito', 'stanley'],
    price: [6900, 29900], count: 5,
    desc: 'Задний фонарь OEM-качества: никакой воды внутри и ровная засветка.',
    specs: (c) => [['Сторона', pick(c, ['Левая', 'Правая'])], ['Тип', pick(c, ['LED', 'Лампы'])], ['Тонировка', yesNo(c, 0.3)]],
  },
  {
    cat: 'lighting', name: 'Лампы LED H11 6500K (комплект)', makers: ['koito', 'stanley'],
    price: [2900, 9900], count: 4, universal: true,
    desc: 'Холодный белый свет, правильная светотеневая граница и никаких ослеплённых встречных.',
    specs: (c) => [['Цоколь', pick(c, ['H11', 'HB3', 'HB4', 'H4'])], ['Цветовая температура', '6500 K'], ['Комплект', '2 шт']],
  },
  // ─────────────── Кузов
  {
    cat: 'body', name: 'Зеркало боковое в сборе', makers: ['genuine'],
    price: [6900, 29000], count: 5,
    desc: 'Зеркало с электроприводом, обогревом и повторителем. Красится в цвет кузова — или оставь чёрным.',
    specs: (c) => [['Сторона', pick(c, ['Левая', 'Правая'])], ['Электроскладывание', yesNo(c, 0.7)], ['Обогрев', 'Да'], ['Повторитель', yesNo(c, 0.6)]],
  },
  {
    cat: 'body', name: 'Бампер передний контрактный', makers: ['genuine'],
    price: [14900, 69000], count: 4, contract: 'generic',
    desc: 'Оригинальный бампер с японского авто. Отдаём с фото всех сторон до отправки.',
    specs: (c) => [['Цвет', pick(c, ['Белый перламутр', 'Чёрный', 'Серебро', 'Красный', 'Под покраску'])], ['Состояние', pick(c, ['Отличное', 'Мелкие сколы'])]],
  },
  {
    cat: 'body', name: 'Капот карбоновый', makers: ['nismo', 'mugen', 'trd', 'greddy'],
    price: [69000, 189000], count: 4, sporty: true,
    desc: 'Карбон с вентиляцией: минус 8 кг спереди и плюс бесконечность к лайкам в соцсетях.',
    specs: (c) => [['Материал', pick(c, ['Карбон 2×2 twill', 'Карбон / стеклопластик'])], ['Вес', `${c.r.int(6, 11)} кг`], ['Вентиляция', yesNo(c, 0.7)]],
  },
  {
    cat: 'body', name: 'Антикрыло GT', makers: ['trd', 'mugen', 'nismo', 'greddy', 'hks'],
    price: [39000, 129000], count: 5, sporty: true,
    desc: 'Регулируемый угол атаки и настоящая прижимная сила. Да, оно работает, а не только для фото.',
    specs: (c) => [['Ширина', mm(c, 1400, 1700)], ['Материал', pick(c, ['Карбон', 'Алюминий', 'FRP'])], ['Регулировка угла', 'Да']],
  },
  {
    cat: 'body', name: 'Решётка радиатора', makers: ['genuine', 'trd', 'mugen', 'nismo'],
    price: [7900, 34900], count: 4,
    desc: 'Свежая решётка меняет «лицо» машины сильнее, чем кажется.',
    specs: (c) => [['Цвет', pick(c, ['Глянцевый чёрный', 'Хром', 'Карбон'])], ['Эмблема', yesNo(c, 0.5)]],
  },
  // ─────────────── Диски и шины
  {
    cat: 'wheels', name: 'Диски кованые (комплект 4 шт)', makers: ['rays', 'enkei', 'work'],
    price: [89000, 389000], count: 9, sporty: true, lines: ['Volk TE37 SAGA', 'Volk CE28N', 'Gram Lights 57DR', 'RPF1', 'NT03+M', 'Emotion CR Kiwami', 'Meister S1'],
    desc: 'Лёгкие, прочные, культовые. Неподрессоренная масса вниз — улыбка вверх.',
    specs: (c) => [['Диаметр', pick(c, ['17"', '18"', '19"'])], ['Ширина', `${pick(c, ['8.5', '9', '9.5', '10'])}J`], ['Вылет', `ET${c.r.int(22, 45)}`], ['PCD', pick(c, ['5×114.3', '5×100', '4×100'])], ['Вес одного', `${(c.r.int(68, 95) / 10).toFixed(1)} кг`]],
  },
  {
    cat: 'wheels', name: 'Шина летняя полуслик', makers: ['yokohama', 'bridgestone', 'toyo'],
    price: [12900, 29900], count: 6, universal: true, lines: ['Advan Neova AD09', 'Potenza RE-71RS', 'Proxes R888R', 'Advan A052'],
    desc: 'Для трек-дней и дерзкой езды по сухому. Сцепление такое, что хочется извиниться перед асфальтом.',
    specs: (c) => [['Размер', `${pick(c, ['225', '235', '245', '255', '265'])}/${pick(c, ['35', '40', '45'])} R${pick(c, ['17', '18', '19'])}`], ['Treadwear', `${pick(c, ['100', '140', '200'])}`], ['Индекс скорости', 'W (270 км/ч)']],
  },
  {
    cat: 'wheels', name: 'Гайки колёсные гоночные', makers: ['rays', 'work'],
    price: [6900, 14900], count: 3, universal: true,
    desc: 'Лёгкие алюминиевые гайки с секреткой. Мелочь, а смотрится на все 100.',
    specs: (c) => [['Резьба', pick(c, ['M12×1.5', 'M12×1.25'])], ['Комплект', '20 шт'], ['Цвет', pick(c, ['Синий', 'Красный', 'Чёрный', 'Золото'])]],
  },
  // ─────────────── Салон
  {
    cat: 'interior', name: 'Руль спортивный', makers: ['trd', 'nismo', 'mugen', 'spoon'],
    price: [29900, 64900], count: 4, sporty: true,
    desc: 'Алькантара, контрастная строчка и метка «12 часов». Ладони не скользят даже на трек-дне.',
    specs: (c) => [['Диаметр', mm(c, 330, 365)], ['Материал', pick(c, ['Алькантара', 'Кожа', 'Замша'])], ['Вынос', mm(c, 40, 90)]],
  },
  {
    cat: 'interior', name: 'Ковш спортивный', makers: ['bride'],
    price: [89000, 219000], count: 5, universal: true, lines: ['Zieg IV', 'Xero RS', 'Stradia III', 'Gias III', 'Low Max'],
    desc: 'Каркас из FRP/карбона, сертификат FIA. Сидишь как влитой — и выглядишь так же.',
    specs: (c) => [['Каркас', pick(c, ['FRP', 'Карбон-кевлар', 'Super Aramid'])], ['Цвет', pick(c, ['Чёрный', 'Gradation Logo', 'Красный'])], ['FIA', yesNo(c, 0.7)], ['Вес', `${c.r.int(7, 12)} кг`]],
  },
  {
    cat: 'interior', name: 'Приборы Defi Racer Gauge', makers: ['defi'],
    price: [14900, 39900], count: 4, universal: true, lines: ['Racer Gauge N2', 'Advance BF', 'Advance CR'],
    desc: 'Давление наддува, масла и температура. Анимация при включении — отдельный вид искусства.',
    specs: (c) => [['Параметр', pick(c, ['Наддув', 'Давление масла', 'Температура масла', 'Температура ОЖ'])], ['Диаметр', pick(c, ['52 мм', '60 мм'])], ['Подсветка', pick(c, ['Белая', 'Красная', 'Синяя'])]],
  },
  {
    cat: 'interior', name: 'Ручка КПП', makers: ['trd', 'mugen', 'nismo', 'spoon', 'cusco'],
    price: [3900, 9900], count: 5,
    desc: 'Тяжёлая шарообразная ручка — переключения становятся чёткими и приятными на ощупь.',
    specs: (c) => [['Материал', pick(c, ['Дюралюминий', 'Делрин', 'Титан'])], ['Резьба', pick(c, ['M10×1.5', 'M10×1.25', 'M12×1.25'])]],
  },
  {
    cat: 'interior', name: 'Ремни безопасности 4-точечные', makers: ['cusco', 'bride'],
    price: [19900, 39000], count: 3, universal: true,
    desc: 'Держат в ковше крепче, чем дедлайн держит студента. Обязательно для трека.',
    specs: (c) => [['Точек', pick(c, ['4', '6'])], ['Ширина', '3"'], ['Замок', 'Поворотный']],
  },
  // ─────────────── ГРМ
  {
    cat: 'timing', name: 'Комплект ГРМ с помпой', makers: ['aisin', 'koyo', 'mitsuboshi', 'gmb'],
    price: [6900, 24900], count: 7,
    desc: 'Ремень, ролики, натяжитель и помпа — меняешь всё сразу и забываешь на 100 000 км.',
    specs: (c) => [['Двигатель', engineOf(c)], ['Зубьев', `${c.r.int(97, 211)}`], ['Помпа', 'В комплекте'], ['Ресурс', '100 000 км']],
  },
  {
    cat: 'timing', name: 'Ремень приводной поликлиновой', makers: ['mitsuboshi', 'genuine'],
    price: [990, 3900], count: 6,
    desc: 'Свист под капотом на холодную — пора менять. Японская резина не дубеет на морозе.',
    specs: (c) => [['Ручьёв', `${c.r.int(4, 7)}`], ['Длина', mm(c, 900, 2200)]],
  },
  {
    cat: 'timing', name: 'Цепь ГРМ (комплект)', makers: ['genuine', 'aisin'],
    price: [9900, 34900], count: 5,
    desc: 'Цепь, успокоители, натяжитель и звёзды. Если мотор «дизелит» на холодную — тебе сюда.',
    specs: (c) => [['Двигатель', engineOf(c)], ['Звёзды', yesNo(c, 0.5)], ['Натяжитель', 'В комплекте']],
  },
  {
    cat: 'timing', name: 'Ролик натяжителя', makers: ['koyo', 'gmb', 'aisin'],
    price: [1900, 5900], count: 4,
    desc: 'Гудит под капотом? Скорее всего, подшипник ролика. Japan-made, ставится на родное место.',
    specs: (c) => [['Тип', pick(c, ['Натяжной', 'Обводной'])], ['Диаметр', mm(c, 55, 80)]],
  },
  {
    cat: 'timing', name: 'Ремень ГРМ усиленный', makers: ['hks', 'greddy', 'tomei'],
    price: [8900, 16900], count: 3, sporty: true,
    desc: 'Арамидный корд и HNBR-резина. Для форсированных моторов и высоких оборотов.',
    specs: (c) => [['Двигатель', engineOf(c)], ['Материал', 'HNBR + арамид'], ['Цвет', pick(c, ['Синий', 'Красный', 'Чёрный'])]],
  },
]

const auctionHouses = ['USS Tokyo', 'USS Nagoya', 'TAA Kinki', 'JU Gifu', 'HAA Kobe', 'CAA Chubu', 'Arai Oyama', 'USS Yokohama']

function oemNumber(r: Rng, makeId: string) {
  const d = (n: number) => Array.from({ length: n }, () => r.int(0, 9)).join('')
  const a = (n: number) => Array.from({ length: n }, () => r.pick('ABCDEFGHJKLMNPRSTUVWXYZ0123456789'.split(''))).join('')
  switch (makeId) {
    case 'nissan':
    case 'infiniti':
      return `${d(5)}-${a(5)}`
    case 'honda':
      return `${d(5)}-${a(3)}-${a(3)}`
    case 'mazda':
      return `${a(4)}-${d(2)}-${a(4)}`
    case 'subaru':
      return `${d(5)}${a(2)}${d(3)}`
    case 'mitsubishi':
      return `MR${d(6)}`
    case 'suzuki':
      return `${d(5)}-${d(2)}${a(3)}`
    default:
      return `${d(5)}-${d(5)}`
  }
}

const roundPrice = (p: number) => Math.max(290, Math.round(p / 100) * 100 - 10)

const typeDescriptions: Record<PartType | 'contract', string> = {
  oem: 'Деталь от OEM-поставщика японских заводов: та же геометрия и материалы, что на конвейере, — ставится как родная.',
  analog: 'Качественный аналог без переплаты за логотип на коробке. Проверен нашими механиками на реальных машинах.',
  tuning: 'Тюнинг из японского мотоспорта: детали, которые десятилетиями обкатывались на треках Цукубы, Судзуки и Эбису.',
  contract: 'Контрактная деталь с аукциона Японии: снята с автомобиля с подтверждённым пробегом и проверена на нашем складе в Иокогаме перед отправкой.',
}

function generate(): Product[] {
  const r = createRng(20261008)
  const out: Product[] = []
  const now = Date.now()
  let idx = 0

  for (const t of templates) {
    for (let i = 0; i < t.count; i++) {
      idx++
      const makerId = r.pick(t.makers)
      const brand = brandById[makerId]
      const restricted = makerRestrictions[makerId]

      let pool = carGens.filter((g) => (!restricted || restricted.includes(g.makeId)) && (!t.sporty || isSporty(g)))
      if (!pool.length) pool = carGens
      const base = r.pick(pool)

      let compat: string[] = []
      let nameSuffix = ''
      if (t.contract === 'engine') {
        const engine = r.pick(base.engines)
        compat = carGens.filter((g) => g.engines.includes(engine)).map((g) => g.id)
        nameSuffix = ` ${engine}`
      } else if (t.contract) {
        compat = [base.id]
        nameSuffix = ` ${makeById[base.makeId].name} ${base.model} ${base.gen}`
      } else if (!t.universal) {
        const siblings = pool.filter((g) => g.id !== base.id && (g.makeId === base.makeId || r.chance(0.15)))
        compat = [base.id, ...r.sample(siblings, r.int(0, 3)).map((g) => g.id)]
      }

      const line = t.lines ? ` ${r.pick(t.lines)}` : ''
      const brandName = makerId === 'genuine' ? `${makeById[base.makeId].name} Genuine` : brand.name
      const name = `${t.name}${nameSuffix} ${brandName}${t.contract ? '' : line}`.replace(/\s+/g, ' ').trim()

      const condition: Condition = t.contract ? 'contract' : 'new'
      const type: PartType = brand.tier === 'tuning' ? 'tuning' : brand.tier === 'aftermarket' ? 'analog' : 'oem'

      const price = roundPrice(t.price[0] + (t.price[1] - t.price[0]) * Math.pow(r.next(), 1.3))
      const hasDiscount = r.chance(0.34)
      const oldPrice = hasDiscount ? roundPrice(price / (1 - r.int(7, 35) / 100)) : undefined

      const inStock = r.chance(condition === 'contract' ? 0.95 : 0.84)
      const stock = condition === 'contract' ? (inStock ? 1 : 0) : inStock ? r.int(1, 48) : 0
      const deliveryDays: [number, number] =
        condition === 'contract' ? [r.int(9, 12), r.int(14, 21)] : stock > 0 ? [1, r.int(2, 4)] : [r.int(6, 9), r.int(12, 18)]

      const rating = Math.round((4 + Math.pow(r.next(), 0.55) * 1) * 10) / 10
      const reviews = r.chance(0.08) ? 0 : Math.floor(Math.pow(r.next(), 2) * 340) + 1
      const sold = reviews * r.int(4, 12) + r.int(0, 60)
      const createdAt = now - r.int(1, 540) * 86400000

      const compatGen = genById[compat[0]] ?? base
      const ctx: Ctx = { r, gen: compatGen, makerId }

      const specs: [string, string][] = [
        ...t.specs(ctx),
        ['Производитель', makerId === 'genuine' ? `${makeById[base.makeId].name} (оригинал)` : brand.name],
        ['Страна бренда', brand.country],
        ['Тип детали', condition === 'contract' ? 'Контрактная (б/у, Япония)' : type === 'oem' ? 'OEM / оригинал' : type === 'tuning' ? 'Тюнинг' : 'Аналог'],
        ['Гарантия', condition === 'contract' ? '30 дней на запуск' : type === 'tuning' ? '12 месяцев' : '365 дней'],
        ['Вес', `${(r.int(2, 400) / 10).toFixed(1)} кг`],
      ]

      const tags: Tag[] = []
      if (oldPrice && oldPrice - price > price * 0.2) tags.push('hot')
      if (oldPrice) tags.push('sale')
      if (createdAt > now - 30 * 86400000) tags.push('new')
      if (sold > 1500) tags.push('hit')
      if (type === 'tuning' || compat.some((id) => genById[id]?.legend)) tags.push('jdm')

      const id = `p${String(idx).padStart(4, '0')}`
      const cat = categoryById[t.cat]

      const product: Product = {
        id,
        slug: `${slugify(name)}-${id}`,
        sku: `SP-${String(100000 + idx * 37).slice(-6)}`,
        oem: oemNumber(r, base.makeId),
        name,
        brandId: makerId,
        categoryId: t.cat,
        type,
        condition,
        price,
        oldPrice,
        rating,
        reviews,
        sold,
        stock,
        deliveryDays,
        compat,
        universal: Boolean(t.universal),
        tags,
        specs,
        hue: (cat.hue + r.int(-28, 28) + 360) % 360,
        art: cat.art,
        description: `${t.desc} ${typeDescriptions[condition === 'contract' ? 'contract' : type]}`,
        createdAt,
      }

      if (condition === 'contract') {
        product.mileage = r.int(28, 118) * 1000
        product.auction = { house: r.pick(auctionHouses), lot: String(r.int(10000, 99999)), grade: r.pick(['3.5', '4', '4', '4.5', '5', 'R']) }
      }

      out.push(product)
    }
  }
  return out
}

export const products: Product[] = generate()

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>
export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>

export const fitsCar = (p: Product, genId?: string | null) => (genId ? p.universal || p.compat.includes(genId) : false)

export const priceBounds = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
}
