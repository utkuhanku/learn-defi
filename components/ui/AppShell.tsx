'use client'

import { useEffect } from 'react'
import { BaseSquare } from '@/components/brand/BaseSquare'
import { BottomNav } from '@/components/ui/BottomNav'
import { UserChip } from '@/components/ui/UserChip'
import { ConnectButton } from '@/components/ui/ConnectButton'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { useTheme } from '@/stores/useTheme'

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

  const hasUser = !!(context?.user as { displayName?: string } | undefined)?.displayName

  const theme = useTheme((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {/* header */}
      <header className="glass-bar sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <BaseSquare size={22} />
          <span className="text-base font-medium tracking-[-0.01em]">
            learn defi
          </span>
        </div>
        {hasUser ? <UserChip /> : <ConnectButton />}
      </header>

      {/* scrollable content area */}
      <main className="flex-1 pb-24">{children}</main>

      {/* bottom navigation */}
      <BottomNav />
    </div>
  )
}
