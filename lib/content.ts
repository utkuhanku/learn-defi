import type { Module, LessonFile, Quiz } from '@/lib/types'
import modulesData from '@/content/en/modules.json'

export function getModules(): Module[] {
  return modulesData as Module[]
}

const LESSON_LOADERS: Record<string, () => Promise<{ default: LessonFile }>> = {
  'defi-basics': () => import('@/content/en/lessons/defi-basics.json') as Promise<{ default: LessonFile }>,
  'stablecoins': () => import('@/content/en/lessons/stablecoins.json') as Promise<{ default: LessonFile }>,
  'lending': () => import('@/content/en/lessons/lending.json') as Promise<{ default: LessonFile }>,
  'dex-swaps': () => import('@/content/en/lessons/dex-swaps.json') as Promise<{ default: LessonFile }>,
  'yield': () => import('@/content/en/lessons/yield.json') as Promise<{ default: LessonFile }>,
}

const QUIZ_LOADERS: Record<string, () => Promise<{ default: Quiz }>> = {
  'defi-basics': () => import('@/content/en/quizzes/defi-basics.json') as Promise<{ default: Quiz }>,
  'stablecoins': () => import('@/content/en/quizzes/stablecoins.json') as Promise<{ default: Quiz }>,
  'lending': () => import('@/content/en/quizzes/lending.json') as Promise<{ default: Quiz }>,
  'dex-swaps': () => import('@/content/en/quizzes/dex-swaps.json') as Promise<{ default: Quiz }>,
  'yield': () => import('@/content/en/quizzes/yield.json') as Promise<{ default: Quiz }>,
}

export async function getLessons(moduleId: string) {
  const loader = LESSON_LOADERS[moduleId]
  if (!loader) return []
  const data = await loader()
  return data.default.lessons
}

export async function getQuiz(moduleId: string) {
  const loader = QUIZ_LOADERS[moduleId]
  if (!loader) return null
  const data = await loader()
  return data.default
}
