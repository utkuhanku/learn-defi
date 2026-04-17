import type { Module, LessonFile, Quiz } from '@/lib/types'
import modulesData from '@/content/en/modules.json'

export function getModules(): Module[] {
  return modulesData as Module[]
}

const LESSON_LOADERS: Record<string, () => Promise<{ default: LessonFile }>> = {
  'defi-basics': () => import('@/content/en/lessons/defi-basics.json') as Promise<{ default: LessonFile }>,
}

const QUIZ_LOADERS: Record<string, () => Promise<{ default: Quiz }>> = {
  'defi-basics': () => import('@/content/en/quizzes/defi-basics.json') as Promise<{ default: Quiz }>,
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
