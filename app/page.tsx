'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { AppShell } from '@/components/ui/AppShell'
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
      <section className="flex flex-col items-center px-6 pt-16 pb-12 text-center">
        <h1 className="hero-glow font-display text-[64px] font-medium uppercase leading-none tracking-[0.03em] text-white md:text-[96px]">
          defi,
          <br />
          demystified
        </h1>
        <p className="mt-6 max-w-xs text-base leading-relaxed text-[var(--text-3)]">
          learn defi by playing. six modules. real calculators.
        </p>
      </section>

      {/* module grid */}
      <section className="px-5 pb-8">
        <p className="label mb-4 px-1">modules</p>
        <ModuleGrid modules={modules} />
      </section>

      {/* primary CTA */}
      <section className="px-5 pb-12">
        <Link href="/module/defi-basics" className="block">
          <button className="press w-full cursor-pointer rounded-xl bg-base-blue py-4 text-[15px] font-semibold tracking-[-0.01em] text-white transition-colors duration-150 hover:brightness-110">
            start with defi basics →
          </button>
        </Link>
      </section>

      {/* footer */}
      <footer className="flex items-center justify-center gap-1.5 pb-6 text-xs text-[var(--text-4)]">
        <span>🟦 base</span>
      </footer>
    </AppShell>
  )
}
