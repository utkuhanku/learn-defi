'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/ui/AppShell'
import { Quiz } from '@/components/learning/Quiz'
import { getQuiz } from '@/lib/content'

export default function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const quiz = use(getQuiz(slug))
  if (!quiz) notFound()

  return (
    <AppShell>
      <div className="px-4 py-6">
        <Quiz quiz={quiz} moduleSlug={slug} />
      </div>
    </AppShell>
  )
}
