'use client'

import { useEffect, useMemo } from 'react'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { AppShell } from '@/components/ui/AppShell'
import { PathNode, type PathStatus } from '@/components/learning/PathNode'
import { DailyGoal } from '@/components/gamification/DailyGoal'
import { getModules } from '@/lib/content'
import { useProgress, DAILY_GOAL } from '@/stores/useProgress'
import type { Module } from '@/lib/types'

const modules = getModules()

type NodeInfo = {
  module: Module
  status: PathStatus
  completedLessons: number
  totalLessons: number
  nextLessonId: string | null
}

function buildPath(
  modules: Module[],
  completedLessons: Record<string, number>,
  completedQuizzes: Record<string, { score: number; total: number; ts: number }>,
): NodeInfo[] {
  const nodes: NodeInfo[] = []
  let foundActive = false

  for (const mod of modules) {
    const lessonIds = Array.from(
      { length: mod.lessonCount },
      (_, i) => `${mod.id}-${i + 1}`,
    )
    const completed = lessonIds.filter((id) => completedLessons[id]).length
    const quizDone = !!completedQuizzes[mod.id]
    const fullyComplete = completed === mod.lessonCount && quizDone
    const nextLessonId = lessonIds.find((id) => !completedLessons[id]) ?? null

    let status: PathStatus

    if (mod.locked) {
      status = 'locked'
    } else if (fullyComplete) {
      status = 'completed'
    } else if (!foundActive && (completed > 0 || nodes.every((n) => n.status === 'completed'))) {
      status = 'active'
      foundActive = true
    } else if (!foundActive) {
      status = 'available'
      foundActive = true
    } else {
      status = 'locked'
    }

    nodes.push({
      module: mod,
      status,
      completedLessons: completed,
      totalLessons: mod.lessonCount,
      nextLessonId,
    })
  }

  return nodes
}

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit()
  const touchStreak = useProgress((s) => s.touchStreak)
  const completedLessons = useProgress((s) => s.completedLessons)
  const completedQuizzes = useProgress((s) => s.completedQuizzes)
  const dailyXp = useProgress((s) => s.dailyXp)

  useEffect(() => {
    if (!isMiniAppReady) setMiniAppReady()
  }, [setMiniAppReady, isMiniAppReady])

  useEffect(() => {
    touchStreak()
  }, [touchStreak])

  const nodes = useMemo(
    () => buildPath(modules, completedLessons, completedQuizzes),
    [completedLessons, completedQuizzes],
  )

  return (
    <AppShell>
      {/* hero */}
      <section className="px-6 pt-10 pb-10">
        <h1 className="hero-glow text-[44px] font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-6xl">
          defi,
          <br />
          demystified.
        </h1>
        <p className="mt-3 text-[15px] text-[var(--text-3)]">
          your defi journey
        </p>
      </section>

      {/* learning path */}
      <section className="px-5 pb-10">
        {nodes.map((node, i) => {
          const isLast = i === nodes.length - 1
          const nextNode = nodes[i + 1]
          const isConnected =
            !isLast &&
            (node.status === 'completed' || node.status === 'active') &&
            nextNode?.status !== 'locked'

          return (
            <div key={node.module.id}>
              <PathNode
                module={node.module}
                status={node.status}
                completedLessons={node.completedLessons}
                totalLessons={node.totalLessons}
                nextLessonId={node.nextLessonId}
              />
              {!isLast && (
                <div className="flex justify-center py-2">
                  <div
                    className={`h-8 ${
                      isConnected ? 'path-line' : 'path-line-locked'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* daily goal */}
      <section className="px-5 pb-10">
        <DailyGoal current={dailyXp} target={DAILY_GOAL} />
      </section>

      {/* footer */}
      <footer className="flex items-center justify-center gap-1.5 pb-6 text-xs text-[var(--text-4)]">
        <span>🟦 base</span>
      </footer>
    </AppShell>
  )
}
