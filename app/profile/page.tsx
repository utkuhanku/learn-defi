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
      <div className="px-5 py-8">
        {/* user identity */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          {pfpUrl ? (
            <img
              src={pfpUrl}
              alt=""
              className="h-[72px] w-[72px] rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--surface)] ring-2 ring-white/10">
              <User size={32} strokeWidth={1.5} className="text-[var(--text-3)]" />
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-bold tracking-[-0.02em]">
              {displayName ?? 'guest'}
            </p>
            <Chip variant="blue">{levelTitle}</Chip>
          </div>
        </div>

        {/* XP & level */}
        <div className="mb-10 rounded-xl bg-[var(--surface)] p-6">
          <div className="flex items-baseline justify-between">
            <span className="label">experience</span>
            <div className="flex items-baseline gap-1">
              <NumberTicker
                value={xp}
                className="text-5xl font-bold tracking-[-0.03em]"
              />
              <span className="text-sm text-[var(--text-3)]">XP</span>
            </div>
          </div>
          <div className="mt-4">
            <Progress
              value={nextThreshold ? (xpInLevel / xpForLevel) * 100 : 100}
              size="md"
            />
            <p className="mt-2 text-xs text-[var(--text-3)]">
              {nextThreshold
                ? `${xpInLevel} / ${xpForLevel} XP to level ${level + 1}`
                : 'max level reached'}
            </p>
          </div>
        </div>

        {/* streak */}
        <div className="mb-10">
          <p className="label mb-5 px-1">streak</p>
          <div className="flex justify-center rounded-xl bg-[var(--surface)] py-8">
            <StreakRing current={streak.current} longest={streak.longest} />
          </div>
        </div>

        {/* badges */}
        <div className="mb-10">
          <p className="label mb-4 px-1">badges</p>
          <BadgeGrid earnedBadges={earnedBadges} />
        </div>

        {/* stats */}
        <div>
          <p className="label mb-4 px-1">stats</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'lessons', value: lessonCount },
              { label: 'quizzes', value: quizCount },
              { label: 'tools', value: toolCount },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 rounded-xl bg-[var(--surface)] py-5"
              >
                <p className="text-3xl font-bold tracking-[-0.02em] text-white">
                  {s.value}
                </p>
                <p className="text-xs text-[var(--text-3)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
