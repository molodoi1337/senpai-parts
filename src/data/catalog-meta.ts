export type ArtKind =
  | 'brake'
  | 'coilover'
  | 'piston'
  | 'spark'
  | 'filter'
  | 'oil'
  | 'turbo'
  | 'exhaust'
  | 'radiator'
  | 'clutch'
  | 'battery'
  | 'headlight'
  | 'mirror'
  | 'wheel'
  | 'steering'
  | 'belt'

export interface Category {
  id: string
  name: string
  jp: string
  art: ArtKind
  hue: number
  blurb: string
}

export const categories: Category[] = [
  { id: 'brakes', name: 'Тормоза', jp: 'ブレーキ', art: 'brake', hue: 345, blurb: 'Колодки, диски, суппорты, шланги' },
  { id: 'suspension', name: 'Подвеска', jp: 'サスペンション', art: 'coilover', hue: 190, blurb: 'Койловеры, амортизаторы, рычаги' },
  { id: 'engine', name: 'Двигатель', jp: 'エンジン', art: 'piston', hue: 20, blurb: 'Контрактные моторы, поршни, прокладки' },
  { id: 'ignition', name: 'Зажигание', jp: '点火', art: 'spark', hue: 50, blurb: 'Свечи, катушки, провода' },
  { id: 'filters', name: 'Фильтры', jp: 'フィルター', art: 'filter', hue: 160, blurb: 'Масляные, воздушные, салонные' },
  { id: 'oils', name: 'Масла и жидкости', jp: 'オイル', art: 'oil', hue: 35, blurb: 'Моторные, ATF, антифриз, тормозная' },
  { id: 'turbo', name: 'Турбо и впуск', jp: 'ターボ', art: 'turbo', hue: 265, blurb: 'Турбины, интеркулеры, BOV' },
  { id: 'exhaust', name: 'Выхлоп', jp: 'マフラー', art: 'exhaust', hue: 300, blurb: 'Кэтбэки, даунпайпы, банки' },
  { id: 'cooling', name: 'Охлаждение', jp: '冷却', art: 'radiator', hue: 200, blurb: 'Радиаторы, помпы, термостаты' },
  { id: 'transmission', name: 'Трансмиссия', jp: 'クラッチ', art: 'clutch', hue: 10, blurb: 'Сцепления, МКПП/АКПП, LSD' },
  { id: 'electrics', name: 'Электрика', jp: '電装', art: 'battery', hue: 120, blurb: 'АКБ, генераторы, стартеры, датчики' },
  { id: 'lighting', name: 'Оптика', jp: 'ライト', art: 'headlight', hue: 55, blurb: 'Фары, фонари, LED-лампы' },
  { id: 'body', name: 'Кузов', jp: 'ボディ', art: 'mirror', hue: 330, blurb: 'Зеркала, бамперы, обвесы, капоты' },
  { id: 'wheels', name: 'Диски и шины', jp: 'ホイール', art: 'wheel', hue: 225, blurb: 'Кованые диски, шины, гайки' },
  { id: 'interior', name: 'Салон и стиль', jp: '内装', art: 'steering', hue: 285, blurb: 'Рули, ковши, приборы, ремни' },
  { id: 'timing', name: 'ГРМ и ремни', jp: 'タイミング', art: 'belt', hue: 170, blurb: 'Комплекты ГРМ, ролики, ремни' },
]

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<string, Category>

export type BrandTier = 'oem' | 'aftermarket' | 'tuning'

export interface PartBrand {
  id: string
  name: string
  tier: BrandTier
  country: string
  since: number
}

export const partBrands: PartBrand[] = [
  { id: 'genuine', name: 'Genuine OEM', tier: 'oem', country: 'Япония', since: 1937 },
  { id: 'denso', name: 'Denso', tier: 'oem', country: 'Япония', since: 1949 },
  { id: 'aisin', name: 'Aisin', tier: 'oem', country: 'Япония', since: 1965 },
  { id: 'ngk', name: 'NGK', tier: 'oem', country: 'Япония', since: 1936 },
  { id: 'akebono', name: 'Akebono', tier: 'oem', country: 'Япония', since: 1929 },
  { id: 'advics', name: 'Advics', tier: 'oem', country: 'Япония', since: 2001 },
  { id: 'kyb', name: 'KYB', tier: 'oem', country: 'Япония', since: 1919 },
  { id: 'koyo', name: 'Koyo', tier: 'oem', country: 'Япония', since: 1921 },
  { id: 'exedy', name: 'Exedy', tier: 'oem', country: 'Япония', since: 1923 },
  { id: 'mitsuboshi', name: 'Mitsuboshi', tier: 'oem', country: 'Япония', since: 1919 },
  { id: 'koito', name: 'Koito', tier: 'oem', country: 'Япония', since: 1915 },
  { id: 'stanley', name: 'Stanley', tier: 'oem', country: 'Япония', since: 1920 },
  { id: 'gs-yuasa', name: 'GS Yuasa', tier: 'oem', country: 'Япония', since: 1917 },
  { id: 'idemitsu', name: 'Idemitsu', tier: 'oem', country: 'Япония', since: 1911 },
  { id: 'eneos', name: 'ENEOS', tier: 'oem', country: 'Япония', since: 1888 },
  { id: 'vic', name: 'VIC', tier: 'aftermarket', country: 'Япония', since: 1946 },
  { id: 'js-asakashi', name: 'JS Asakashi', tier: 'aftermarket', country: 'Япония', since: 1976 },
  { id: 'nisshinbo', name: 'Nisshinbo', tier: 'aftermarket', country: 'Япония', since: 1907 },
  { id: 'ctr', name: 'CTR', tier: 'aftermarket', country: 'Корея', since: 1976 },
  { id: 'gmb', name: 'GMB', tier: 'aftermarket', country: 'Япония', since: 1964 },
  { id: 'hks', name: 'HKS', tier: 'tuning', country: 'Япония', since: 1973 },
  { id: 'greddy', name: 'GReddy', tier: 'tuning', country: 'Япония', since: 1977 },
  { id: 'tein', name: 'Tein', tier: 'tuning', country: 'Япония', since: 1985 },
  { id: 'cusco', name: 'Cusco', tier: 'tuning', country: 'Япония', since: 1977 },
  { id: 'nismo', name: 'Nismo', tier: 'tuning', country: 'Япония', since: 1984 },
  { id: 'mugen', name: 'Mugen', tier: 'tuning', country: 'Япония', since: 1973 },
  { id: 'trd', name: 'TRD', tier: 'tuning', country: 'Япония', since: 1954 },
  { id: 'spoon', name: 'Spoon Sports', tier: 'tuning', country: 'Япония', since: 1988 },
  { id: 'blitz', name: 'Blitz', tier: 'tuning', country: 'Япония', since: 1980 },
  { id: 'tomei', name: 'Tomei', tier: 'tuning', country: 'Япония', since: 1968 },
  { id: 'apexi', name: "A'PEXi", tier: 'tuning', country: 'Япония', since: 1985 },
  { id: 'rays', name: 'RAYS', tier: 'tuning', country: 'Япония', since: 1973 },
  { id: 'enkei', name: 'Enkei', tier: 'tuning', country: 'Япония', since: 1950 },
  { id: 'work', name: 'Work Wheels', tier: 'tuning', country: 'Япония', since: 1977 },
  { id: 'bride', name: 'Bride', tier: 'tuning', country: 'Япония', since: 1980 },
  { id: 'defi', name: 'Defi', tier: 'tuning', country: 'Япония', since: 1990 },
  { id: 'yokohama', name: 'Yokohama', tier: 'aftermarket', country: 'Япония', since: 1917 },
  { id: 'bridgestone', name: 'Bridgestone', tier: 'aftermarket', country: 'Япония', since: 1931 },
  { id: 'toyo', name: 'Toyo Tires', tier: 'aftermarket', country: 'Япония', since: 1945 },
  { id: 'kakimoto', name: 'Kakimoto Racing', tier: 'tuning', country: 'Япония', since: 1983 },
]

export const brandById = Object.fromEntries(partBrands.map((b) => [b.id, b])) as Record<string, PartBrand>

export const tierLabel: Record<BrandTier, string> = {
  oem: 'OEM-поставщик',
  aftermarket: 'Аналог',
  tuning: 'Тюнинг',
}
