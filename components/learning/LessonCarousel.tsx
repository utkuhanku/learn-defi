'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { LessonComplete } from '@/components/learning/LessonComplete'
import { useProgress } from '@/stores/useProgress'
import type { Lesson, LessonCard } from '@/lib/types'

function TextCard({ card }: { card: Extract<LessonCard, { type: 'text' }> }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
        {card.heading}
      </h3>
      <p className="whitespace-pre-line text-base leading-relaxed text-[var(--text-2)]">
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
        <div
          key={side.label}
          className="rounded-xl bg-[var(--surface-2)] p-4"
        >
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/80">
            {side.label}
          </h4>
          <ul className="space-y-1.5">
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
    <div className="flex items-start gap-3 rounded-xl bg-base-blue/5 p-4 ring-1 ring-base-blue/10">
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

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 24,
  mass: 0.8,
}

const variants = {
  enter: (d: number) => ({
    x: d > 0 ? '100%' : '-100%',
    scale: 0.95,
    opacity: 0,
  }),
  center: { x: 0, scale: 1, opacity: 1 },
  exit: (d: number) => ({
    x: d > 0 ? '-100%' : '100%',
    scale: 0.95,
    opacity: 0,
  }),
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
  const [direction, setDirection] = useState(1)
  const [showComplete, setShowComplete] = useState(false)
  const router = useRouter()
  const { completeLesson, addXp } = useProgress()
  const dragX = useMotionValue(0)
  const rotate = useTransform(dragX, [-200, 0, 200], [-6, 0, 6])
  const scale = useTransform(dragX, [-200, 0, 200], [0.95, 1, 0.95])
  const opacity = useTransform(dragX, [-200, 0, 200], [0.5, 1, 0.5])

  const cards = lesson.cards
  const isLast = cardIndex === cards.length - 1

  const goNext = useCallback(() => {
    if (isLast) {
      completeLesson(lesson.id)
      addXp(10)
      setShowComplete(true)
    } else {
      setDirection(1)
      setCardIndex((i) => i + 1)
    }
  }, [isLast, lesson.id, completeLesson, addXp])

  const goBack = useCallback(() => {
    if (cardIndex > 0) {
      setDirection(-1)
      setCardIndex((i) => i - 1)
    }
  }, [cardIndex])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const swipeThreshold = 50
      const velocityThreshold = 300
      if (
        info.offset.x < -swipeThreshold ||
        info.velocity.x < -velocityThreshold
      ) {
        goNext()
      } else if (
        info.offset.x > swipeThreshold ||
        info.velocity.x > velocityThreshold
      ) {
        goBack()
      }
    },
    [goNext, goBack],
  )

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
    <div className="flex flex-col gap-6">
      {/* header */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-4)]">
          lesson {lessonIndex + 1} of {totalLessons}
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.02em]">
          {lesson.title}
        </h2>

        {/* animated progress dots — active widens + glows */}
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full"
              animate={{
                flex: i === cardIndex ? '0 0 24px' : '1 1 0%',
                backgroundColor:
                  i <= cardIndex ? '#0000ff' : 'rgba(255,255,255,0.08)',
                boxShadow:
                  i === cardIndex
                    ? '0 0 8px rgba(0,0,255,0.5)'
                    : '0 0 0px rgba(0,0,255,0)',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          ))}
        </div>
      </div>

      {/* swipe hint — only first card */}
      {cardIndex === 0 && (
        <motion.p
          className="text-center text-xs text-[var(--text-4)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ← swipe or tap next →
        </motion.p>
      )}

      {/* card content with swipe */}
      <div className="relative min-h-[260px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={cardIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springTransition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            style={{ x: dragX, rotate, scale, opacity, cursor: 'grab' }}
            whileTap={{ cursor: 'grabbing' }}
            className="rounded-xl bg-[var(--surface)] p-6"
          >
            {renderCard(cards[cardIndex])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* card counter */}
      <p className="text-center text-xs tabular-nums text-[var(--text-4)]">
        {cardIndex + 1} / {cards.length}
      </p>

      {/* CTA — last card breathes */}
      <motion.div
        animate={
          isLast
            ? { opacity: [0.85, 1, 0.85] }
            : { opacity: 1 }
        }
        transition={
          isLast
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
      >
        <Button
          variant={isLast ? 'primary' : 'secondary'}
          onClick={goNext}
          className="w-full"
        >
          {isLast ? 'complete lesson' : 'next'}
        </Button>
      </motion.div>
    </div>
  )
}
