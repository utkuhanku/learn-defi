'use client'

import { use } from 'react'
import Link from 'next/link'
import { ChevronLeft, Lock } from 'lucide-react'
import { AppShell } from '@/components/ui/AppShell'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { GasComparator } from '@/components/tools/GasComparator'
import { PegTracker } from '@/components/tools/PegTracker'
import { HealthFactorCalc } from '@/components/tools/HealthFactorCalc'
import { ILSimulator } from '@/components/tools/ILSimulator'
import { AprApyCalc } from '@/components/tools/AprApyCalc'
import { useProgress } from '@/stores/useProgress'

const TOOLS: Record<string, React.ComponentType> = {
  'defi-basics': GasComparator,
  'stablecoins': PegTracker,
  'lending': HealthFactorCalc,
  'dex-swaps': ILSimulator,
  'yield': AprApyCalc,
}

const LESSON_COUNT = 5

export default function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const Tool = TOOLS[slug]
  const completedLessons = useProgress((s) => s.completedLessons)

  const lessonIds = Array.from(
    { length: LESSON_COUNT },
    (_, i) => `${slug}-${i + 1}`,
  )
  const completedCount = lessonIds.filter((id) => completedLessons[id]).length
  const allLessonsDone = completedCount === LESSON_COUNT

  return (
    <AppShell>
      <div className="px-5 py-6">
        <Link
          href={`/module/${slug}`}
          className="press mb-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-3)] transition-colors duration-150 hover:text-[var(--text)]"
        >
          <ChevronLeft size={16} />
          back to module
        </Link>

        {!Tool ? (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">tool coming soon</h2>
            <p className="mt-2 text-sm text-[var(--text-3)]">
              this interactive tool will be available in a future update.
            </p>
          </div>
        ) : !allLessonsDone ? (
          <div className="flex flex-col items-center px-2 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface)]">
              <Lock size={28} strokeWidth={1.5} className="text-[var(--text-3)]" />
            </div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">
              tool locked
            </h2>
            <p className="mt-2 max-w-xs text-sm text-[var(--text-3)]">
              complete all lessons in this module to unlock the tool
            </p>

            <div className="mt-8 w-full max-w-xs">
              <Progress
                value={(completedCount / LESSON_COUNT) * 100}
                size="md"
              />
              <p className="mt-2 text-xs tabular-nums text-[var(--text-4)]">
                {completedCount}/{LESSON_COUNT} lessons complete
              </p>
            </div>

            <Link href={`/module/${slug}`} className="mt-8 w-full max-w-xs">
              <Button variant="primary" className="w-full">
                back to lessons →
              </Button>
            </Link>
          </div>
        ) : (
          <Tool />
        )}
      </div>
    </AppShell>
  )
}
