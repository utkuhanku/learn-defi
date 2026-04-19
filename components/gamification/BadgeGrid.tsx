'use client'

import { BADGES } from '@/lib/badges'

type Props = {
  earnedBadges: string[]
}

export function BadgeGrid({ earnedBadges }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {BADGES.map((badge) => {
        const earned = earnedBadges.includes(badge.id)
        const isEmoji = typeof badge.icon === 'string'
        const Icon = isEmoji ? null : badge.icon

        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-2 rounded-xl bg-[var(--surface)] p-4 ${
              earned ? '' : 'opacity-20'
            }`}
          >
            {isEmoji ? (
              <span className="text-[22px] leading-none">
                {badge.icon as string}
              </span>
            ) : Icon ? (
              <Icon
                size={22}
                strokeWidth={1.75}
                className={earned ? 'text-base-blue' : 'text-white/40'}
              />
            ) : null}
            <span className="text-center text-[10px] font-semibold leading-tight tracking-[-0.01em]">
              {badge.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
