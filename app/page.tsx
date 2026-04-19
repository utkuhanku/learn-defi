'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { AppShell } from '@/components/ui/AppShell'
import { PathNode, type PathStatus } from '@/components/learning/PathNode'
import { DailyGoal } from '@/components/gamification/DailyGoal'
import { TipModal } from '@/components/tip/TipModal'
import { getModules } from '@/lib/content'
import { getGreeting } from '@/lib/greeting'
import { useProgress, DAILY_GOAL } from '@/stores/useProgress'
import type { Module } from '@/lib/types'

const modules = getModules()

type FarcasterUser = {
  fid?: number
  username?: string
  displayName?: string
  pfpUrl?: string
}

type MiniKitCtx = {
  user?: FarcasterUser
  location?: string
}

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
  const { setMiniAppReady, isMiniAppReady, context } = useMiniKit()
  const touchStreak = useProgress((s) => s.touchStreak)
  const completedLessons = useProgress((s) => s.completedLessons)
  const completedQuizzes = useProgress((s) => s.completedQuizzes)
  const dailyXp = useProgress((s) => s.dailyXp)
  const level = useProgress((s) => s.level)
  const levelTitle = useProgress((s) => s.levelTitle)
  const [tipOpen, setTipOpen] = useState(false)

  useEffect(() => {
    if (!isMiniAppReady) setMiniAppReady()
  }, [setMiniAppReady, isMiniAppReady])

  useEffect(() => {
    touchStreak()
  }, [touchStreak])

  // Location-aware entry — log for analytics (v1.2 will personalize flows)
  useEffect(() => {
    const ctx = context as MiniKitCtx | null
    const loc = ctx?.location
    if (loc) console.log('[mini-app] launched from:', loc)
  }, [context])

  const nodes = useMemo(
    () => buildPath(modules, completedLessons, completedQuizzes),
    [completedLessons, completedQuizzes],
  )

  const ctx = context as MiniKitCtx | null
  const user = ctx?.user
  const hasUser = !!(user?.displayName || user?.username)

  return (
    <AppShell>
      {/* personalized hero when we have user context */}
      {hasUser ? (
        <section className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            {user?.pfpUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.pfpUrl}
                alt={user.displayName ?? user.username ?? ''}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-xl">
                👋
              </div>
            )}
            <div className="flex-1">
              <div className="text-xs text-[var(--text-3)]">{getGreeting()}</div>
              <div className="text-lg font-bold tracking-[-0.02em]">
                {user?.displayName ?? user?.username}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--text-3)]">lvl {level}</div>
              <div className="text-xs font-semibold text-base-blue">
                {levelTitle.toLowerCase()}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-6 pt-10 pb-6">
          <h1 className="hero-glow text-[44px] font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-6xl">
            defi,
            <br />
            demystified.
          </h1>
          <p className="mt-3 text-[15px] text-[var(--text-3)]">
            your defi journey
          </p>
        </section>
      )}

      {/* learning path */}
      <section className="px-5 pt-4 pb-10">
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
      <section className="px-5 pb-6">
        <DailyGoal current={dailyXp} target={DAILY_GOAL} />
      </section>

      {/* subtle tip CTA — smaller than profile version */}
      <section className="px-4 pb-6">
        <button
          onClick={() => setTipOpen(true)}
          className="press flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-[var(--surface)] px-4 py-3 text-left transition-colors duration-150 hover:bg-[var(--surface-2)]"
        >
          <span className="text-xl leading-none">☕</span>
          <div className="flex-1">
            <div className="text-sm font-semibold">enjoying the app?</div>
            <div className="text-xs text-[var(--text-3)]">
              tip the dev on base
            </div>
          </div>
          <span className="text-[var(--text-4)]">→</span>
        </button>
      </section>

      {/* footer */}
      <footer className="flex items-center justify-center gap-1.5 pb-6 text-xs text-[var(--text-4)]">
        <span>🟦 base</span>
      </footer>

      <TipModal open={tipOpen} onClose={() => setTipOpen(false)} />
    </AppShell>
  )
}
