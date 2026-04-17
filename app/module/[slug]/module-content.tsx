'use client'

import Link from 'next/link'
import { Check, HelpCircle, Wrench } from 'lucide-react'
import { AppShell } from '@/components/ui/AppShell'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { useProgress } from '@/stores/useProgress'
import type { Module, Lesson } from '@/lib/types'

type Props = {
  module: Module
  lessons: Lesson[]
}

export function ModuleContent({ module: mod, lessons }: Props) {
  const { completedLessons, completedQuizzes } = useProgress()

  const completedCount = lessons.filter(
    (l) => completedLessons[l.id],
  ).length
  const allLessonsDone = completedCount === lessons.length
  const quizDone = !!completedQuizzes[mod.id]
  const progressPct =
    lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

  return (
    <AppShell>
      <div className="px-4 py-6">
        {/* header */}
        <div className="mb-6 space-y-3">
          <h1 className="text-2xl font-semibold">{mod.title}</h1>
          <p className="text-sm text-[var(--text-muted)]">{mod.description}</p>
          <Progress value={progressPct} size="md" />
          <p className="text-xs text-[var(--text-muted)]">
            {completedCount}/{lessons.length} lessons
          </p>
        </div>

        {/* lesson list */}
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
            lessons
          </h2>
          {lessons.map((lesson, i) => {
            const done = !!completedLessons[lesson.id]
            return (
              <Link
                key={lesson.id}
                href={`/module/${mod.id}/lesson/${lesson.id}`}
              >
                <Card
                  hoverable
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-10 text-xs font-semibold dark:bg-gray-80">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{lesson.title}</span>
                  </div>
                  {done && (
                    <Check size={16} className="text-green" />
                  )}
                </Card>
              </Link>
            )
          })}
        </div>

        {/* quiz */}
        <div className="mb-3">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
            quiz
          </h2>
          {allLessonsDone ? (
            <Link href={`/module/${mod.id}/quiz`}>
              <Card hoverable className="flex items-center gap-3">
                <HelpCircle size={20} className="text-base-blue" />
                <span className="text-sm font-medium">
                  {quizDone ? 'retake quiz' : 'take the quiz'}
                </span>
                {quizDone && <Check size={16} className="ml-auto text-green" />}
              </Card>
            </Link>
          ) : (
            <Card className="flex items-center gap-3 opacity-50">
              <HelpCircle size={20} className="text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-muted)]">
                complete all lessons to unlock
              </span>
            </Card>
          )}
        </div>

        {/* tool */}
        <div>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
            tool
          </h2>
          <Link href={`/module/${mod.id}/tool`}>
            <Card hoverable className="flex items-center gap-3">
              <Wrench size={20} className="text-base-blue" />
              <span className="text-sm font-medium">gas cost comparator</span>
            </Card>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
