'use client'

import { User } from 'lucide-react'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { AppShell } from '@/components/ui/AppShell'
import { Progress } from '@/components/ui/Progress'
import { Chip } from '@/components/ui/Chip'
import { NumberTicker } from '@/components/ui/NumberTicker'
import { StreakRing } from '@/components/gamification/StreakRing'
import { BadgeGrid } from '@/components/gamification/BadgeGrid'
import { useProgress, LEVEL_THRESHOLDS } from '@/stores/useProgress'

export default function ProfilePage() {
  const { context } = useMiniKit()
  const {
    xp,
    level,
    levelTitle,
    streak,
    earnedBadges,
    completedLessons,
    completedQuizzes,
    toolsUsed,
  } = useProgress()

  const user = context?.user as
    | { displayName?: string; pfpUrl?: string }
    | undefined
  const displayName = user?.displayName ?? null
  const pfpUrl = user?.pfpUrl ?? null

  const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === level)
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === level + 1)
  const xpInLevel = nextThreshold ? xp - (currentThreshold?.xp ?? 0) : xp
  const xpForLevel = nextThreshold
    ? nextThreshold.xp - (currentThreshold?.xp ?? 0)
    : 1

  const lessonCount = Object.keys(completedLessons).length
  const quizCount = Object.keys(completedQuizzes).length
  const toolCount = toolsUsed.length

  return (
    <AppShell>
      <div className="px-4 py-8">
        {/* user identity */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          {pfpUrl ? (
            <img
              src={pfpUrl}
              alt=""
              className="h-20 w-20 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="glass flex h-20 w-20 items-center justify-center rounded-full">
              <User size={36} strokeWidth={1.5} className="text-white/50" />
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-semibold tracking-[-0.02em]">
              {displayName ?? 'guest'}
            </p>
            <Chip variant="blue">{levelTitle}</Chip>
          </div>
        </div>

        {/* XP & level */}
        <div className="mb-10 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
              experience
            </span>
            <div className="flex items-baseline gap-1">
              <NumberTicker
                value={xp}
                className="text-4xl font-bold tracking-[-0.02em]"
              />
              <span className="text-sm text-[var(--text-muted)]">XP</span>
            </div>
          </div>
          <Progress
            value={nextThreshold ? (xpInLevel / xpForLevel) * 100 : 100}
            size="md"
          />
          <p className="text-xs text-[var(--text-dim)]">
            {nextThreshold
              ? `${xpInLevel} / ${xpForLevel} XP to level ${level + 1}`
              : 'max level reached'}
          </p>
        </div>

        {/* streak */}
        <div className="mb-10">
          <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
            streak
          </h2>
          <div className="flex justify-center">
            <StreakRing current={streak.current} longest={streak.longest} />
          </div>
        </div>

        {/* badges */}
        <div className="mb-10">
          <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
            badges
          </h2>
          <BadgeGrid earnedBadges={earnedBadges} />
        </div>

        {/* stats */}
        <div>
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
            stats
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'lessons', value: lessonCount },
              { label: 'quizzes', value: quizCount },
              { label: 'tools', value: toolCount },
            ].map((s) => (
              <div
                key={s.label}
                className="glass flex flex-col items-center gap-1 rounded-md p-4"
              >
                <p className="text-2xl font-bold tracking-[-0.02em] text-white">
                  {s.value}
                </p>
                <p className="text-xs text-[var(--text-dim)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
