import { create } from 'zustand'

interface StreakState {
  streak: number
  setStreak: (streak: number) => void
  incrementStreak: () => void
  resetStreak: () => void
}

export const useStreakStore = create<StreakState>((set) => ({
  streak: 1,
  setStreak: (streak) => set({ streak }),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  resetStreak: () => set({ streak: 0 }),
}))