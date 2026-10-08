import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { genById } from '@/data/cars'

export interface GarageCar {
  id: string
  genId: string
  engine?: string
  year?: number
  nickname?: string
  addedAt: number
}

interface GarageState {
  cars: GarageCar[]
  activeId: string | null
  add: (car: Omit<GarageCar, 'id' | 'addedAt'>) => GarageCar
  remove: (id: string) => void
  setActive: (id: string | null) => void
  rename: (id: string, nickname: string) => void
}

export const useGarage = create<GarageState>()(
  persist(
    (set, get) => ({
      cars: [],
      activeId: null,
      add: (car) => {
        const existing = get().cars.find((c) => c.genId === car.genId && c.engine === car.engine)
        if (existing) {
          set({ activeId: existing.id })
          return existing
        }
        const next: GarageCar = { ...car, id: Math.random().toString(36).slice(2, 10), addedAt: Date.now() }
        set((s) => ({ cars: [next, ...s.cars], activeId: next.id }))
        return next
      },
      remove: (id) =>
        set((s) => {
          const cars = s.cars.filter((c) => c.id !== id)
          return { cars, activeId: s.activeId === id ? (cars[0]?.id ?? null) : s.activeId }
        }),
      setActive: (id) => set({ activeId: id }),
      rename: (id, nickname) => set((s) => ({ cars: s.cars.map((c) => (c.id === id ? { ...c, nickname } : c)) })),
    }),
    { name: 'senpai-garage' },
  ),
)

/** Активная машина + её поколение (или null) */
export const useActiveCar = () => {
  const car = useGarage((s) => s.cars.find((c) => c.id === s.activeId) ?? null)
  return car ? { car, gen: genById[car.genId] } : null
}
