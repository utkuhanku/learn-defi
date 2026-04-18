'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useProgress } from '@/stores/useProgress'
import type { Lesson, LessonCard } from '@/lib/types'

function TextCard({ card }: { card: Extract<LessonCard, { type: 'text' }> }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
        {card.heading}
      </h3>
      <p className="whitespace-pre-line text-base leading-relaxed text-[var(--text-secondary)]">
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
        <div key={side.label} className="glass rounded-md p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/80">
            {side.label}
          </h4>
          <ul className="space-y-1.5">
            {side.items.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-[var(--text-secondary)]"
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
    <div className="glass flex items-start gap-3 rounded-md p-4">
      <span className="text-2xl leading-none">{card.emoji}</span>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
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
    <div className="flex flex-col gap-8">
      {/* header */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
          lesson {lessonIndex + 1} of {totalLessons}
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.02em]">
          {lesson.title}
        </h2>
        {/* progress dots */}
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= cardIndex
                  ? 'bg-base-blue shadow-[0_0_8px_rgba(0,0,255,0.4)]'
                  : 'bg-white/[0.08]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* card content */}
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
