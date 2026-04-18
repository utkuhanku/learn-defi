'use client'

import { use } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AppShell } from '@/components/ui/AppShell'
import { GasComparator } from '@/components/tools/GasComparator'
import { PegTracker } from '@/components/tools/PegTracker'
import { HealthFactorCalc } from '@/components/tools/HealthFactorCalc'
import { ILSimulator } from '@/components/tools/ILSimulator'
import { AprApyCalc } from '@/components/tools/AprApyCalc'

const TOOLS: Record<string, React.ComponentType> = {
  'defi-basics': GasComparator,
  'stablecoins': PegTracker,
  'lending': HealthFactorCalc,
  'dex-swaps': ILSimulator,
  'yield': AprApyCalc,
}

export default function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const Tool = TOOLS[slug]

  return (
    <AppShell>
      <div className="px-5 py-6">
        <Link
          href={`/module/${slug}`}
          className="press mb-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-3)] transition-colors duration-150 hover:text-[var(--text)]"
        >
          <ChevronLeft size={16} />
          back to module
        </Link>

        {Tool ? (
          <Tool />
        ) : (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">tool coming soon</h2>
            <p className="mt-2 text-sm text-[var(--text-3)]">
              this interactive tool will be available in a future update.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
