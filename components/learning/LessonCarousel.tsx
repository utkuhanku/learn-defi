'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { LessonComplete } from '@/components/learning/LessonComplete'
import { useProgress } from '@/stores/useProgress'
import type { Lesson, LessonCard } from '@/lib/types'

function TextCard({ card }: { card: Extract<LessonCard, { type: 'text' }> }) {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-bold tracking-[-0.02em] text-white">
        {card.heading}
      </h3>
      <p className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--text-2)]">
        {card.body}
      </p>
    </div>
  )
}

function ComparisonCard({
  card,
}: {
  card: Extract<LessonCard, { type: 'comparison' }>
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[card.left, card.right].map((side) => (
        <div key={side.label} className="rounded-xl bg-[var(--surface)] p-4">
          <h4 className="label mb-3">{side.label}</h4>
          <ul className="space-y-2">
            {side.items.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-[var(--text-2)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function HighlightCard({
  card,
}: {
  card: Extract<LessonCard, { type: 'highlight' }>
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[var(--surface)] p-4">
      <span className="text-2xl leading-none">{card.emoji}</span>
      <p className="text-sm leading-relaxed text-[var(--text-2)]">
        {card.text}
      </p>
    </div>
  )
}

function renderCard(card: LessonCard) {
  switch (card.type) {
    case 'text':
      return <TextCard card={card} />
    case 'comparison':
      return <ComparisonCard card={card} />
    case 'highlight':
      return <HighlightCard card={card} />
  }
}

type Props = {
  lesson: Lesson
  moduleSlug: string
  lessonIndex: number
  totalLessons: number
}

export function LessonCarousel({
  lesson,
  moduleSlug,
  lessonIndex,
  totalLessons,
}: Props) {
  const [cardIndex, setCardIndex] = useState(0)
  const [showComplete, setShowComplete] = useState(false)
  const router = useRouter()
  const { completeLesson, addXp } = useProgress()

  const cards = lesson.cards
  const isLast = cardIndex === cards.length - 1

  function handleNext() {
    if (isLast) {
      completeLesson(lesson.id)
      addXp(10)
      setShowComplete(true)
    } else {
      setCardIndex((i) => i + 1)
    }
  }

  if (showComplete) {
    return (
      <LessonComplete
        stats={{
          type: 'lesson',
          xpEarned: 10,
          totalCards: cards.length,
          moduleSlug,
          lessonTitle: lesson.title,
        }}
        onContinue={() => router.push(`/module/${moduleSlug}`)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="label">
          lesson {lessonIndex + 1} of {totalLessons}
        </p>
        <h2 className="text-3xl font-bold tracking-[-0.02em]">
          {lesson.title}
        </h2>
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= cardIndex ? 'bg-base-blue' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderCard(cards[cardIndex])}
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        variant={isLast ? 'primary' : 'secondary'}
        onClick={handleNext}
        className="w-full"
      >
        {isLast ? 'complete lesson' : 'next'}
      </Button>
    </div>
  )
}
