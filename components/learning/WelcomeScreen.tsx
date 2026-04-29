'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ONBOARDING_KEY = 'learn-defi-onboarded'

const STEPS = [
  { emoji: '📚', text: 'swipe through bite-sized lessons' },
  { emoji: '🧮', text: 'play with real DeFi calculators' },
  { emoji: '⚡', text: 'earn XP, badges, and streaks' },
] as const

// localStorage as external store — avoids set-state-in-effect violation
function subscribe() {
  return () => {}
}
function getOnboardedSnapshot(): 'seen' | 'unseen' {
  return localStorage.getItem(ONBOARDING_KEY) ? 'seen' : 'unseen'
}
function getServerSnapshot(): 'seen' | 'unseen' {
  return 'seen' // never render welcome on server
}

export function WelcomeScreen({ children }: { children: React.ReactNode }) {
  const onboarded = useSyncExternalStore(
    subscribe,
    getOnboardedSnapshot,
    getServerSnapshot,
  )
  const [dismissed, setDismissed] = useState(false)
  const show = onboarded === 'unseen' && !dismissed

  function handleDismiss() {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setDismissed(true)
  }

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--bg)] px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            >
              <div className="mb-6 text-6xl">🟦</div>
              <h1 className="mb-3 text-4xl font-bold tracking-[-0.03em]">
                welcome to
                <br />
                learn defi
              </h1>
              <p className="mb-10 text-base text-[var(--text-3)]">
                your journey to understanding DeFi starts here
              </p>
            </motion.div>

            <div className="mb-12 w-full max-w-xs space-y-4 text-left">
              {STEPS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-[15px] text-[var(--text-2)]">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              onClick={handleDismiss}
              className="press w-full max-w-xs cursor-pointer rounded-xl bg-base-blue py-4 text-[15px] font-semibold text-white"
            >
              let&apos;s go →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  )
}
