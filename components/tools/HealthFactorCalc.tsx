'use client'

import { useState, useRef } from 'react'
import { Chip } from '@/components/ui/Chip'
import { useProgress } from '@/stores/useProgress'
import { healthFactor } from '@/lib/formulas/healthFactor'

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
  const ethAmount = collateral / 3000
  const liqPriceDisplay = ethAmount > 0 && lt > 0
    ? (borrow / (ethAmount * lt)).toFixed(0)
    : '0'

  let hfColor = 'text-green'
  let hfChip: 'green' | 'yellow' | 'red' = 'green'
  let hfLabel = 'safe'
  if (hf < 1.0) {
    hfColor = 'text-red'
    hfChip = 'red'
    hfLabel = 'liquidation'
  } else if (hf < 1.5) {
    hfColor = 'text-yellow'
    hfChip = 'yellow'
    hfLabel = 'caution'
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">health factor calculator</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          check if your lending position is safe
        </p>
      </div>

      {/* collateral input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          collateral value: ${collateral.toLocaleString()}
        </label>
        <input
          type="range"
          min={0}
          max={50000}
          step={100}
          value={collateral}
          onChange={(e) => {
            setCollateral(Number(e.target.value))
            trackUsage()
          }}
          className="w-full accent-base-blue"
        />
      </div>

      {/* borrow input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          borrow value: ${borrow.toLocaleString()}
        </label>
        <input
          type="range"
          min={0}
          max={40000}
          step={100}
          value={borrow}
          onChange={(e) => {
            setBorrow(Number(e.target.value))
            trackUsage()
          }}
          className="w-full accent-base-blue"
        />
      </div>

      {/* liquidation threshold */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          liquidation threshold: {(lt * 100).toFixed(1)}%
        </label>
        <input
          type="range"
          min={0.5}
          max={0.95}
          step={0.005}
          value={lt}
          onChange={(e) => {
            setLt(Number(e.target.value))
            trackUsage()
          }}
          className="w-full accent-base-blue"
        />
      </div>

      {/* result */}
      <div className="flex flex-col items-center gap-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">health factor</p>
        <p className={`text-5xl font-bold ${hfColor}`}>
          {hf === Infinity ? '∞' : hf.toFixed(2)}
        </p>
        <Chip variant={hfChip}>{hfLabel}</Chip>
        {borrow > 0 && collateral > 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            liquidation if ETH drops to ~${liqPriceDisplay}
          </p>
        )}
      </div>
    </div>
  )
}
