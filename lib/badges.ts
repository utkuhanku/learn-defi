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
  Award,
  type LucideIcon,
} from 'lucide-react'

export type BadgeDef = {
  id: string
  label: string
  /** Lucide icon OR emoji string */
  icon: LucideIcon | string
  description?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

export const BADGES: BadgeDef[] = [
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
  {
    id: 'supporter',
    label: 'supporter',
    icon: Award,
    description: 'Tipped the dev to support DeFi education',
    rarity: 'rare',
  },
]
