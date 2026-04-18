'use client'

import { User } from 'lucide-react'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { AppShell } from '@/components/ui/AppShell'
import { Progress } from '@/components/ui/Progress'
import { Chip } from '@/components/ui/Chip'
import { NumberTicker } from '@/components/ui/NumberTicker'
import { Card } from '@/components/ui/Card'
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
      <div className="px-4 py-6">
        {/* user identity */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {pfpUrl ? (
            <img
              src={pfpUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-10 dark:bg-gray-80">
              <User size={32} strokeWidth={1.5} className="text-gray-50" />
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">
              {displayName ?? 'guest'}
            </p>
            <Chip variant="blue">{levelTitle}</Chip>
          </div>
        </div>

        {/* XP & level */}
        <div className="mb-8 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[var(--text-muted)]">experience</span>
            <div className="flex items-baseline gap-1">
              <NumberTicker value={xp} className="text-2xl font-bold" />
              <span className="text-sm text-[var(--text-muted)]">XP</span>
            </div>
          </div>
          <Progress
            value={nextThreshold ? (xpInLevel / xpForLevel) * 100 : 100}
            size="md"
          />
          <p className="text-xs text-[var(--text-muted)]">
            {nextThreshold
              ? `${xpInLevel} / ${xpForLevel} XP to level ${level + 1}`
              : 'max level reached'}
          </p>
        </div>

        {/* streak */}
        <div className="mb-8 flex flex-col items-center">
          <h2 className="mb-4 self-start text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
            streak
          </h2>
          <StreakRing
            current={streak.current}
            longest={streak.longest}
          />
        </div>

        {/* badges */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
            badges
          </h2>
          <BadgeGrid earnedBadges={earnedBadges} />
        </div>

        {/* stats */}
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
            stats
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Card variant="surface" className="text-center">
              <p className="text-2xl font-bold">{lessonCount}</p>
              <p className="text-xs text-[var(--text-muted)]">lessons</p>
            </Card>
            <Card variant="surface" className="text-center">
              <p className="text-2xl font-bold">{quizCount}</p>
              <p className="text-xs text-[var(--text-muted)]">quizzes</p>
            </Card>
            <Card variant="surface" className="text-center">
              <p className="text-2xl font-bold">{toolCount}</p>
              <p className="text-xs text-[var(--text-muted)]">tools</p>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
