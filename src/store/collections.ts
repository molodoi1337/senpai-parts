import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IdSet {
  ids: string[]
  toggle: (id: string) => boolean
  remove: (id: string) => void
  clear: () => void
}

export const useWishlist = create<IdSet>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id)
        set({ ids: has ? get().ids.filter((x) => x !== id) : [id, ...get().ids] })
        return !has
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'senpai-wishlist' },
  ),
)

export const COMPARE_LIMIT = 4

export const useCompare = create<IdSet>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id)
        if (has) {
          set({ ids: get().ids.filter((x) => x !== id) })
          return false
        }
        set({ ids: [...get().ids, id].slice(-COMPARE_LIMIT) })
        return true
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'senpai-compare' },
  ),
)

interface Recent {
  ids: string[]
  push: (id: string) => void
}

export const useRecent = create<Recent>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 12) })),
    }),
    { name: 'senpai-recent' },
  ),
)
