'use client'

import { use } from 'react'
import { AppShell } from '@/components/ui/AppShell'
import { GasComparator } from '@/components/tools/GasComparator'

export default function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  return (
    <AppShell>
      <div className="px-4 py-6">
        {slug === 'defi-basics' ? (
          <GasComparator />
        ) : (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">tool coming soon</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              this interactive tool will be available in phase 4.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
