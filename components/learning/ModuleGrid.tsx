'use client'

import Link from 'next/link'
import { useProgress } from '@/stores/useProgress'
import { Progress } from '@/components/ui/Progress'
import type { Module } from '@/lib/types'

const EMOJI: Record<string, string> = {
  'defi-basics': '📚',
  'stablecoins': '💵',
  'lending': '🏦',
  'dex-swaps': '🔄',
  'yield': '🌾',
  'advanced': '🧠',
}

type Props = {
  modules: Module[]
}

export function ModuleGrid({ modules }: Props) {
  const { completedLessons } = useProgress()

  return (
    <div className="grid grid-cols-2 gap-3">
      {modules.map((m) => {
        const completedCount = Array.from(
          { length: m.lessonCount },
          (_, i) => `${m.id}-${i + 1}`,
        ).filter((id) => completedLessons[id]).length
        const pct =
          m.lessonCount > 0 ? (completedCount / m.lessonCount) * 100 : 0

        const emoji = EMOJI[m.id] ?? '📦'

        const inner = (
          <div
            className={`flex h-full flex-col justify-between rounded-xl bg-[var(--surface)] p-5 ${
              m.locked
                ? 'cursor-not-allowed opacity-30'
                : 'press cursor-pointer transition-colors duration-150 hover:bg-[var(--surface-2)]'
            }`}
          >
            <div className="text-[28px] leading-none">{emoji}</div>
            <div className="mt-8 space-y-2">
              <p className="text-sm font-semibold tracking-[-0.01em] text-white">
                {m.title}
              </p>
              <p className="text-xs text-[var(--text-3)]">
                {m.locked ? 'coming soon' : `${m.lessonCount} lessons`}
              </p>
              {!m.locked && (
                <div className="flex items-center gap-2">
                  <Progress value={pct} size="sm" className="flex-1" />
                  <span className="text-[10px] font-semibold tabular-nums text-[var(--text-3)]">
                    {Math.round(pct)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )

        if (m.locked) {
          return <div key={m.id}>{inner}</div>
        }
        return (
          <Link key={m.id} href={`/module/${m.id}`} className="block">
            {inner}
          </Link>
        )
      })}
    </div>
  )
}
