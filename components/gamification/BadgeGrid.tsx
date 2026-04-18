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
            className={`glass flex flex-col items-center gap-2 rounded-md p-4 ${
              earned ? '' : 'opacity-30'
            }`}
            style={
              earned
                ? {
                    boxShadow:
                      '0 0 16px rgba(0, 0, 255, 0.08), inset 0 0 0 1px rgba(0, 0, 255, 0.15)',
                    background: 'rgba(0, 0, 255, 0.04)',
                  }
                : undefined
            }
          >
            <badge.icon
              size={22}
              strokeWidth={1.5}
              className={earned ? 'text-base-blue' : 'text-white/40'}
            />
            <span className="text-center text-[10px] font-medium leading-tight tracking-[-0.01em]">
              {badge.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
