import { useUi } from '@/store/ui'
import { SakuraCanvas } from './SakuraCanvas'

const noise =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")"

/** Фон всего приложения: ночное небо, «живые» неоновые пятна, сетка, зерно и сакура */
export function Background() {
  const sakura = useUi((s) => s.sakura)
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% -10%, var(--bg-1) 0%, var(--bg-0) 55%), radial-gradient(80% 60% at 100% 100%, var(--bg-2) 0%, transparent 70%)',
          }}
        />
        <div className="animate-blob absolute -left-[10vw] -top-[10vh] h-[55vh] w-[55vh] rounded-full opacity-40 blur-[110px]" style={{ background: 'var(--blob-a)' }} />
        <div className="animate-blob absolute right-[-12vw] top-[20vh] h-[60vh] w-[60vh] rounded-full opacity-35 blur-[120px] [animation-delay:-7s]" style={{ background: 'var(--blob-b)' }} />
        <div className="animate-blob absolute bottom-[-20vh] left-[30vw] h-[50vh] w-[50vh] rounded-full opacity-25 blur-[120px] [animation-delay:-14s]" style={{ background: 'var(--blob-c)' }} />
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: noise }} />
      </div>
      {sakura && <SakuraCanvas />}
    </>
  )
}
