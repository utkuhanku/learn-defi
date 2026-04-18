'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { BaseSquare } from '@/components/brand/BaseSquare'
import { Progress } from '@/components/ui/Progress'
import { useProgress } from '@/stores/useProgress'
import type { Module } from '@/lib/types'

type Props = {
  modules: Module[]
}

export function ModuleGrid({ modules }: Props) {
  const { completedLessons } = useProgress()

  return (
    <div className="grid grid-cols-2 gap-4">
      {modules.map((m) => {
        const completedCount = Array.from(
          { length: m.lessonCount },
          (_, i) => `${m.id}-${i + 1}`,
        ).filter((id) => completedLessons[id]).length
        const pct =
          m.lessonCount > 0 ? (completedCount / m.lessonCount) * 100 : 0

        const inner = (
          <div
            className={`glass press flex aspect-square flex-col justify-between rounded-md p-5 ${
              m.locked
                ? 'cursor-not-allowed opacity-30'
                : 'glass-hover cursor-pointer'
            }`}
          >
            <div className="flex items-start justify-between">
              <BaseSquare
                size={20}
                variant="current"
                className="text-white/40"
              />
              {m.locked && (
                <Lock
                  size={14}
                  strokeWidth={1.5}
                  className="text-[var(--text-dim)]"
                />
              )}
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium tracking-[-0.01em] text-white/80">
                {m.title}
              </span>
              {m.locked ? (
                <span className="block text-xs text-[var(--text-dim)]">
                  coming soon
                </span>
              ) : (
                <Progress value={pct} size="sm" />
              )}
            </div>
          </div>
        )

        if (m.locked) {
          return <div key={m.id}>{inner}</div>
        }
        return (
          <Link key={m.id} href={`/module/${m.id}`}>
            {inner}
          </Link>
        )
      })}
    </div>
  )
}
