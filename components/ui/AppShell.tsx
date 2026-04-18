'use client'

import { useEffect } from 'react'
import { Zap, Flame } from 'lucide-react'
import { BaseSquare } from '@/components/brand/BaseSquare'
import { BottomNav } from '@/components/ui/BottomNav'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { useTheme } from '@/stores/useTheme'
import { useProgress } from '@/stores/useProgress'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { context } = useMiniKit()
  const insets = (context?.client as
    | { safeAreaInsets?: { top: number; bottom: number; left: number; right: number } }
    | undefined)?.safeAreaInsets ?? {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  const theme = useTheme((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  const xp = useProgress((s) => s.xp)
  const streakCurrent = useProgress((s) => s.streak.current)

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <BaseSquare size={18} />
          <span className="text-[15px] font-semibold tracking-[-0.01em]">
            learn defi
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-bold tabular-nums">{xp}</span>
            <Zap size={14} className="text-yellow fill-yellow" strokeWidth={0} />
          </div>
          <span className="text-[var(--text-4)]">·</span>
          <div className="flex items-center gap-1">
            <span className="font-bold tabular-nums">{streakCurrent}</span>
            <Flame
              size={14}
              className={
                streakCurrent >= 1
                  ? 'text-[#ff8800] fill-[#ff8800]'
                  : 'text-white/20'
              }
              strokeWidth={0}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">{children}</main>

      <BottomNav />
    </div>
  )
}
