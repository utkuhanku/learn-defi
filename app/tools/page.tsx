'use client'

import { AppShell } from '@/components/ui/AppShell'
import { Calculator } from 'lucide-react'

const tools = [
  'gas cost comparator',
  'stablecoin peg tracker',
  'health factor calculator',
  'impermanent loss simulator',
  'apr → apy calculator',
  'defi strategy calculator',
]

export default function ToolsPage() {
  return (
    <AppShell>
      <section className="px-4 pt-8 pb-16">
        <h1 className="mb-6 text-2xl font-semibold">calculators</h1>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 text-center"
            >
              <Calculator
                size={24}
                strokeWidth={1.5}
                className="text-[var(--text-muted)]"
              />
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          interactive tools — coming in phase 3–4.
        </p>
      </section>
    </AppShell>
  )
}
