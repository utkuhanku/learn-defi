'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Chip } from '@/components/ui/Chip'
import { NumberTicker } from '@/components/ui/NumberTicker'

type Props = {
  amount: number
  onComplete?: () => void
}

export function XPReward({ amount, onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 1200)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="flex flex-col items-center gap-3 py-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-1 text-3xl font-bold">
        <span>+</span>
        <NumberTicker value={amount} />
      </div>
      <Chip variant="yellow">XP earned</Chip>
    </motion.div>
  )
}
