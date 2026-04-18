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

const tooltipStyle = {
  background: 'rgba(10,11,13,0.9)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  backdropFilter: 'blur(12px)',
}

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
        <h2 className="text-2xl font-semibold tracking-[-0.02em]">
          stablecoin peg tracker
        </h2>
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

      <div className="glass h-52 w-full rounded-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={coin.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
            <YAxis
              domain={[0.995, 1.005]}
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }}
              tickFormatter={(v: number) => `$${v.toFixed(3)}`}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(4)}`, coin.label]}
              contentStyle={tooltipStyle}
              cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <ReferenceArea y1={0.995} y2={1.005} fill="#ffd12f" fillOpacity={0.05} />
            <ReferenceLine y={1} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0000ff"
              strokeWidth={2}
              dot={{ r: 3, fill: '#0000ff' }}
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
