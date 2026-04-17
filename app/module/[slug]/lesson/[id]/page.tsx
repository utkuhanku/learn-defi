'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/ui/AppShell'
import { LessonCarousel } from '@/components/learning/LessonCarousel'
import { getLessons } from '@/lib/content'

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = use(params)
  const lessons = use(getLessons(slug))
  const lessonIndex = lessons.findIndex((l) => l.id === id)
  if (lessonIndex === -1) notFound()

  const lesson = lessons[lessonIndex]

  return (
    <AppShell>
      <div className="px-4 py-6">
        <LessonCarousel
          lesson={lesson}
          moduleSlug={slug}
          lessonIndex={lessonIndex}
          totalLessons={lessons.length}
        />
      </div>
    </AppShell>
  )
}
