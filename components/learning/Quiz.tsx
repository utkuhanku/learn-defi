'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Chip } from '@/components/ui/Chip'
import { LottieAnimation } from '@/components/ui/LottieAnimation'
import { LessonComplete } from '@/components/learning/LessonComplete'
import { ANIMATIONS } from '@/lib/animations'
import { useProgress } from '@/stores/useProgress'
import type { Quiz as QuizType } from '@/lib/types'

const MOTIVATIONS = [
  'excellent!',
  'nice one!',
  "you're on fire!",
  'nailed it!',
  'perfect!',
  'keep going!',
  'brilliant!',
  'well done!',
]

function randomMotivation() {
  return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]
}

type Props = {
  quiz: QuizType
  moduleSlug: string
}

export function Quiz({ quiz, moduleSlug }: Props) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [finalStats, setFinalStats] = useState<{ score: number; xp: number } | null>(null)
  const { submitQuiz, addXp, earnBadge, completedLessons } = useProgress()

  const total = quiz.questions.length
  const question = quiz.questions[currentIndex]

  // fresh motivation per question (not per render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const motivation = useMemo(() => randomMotivation(), [currentIndex])

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

          setFinalStats({ score: finalScore, xp })
          setFinished(true)
        }
      }, 900)
    },
    [selected, question, currentIndex, total, score, quiz.moduleId, moduleSlug, submitQuiz, addXp, earnBadge, completedLessons],
  )

  if (finished && finalStats) {
    return (
      <LessonComplete
        stats={{
          type: 'quiz',
          xpEarned: finalStats.xp,
          score: finalStats.score,
          total,
          accuracy: Math.round((finalStats.score / total) * 100),
          isPerfect: finalStats.score === total,
          moduleSlug,
        }}
        onContinue={() => router.push(`/module/${moduleSlug}`)}
      />
    )
  }

  const showMotivation = selected !== null && selected === question.correctIndex

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="label">
          question {currentIndex + 1} of {total}
        </p>
        <div className="flex gap-1.5">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= currentIndex ? 'bg-base-blue' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold leading-snug tracking-[-0.01em]">
          {question.text}
        </h2>
        {showMotivation && (
          <div className="flex animate-celebrate items-center gap-2">
            <div className="h-6 w-6">
              <LottieAnimation
                src={ANIMATIONS.lightning}
                loop={false}
                className="h-full w-full"
                fallback={<span className="text-lg">⚡</span>}
              />
            </div>
            <Chip variant="green">{motivation}</Chip>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => {
          let cls = 'bg-[var(--surface)] text-white/80 hover:bg-[var(--surface-2)]'
          let icon = null

          if (selected !== null) {
            if (i === question.correctIndex) {
              cls = 'bg-green/10 text-green ring-1 ring-green/30'
              icon = <Check size={16} />
            } else if (i === selected) {
              cls = 'bg-red/10 text-red ring-1 ring-red/30'
              icon = <X size={16} />
            } else {
              cls = 'bg-[var(--surface)] text-white/30'
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              whileHover={selected === null ? { scale: 1.02 } : undefined}
              whileTap={selected === null ? { scale: 0.97 } : undefined}
              className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-left text-[15px] font-medium tracking-[-0.01em] transition-colors duration-150 ${cls} ${
                selected !== null ? 'cursor-not-allowed' : ''
              }`}
            >
              {icon}
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
