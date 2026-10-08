import { useId, type ReactNode } from 'react'
import type { ArtKind } from '@/data/catalog-meta'
import { cn } from '@/lib/utils'

interface Props {
  kind: ArtKind
  hue?: number
  variant?: number
  label?: string
  className?: string
  bare?: boolean
}

const polar = (r: number, deg: number, cx = 100, cy = 100) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
}

const ring = (n: number, r: number, offset = 0) => Array.from({ length: n }, (_, i) => polar(r, (360 / n) * i + offset))

function arcBand(r1: number, r2: number, from: number, to: number) {
  const [x1, y1] = polar(r2, from)
  const [x2, y2] = polar(r2, to)
  const [x3, y3] = polar(r1, to)
  const [x4, y4] = polar(r1, from)
  const large = to - from > 180 ? 1 : 0
  return `M${x1},${y1} A${r2},${r2} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${r1},${r1} 0 ${large} 0 ${x4},${y4} Z`
}

/** Стилизованные «неоновые» иллюстрации деталей — без внешних картинок, весят по паре КБ */
export function PartArt({ kind, hue = 330, variant = 0, label, className, bare }: Props) {
  const uid = useId().replace(/:/g, '')
  const h2 = (hue + 50) % 360
  const stroke = `hsl(${hue} 100% 82%)`
  const accent = `hsl(${(hue + 180) % 360} 95% 65%)`
  const fill = `url(#f${uid})`
  const metal = `url(#m${uid})`

  const transforms = [
    'translate(100 100) scale(1) translate(-100 -100)',
    'translate(100 100) rotate(-14) scale(0.92) translate(-100 -100)',
    'translate(110 112) scale(1.45) translate(-100 -100)',
    'translate(100 100) rotate(10) scale(0.82) translate(-100 -100)',
  ]

  const common = { stroke, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  const parts: Record<ArtKind, ReactNode> = {
    brake: (
      <g {...common}>
        <circle cx="100" cy="100" r="64" fill={metal} />
        <circle cx="100" cy="100" r="50" fill="none" strokeOpacity=".35" strokeWidth="2" />
        {ring(16, 44, 6).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.2" fill={`hsl(${hue} 60% 12%)`} strokeWidth="1.5" />
        ))}
        <circle cx="100" cy="100" r="27" fill={fill} />
        {ring(5, 15).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={`hsl(${hue} 60% 12%)`} strokeWidth="2" />
        ))}
        <path d={arcBand(46, 76, 20, 100)} fill={accent} stroke="#fff" strokeWidth="3" />
        <text x="152" y="86" fontSize="13" fontWeight="900" fill="#fff" stroke="none" fontFamily="Unbounded, sans-serif" transform="rotate(58 152 86)">
          SENPAI
        </text>
      </g>
    ),
    coilover: (
      <g {...common}>
        <rect x="88" y="30" width="24" height="122" rx="8" fill={metal} />
        <rect x="95" y="16" width="10" height="20" rx="3" fill={fill} />
        <ellipse cx="100" cy="44" rx="40" ry="9" fill={fill} />
        {[60, 76, 92, 108, 124].map((y) => (
          <ellipse key={y} cx="100" cy={y} rx="34" ry="8" fill="none" stroke={accent} strokeWidth="7" />
        ))}
        <ellipse cx="100" cy="140" rx="36" ry="8" fill={fill} />
        <rect x="80" y="150" width="40" height="26" rx="6" fill={metal} />
        <circle cx="100" cy="164" r="6" fill={`hsl(${hue} 60% 12%)`} strokeWidth="2.5" />
      </g>
    ),
    piston: (
      <g {...common}>
        <path d="M100,108 L86,150 Q100,156 114,150 Z" fill={metal} />
        <circle cx="100" cy="160" r="22" fill={metal} />
        <circle cx="100" cy="160" r="11" fill={`hsl(${hue} 60% 12%)`} />
        <path d="M58,48 Q58,36 70,36 L130,36 Q142,36 142,48 L142,112 Q100,124 58,112 Z" fill={fill} />
        {[52, 62, 72].map((y) => (
          <line key={y} x1="58" x2="142" y1={y} y2={y} strokeWidth={y === 72 ? 5 : 3} stroke={y === 72 ? accent : stroke} />
        ))}
        <circle cx="100" cy="96" r="11" fill={`hsl(${hue} 60% 12%)`} />
        <path d="M70,40 Q100,30 130,40" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" />
      </g>
    ),
    spark: (
      <g {...common}>
        <rect x="92" y="14" width="16" height="16" rx="3" fill={metal} />
        <path d="M88,30 L112,30 L116,92 L84,92 Z" fill="#fff" fillOpacity=".92" />
        {[44, 56, 68].map((y) => (
          <line key={y} x1="86" x2="114" y1={y} y2={y} stroke={`hsl(${hue} 50% 70%)`} strokeWidth="3" />
        ))}
        <path d="M74,92 L126,92 L132,106 L126,120 L74,120 L68,106 Z" fill={fill} />
        <rect x="84" y="120" width="32" height="34" fill={metal} />
        {[124, 132, 140, 148].map((y) => (
          <line key={y} x1="84" x2="116" y1={y} y2={y + 5} strokeWidth="2.5" />
        ))}
        <path d="M100,154 L100,166 M90,166 L110,166 L110,160" fill="none" strokeWidth="4" />
        <path d="M100,172 L92,184 L102,182 L94,196" fill="none" stroke={accent} strokeWidth="4" />
        {ring(8, 16).map(([x, y], i) => (
          <line key={i} x1={100 + (x - 100) * 0.5} y1={178 + (y - 100) * 0.5} x2={100 + (x - 100)} y2={178 + (y - 100)} stroke={accent} strokeWidth="2.5" strokeOpacity=".7" />
        ))}
      </g>
    ),
    filter: (
      <g {...common}>
        <path d="M54,62 L54,150 Q54,166 100,166 Q146,166 146,150 L146,62 Z" fill={fill} />
        <ellipse cx="100" cy="62" rx="46" ry="14" fill={metal} />
        <ellipse cx="100" cy="62" rx="16" ry="5" fill={`hsl(${hue} 60% 12%)`} strokeWidth="2.5" />
        {Array.from({ length: 9 }, (_, i) => 60 + i * 10).map((x) => (
          <line key={x} x1={x} x2={x} y1="80" y2="94" strokeWidth="2.5" strokeOpacity=".7" />
        ))}
        <rect x="54" y="104" width="92" height="38" fill={accent} stroke="#fff" strokeWidth="3" />
        <text x="100" y="129" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" stroke="none" fontFamily="Zen Maru Gothic, sans-serif">
          フィルター
        </text>
      </g>
    ),
    oil: (
      <g {...common}>
        <path d="M58,62 L120,62 L150,86 L150,170 Q150,176 144,176 L64,176 Q58,176 58,170 Z" fill={fill} />
        <path d="M120,62 L120,46 L104,46 L104,62" fill={metal} />
        <rect x="100" y="34" width="24" height="14" rx="3" fill={accent} stroke="#fff" strokeWidth="2.5" />
        <path d="M64,62 Q64,40 90,40 L96,40" fill="none" strokeWidth="9" stroke={metal} />
        <rect x="70" y="100" width="70" height="56" rx="8" fill="#fff" fillOpacity=".9" stroke="none" />
        <path d="M105,108 Q92,126 96,134 Q100,144 110,140 Q120,134 105,108 Z" fill={accent} stroke="none" />
        <text x="105" y="152" textAnchor="middle" fontSize="9" fontWeight="900" fill={`hsl(${hue} 70% 25%)`} stroke="none" fontFamily="Unbounded, sans-serif">
          0W-20
        </text>
      </g>
    ),
    turbo: (
      <g {...common}>
        <path d="M118,42 L176,42 L176,78 L132,78" fill={metal} />
        <ellipse cx="176" cy="60" rx="7" ry="18" fill={fill} />
        <path d="M100,40 A60,60 0 1,1 46,74 Q60,46 100,40 Z" fill={metal} />
        <circle cx="100" cy="104" r="38" fill={fill} />
        <circle cx="100" cy="104" r="30" fill={`hsl(${hue} 60% 12%)`} strokeWidth="3" />
        {Array.from({ length: 9 }, (_, i) => i * 40).map((a) => {
          const [x1, y1] = polar(6, a, 100, 104)
          const [x2, y2] = polar(28, a + 40, 100, 104)
          return <path key={a} d={`M${x1},${y1} Q${(x1 + x2) / 2 + 6},${(y1 + y2) / 2 - 6} ${x2},${y2}`} fill="none" stroke={accent} strokeWidth="3" />
        })}
        <circle cx="100" cy="104" r="6" fill="#fff" stroke="none" />
      </g>
    ),
    exhaust: (
      <g {...common}>
        <defs>
          <linearGradient id={`ti${uid}`} x1="0" x2="1">
            <stop offset="0" stopColor={`hsl(${hue} 80% 55%)`} />
            <stop offset=".5" stopColor="hsl(265 80% 60%)" />
            <stop offset="1" stopColor="hsl(195 90% 60%)" />
          </linearGradient>
        </defs>
        <path d="M14,104 L42,104" strokeWidth="14" stroke={metal} />
        <rect x="38" y="70" width="104" height="64" rx="30" fill={`url(#ti${uid})`} />
        <path d="M52,82 L128,82" stroke="#fff" strokeOpacity=".6" strokeWidth="3" />
        <path d="M140,92 L168,86 M140,114 L168,120" strokeWidth="14" stroke={metal} />
        <ellipse cx="172" cy="86" rx="9" ry="13" fill={`hsl(${hue} 60% 12%)`} stroke={accent} strokeWidth="4" />
        <ellipse cx="172" cy="120" rx="9" ry="13" fill={`hsl(${hue} 60% 12%)`} stroke={accent} strokeWidth="4" />
      </g>
    ),
    radiator: (
      <g {...common}>
        <rect x="40" y="52" width="120" height="100" rx="6" fill={fill} />
        {Array.from({ length: 17 }, (_, i) => 50 + i * 6).map((x) => (
          <line key={x} x1={x} x2={x} y1="58" y2="146" strokeWidth="1.6" strokeOpacity=".75" />
        ))}
        <rect x="30" y="48" width="16" height="108" rx="5" fill={metal} />
        <rect x="154" y="48" width="16" height="108" rx="5" fill={metal} />
        <path d="M38,48 L38,32 Q38,26 44,26 L58,26" fill="none" strokeWidth="9" stroke={accent} />
        <path d="M162,156 L162,170 Q162,176 156,176 L142,176" fill="none" strokeWidth="9" stroke={accent} />
        <circle cx="150" cy="40" r="7" fill={metal} />
      </g>
    ),
    clutch: (
      <g {...common}>
        <circle cx="100" cy="100" r="66" fill={metal} />
        {Array.from({ length: 6 }, (_, i) => i * 60).map((a) => (
          <path key={a} d={arcBand(44, 64, a + 4, a + 56)} fill={accent} strokeWidth="2.5" />
        ))}
        <circle cx="100" cy="100" r="38" fill={fill} />
        {ring(4, 26, 45).map(([x, y], i) => (
          <rect key={i} x={x - 9} y={y - 5} width="18" height="10" rx="4" fill="#fff" fillOpacity=".85" strokeWidth="2" transform={`rotate(${i * 90 + 45} ${x} ${y})`} />
        ))}
        <circle cx="100" cy="100" r="13" fill={`hsl(${hue} 60% 12%)`} />
        {ring(10, 13).map(([x, y], i) => (
          <line key={i} x1="100" y1="100" x2={x} y2={y} strokeWidth="1.5" strokeOpacity=".6" />
        ))}
      </g>
    ),
    battery: (
      <g {...common}>
        <rect x="40" y="70" width="120" height="86" rx="10" fill={fill} />
        <rect x="36" y="60" width="128" height="18" rx="6" fill={metal} />
        <rect x="56" y="46" width="18" height="16" rx="3" fill={accent} />
        <rect x="126" y="46" width="18" height="16" rx="3" fill={metal} />
        <path d="M58,96 L72,96 M65,89 L65,103 M128,96 L142,96" strokeWidth="4" />
        <path d="M106,92 L90,122 L102,122 L96,144 L116,112 L104,112 L112,92 Z" fill="#fff" stroke={accent} strokeWidth="3" />
      </g>
    ),
    headlight: (
      <g {...common}>
        <path d="M24,92 Q30,58 80,52 L176,62 Q182,64 180,72 L166,128 Q160,140 146,140 L48,138 Q24,134 24,110 Z" fill={fill} />
        <circle cx="74" cy="98" r="26" fill={metal} />
        <circle cx="74" cy="98" r="15" fill="#fff" stroke={accent} strokeWidth="4" />
        <circle cx="68" cy="92" r="4" fill={accent} stroke="none" />
        <circle cx="128" cy="100" r="16" fill={metal} />
        <circle cx="128" cy="100" r="8" fill="#fff" strokeWidth="2.5" />
        <path d="M40,130 L150,132" stroke={accent} strokeWidth="6" />
        <path d="M60,62 L168,70" stroke="#fff" strokeOpacity=".6" strokeWidth="3" />
      </g>
    ),
    mirror: (
      <g {...common}>
        <path d="M128,128 L150,168 L172,168 L160,132" fill={metal} />
        <path d="M30,96 Q30,52 84,48 L150,46 Q178,48 176,82 L172,118 Q168,140 140,140 L64,142 Q30,140 30,96 Z" fill={fill} />
        <path d="M44,96 Q44,64 86,60 L148,58 Q164,60 162,82 L158,114 Q156,128 138,128 L66,130 Q44,128 44,96 Z" fill={metal} />
        <path d="M70,72 L100,72 L76,110" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="5" />
        <path d="M40,132 L130,140" stroke={accent} strokeWidth="5" />
      </g>
    ),
    wheel: (
      <g {...common}>
        <circle cx="100" cy="100" r="72" fill={`hsl(${hue} 30% 10%)`} strokeWidth="5" />
        <circle cx="100" cy="100" r="54" fill={metal} />
        {Array.from({ length: 6 }, (_, i) => i * 60).map((a) => {
          const [x, y] = polar(52, a)
          return <line key={a} x1="100" y1="100" x2={x} y2={y} stroke={accent} strokeWidth="11" />
        })}
        <circle cx="100" cy="100" r="54" fill="none" strokeWidth="5" />
        <circle cx="100" cy="100" r="17" fill={fill} />
        {ring(5, 10).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill="#fff" stroke="none" />
        ))}
        {ring(24, 66).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill={stroke} stroke="none" opacity=".5" />
        ))}
      </g>
    ),
    steering: (
      <g {...common}>
        <circle cx="100" cy="100" r="62" fill="none" stroke={metal} strokeWidth="18" />
        <circle cx="100" cy="100" r="62" fill="none" strokeWidth="2" strokeOpacity=".5" />
        <path d="M94,38 L106,38 L106,48 L94,48 Z" fill={accent} stroke="none" transform="translate(0 -9)" />
        <path d="M42,108 L80,106 L100,122 L120,106 L158,108 M100,122 L100,160" fill="none" stroke={fill} strokeWidth="16" />
        <path d="M42,108 L80,106 L100,122 L120,106 L158,108 M100,122 L100,160" fill="none" strokeWidth="2.5" />
        <circle cx="100" cy="112" r="20" fill={metal} />
        <text x="100" y="118" textAnchor="middle" fontSize="15" fontWeight="900" fill={accent} stroke="none" fontFamily="Zen Maru Gothic, sans-serif">
          先
        </text>
      </g>
    ),
    belt: (
      <g {...common}>
        <path d="M70,58 L146,46 A26,26 0 0,1 152,96 L80,148 A46,46 0 1,1 70,58 Z" fill="none" stroke={accent} strokeWidth="9" strokeDasharray="3 4" />
        <circle cx="72" cy="104" r="40" fill={metal} />
        <circle cx="72" cy="104" r="14" fill={`hsl(${hue} 60% 12%)`} />
        {ring(6, 26, 0).map(([x, y], i) => (
          <circle key={i} cx={x - 28} cy={y + 4} r="4" fill={fill} strokeWidth="2" />
        ))}
        <circle cx="146" cy="72" r="22" fill={fill} />
        <circle cx="146" cy="72" r="7" fill="#fff" stroke="none" />
        <circle cx="128" cy="128" r="13" fill={metal} />
      </g>
    ),
  }

  const svg = (
    <svg viewBox="0 0 200 200" className={bare ? className : 'h-full w-full'} aria-hidden>
      <defs>
        <linearGradient id={`f${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 95% 62%)`} />
          <stop offset="1" stopColor={`hsl(${h2} 90% 48%)`} />
        </linearGradient>
        <linearGradient id={`m${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 25% 78%)`} />
          <stop offset=".5" stopColor={`hsl(${hue} 18% 46%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 30% 26%)`} />
        </linearGradient>
        <radialGradient id={`g${uid}`} cx=".5" cy=".45" r=".6">
          <stop offset="0" stopColor={`hsl(${hue} 100% 60%)`} stopOpacity=".55" />
          <stop offset="1" stopColor={`hsl(${hue} 100% 60%)`} stopOpacity="0" />
        </radialGradient>
        <pattern id={`d${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill={`hsl(${hue} 100% 85%)`} opacity=".22" />
        </pattern>
        <filter id={`s${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor={`hsl(${hue} 100% 30%)`} floodOpacity=".55" />
        </filter>
      </defs>
      {!bare && (
        <>
          <rect width="200" height="200" fill={`url(#d${uid})`} />
          <circle cx="100" cy="96" r="92" fill={`url(#g${uid})`} />
          {label && (
            <text x="10" y="192" fontSize="22" fontWeight="900" fill={`hsl(${hue} 100% 85%)`} opacity=".12" fontFamily="Zen Maru Gothic, sans-serif">
              {label}
            </text>
          )}
        </>
      )}
      <g transform={transforms[variant % transforms.length]} filter={`url(#s${uid})`}>
        {parts[kind]}
      </g>
    </svg>
  )

  if (bare) return svg
  return <div className={cn('relative', className)}>{svg}</div>
}
