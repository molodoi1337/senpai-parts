import { useCountdown } from '@/lib/hooks'

const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown({ target }: { target: number }) {
  const { h, m, s } = useCountdown(target)
  return (
    <div className="flex items-center gap-1.5 font-display" aria-label="До конца акции">
      {[
        [h, 'ч'],
        [m, 'м'],
        [s, 'с'],
      ].map(([v, l], i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="glass grid h-12 w-12 place-items-center rounded-xl text-xl font-extrabold tabular-nums">
            {pad(v as number)}
            <span className="sr-only">{l}</span>
          </span>
          {i < 2 && <span className="animate-[blink_1s_steps(1)_infinite] text-xl font-extrabold text-pink">:</span>}
        </span>
      ))}
    </div>
  )
}
