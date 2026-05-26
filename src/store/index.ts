import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CalculationRecord, Entity, User } from '../types'

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  history: CalculationRecord[]
  addHistory: (record: Omit<CalculationRecord, 'id' | 'createdAt'>) => void
  removeHistory: (id: string) => void
  clearHistory: () => void
  entities: Entity[]
  addEntity: (entity: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEntity: (id: string, entity: Partial<Entity>) => void
  removeEntity: (id: string) => void
  selectedEntity: Entity | null
  setSelectedEntity: (entity: Entity | null) => void
}

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      history: [],
      entities: [],
      selectedEntity: null,

      setUser: (user) => set({ user }),

      addHistory: (record) => {
        const newRecord: CalculationRecord = {
          ...record,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ history: [newRecord, ...state.history] }))
      },

      removeHistory: (id) => {
        set((state) => ({ history: state.history.filter((h) => h.id !== id) }))
      },

      clearHistory: () => set({ history: [] }),

      addEntity: (entity) => {
        const newEntity: Entity = {
          ...entity,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ entities: [...state.entities, newEntity] }))
      },

      updateEntity: (id, entity) => {
        set((state) => ({
          entities: state.entities.map((e) =>
            e.id === id ? { ...e, ...entity, updatedAt: new Date().toISOString() } : e
          ),
        }))
      },

      removeEntity: (id) => {
        set((state) => ({ entities: state.entities.filter((e) => e.id !== id) }))
        if (get().selectedEntity?.id === id) {
          set({ selectedEntity: null })
        }
      },

      setSelectedEntity: (entity) => set({ selectedEntity: entity }),
    }),
    {
      name: 'tax-calculator-storage',
    }
  )
)
