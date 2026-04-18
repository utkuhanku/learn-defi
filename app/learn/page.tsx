'use client'

import Link from 'next/link'
import { AppShell } from '@/components/ui/AppShell'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { useProgress } from '@/stores/useProgress'
import { getModules } from '@/lib/content'
import type { Module } from '@/lib/types'

const modules = getModules().filter((m) => !m.locked)

function useActiveModule(modules: Module[]) {
  const { completedLessons } = useProgress()

  for (const mod of modules) {
    const lessonIds = Array.from(
      { length: mod.lessonCount },
      (_, i) => `${mod.id}-${i + 1}`,
    )
    const completed = lessonIds.filter((id) => completedLessons[id]).length
    if (completed > 0 && completed < mod.lessonCount) {
      const nextLesson = lessonIds.find((id) => !completedLessons[id])!
      return { mod, completed, nextLesson }
    }
  }

  for (const mod of modules) {
    const lessonIds = Array.from(
      { length: mod.lessonCount },
      (_, i) => `${mod.id}-${i + 1}`,
    )
    const completed = lessonIds.filter((id) => completedLessons[id]).length
    if (completed < mod.lessonCount) {
      const nextLesson = lessonIds.find((id) => !completedLessons[id])!
      return { mod, completed, nextLesson }
    }
  }

  return null
}

export default function LearnPage() {
  const { completedLessons } = useProgress()
  const active = useActiveModule(modules)

  return (
    <AppShell>
      <div className="px-4 py-8">
        {/* continue section */}
        {active && (
          <div className="mb-10">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
              continue
            </h2>
            <div className="glass space-y-5 rounded-md p-5">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">
                  {active.mod.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  lesson {active.completed + 1} of {active.mod.lessonCount}
                </p>
              </div>
              <Progress
                value={(active.completed / active.mod.lessonCount) * 100}
                size="md"
              />
              <Link
                href={`/module/${active.mod.id}/lesson/${active.nextLesson}`}
              >
                <Button className="w-full">continue →</Button>
              </Link>
            </div>
          </div>
        )}

        {/* all modules */}
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
          your modules
        </h2>
        <div className="space-y-3">
          {modules.map((mod) => {
            const lessonIds = Array.from(
              { length: mod.lessonCount },
              (_, i) => `${mod.id}-${i + 1}`,
            )
            const completed = lessonIds.filter(
              (id) => completedLessons[id],
            ).length
            const pct =
              mod.lessonCount > 0 ? (completed / mod.lessonCount) * 100 : 0

            return (
              <Link key={mod.id} href={`/module/${mod.id}`}>
                <div className="glass glass-hover press flex cursor-pointer items-center gap-4 rounded-md p-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium tracking-[-0.01em]">
                      {mod.title}
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">
                      {completed}/{mod.lessonCount} lessons
                    </p>
                  </div>
                  <div className="w-20">
                    <Progress value={pct} size="sm" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
