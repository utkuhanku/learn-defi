'use client'

import { useState, useRef } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { useProgress } from '@/stores/useProgress'

const COINS = {
  USDC: {
    label: 'USDC',
    type: 'fiat-backed (Circle)',
    data: [
      { day: 'Mon', price: 1.0001 },
      { day: 'Tue', price: 0.9998 },
      { day: 'Wed', price: 1.0002 },
      { day: 'Thu', price: 0.9999 },
      { day: 'Fri', price: 1.0001 },
      { day: 'Sat', price: 1.0 },
      { day: 'Sun', price: 1.0001 },
    ],
  },
  USDT: {
    label: 'USDT',
    type: 'fiat-backed (Tether)',
    data: [
      { day: 'Mon', price: 0.9997 },
      { day: 'Tue', price: 0.9999 },
      { day: 'Wed', price: 1.0003 },
      { day: 'Thu', price: 0.9996 },
      { day: 'Fri', price: 1.0001 },
      { day: 'Sat', price: 0.9998 },
      { day: 'Sun', price: 1.0002 },
    ],
  },
  DAI: {
    label: 'DAI',
    type: 'crypto-backed (MakerDAO)',
    data: [
      { day: 'Mon', price: 0.9994 },
      { day: 'Tue', price: 1.0003 },
      { day: 'Wed', price: 0.9991 },
      { day: 'Thu', price: 1.0008 },
      { day: 'Fri', price: 0.9997 },
      { day: 'Sat', price: 1.0005 },
      { day: 'Sun', price: 0.9999 },
    ],
  },
}

type CoinKey = keyof typeof COINS

export function PegTracker() {
  const [selected, setSelected] = useState<CoinKey>('USDC')
  const { markToolUsed, addXp, toolsUsed } = useProgress()
  const trackedRef = useRef(false)

  function handleSelect(coin: CoinKey) {
    setSelected(coin)
    if (!trackedRef.current && !toolsUsed.includes('peg-tracker')) {
      markToolUsed('peg-tracker')
      addXp(15)
      trackedRef.current = true
    }
  }

  const coin = COINS[selected]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">stablecoin peg tracker</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          7-day peg deviation for major stablecoins
        </p>
      </div>

      <div className="flex gap-2">
        {(Object.keys(COINS) as CoinKey[]).map((key) => (
          <Button
            key={key}
            variant={selected === key ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleSelect(key)}
          >
            {key}
          </Button>
        ))}
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={coin.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <YAxis
              domain={[0.995, 1.005]}
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              tickFormatter={(v: number) => `$${v.toFixed(3)}`}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(4)}`, coin.label]}
              contentStyle={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            />
            <ReferenceArea y1={0.995} y2={1.005} fill="#ffd12f" fillOpacity={0.08} />
            <ReferenceLine y={1} stroke="#fc401f" strokeDasharray="4 4" label="" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0000ff"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--text-muted)]">{coin.label}:</span>
        <Chip variant="default">{coin.type}</Chip>
      </div>
    </div>
  )
}
