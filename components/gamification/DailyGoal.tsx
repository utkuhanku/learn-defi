'use client'

import { Target } from 'lucide-react'
import { Progress } from '@/components/ui/Progress'
import { Chip } from '@/components/ui/Chip'

type Props = {
  current: number
  target: number
  className?: string
}

export function DailyGoal({ current, target, className = '' }: Props) {
  const reached = current >= target
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0

  return (
    <div className={`rounded-xl bg-[var(--surface)] p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-[var(--text-3)]" />
          <span className="label">daily goal</span>
        </div>
        {reached && <Chip variant="green">🎯 goal reached</Chip>}
      </div>
      <Progress value={pct} size="md" />
      <p className="mt-2 text-xs text-[var(--text-3)] tabular-nums">
        {current} / {target} XP today
      </p>
    </div>
  )
}
