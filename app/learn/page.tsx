'use client'

import { AppShell } from '@/components/ui/AppShell'

export default function LearnPage() {
  return (
    <AppShell>
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">continue where you left off</h1>
        <p className="mt-3 text-[var(--text-muted)]">
          module lessons and progress — coming in phase 3.
        </p>
      </section>
    </AppShell>
  )
}
