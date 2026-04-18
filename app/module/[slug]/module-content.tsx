'use client'

import Link from 'next/link'
import { Check, HelpCircle, Wrench, Lock } from 'lucide-react'
import { AppShell } from '@/components/ui/AppShell'
import { Progress } from '@/components/ui/Progress'
import { useProgress } from '@/stores/useProgress'
import type { Module, Lesson } from '@/lib/types'

const TOOL_NAMES: Record<string, string> = {
  'defi-basics': 'gas cost comparator',
  'stablecoins': 'stablecoin peg tracker',
  'lending': 'health factor calculator',
  'dex-swaps': 'impermanent loss simulator',
  'yield': 'APR → APY calculator',
}

type Props = {
  module: Module
  lessons: Lesson[]
}

export function ModuleContent({ module: mod, lessons }: Props) {
  const { completedLessons, completedQuizzes } = useProgress()

  const completedCount = lessons.filter((l) => completedLessons[l.id]).length
  const allLessonsDone = completedCount === lessons.length
  const quizDone = !!completedQuizzes[mod.id]
  const progressPct =
    lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

  return (
    <AppShell>
      <div className="px-4 py-8">
        {/* header */}
        <div className="mb-10 space-y-4">
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">{mod.title}</h1>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {mod.description}
          </p>
          <Progress value={progressPct} size="md" />
          <p className="text-xs text-[var(--text-dim)]">
            {completedCount}/{lessons.length} lessons complete
          </p>
        </div>

        {/* lesson list */}
        <div className="mb-10 space-y-3">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
            lessons
          </h2>
          {lessons.map((lesson, i) => {
            const done = !!completedLessons[lesson.id]
            return (
              <Link
                key={lesson.id}
                href={`/module/${mod.id}/lesson/${lesson.id}`}
              >
                <div className="glass glass-hover press flex cursor-pointer items-center justify-between rounded-md p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold tracking-[-0.01em] ${
                        done
                          ? 'bg-base-blue/15 text-base-blue'
                          : 'border border-white/10 text-white/60'
                      }`}
                      style={
                        done
                          ? { boxShadow: '0 0 8px rgba(0,0,255,0.25)' }
                          : undefined
                      }
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium tracking-[-0.01em]">
                      {lesson.title}
                    </span>
                  </div>
                  {done && <Check size={16} className="text-base-blue" />}
                </div>
              </Link>
            )
          })}
        </div>

        {/* quiz */}
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
            quiz
          </h2>
          {allLessonsDone ? (
            <Link href={`/module/${mod.id}/quiz`}>
              <div className="glass glass-hover press flex cursor-pointer items-center gap-3 rounded-md p-4">
                <HelpCircle size={20} className="text-base-blue" />
                <span className="text-sm font-medium tracking-[-0.01em]">
                  {quizDone ? 'retake quiz' : 'take the quiz'}
                </span>
                {quizDone && <Check size={16} className="ml-auto text-base-blue" />}
              </div>
            </Link>
          ) : (
            <div className="glass flex items-center gap-3 rounded-md p-4 opacity-40">
              <Lock size={18} className="text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-muted)]">
                complete all lessons to unlock
              </span>
            </div>
          )}
        </div>

        {/* tool */}
        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
            tool
          </h2>
          <Link href={`/module/${mod.id}/tool`}>
            <div className="glass glass-hover press flex cursor-pointer items-center gap-3 rounded-md p-4">
              <Wrench size={20} className="text-base-blue" />
              <span className="text-sm font-medium tracking-[-0.01em]">
                {TOOL_NAMES[mod.id] ?? 'interactive tool'}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
