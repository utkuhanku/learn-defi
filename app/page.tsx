'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { AppShell } from '@/components/ui/AppShell'
import { BaseSquare } from '@/components/brand/BaseSquare'
import { OnboardingExplainer } from '@/components/learning/OnboardingExplainer'
import { ModuleGrid } from '@/components/learning/ModuleGrid'
import { getModules } from '@/lib/content'
import { useProgress } from '@/stores/useProgress'

const modules = getModules()

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit()
  const touchStreak = useProgress((s) => s.touchStreak)

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady()
    }
  }, [setMiniAppReady, isMiniAppReady])

  useEffect(() => {
    touchStreak()
  }, [touchStreak])

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
        <ModuleGrid modules={modules} />
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
