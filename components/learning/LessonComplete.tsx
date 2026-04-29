'use client'

import { useEffect, useState } from 'react'
import { X, BookOpen, Zap, Check, Trophy } from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/Progress'
import { Chip } from '@/components/ui/Chip'
import { LottieAnimation } from '@/components/ui/LottieAnimation'
import { ANIMATIONS } from '@/lib/animations'
import { useProgress, DAILY_GOAL } from '@/stores/useProgress'

type LessonStats = {
  type: 'lesson'
  xpEarned: number
  totalCards: number
  moduleSlug: string
  lessonTitle: string
}

type QuizStats = {
  type: 'quiz'
  xpEarned: number
  score: number
  total: number
  accuracy: number
  isPerfect: boolean
  moduleSlug: string
}

type Props = {
  stats: LessonStats | QuizStats
  onContinue: () => void
}

const CONFETTI_COLORS = ['#0000ff', '#ffd12f', '#66c800', '#fea8cd', '#ffffff']

export function LessonComplete({ stats, onContinue }: Props) {
  const dailyXp = useProgress((s) => s.dailyXp)
  const lastEarnedBadge = useProgress((s) => s.lastEarnedBadge)
  const clearLastBadge = useProgress((s) => s.clearLastBadge)
  const dailyPct = Math.min((dailyXp / DAILY_GOAL) * 100, 100)

  const isQuiz = stats.type === 'quiz'
  const isPerfect = isQuiz && stats.isPerfect
  const heading = isQuiz ? 'quiz complete!' : 'lesson complete!'
  const subtitle = isQuiz ? 'great work' : stats.lessonTitle

  // Generate confetti particles once on mount.
  // useState lazy init runs only on first render — react-hooks/purity allows
  // impure calls here (vs. during render body or useMemo).
  const [confetti] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 2}s`,
      size: `${4 + Math.random() * 6}px`,
    })),
  )

  // Auto-clear badge popup after 3s
  useEffect(() => {
    if (!lastEarnedBadge) return
    const timer = setTimeout(() => clearLastBadge(), 3000)
    return () => clearTimeout(timer)
  }, [lastEarnedBadge, clearLastBadge])

  const statCards = isQuiz
    ? [
        { label: 'score', value: `${stats.score}/${stats.total}`, icon: Check, color: 'text-green' },
        { label: 'XP', value: `+${stats.xpEarned}`, icon: Zap, color: 'text-yellow' },
        { label: 'accuracy', value: `${stats.accuracy}%`, icon: Trophy, color: 'text-base-blue' },
      ]
    : [
        { label: 'cards', value: `${stats.totalCards}`, icon: BookOpen, color: 'text-white' },
        { label: 'XP', value: `+${stats.xpEarned}`, icon: Zap, color: 'text-yellow' },
        { label: 'done', value: '100%', icon: Check, color: 'text-green' },
      ]

  // Staggered delays for stat cards (per spec: 0.3s / 0.45s / 0.6s)
  const statDelays = ['0.3s', '0.45s', '0.6s']

  const heroAnimation = isPerfect ? ANIMATIONS.confetti : ANIMATIONS.celebration
  const heroEmoji = isPerfect ? '🏆' : '🎉'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]">
      {/* confetti rain */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-particle"
          style={{
            left: c.left,
            backgroundColor: c.color,
            animationDelay: c.delay,
            animationDuration: c.duration,
            width: c.size,
            height: c.size,
          }}
        />
      ))}

      {/* close */}
      <div className="flex justify-end p-5">
        <button
          onClick={onContinue}
          aria-label="close"
          className="press cursor-pointer rounded-full bg-[var(--surface)] p-2 text-[var(--text-3)] transition-colors duration-150 hover:text-[var(--text)]"
        >
          <X size={18} />
        </button>
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* hero animation */}
        <div className="mb-2 h-40 w-40">
          <LottieAnimation
            src={heroAnimation}
            loop={false}
            className="h-full w-full"
            fallback={
              <div className="animate-celebrate flex h-full w-full items-center justify-center text-7xl">
                {heroEmoji}
              </div>
            }
          />
        </div>

        <h1
          className="animate-celebrate text-4xl font-bold tracking-[-0.03em]"
          style={{ animationDelay: '0.1s' }}
        >
          {heading}
        </h1>
        <p
          className="mt-2 animate-celebrate text-[15px] text-[var(--text-3)]"
          style={{ animationDelay: '0.15s' }}
        >
          {subtitle}
        </p>

        {isPerfect && (
          <div
            className="mt-3 flex animate-celebrate items-center gap-2"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="h-8 w-8">
              <LottieAnimation
                src={ANIMATIONS.star}
                loop={false}
                className="h-full w-full"
                fallback={<span className="text-2xl">⭐</span>}
              />
            </div>
            <Chip variant="yellow">perfect score!</Chip>
          </div>
        )}

        {/* stat cards — staggered */}
        <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-3">
          {statCards.map((s, i) => {
            const Icon = s.icon
            const isXpCard = s.label === 'XP'
            return (
              <div
                key={s.label}
                className="animate-slide-up flex flex-col items-center gap-2 rounded-xl bg-[var(--surface)] p-4 opacity-0"
                style={{ animationDelay: statDelays[i] }}
              >
                {isXpCard ? (
                  <div className="h-[18px] w-[18px]">
                    <LottieAnimation
                      src={ANIMATIONS.coin}
                      loop
                      className="h-full w-full"
                      fallback={<Icon size={18} className={s.color} strokeWidth={2} />}
                    />
                  </div>
                ) : (
                  <Icon size={18} className={s.color} strokeWidth={2} />
                )}
                <p className="text-xl font-bold tracking-[-0.02em]">{s.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-4)]">
                  {s.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* badge popup */}
        {lastEarnedBadge && (
          <div
            className="animate-celebrate mt-6 flex flex-col items-center gap-1"
            style={{ animationDelay: '0.7s' }}
          >
            <div className="h-16 w-16">
              <LottieAnimation
                src={ANIMATIONS.trophy}
                loop={false}
                className="h-full w-full"
                fallback={<span className="text-5xl">🏅</span>}
              />
            </div>
            <p className="text-sm font-semibold text-yellow">
              🏅 badge unlocked: {lastEarnedBadge}
            </p>
          </div>
        )}

        {/* daily goal */}
        <div className="mt-8 w-full max-w-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="label">daily goal</span>
            <span className="text-xs tabular-nums text-[var(--text-3)]">
              {dailyXp}/{DAILY_GOAL} XP
            </span>
          </div>
          <Progress value={dailyPct} size="md" />
        </div>
      </div>

      {/* CTA */}
      <div className="p-5 pb-8">
        <Link
          href={`/module/${stats.moduleSlug}`}
          onClick={onContinue}
          className="block"
        >
          <button className="press w-full cursor-pointer rounded-xl bg-base-blue py-4 text-[15px] font-semibold tracking-[-0.01em] text-white transition-colors duration-150 hover:brightness-110">
            continue →
          </button>
        </Link>
      </div>
    </div>
  )
}
