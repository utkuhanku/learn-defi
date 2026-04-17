'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { AppShell } from '@/components/ui/AppShell'
import { BaseSquare } from '@/components/brand/BaseSquare'
import { OnboardingExplainer } from '@/components/learning/OnboardingExplainer'

const modules = [
  { title: 'defi basics', slug: 'defi-basics', locked: false },
  { title: 'stablecoins', slug: 'stablecoins', locked: false },
  { title: 'lending & borrowing', slug: 'lending', locked: false },
  { title: 'dex & swaps', slug: 'dex-swaps', locked: false },
  { title: 'yield farming', slug: 'yield', locked: false },
  { title: 'advanced strategies', slug: 'advanced', locked: true },
]

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit()

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady()
    }
  }, [setMiniAppReady, isMiniAppReady])

  return (
    <AppShell>
      {/* hero */}
      <section className="flex flex-col items-center px-6 pt-8 pb-10 text-center">
        <h1 className="font-display text-5xl font-medium uppercase tracking-[0.02em] md:text-7xl">
          defi, demystified
        </h1>
        <p className="mt-4 max-w-md text-lg text-[var(--text-secondary)]">
          learn defi by playing. six modules. real calculators. no theory
          dumps.
        </p>
      </section>

      {/* onboarding explainer */}
      <OnboardingExplainer />

      {/* module grid */}
      <section className="px-4 pb-8">
        <div className="grid grid-cols-2 gap-3">
          {modules.map((m) => (
            <div
              key={m.slug}
              className={`flex aspect-square flex-col justify-between rounded-md border border-[var(--border)] bg-[var(--surface)] p-4${
                m.locked ? ' cursor-not-allowed opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <BaseSquare size={20} variant="current" className="text-gray-80 dark:text-gray-30" />
                {m.locked && (
                  <Lock size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />
                )}
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">{m.title}</span>
                {m.locked ? (
                  <span className="mt-1 text-xs text-[var(--text-muted)]">coming soon</span>
                ) : (
                  <div className="h-1 w-full rounded-xs bg-gray-15 dark:bg-gray-80">
                    <div className="h-full w-0 rounded-xs bg-base-blue" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* primary CTA */}
      <section className="px-6 pb-28">
        <Link href="/module/defi-basics" className="block">
          <button className="w-full min-h-11 cursor-pointer rounded-md bg-base-blue py-4 text-base font-medium text-white transition-all duration-120 hover:brightness-[1.04] active:scale-[0.98]">
            start with defi basics →
          </button>
        </Link>
      </section>

      {/* footer */}
      <footer className="flex items-center justify-center gap-2 pb-6 text-sm text-[var(--text-muted)]">
        <span>built on</span>
        <BaseSquare size={14} variant="white" decorative />
        <span>base</span>
      </footer>
    </AppShell>
  )
}
