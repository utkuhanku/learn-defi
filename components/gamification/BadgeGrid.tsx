'use client'

import {
  Wallet,
  BookOpen,
  Coins,
  Landmark,
  ArrowLeftRight,
  TrendingUp,
  Brain,
  Flame,
  Star,
  Trophy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type BadgeDef = {
  id: string
  label: string
  icon: LucideIcon
}

const BADGES: BadgeDef[] = [
  { id: 'first-wallet', label: 'first wallet', icon: Wallet },
  { id: 'defi-101', label: 'defi 101', icon: BookOpen },
  { id: 'stable-pilot', label: 'stable pilot', icon: Coins },
  { id: 'lender', label: 'lender', icon: Landmark },
  { id: 'swapper', label: 'swapper', icon: ArrowLeftRight },
  { id: 'farmer', label: 'farmer', icon: TrendingUp },
  { id: 'strategist', label: 'strategist', icon: Brain },
  { id: 'streak-7', label: '7-day streak', icon: Flame },
  { id: 'streak-30', label: '30-day streak', icon: Flame },
  { id: 'perfect-quiz', label: 'perfect quiz', icon: Star },
  { id: 'all-modules', label: 'all modules', icon: Trophy },
]

type Props = {
  earnedBadges: string[]
}

export function BadgeGrid({ earnedBadges }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {BADGES.map((badge) => {
        const earned = earnedBadges.includes(badge.id)
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-2 rounded-md p-3 ${
              earned
                ? 'bg-base-blue/10'
                : 'bg-gray-10 opacity-50 dark:bg-gray-80'
            }`}
          >
            <badge.icon
              size={24}
              strokeWidth={1.5}
              className={earned ? 'text-base-blue' : 'text-gray-30'}
            />
            <span className="text-center text-xs font-medium">
              {badge.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
