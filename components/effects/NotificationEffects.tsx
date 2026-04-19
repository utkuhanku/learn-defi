'use client'

import { useEffect, useRef } from 'react'
import { useMiniKit, useNotification } from '@coinbase/onchainkit/minikit'
import { useProgress } from '@/stores/useProgress'

const STREAK_MILESTONES = [7, 30, 100, 365]

/**
 * Listens to progress store changes and fires celebration notifications
 * for level-up, badge unlock, and streak milestones. No-render component.
 * Only active when the user has added the frame (`context.client.added`).
 */
export function NotificationEffects() {
  const { context } = useMiniKit()
  const added =
    (context?.client as { added?: boolean } | undefined)?.added ?? false
  const sendNotification = useNotification()

  const level = useProgress((s) => s.level)
  const earnedBadges = useProgress((s) => s.earnedBadges)
  const streak = useProgress((s) => s.streak.current)

  const prevLevel = useRef<number | null>(null)
  const prevBadges = useRef<string[] | null>(null)
  const prevStreak = useRef<number | null>(null)

  // Level up
  useEffect(() => {
    if (!added) return
    if (prevLevel.current === null) {
      prevLevel.current = level
      return
    }
    if (level > prevLevel.current) {
      sendNotification({
        title: `level ${level} unlocked 🎉`,
        body: `keep going — new content awaits`,
      }).catch((err) => console.error('[notif-effects] level:', err))
    }
    prevLevel.current = level
  }, [level, added, sendNotification])

  // Badge unlock
  useEffect(() => {
    if (!added) return
    if (prevBadges.current === null) {
      prevBadges.current = earnedBadges
      return
    }
    const newBadges = earnedBadges.filter(
      (b) => !prevBadges.current!.includes(b),
    )
    if (newBadges.length > 0) {
      const first = newBadges[0]
      sendNotification({
        title: `new badge: ${first} 🏅`,
        body: `open learn defi to see it`,
      }).catch((err) => console.error('[notif-effects] badge:', err))
    }
    prevBadges.current = earnedBadges
  }, [earnedBadges, added, sendNotification])

  // Streak milestone
  useEffect(() => {
    if (!added) return
    if (prevStreak.current === null) {
      prevStreak.current = streak
      return
    }
    if (
      streak > prevStreak.current &&
      STREAK_MILESTONES.includes(streak)
    ) {
      sendNotification({
        title: `${streak}-day streak 🔥`,
        body: `you're on fire — don't break it now`,
      }).catch((err) => console.error('[notif-effects] streak:', err))
    }
    prevStreak.current = streak
  }, [streak, added, sendNotification])

  return null
}
