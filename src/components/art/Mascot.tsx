import { cn } from '@/lib/utils'

type Mood = 'happy' | 'wink' | 'dizzy' | 'love'

/** Нэко-сэнсэй — кот-механик, маскот магазина */
export function Mascot({ mood = 'happy', className }: { mood?: Mood; className?: string }) {
  const ink = '#2a1840'
  const eyes = {
    happy: (
      <>
        <ellipse cx="76" cy="98" rx="11" ry="14" fill={ink} />
        <ellipse cx="124" cy="98" rx="11" ry="14" fill={ink} />
        <ellipse cx="76" cy="103" rx="8" ry="8" fill="#ff4fa3" opacity=".7" />
        <ellipse cx="124" cy="103" rx="8" ry="8" fill="#8f72ff" opacity=".7" />
        <circle cx="80" cy="92" r="4.5" fill="#fff" />
        <circle cx="128" cy="92" r="4.5" fill="#fff" />
        <circle cx="72" cy="104" r="2" fill="#fff" />
        <circle cx="120" cy="104" r="2" fill="#fff" />
      </>
    ),
    wink: (
      <>
        <ellipse cx="76" cy="98" rx="11" ry="14" fill={ink} />
        <ellipse cx="76" cy="103" rx="8" ry="8" fill="#ff4fa3" opacity=".7" />
        <circle cx="80" cy="92" r="4.5" fill="#fff" />
        <path d="M112,100 Q124,88 136,100" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
        <path d="M150,70 l6,-6 M156,78 l9,-2" stroke="#ffd84d" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
    dizzy: (
      <>
        <path d="M66,90 L86,106 M86,90 L66,106" stroke={ink} strokeWidth="5" strokeLinecap="round" />
        <path d="M114,90 L134,106 M134,90 L114,106" stroke={ink} strokeWidth="5" strokeLinecap="round" />
        <path d="M150,48 q8,-10 16,0 t16,0" fill="none" stroke="#3de8ff" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    love: (
      <>
        <path d="M76,108 l-11,-11 a7,7 0 0,1 11,-8 a7,7 0 0,1 11,8 z" fill="#ff4fa3" stroke={ink} strokeWidth="2.5" />
        <path d="M124,108 l-11,-11 a7,7 0 0,1 11,-8 a7,7 0 0,1 11,8 z" fill="#ff4fa3" stroke={ink} strokeWidth="2.5" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 200 200" className={cn('select-none', className)} aria-hidden>
      {/* уши */}
      <path d="M48,74 L58,20 L98,52 Z" fill="#fff7fb" stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M152,74 L142,20 L102,52 Z" fill="#fff7fb" stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M60,62 L64,34 L84,52 Z" fill="#ffb3d6" />
      <path d="M140,62 L136,34 L116,52 Z" fill="#ffb3d6" />
      {/* голова */}
      <ellipse cx="100" cy="100" rx="64" ry="54" fill="#fff7fb" stroke={ink} strokeWidth="4.5" />
      {/* хачимаки */}
      <path d="M38,80 Q100,56 162,80 L160,92 Q100,70 40,92 Z" fill="#ff4fa3" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="100" cy="74" r="7" fill="#fff" stroke={ink} strokeWidth="2.5" />
      <circle cx="100" cy="74" r="3.5" fill="#ff3d6e" />
      <path d="M160,84 Q178,76 188,88 Q176,90 172,98 Q168,88 160,90" fill="#ff4fa3" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      {eyes[mood]}
      {/* щёчки */}
      <ellipse cx="58" cy="118" rx="10" ry="6" fill="#ff7eb9" opacity=".55" />
      <ellipse cx="142" cy="118" rx="10" ry="6" fill="#ff7eb9" opacity=".55" />
      {/* рот ω */}
      <path d="M90,118 q5,7 10,0 q5,7 10,0" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M97,112 L103,112 L100,115 Z" fill="#ff7eb9" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
      {/* усы */}
      <path d="M34,108 L56,112 M34,122 L56,120 M166,108 L144,112 M166,122 L144,120" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      {/* лапа с ключом */}
      <g transform="rotate(-28 150 160)">
        <rect x="140" y="112" width="14" height="72" rx="5" fill="#cfd6ec" stroke={ink} strokeWidth="3.5" />
        <path d="M134,112 a14,14 0 1,1 26,0 l-6,0 l0,-8 l-14,0 l0,8 z" fill="#cfd6ec" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
      <ellipse cx="138" cy="160" rx="16" ry="13" fill="#fff7fb" stroke={ink} strokeWidth="4" />
      <path d="M130,154 L130,164 M138,152 L138,166 M146,154 L146,164" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <ellipse cx="66" cy="160" rx="16" ry="13" fill="#fff7fb" stroke={ink} strokeWidth="4" />
      <circle cx="66" cy="162" r="4" fill="#ffb3d6" />
    </svg>
  )
}
