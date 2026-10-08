import { useEffect, useRef } from 'react'

interface Petal {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  rot: number
  vr: number
  flip: number
  vf: number
  hue: number
}

/** Падающие лепестки сакуры на canvas. Лёгкий, ставится на паузу во вкладке в фоне */
export function SakuraCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const count = w < 640 ? 14 : 26
    const spawn = (initial: boolean): Petal => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20,
      r: 5 + Math.random() * 7,
      vx: -0.3 + Math.random() * 0.9,
      vy: 0.35 + Math.random() * 0.8,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI,
      vf: 0.02 + Math.random() * 0.03,
      hue: 330 + Math.random() * 20,
    })
    const petals = Array.from({ length: count }, () => spawn(true))

    const draw = (p: Petal) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2)
      const g = ctx.createLinearGradient(0, -p.r, 0, p.r)
      g.addColorStop(0, `hsla(${p.hue}, 100%, 92%, .95)`)
      g.addColorStop(1, `hsla(${p.hue}, 90%, 72%, .85)`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(0, -p.r)
      ctx.bezierCurveTo(p.r, -p.r, p.r, p.r * 0.6, 0, p.r)
      ctx.bezierCurveTo(-p.r, p.r * 0.6, -p.r, -p.r, 0, -p.r)
      ctx.fill()
      ctx.restore()
    }

    let t = 0
    const tick = () => {
      t += 1
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        p.x += p.vx + Math.sin((t + i * 40) / 90) * 0.4
        p.y += p.vy
        p.rot += p.vr
        p.flip += p.vf
        if (p.y > h + 20 || p.x < -30 || p.x > w + 30) petals[i] = spawn(false)
        draw(p)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[1] opacity-80" />
}
