import { useId } from 'react'
import type { CarShape } from '@/data/cars'
import { cn } from '@/lib/utils'

interface ShapeDef {
  body: string
  glass: string
  pillar?: number
  wheels: [number, number]
  wy: number
  wr: number
  head: [number, number]
  tail: [number, number]
}

const shapes: Record<CarShape, ShapeDef> = {
  coupe: {
    body: 'M22 112 L20 98 Q22 86 40 82 L120 72 Q150 48 190 42 L250 42 Q290 46 322 66 L368 74 Q382 78 380 92 L378 112 L346 112 A30 30 0 0 0 286 112 L120 112 A30 30 0 0 0 60 112 Z',
    glass: 'M134 72 Q160 53 192 48 L248 48 Q278 51 304 67 Z',
    pillar: 230,
    wheels: [90, 316],
    wy: 112,
    wr: 24,
    head: [30, 88],
    tail: [372, 84],
  },
  sedan: {
    body: 'M22 114 L20 98 Q22 88 40 85 L112 78 Q140 52 178 46 L262 46 Q292 50 314 72 L370 76 Q382 80 380 96 L378 114 L346 114 A30 30 0 0 0 286 114 L120 114 A30 30 0 0 0 60 114 Z',
    glass: 'M126 77 Q151 57 181 52 L259 52 Q284 55 300 73 Z',
    pillar: 218,
    wheels: [90, 316],
    wy: 114,
    wr: 24,
    head: [30, 91],
    tail: [372, 86],
  },
  hatch: {
    body: 'M26 114 L24 98 Q26 88 44 85 L108 78 Q138 50 178 44 L300 42 Q336 44 352 70 L366 82 Q374 88 372 100 L370 114 L344 114 A30 30 0 0 0 284 114 L118 114 A30 30 0 0 0 58 114 Z',
    glass: 'M122 77 Q148 55 180 50 L296 48 Q324 50 338 72 Z',
    pillar: 226,
    wheels: [88, 314],
    wy: 114,
    wr: 24,
    head: [34, 91],
    tail: [364, 88],
  },
  suv: {
    body: 'M22 116 L20 92 Q22 76 42 72 L104 66 Q128 36 160 30 L318 28 Q352 30 362 56 L372 70 Q380 76 378 92 L376 116 L346 116 A32 32 0 0 0 282 116 L122 116 A32 32 0 0 0 58 116 Z',
    glass: 'M118 66 Q140 41 164 36 L314 34 Q338 36 348 60 L350 66 Z',
    pillar: 236,
    wheels: [90, 314],
    wy: 116,
    wr: 27,
    head: [30, 80],
    tail: [372, 76],
  },
  roadster: {
    body: 'M22 112 L20 98 Q22 86 40 82 L148 72 L250 72 Q262 62 280 62 L300 66 L368 74 Q382 78 380 92 L378 112 L346 112 A30 30 0 0 0 286 112 L120 112 A30 30 0 0 0 60 112 Z',
    glass: 'M150 72 L180 46 L186 47 L166 72 Z',
    wheels: [90, 316],
    wy: 112,
    wr: 24,
    head: [30, 88],
    tail: [372, 84],
  },
}

interface Props {
  shape: CarShape
  hue?: number
  className?: string
  plate?: string
  glow?: boolean
}

/** Боковой силуэт машины в неоновом стиле */
export function CarSilhouette({ shape, hue = 330, className, plate, glow = true }: Props) {
  const uid = useId().replace(/:/g, '')
  const s = shapes[shape]
  const ground = s.wy + s.wr

  return (
    <svg viewBox="0 0 400 160" className={cn('w-full', className)} aria-hidden>
      <defs>
        <linearGradient id={`b${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 95% 66%)`} />
          <stop offset=".55" stopColor={`hsl(${(hue + 30) % 360} 85% 48%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 50) % 360} 80% 26%)`} />
        </linearGradient>
        <linearGradient id={`w${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9f3ff" stopOpacity=".85" />
          <stop offset=".45" stopColor="#1a1036" stopOpacity=".9" />
          <stop offset="1" stopColor="#3b2a6e" stopOpacity=".9" />
        </linearGradient>
        <radialGradient id={`h${uid}`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset=".4" stopColor="#bff6ff" stopOpacity=".8" />
          <stop offset="1" stopColor="#3de8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`t${uid}`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset=".35" stopColor="#ff3d6e" />
          <stop offset="1" stopColor="#ff3d6e" stopOpacity="0" />
        </radialGradient>
        <filter id={`n${uid}`} x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="200" cy={ground + 2} rx="190" ry="9" fill="#000" opacity=".35" />
      {glow && <ellipse cx="200" cy={ground} rx="170" ry="5" fill={`hsl(${hue} 100% 65%)`} opacity=".5" filter={`url(#n${uid})`} />}

      <path d={s.body} fill={`url(#b${uid})`} stroke={`hsl(${hue} 100% 85%)`} strokeWidth="2.5" strokeLinejoin="round" filter={glow ? `url(#n${uid})` : undefined} />
      <path d={s.glass} fill={`url(#w${uid})`} stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" />
      {s.pillar && <line x1={s.pillar} x2={s.pillar - 4} y1={s.wy - 70} y2={s.wy - 38} stroke={`hsl(${hue} 80% 30%)`} strokeWidth="6" />}

      {/* линия дверей и порога */}
      <path d={`M${s.wheels[0] + 36} ${s.wy - 12} L${s.wheels[1] - 36} ${s.wy - 12}`} stroke="#000" strokeOpacity=".25" strokeWidth="3" />
      <path d={`M${s.wheels[0] + 40} ${s.wy - 34} Q200 ${s.wy - 40} ${s.wheels[1] - 40} ${s.wy - 36}`} stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none" />

      <circle cx={s.head[0]} cy={s.head[1]} r="16" fill={`url(#h${uid})`} />
      <circle cx={s.tail[0]} cy={s.tail[1]} r="13" fill={`url(#t${uid})`} />

      {s.wheels.map((x) => (
        <g key={x}>
          <circle cx={x} cy={s.wy} r={s.wr} fill="#0b0716" stroke={`hsl(${hue} 100% 85%)`} strokeOpacity=".5" strokeWidth="2" />
          <circle cx={x} cy={s.wy} r={s.wr * 0.66} fill="#cfd6ec" />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const r = (a * Math.PI) / 180
            return (
              <line
                key={a}
                x1={x}
                y1={s.wy}
                x2={x + Math.cos(r) * s.wr * 0.62}
                y2={s.wy + Math.sin(r) * s.wr * 0.62}
                stroke={`hsl(${hue} 70% 35%)`}
                strokeWidth="4"
                strokeLinecap="round"
              />
            )
          })}
          <circle cx={x} cy={s.wy} r={s.wr * 0.2} fill={`hsl(${hue} 100% 60%)`} />
        </g>
      ))}

      {plate && (
        <g transform={`translate(${s.tail[0] - 30} ${s.wy - 22})`}>
          <rect width="28" height="12" rx="2" fill="#fff" stroke="#1d1035" strokeWidth="1" />
          <text x="14" y="9" textAnchor="middle" fontSize="7" fontWeight="800" fill="#1d1035" fontFamily="Unbounded, sans-serif">
            {plate}
          </text>
        </g>
      )}
    </svg>
  )
}
