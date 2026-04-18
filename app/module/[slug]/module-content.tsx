'use client'

import Link from 'next/link'
import { ChevronRight, HelpCircle, Wrench, Lock } from 'lucide-react'
import { AppShell } from '@/components/ui/AppShell'
import { ProgressRing } from '@/components/ui/ProgressRing'
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
      <div className="px-5 py-8">
        {/* header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <h1 className="text-4xl font-bold tracking-[-0.03em] text-white">
              {mod.title}
            </h1>
            <p className="text-[15px] leading-relaxed text-[var(--text-2)]">
              {mod.description}
            </p>
            <p className="text-xs font-semibold tabular-nums text-[var(--text-3)]">
              {completedCount}/{lessons.length} lessons
            </p>
          </div>
          <ProgressRing value={progressPct} size={64} strokeWidth={5} />
        </div>

        {/* lessons */}
        <div className="mb-10">
          <p className="label mb-3 px-1">lessons</p>
          <div className="overflow-hidden rounded-xl bg-[var(--surface)]">
            {lessons.map((lesson, i) => {
              const done = !!completedLessons[lesson.id]
              return (
                <Link
                  key={lesson.id}
                  href={`/module/${mod.id}/lesson/${lesson.id}`}
                >
                  <div
                    className={`press flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-[var(--surface-2)] ${
                      i < lessons.length - 1
                        ? 'border-b border-[var(--border)]'
                        : ''
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tracking-[-0.01em] ${
                        done
                          ? 'bg-base-blue text-white'
                          : 'border border-white/10 text-[var(--text-3)]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-[15px] font-medium tracking-[-0.01em]">
                      {lesson.title}
                    </span>
                    <ChevronRight size={16} className="text-[var(--text-4)]" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* quiz + tool */}
        <p className="label mb-3 px-1">challenge</p>
        <div className="overflow-hidden rounded-xl bg-[var(--surface)]">
          {allLessonsDone ? (
            <Link href={`/module/${mod.id}/quiz`}>
              <div className="press flex cursor-pointer items-center gap-4 border-b border-[var(--border)] px-5 py-4 transition-colors duration-150 hover:bg-[var(--surface-2)]">
                <HelpCircle size={20} className="shrink-0 text-base-blue" />
                <span className="flex-1 text-[15px] font-medium tracking-[-0.01em]">
                  {quizDone ? 'retake quiz' : 'take the quiz'}
                </span>
                <ChevronRight size={16} className="text-[var(--text-4)]" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 border-b border-[var(--border)] px-5 py-4 opacity-40">
              <Lock size={18} className="shrink-0 text-[var(--text-3)]" />
              <span className="flex-1 text-[15px] text-[var(--text-3)]">
                complete all lessons to unlock
              </span>
            </div>
          )}

          <Link href={`/module/${mod.id}/tool`}>
            <div className="press flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-[var(--surface-2)]">
              <Wrench size={20} className="shrink-0 text-base-blue" />
              <span className="flex-1 text-[15px] font-medium tracking-[-0.01em]">
                {TOOL_NAMES[mod.id] ?? 'interactive tool'}
              </span>
              <ChevronRight size={16} className="text-[var(--text-4)]" />
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
