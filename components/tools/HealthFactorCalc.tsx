'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '@/stores/useProgress'
import { healthFactor } from '@/lib/formulas/healthFactor'

const ETH_PRICE = 3000

export function HealthFactorCalc() {
  const [collateral, setCollateral] = useState(10000)
  const [borrow, setBorrow] = useState(5000)
  const [lt, setLt] = useState(0.825)
  const { markToolUsed, addXp, toolsUsed } = useProgress()
  const trackedRef = useRef(false)

  function trackUsage() {
    if (!trackedRef.current && !toolsUsed.includes('health-factor-calc')) {
      markToolUsed('health-factor-calc')
      addXp(15)
      trackedRef.current = true
    }
  }

  const hf = healthFactor(collateral, lt, borrow)
  const ethAmount = collateral / ETH_PRICE
  const liqEthPrice =
    ethAmount > 0 && lt > 0 ? borrow / (ethAmount * lt) : 0
  const crashPct =
    ETH_PRICE > 0 ? ((ETH_PRICE - liqEthPrice) / ETH_PRICE) * 100 : 0

  type State = 'safe' | 'risky' | 'liquidated'
  let state: State = 'safe'
  if (hf < 1.0) state = 'liquidated'
  else if (hf < 1.5) state = 'risky'

  const stateStyle = {
    safe: 'bg-green/5 ring-green/20',
    risky: 'bg-yellow/5 ring-yellow/20',
    liquidated: 'bg-red/5 ring-red/20',
  }[state]

  const hfColor = {
    safe: 'text-green',
    risky: 'text-yellow',
    liquidated: 'text-red',
  }[state]

  const statusMessage = {
    safe: '✅ you\'re safe — sleep well',
    risky: '⚠️ getting risky — consider repaying',
    liquidated: '🚨 liquidation! — you just lost your collateral',
  }[state]

  const liquidationLoss = collateral * 0.05 // 5% liquidation penalty

  return (
    <div>
      {/* scenario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 rounded-2xl bg-[var(--surface)] p-6"
      >
        <div className="mb-2 text-[28px]">🏦</div>
        <p className="text-[15px] italic leading-relaxed text-[var(--text-2)]">
          you deposited ETH as collateral and borrowed USDC. ETH starts
          dropping. how far can it fall before you get liquidated?
        </p>
      </motion.div>

      {/* sliders */}
      <div className="mb-6 space-y-4">
        <div className="rounded-2xl bg-[var(--surface)] p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">collateral (ETH)</span>
            <span className="text-lg font-bold tabular-nums tracking-[-0.02em]">
              ${collateral.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50000}
            step={100}
            value={collateral}
            onChange={(e) => { setCollateral(Number(e.target.value)); trackUsage() }}
            className="w-full accent-base-blue"
          />
        </div>

        <div className="rounded-2xl bg-[var(--surface)] p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">borrowed (USDC)</span>
            <span className="text-lg font-bold tabular-nums tracking-[-0.02em]">
              ${borrow.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={40000}
            step={100}
            value={borrow}
            onChange={(e) => { setBorrow(Number(e.target.value)); trackUsage() }}
            className="w-full accent-base-blue"
          />
        </div>

        <div className="rounded-2xl bg-[var(--surface)] p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">liquidation threshold</span>
            <span className="text-lg font-bold tabular-nums tracking-[-0.02em]">
              {(lt * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={0.95}
            step={0.005}
            value={lt}
            onChange={(e) => { setLt(Number(e.target.value)); trackUsage() }}
            className="w-full accent-base-blue"
          />
        </div>
      </div>

      {/* big HF display */}
      <div className={`mb-8 rounded-2xl p-8 text-center ring-1 ${stateStyle}`}>
        <p className="label mb-4">health factor</p>
        <p className={`text-7xl font-bold tracking-[-0.04em] ${hfColor}`}>
          {hf === Infinity ? '∞' : hf.toFixed(2)}
        </p>
        <p className="mt-4 text-base font-semibold">{statusMessage}</p>

        {borrow > 0 && collateral > 0 && state !== 'liquidated' && (
          <div className="mt-6 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-2)]">
            <p>
              ETH can drop to{' '}
              <span className="font-bold text-white tabular-nums">
                ${liqEthPrice.toFixed(0)}
              </span>
            </p>
            <p className="mt-1 text-[var(--text-3)]">
              that&apos;s a{' '}
              <span className="font-bold text-white tabular-nums">
                {crashPct.toFixed(0)}%
              </span>{' '}
              crash from today
            </p>
          </div>
        )}

        {state === 'liquidated' && (
          <div className="mt-6 border-t border-red/20 pt-6 text-sm text-[var(--text-2)]">
            <p>a liquidator took your ETH at a 5% discount.</p>
            <p className="mt-1">
              you lost{' '}
              <span className="font-bold text-red tabular-nums">
                ${liquidationLoss.toFixed(0)}
              </span>{' '}
              in penalties.
            </p>
          </div>
        )}
      </div>

      {/* fun fact */}
      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-sm italic leading-relaxed text-[var(--text-3)]">
          💡 most experienced DeFi users keep their HF above 2.0. the extra
          buffer lets them sleep at night.
        </p>
      </div>
    </div>
  )
}
