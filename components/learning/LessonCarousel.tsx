'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useProgress } from '@/stores/useProgress'
import type { Lesson, LessonCard } from '@/lib/types'

function TextCard({ card }: { card: Extract<LessonCard, { type: 'text' }> }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{card.heading}</h3>
      <p className="whitespace-pre-line text-base text-[var(--text-secondary)]">
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
        <Card key={side.label} variant="surface" className="p-4">
          <h4 className="mb-2 text-sm font-semibold">{side.label}</h4>
          <ul className="space-y-1">
            {side.items.map((item, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)]">
                {item}
              </li>
            ))}
          </ul>
        </Card>
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
    <Card variant="surface" className="flex items-start gap-3 p-4">
      <span className="text-2xl">{card.emoji}</span>
      <p className="text-sm text-[var(--text-secondary)]">{card.text}</p>
    </Card>
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
  const router = useRouter()
  const { completeLesson, addXp } = useProgress()

  const cards = lesson.cards
  const isLast = cardIndex === cards.length - 1

  function handleNext() {
    if (isLast) {
      completeLesson(lesson.id)
      addXp(10)
      router.push(`/module/${moduleSlug}`)
    } else {
      setCardIndex((i) => i + 1)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* header */}
      <div className="space-y-2">
        <p className="text-sm text-[var(--text-muted)]">
          lesson {lessonIndex + 1} of {totalLessons}
        </p>
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        {/* progress dots */}
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                i <= cardIndex ? 'bg-base-blue' : 'bg-gray-15 dark:bg-gray-80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* card content */}
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

      {/* navigation */}
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
