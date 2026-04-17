'use client'

import { BaseSquare } from '@/components/brand/BaseSquare'
import { BottomNav } from '@/components/ui/BottomNav'
import { UserChip } from '@/components/ui/UserChip'
import { ConnectButton } from '@/components/ui/ConnectButton'
import { useMiniKit } from '@coinbase/onchainkit/minikit'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { context } = useMiniKit()
  const insets = (context?.client as { safeAreaInsets?: { top: number; bottom: number; left: number; right: number } } | undefined)?.safeAreaInsets ?? {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  const hasUser = !!(context?.user as { displayName?: string } | undefined)?.displayName

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
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4 py-3">
        <div className="flex items-center gap-2">
          <BaseSquare size={24} />
          <span className="text-base font-medium tracking-tight">
            learn defi
          </span>
        </div>
        {hasUser ? <UserChip /> : <ConnectButton />}
      </header>

      {/* scrollable content area */}
      <main className="flex-1 pb-20">{children}</main>

      {/* bottom navigation */}
      <BottomNav />
    </div>
  )
}
