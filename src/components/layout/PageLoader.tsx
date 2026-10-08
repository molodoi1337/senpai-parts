import { Mascot } from '@/components/art/Mascot'

export function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <Mascot className="h-20 w-20 animate-wiggle" />
        <p className="font-jp text-sm font-bold tracking-[0.3em] text-muted">ロード中…</p>
      </div>
    </div>
  )
}
