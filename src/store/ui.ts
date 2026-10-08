import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

interface UiState {
  theme: Theme
  sakura: boolean
  cartOpen: boolean
  searchOpen: boolean
  menuOpen: boolean
  garageOpen: boolean
  quickViewId: string | null
  toggleTheme: () => void
  toggleSakura: () => void
  setCartOpen: (v: boolean) => void
  setSearchOpen: (v: boolean) => void
  setMenuOpen: (v: boolean) => void
  setGarageOpen: (v: boolean) => void
  setQuickView: (id: string | null) => void
}

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sakura: true,
      cartOpen: false,
      searchOpen: false,
      menuOpen: false,
      garageOpen: false,
      quickViewId: null,
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSakura: () => set((s) => ({ sakura: !s.sakura })),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setMenuOpen: (menuOpen) => set({ menuOpen }),
      setGarageOpen: (garageOpen) => set({ garageOpen }),
      setQuickView: (quickViewId) => set({ quickViewId }),
    }),
    { name: 'senpai-ui', partialize: (s) => ({ theme: s.theme, sakura: s.sakura }) },
  ),
)

export interface Toast {
  id: number
  title: string
  description?: string
  tone?: 'default' | 'success' | 'error' | 'kawaii'
  action?: { label: string; to: string }
}

interface ToastState {
  toasts: Toast[]
  push: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

let toastId = 0

export const useToasts = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts.slice(-3), { ...t, id }] }))
    setTimeout(() => get().dismiss(id), 3800)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = (t: Omit<Toast, 'id'>) => useToasts.getState().push(t)
