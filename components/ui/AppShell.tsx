'use client'

import { useEffect, useState } from 'react'
import { Zap, Flame, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { BaseSquare } from '@/components/brand/BaseSquare'
import { BottomNav } from '@/components/ui/BottomNav'
import { useMiniKit, useAddFrame } from '@coinbase/onchainkit/minikit'
import { useTheme } from '@/stores/useTheme'
import { useProgress } from '@/stores/useProgress'

type ClientCtx = {
  safeAreaInsets?: { top: number; bottom: number; left: number; right: number }
  added?: boolean
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { context } = useMiniKit()
  const clientCtx = context?.client as ClientCtx | undefined
  const insets = clientCtx?.safeAreaInsets ?? {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
  const inFrame = !!context
  const added = clientCtx?.added ?? false

  const theme = useTheme((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  const xp = useProgress((s) => s.xp)
  const streakCurrent = useProgress((s) => s.streak.current)

  const addFrame = useAddFrame()
  const [adding, setAdding] = useState(false)

  async function handleAdd() {
    setAdding(true)
    try {
      const result = await addFrame()
      if (result) {
        console.log('[mini-app] frame added:', result.url, result.token)
        // TODO (Paket 2B): POST to /api/frame-added to persist token for notifications
      }
    } catch (err) {
      console.error('[mini-app] addFrame failed:', err)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div
      className="flex min-h-dvh flex-col bg-[var(--bg)]"
      style={{
        paddingTop: `${insets.top}px`,
        paddingBottom: `${insets.bottom}px`,
        paddingLeft: `${insets.left}px`,
        paddingRight: `${insets.right}px`,
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
          {/* save app button — only in frame context */}
          {inFrame && !added && (
            <button
              onClick={handleAdd}
              disabled={adding}
              className="press cursor-pointer rounded-full bg-base-blue px-3 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-50"
            >
              {adding ? 'saving...' : '+ save app'}
            </button>
          )}
          {inFrame && added && (
            <div className="flex items-center gap-1 rounded-full bg-green/10 px-2.5 py-1 text-xs font-semibold text-green">
              <Check size={12} strokeWidth={2.5} />
              <span>saved</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <motion.span
              key={xp}
              initial={{ scale: 1.35, color: '#ffd12f' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="font-bold tabular-nums"
            >
              {xp}
            </motion.span>
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

      <BottomNav bottomInset={insets.bottom} />
    </div>
  )
}
