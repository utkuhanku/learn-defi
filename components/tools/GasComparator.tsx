'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '@/stores/useProgress'

const TX_TYPES = [
  { id: 'transfer', label: 'transfer', gasUnits: 21_000 },
  { id: 'swap', label: 'swap', gasUnits: 150_000 },
  { id: 'mint', label: 'NFT mint', gasUnits: 100_000 },
] as const

const L1_GWEI = 30
const BASE_GWEI = 0.01
const ETH_PRICE = 3000

function costUsd(gasUnits: number, gasPriceGwei: number): number {
  return gasUnits * gasPriceGwei * 1e-9 * ETH_PRICE
}

function formatUsd(n: number): string {
  if (n < 0.01) return `$${n.toFixed(4)}`
  if (n < 1) return `$${n.toFixed(3)}`
  return `$${n.toFixed(2)}`
}

export function GasComparator() {
  const [selectedTx, setSelectedTx] = useState<(typeof TX_TYPES)[number]>(TX_TYPES[1])
  const [txCount, setTxCount] = useState(10)
  const { markToolUsed, addXp, toolsUsed } = useProgress()
  const trackedRef = useRef(false)

  function trackUsage() {
    if (!trackedRef.current && !toolsUsed.includes('gas-comparator')) {
      markToolUsed('gas-comparator')
      addXp(15)
      trackedRef.current = true
    }
  }

  const l1Total = costUsd(selectedTx.gasUnits, L1_GWEI) * txCount
  const baseTotal = costUsd(selectedTx.gasUnits, BASE_GWEI) * txCount
  const savings = l1Total - baseTotal

  return (
    <div>
      {/* scenario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 rounded-2xl bg-[var(--surface)] p-6"
      >
        <div className="mb-2 text-[28px]">⛽</div>
        <p className="text-[15px] italic leading-relaxed text-[var(--text-2)]">
          imagine you&apos;re trading on a busy day. you want to make several swaps.
          let&apos;s see what that actually costs on Ethereum vs Base.
        </p>
      </motion.div>

      {/* tx type chips */}
      <div className="mb-6">
        <p className="label mb-3">transaction type</p>
        <div className="flex gap-2">
          {TX_TYPES.map((tx) => {
            const active = selectedTx.id === tx.id
            return (
              <button
                key={tx.id}
                onClick={() => { setSelectedTx(tx); trackUsage() }}
                className={`press cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-colors duration-150 ${
                  active
                    ? 'bg-base-blue text-white'
                    : 'bg-[var(--surface)] text-white/70 hover:bg-[var(--surface-2)]'
                }`}
              >
                {tx.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* tx count slider */}
      <div className="mb-10 rounded-2xl bg-[var(--surface)] p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="label">how many?</span>
          <span className="text-3xl font-bold tabular-nums tracking-[-0.02em]">
            {txCount}<span className="ml-1 text-sm font-normal text-[var(--text-3)]">tx</span>
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={50}
          step={1}
          value={txCount}
          onChange={(e) => { setTxCount(Number(e.target.value)); trackUsage() }}
          className="w-full accent-base-blue"
        />
      </div>

      {/* results — side by side */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-red/5 p-6 text-center ring-1 ring-red/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-3)]">
            ethereum L1
          </p>
          <p className="text-4xl font-bold tracking-[-0.02em] text-red">
            {formatUsd(l1Total)}
          </p>
          <p className="mt-3 text-2xl">😰</p>
          <p className="text-xs text-[var(--text-3)]">ouch</p>
        </div>
        <div className="rounded-2xl bg-green/5 p-6 text-center ring-1 ring-green/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-3)]">
            base
          </p>
          <p className="text-4xl font-bold tracking-[-0.02em] text-green">
            {formatUsd(baseTotal)}
          </p>
          <p className="mt-3 text-2xl">😎</p>
          <p className="text-xs text-[var(--text-3)]">nice</p>
        </div>
      </div>

      {/* savings */}
      <div className="mb-8 text-center">
        <p className="text-sm text-[var(--text-3)]">you save</p>
        <p className="mt-1 text-4xl font-bold tracking-[-0.02em] text-green">
          {formatUsd(savings)}
        </p>
        <p className="mt-1 text-sm text-[var(--text-3)]">
          on {txCount} {selectedTx.label}{txCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* fun fact */}
      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-sm italic leading-relaxed text-[var(--text-3)]">
          💡 on Base, you could make 10,000 swaps for the price of 1 swap on Ethereum L1.
        </p>
      </div>
    </div>
  )
}
