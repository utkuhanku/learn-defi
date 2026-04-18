'use client'

import Link from 'next/link'
import { Check, Lock, ChevronRight } from 'lucide-react'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Chip } from '@/components/ui/Chip'
import { LottieAnimation } from '@/components/ui/LottieAnimation'
import { ANIMATIONS } from '@/lib/animations'
import type { Module } from '@/lib/types'

const EMOJI: Record<string, string> = {
  'defi-basics': '📚',
  'stablecoins': '💵',
  'lending': '🏦',
  'dex-swaps': '🔄',
  'yield': '🌾',
  'advanced': '🧠',
}

export type PathStatus = 'active' | 'completed' | 'available' | 'locked'

type Props = {
  module: Module
  status: PathStatus
  completedLessons: number
  totalLessons: number
  nextLessonId?: string | null
}

export function PathNode({
  module: mod,
  status,
  completedLessons,
  totalLessons,
  nextLessonId,
}: Props) {
  const emoji = EMOJI[mod.id] ?? '📦'
  const pct = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // ACTIVE — big card with progress ring + continue button
  if (status === 'active') {
    const continueHref = nextLessonId
      ? `/module/${mod.id}/lesson/${nextLessonId}`
      : `/module/${mod.id}`

    return (
      <div className="relative rounded-2xl bg-[var(--surface)] p-6">
        {/* left accent bar */}
        <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full bg-base-blue" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-[32px] leading-none">{emoji}</div>
            <h3 className="mt-3 text-xl font-bold tracking-[-0.02em]">
              {mod.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-3)]">
              {completedLessons}/{totalLessons} lessons
            </p>
          </div>
          <ProgressRing value={pct} size={56} strokeWidth={5} />
        </div>

        <Link href={continueHref} className="mt-5 block">
          <button className="press animate-soft-pulse w-full cursor-pointer rounded-xl bg-base-blue py-3 text-[15px] font-semibold tracking-[-0.01em] text-white transition-colors duration-150 hover:brightness-110 hover:animate-none">
            {completedLessons > 0
              ? `continue · lesson ${completedLessons + 1}`
              : 'start →'}
          </button>
        </Link>
      </div>
    )
  }

  // COMPLETED — muted with check
  if (status === 'completed') {
    return (
      <Link href={`/module/${mod.id}`}>
        <div className="press flex cursor-pointer items-center gap-4 rounded-2xl bg-base-blue/5 p-5 transition-colors duration-150 hover:bg-base-blue/10">
          <div className="text-[28px] leading-none">{emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold tracking-[-0.01em]">
                {mod.title}
              </p>
              <div className="h-6 w-6">
                <LottieAnimation
                  src={ANIMATIONS.checkmark}
                  loop={false}
                  className="h-full w-full"
                  fallback={<Check size={16} className="text-green" />}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--text-3)]">
              {totalLessons}/{totalLessons} lessons
            </p>
          </div>
          <Chip variant="green">
            <Check size={10} className="mr-1" />
            done
          </Chip>
        </div>
      </Link>
    )
  }

  // AVAILABLE — next up, smaller card
  if (status === 'available') {
    return (
      <Link href={`/module/${mod.id}`}>
        <div className="press flex cursor-pointer items-center gap-4 rounded-2xl bg-[var(--surface)] p-5 transition-colors duration-150 hover:bg-[var(--surface-2)]">
          <div className="text-[28px] leading-none">{emoji}</div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold tracking-[-0.01em]">
              {mod.title}
            </p>
            <p className="text-xs text-[var(--text-3)]">
              0/{totalLessons} lessons
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-base-blue">
            start
            <ChevronRight size={14} />
          </span>
        </div>
      </Link>
    )
  }

  // LOCKED
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[var(--surface)] p-5 opacity-40">
      <div className="grayscale text-[28px] leading-none">{emoji}</div>
      <div className="flex-1">
        <p className="text-[15px] font-semibold tracking-[-0.01em]">
          {mod.title}
        </p>
        <p className="text-xs text-[var(--text-3)]">
          {mod.locked ? 'coming soon' : 'complete previous to unlock'}
        </p>
      </div>
      <Lock size={16} className="text-[var(--text-3)]" />
    </div>
  )
}
