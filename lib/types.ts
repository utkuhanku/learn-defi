export type LessonCard =
  | { type: 'text'; heading: string; body: string }
  | {
      type: 'comparison'
      left: { label: string; items: string[] }
      right: { label: string; items: string[] }
    }
  | { type: 'highlight'; emoji: string; text: string }

export type Lesson = {
  id: string
  title: string
  order: number
  cards: LessonCard[]
}

export type LessonFile = {
  moduleId: string
  lessons: Lesson[]
}

export type QuizQuestion = {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

export type Quiz = {
  moduleId: string
  questions: QuizQuestion[]
}

export type Module = {
  id: string
  title: string
  description: string
  order: number
  lessonCount: number
  icon: string
  locked?: boolean
}
