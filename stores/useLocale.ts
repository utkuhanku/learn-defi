import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type LocaleState = {
  locale: 'en' | 'tr'
  setLocale: (l: 'en' | 'tr') => void
}

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'learndefi-locale' },
  ),
)
