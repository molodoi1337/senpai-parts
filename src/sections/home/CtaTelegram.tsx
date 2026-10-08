import { useState } from 'react'
import { Send } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Mascot } from '@/components/art/Mascot'
import { toast } from '@/store/ui'

export function CtaTelegram() {
  const [email, setEmail] = useState('')
  return (
    <section className="py-12">
      <Container>
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-pink via-violet to-[#3b2bd6] p-6 text-white sm:p-12">
          <span aria-hidden className="halftone absolute inset-0 opacity-25 [mask-image:linear-gradient(90deg,transparent,black)]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-10 left-6 select-none font-jp text-[8rem] font-black text-white/10 sm:text-[12rem]">
            仲間
          </span>
          <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-jp text-sm font-bold tracking-[0.3em] text-white/80">ニュースレター</p>
              <h2 className="section-title mt-2 text-3xl sm:text-5xl">Залетай в тусовку сэмпаев</h2>
              <p className="mt-3 max-w-lg text-white/85">
                Закрытые дропы, промокоды раньше всех и мемы про 2JZ. Раз в неделю, без спама — честное слово кота-механика.
              </p>
              <form
                className="mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!/^\S+@\S+\.\S+$/.test(email)) {
                    toast({ title: 'Хм, это не похоже на e-mail', tone: 'error' })
                    return
                  }
                  setEmail('')
                  toast({ title: 'Ты в тусовке! 🎉', description: 'Лови промокод SENPAI10 на первый заказ', tone: 'kawaii' })
                }}
              >
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="твой@email.ru"
                  aria-label="E-mail"
                  className="h-12 flex-1 rounded-2xl border border-white/30 bg-white/15 px-4 font-semibold text-white outline-none placeholder:text-white/60 focus:border-white"
                />
                <button className="btn h-12 bg-white text-[#2a1840] hover:bg-white/90">
                  <Send size={17} /> Подписаться
                </button>
              </form>
            </div>
            <div className="relative mx-auto">
              <Mascot mood="love" className="h-48 w-48 animate-float drop-shadow-[0_20px_30px_rgba(0,0,0,.3)] sm:h-60 sm:w-60" />
              <span className="sticker absolute -left-4 top-6 -rotate-12">−10% 🎁</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
