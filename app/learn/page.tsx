'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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
      <div className="px-5 py-8">
        {active && (
          <div className="mb-10">
            <p className="label mb-3 px-1">continue</p>
            <div className="rounded-xl bg-[var(--surface)] p-6">
              <h3 className="text-2xl font-bold tracking-[-0.02em]">
                {active.mod.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-3)]">
                lesson {active.completed + 1} of {active.mod.lessonCount}
              </p>
              <div className="mt-4">
                <Progress
                  value={(active.completed / active.mod.lessonCount) * 100}
                  size="md"
                />
              </div>
              <Link
                href={`/module/${active.mod.id}/lesson/${active.nextLesson}`}
                className="mt-5 block"
              >
                <Button className="w-full">continue →</Button>
              </Link>
            </div>
          </div>
        )}

        <p className="label mb-3 px-1">your modules</p>
        <div className="overflow-hidden rounded-xl bg-[var(--surface)]">
          {modules.map((mod, i) => {
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
                <div
                  className={`press flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-[var(--surface-2)] ${
                    i < modules.length - 1
                      ? 'border-b border-[var(--border)]'
                      : ''
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-[15px] font-medium tracking-[-0.01em]">
                      {mod.title}
                    </p>
                    <p className="text-xs text-[var(--text-3)]">
                      {completed}/{mod.lessonCount} lessons
                    </p>
                  </div>
                  <div className="w-16">
                    <Progress value={pct} size="sm" />
                  </div>
                  <ChevronRight size={16} className="text-[var(--text-4)]" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
