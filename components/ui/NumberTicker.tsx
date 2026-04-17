'use client'

import { useEffect, useRef } from 'react'
import { useSpring, useTransform, motion, useMotionValue } from 'framer-motion'

type NumberTickerProps = {
  value: number
  duration?: number
  className?: string
}

export function NumberTicker({
  value,
  duration = 0.6,
  className = '',
}: NumberTickerProps) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 300,
    damping: 30,
    duration,
  })
  const display = useTransform(springValue, (v) =>
    Math.round(v).toLocaleString(),
  )
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    motionValue.set(value)
  }, [motionValue, value])

  return <motion.span ref={ref} className={className}>{display}</motion.span>
}
