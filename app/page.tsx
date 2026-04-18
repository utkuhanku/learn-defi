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
    if (!isMiniAppReady) setMiniAppReady()
  }, [setMiniAppReady, isMiniAppReady])

  useEffect(() => {
    touchStreak()
  }, [touchStreak])

  return (
    <AppShell>
      {/* hero */}
      <section className="flex flex-col items-center px-6 pt-12 pb-14 text-center">
        <h1
          className="font-display text-6xl font-medium uppercase tracking-[0.04em] text-white hero-glow md:text-8xl"
        >
          defi, demystified
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--text-secondary)]">
          learn defi by playing. six modules. real calculators. no theory
          dumps.
        </p>
      </section>

      {/* onboarding explainer */}
      <OnboardingExplainer />

      {/* module grid */}
      <section className="px-4 pb-12">
        <ModuleGrid modules={modules} />
      </section>

      {/* primary CTA */}
      <section className="px-6 pb-12">
        <Link href="/module/defi-basics" className="block">
          <button className="press min-h-11 w-full cursor-pointer rounded-md bg-base-blue py-4 text-base font-medium tracking-[-0.01em] text-white shadow-[0_0_24px_rgba(0,0,255,0.3)] transition-all duration-150 hover:brightness-[1.08] hover:shadow-[0_0_32px_rgba(0,0,255,0.4)]">
            start with defi basics →
          </button>
        </Link>
      </section>

      {/* footer */}
      <footer className="flex items-center justify-center gap-2 pb-6 text-xs text-[var(--text-dim)]">
        <span>built on</span>
        <BaseSquare size={12} variant="current" className="text-white/40" decorative />
        <span>base</span>
      </footer>
    </AppShell>
  )
}
