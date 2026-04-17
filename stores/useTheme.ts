import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeState = {
  theme: 'system' | 'light' | 'dark'
  setTheme: (t: 'system' | 'light' | 'dark') => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'learndefi-theme' },
  ),
)
