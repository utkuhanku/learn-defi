'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { NumberTicker } from '@/components/ui/NumberTicker'
import { useProgress } from '@/stores/useProgress'
import type { Quiz as QuizType } from '@/lib/types'

type Props = {
  quiz: QuizType
  moduleSlug: string
}

export function Quiz({ quiz, moduleSlug }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const { submitQuiz, addXp, earnBadge, completedLessons } = useProgress()

  const total = quiz.questions.length
  const question = quiz.questions[currentIndex]

  const xpEarned = score === total ? 50 : score >= 3 ? 30 : 10

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (selected !== null) return
      setSelected(optionIndex)

      const isCorrect = optionIndex === question.correctIndex
      if (isCorrect) setScore((s) => s + 1)

      setTimeout(() => {
        if (currentIndex < total - 1) {
          setCurrentIndex((i) => i + 1)
          setSelected(null)
        } else {
          const finalScore = isCorrect ? score + 1 : score
          submitQuiz(quiz.moduleId, finalScore, total)
          const xp = finalScore === total ? 50 : finalScore >= 3 ? 30 : 10
          addXp(xp)
          if (finalScore === total) earnBadge('perfect-quiz')

          const lessonIds = Array.from({ length: 5 }, (_, i) => `${moduleSlug}-${i + 1}`)
          const allLessons = lessonIds.every((id) => completedLessons[id])
          if (allLessons) earnBadge(moduleSlug === 'defi-basics' ? 'defi-101' : moduleSlug)

          setFinished(true)
        }
      }, 750)
    },
    [selected, question, currentIndex, total, score, quiz.moduleId, moduleSlug, submitQuiz, addXp, earnBadge, completedLessons],
  )

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
          quiz complete
        </p>
        <p className="text-6xl font-bold tracking-[-0.03em] hero-glow">
          {score}/{total}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-lg text-[var(--text-secondary)]">+</span>
          <NumberTicker value={xpEarned} className="text-lg font-bold" />
          <Chip variant="yellow">XP</Chip>
        </div>
        {score === total && <Chip variant="green">perfect score</Chip>}
        <Link href={`/module/${moduleSlug}`}>
          <Button variant="secondary">back to module</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
          question {currentIndex + 1} of {total}
        </p>
        <div className="flex gap-1.5">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= currentIndex
                  ? 'bg-base-blue shadow-[0_0_8px_rgba(0,0,255,0.4)]'
                  : 'bg-white/[0.08]'
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="text-xl font-semibold tracking-[-0.02em] leading-snug">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => {
          let variant: 'secondary' | 'success' | 'danger' = 'secondary'
          let icon = null

          if (selected !== null) {
            if (i === question.correctIndex) {
              variant = 'success'
              icon = <Check size={16} />
            } else if (i === selected) {
              variant = 'danger'
              icon = <X size={16} />
            }
          }

          return (
            <Button
              key={i}
              variant={variant}
              size="md"
              className="justify-start gap-2 text-left"
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
            >
              {icon}
              {option}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
