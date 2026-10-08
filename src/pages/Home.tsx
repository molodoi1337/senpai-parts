import { Hero } from '@/sections/home/Hero'
import { BrandMarquee } from '@/sections/home/BrandMarquee'
import { CarMakes } from '@/sections/home/CarMakes'
import { CategoryBento } from '@/sections/home/CategoryBento'
import { HotDeals } from '@/sections/home/HotDeals'
import { Legends } from '@/sections/home/Legends'
import { MangaSteps } from '@/sections/home/MangaSteps'
import { WhyUs } from '@/sections/home/WhyUs'
import { Showcase } from '@/sections/home/Showcase'
import { Testimonials } from '@/sections/home/Testimonials'
import { BlogTeaser } from '@/sections/home/BlogTeaser'
import { CtaTelegram } from '@/sections/home/CtaTelegram'
import { usePageTitle } from '@/lib/hooks'

export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <BrandMarquee />
      <CategoryBento />
      <HotDeals />
      <CarMakes />
      <Legends />
      <WhyUs />
      <Showcase />
      <MangaSteps />
      <Testimonials />
      <BlogTeaser />
      <CtaTelegram />
    </>
  )
}
