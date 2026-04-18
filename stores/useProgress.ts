import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'Novice' },
  { level: 2, xp: 100, title: 'Curious' },
  { level: 3, xp: 300, title: 'Explorer' },
  { level: 4, xp: 700, title: 'Trader' },
  { level: 5, xp: 1300, title: 'Strategist' },
  { level: 6, xp: 2000, title: 'Onchain Native' },
] as const

export const DAILY_GOAL = 100

export type LevelInfo = (typeof LEVEL_THRESHOLDS)[number]

function computeLevel(xp: number): LevelInfo {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) return LEVEL_THRESHOLDS[i]
  }
  return LEVEL_THRESHOLDS[0]
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

type ProgressState = {
  xp: number
  level: number
  levelTitle: string
  completedLessons: Record<string, number>
  completedQuizzes: Record<string, { score: number; total: number; ts: number }>
  earnedBadges: string[]
  lastEarnedBadge: string | null
  streak: { current: number; longest: number; lastDayISO: string }
  toolsUsed: string[]
  dailyXp: number
  lastDailyReset: string

  addXp: (amount: number) => void
  completeLesson: (lessonId: string) => void
  submitQuiz: (quizId: string, score: number, total: number) => void
  earnBadge: (badgeId: string) => void
  clearLastBadge: () => void
  touchStreak: () => void
  markToolUsed: (toolId: string) => void
  reset: () => void
}

const INITIAL: Pick<
  ProgressState,
  'xp' | 'level' | 'levelTitle' | 'completedLessons' | 'completedQuizzes' | 'earnedBadges' | 'lastEarnedBadge' | 'streak' | 'toolsUsed' | 'dailyXp' | 'lastDailyReset'
> = {
  xp: 0,
  level: 1,
  levelTitle: 'Novice',
  completedLessons: {},
  completedQuizzes: {},
  earnedBadges: [],
  lastEarnedBadge: null,
  streak: { current: 0, longest: 0, lastDayISO: '' },
  toolsUsed: [],
  dailyXp: 0,
  lastDailyReset: '',
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...INITIAL,

      addXp: (amount) =>
        set((s) => {
          const xp = s.xp + amount
          const info = computeLevel(xp)
          const today = todayISO()
          const dailyXp =
            s.lastDailyReset === today ? s.dailyXp + amount : amount
          return {
            xp,
            level: info.level,
            levelTitle: info.title,
            dailyXp,
            lastDailyReset: today,
          }
        }),

      completeLesson: (lessonId) =>
        set((s) => {
          if (s.completedLessons[lessonId]) return s
          return {
            completedLessons: { ...s.completedLessons, [lessonId]: Date.now() },
          }
        }),

      submitQuiz: (quizId, score, total) =>
        set((s) => ({
          completedQuizzes: {
            ...s.completedQuizzes,
            [quizId]: { score, total, ts: Date.now() },
          },
        })),

      earnBadge: (badgeId) =>
        set((s) => {
          if (s.earnedBadges.includes(badgeId)) return s
          return {
            earnedBadges: [...s.earnedBadges, badgeId],
            lastEarnedBadge: badgeId,
          }
        }),

      clearLastBadge: () => set({ lastEarnedBadge: null }),

      touchStreak: () =>
        set((s) => {
          const today = todayISO()
          // daily XP reset check (runs on every app load)
          const dailyXpUpdate =
            s.lastDailyReset === today
              ? {}
              : { dailyXp: 0, lastDailyReset: today }

          if (s.streak.lastDayISO === today) {
            return { ...dailyXpUpdate }
          }
          if (s.streak.lastDayISO === yesterdayISO()) {
            const current = s.streak.current + 1
            return {
              streak: {
                current,
                longest: Math.max(current, s.streak.longest),
                lastDayISO: today,
              },
              ...dailyXpUpdate,
            }
          }
          return {
            streak: {
              current: 1,
              longest: Math.max(1, s.streak.longest),
              lastDayISO: today,
            },
            ...dailyXpUpdate,
          }
        }),

      markToolUsed: (toolId) =>
        set((s) => {
          if (s.toolsUsed.includes(toolId)) return s
          return { toolsUsed: [...s.toolsUsed, toolId] }
        }),

      reset: () => set(INITIAL),
    }),
    { name: 'learndefi-progress' },
  ),
)

export { LEVEL_THRESHOLDS }
