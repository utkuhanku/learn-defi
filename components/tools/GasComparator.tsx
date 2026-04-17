'use client'

import { useState, useRef } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
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

export function GasComparator() {
  const [selectedTx, setSelectedTx] = useState<(typeof TX_TYPES)[number]>(
    TX_TYPES[0],
  )
  const { markToolUsed, addXp, toolsUsed } = useProgress()
  const trackedRef = useRef(false)

  function handleSelect(tx: (typeof TX_TYPES)[number]) {
    setSelectedTx(tx)
    if (!trackedRef.current && !toolsUsed.includes('gas-comparator')) {
      markToolUsed('gas-comparator')
      addXp(15)
      trackedRef.current = true
    }
  }

  const l1Cost = costUsd(selectedTx.gasUnits, L1_GWEI)
  const baseCost = costUsd(selectedTx.gasUnits, BASE_GWEI)
  const savePct = ((1 - baseCost / l1Cost) * 100).toFixed(1)

  const chartData = [
    { name: 'Ethereum L1', cost: Number(l1Cost.toFixed(4)) },
    { name: 'Base', cost: Number(baseCost.toFixed(6)) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">gas cost comparator</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          compare transaction costs between Ethereum L1 and Base
        </p>
      </div>

      {/* tx type selector */}
      <div className="flex gap-2">
        {TX_TYPES.map((tx) => (
          <Button
            key={tx.id}
            variant={selectedTx.id === tx.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleSelect(tx)}
          >
            {tx.label}
          </Button>
        ))}
      </div>

      {/* chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Cost']}
              contentStyle={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
              <Cell fill="#717886" />
              <Cell fill="#0000ff" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* result */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">you save</span>
          <Chip variant="green">{savePct}%</Chip>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          on Base, a {selectedTx.label} costs less than a penny
        </p>
      </div>
    </div>
  )
}
