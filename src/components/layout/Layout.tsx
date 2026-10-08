import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Background } from './Background'
import { AnnouncementBar } from './AnnouncementBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'
import { MobileMenu } from './MobileMenu'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CommandPalette } from '@/components/search/CommandPalette'
import { GarageModal } from '@/components/garage/GarageModal'
import { QuickView } from '@/components/product/QuickView'
import { Toaster } from '@/components/ui/Toaster'
import { PageLoader } from './PageLoader'
import { useUi } from '@/store/ui'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function ThemeSync() {
  const theme = useUi((s) => s.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0d0820' : '#fff3f9')
  }, [theme])
  return null
}

export function Layout() {
  return (
    <>
      <ThemeSync />
      <ScrollToTop />
      <Background />
      <div className="relative z-[2] flex min-h-dvh flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <BottomNav />
      <MobileMenu />
      <CartDrawer />
      <CommandPalette />
      <GarageModal />
      <QuickView />
      <Toaster />
    </>
  )
}
