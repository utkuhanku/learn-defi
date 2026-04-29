'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LessonComplete } from '@/components/learning/LessonComplete'
import { useProgress } from '@/stores/useProgress'
import type { Quiz as QuizType } from '@/lib/types'

const MOTIVATIONS = [
  'excellent!',
  'nailed it!',
  "you're on fire!",
  'brilliant!',
  'spot on!',
  'perfect!',
  'well done!',
  'keep going!',
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
  const [motivation, setMotivation] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [finalStats, setFinalStats] = useState<{ score: number; xp: number } | null>(null)
  const { submitQuiz, addXp, earnBadge, completedLessons } = useProgress()

  const total = quiz.questions.length
  const question = quiz.questions[currentIndex]

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (selected !== null) return
      setSelected(optionIndex)

      const isCorrect = optionIndex === question.correctIndex
      if (isCorrect) {
        setScore((s) => s + 1)
        setMotivation(randomMotivation())
      } else {
        setMotivation('not quite — keep going!')
      }

      setTimeout(() => {
        setMotivation(null)
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

      <h2 className="text-xl font-semibold leading-snug tracking-[-0.01em]">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => {
          let cls = 'bg-[var(--surface)] text-white/80 hover:bg-[var(--surface-2)]'
          let icon = null
          let animateProps = {}

          if (selected !== null) {
            if (i === question.correctIndex) {
              cls = 'bg-green/10 text-green ring-1 ring-green/30'
              icon = <Check size={16} />
              animateProps = { scale: [1, 1.02, 1] }
            } else if (i === selected) {
              cls = 'bg-red/10 text-red ring-1 ring-red/30'
              icon = <X size={16} />
              animateProps = { x: [0, -8, 8, -8, 8, 0] }
            } else {
              cls = 'bg-[var(--surface)] text-white/30'
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              whileHover={selected === null ? { scale: 1.01 } : undefined}
              whileTap={selected === null ? { scale: 0.97 } : undefined}
              animate={animateProps}
              transition={{ duration: 0.3 }}
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

      {/* motivation chip */}
      <AnimatePresence>
        {motivation && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                motivation.includes('not quite')
                  ? 'bg-yellow/10 text-yellow'
                  : 'bg-green/10 text-green'
              }`}
            >
              ⚡ {motivation}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
