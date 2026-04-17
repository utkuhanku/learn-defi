'use client'

import { AppShell } from '@/components/ui/AppShell'
import { User } from 'lucide-react'

export default function ProfilePage() {
  return (
    <AppShell>
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-10 dark:bg-gray-80">
          <User size={32} strokeWidth={1.5} className="text-gray-50" />
        </div>
        <h1 className="text-2xl font-semibold">your profile</h1>
        <p className="mt-3 text-[var(--text-muted)]">
          connect to see your progress — coming in phase 2.
        </p>
      </section>
    </AppShell>
  )
}
