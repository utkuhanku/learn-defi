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
import { useProgress } from '@/stores/useProgress'

const COINS = {
  USDC: {
    label: 'USDC',
    issuer: 'Circle',
    type: 'fiat-backed',
    health: '🟢 rock solid',
    healthColor: 'text-green',
    healthBg: 'bg-green/5 ring-green/20',
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
    issuer: 'Tether',
    type: 'fiat-backed',
    health: '🟡 mostly stable',
    healthColor: 'text-yellow',
    healthBg: 'bg-yellow/5 ring-yellow/20',
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
    issuer: 'MakerDAO',
    type: 'crypto-backed',
    health: '🟠 more volatile',
    healthColor: 'text-[#ff8800]',
    healthBg: 'bg-[#ff8800]/5 ring-[#ff8800]/20',
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
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
}

function maxDeviation(data: { price: number }[]): number {
  return Math.max(...data.map((d) => Math.abs(d.price - 1)))
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
  const deviation = maxDeviation(coin.data)

  return (
    <div>
      {/* scenario */}
      <div className="mb-8 rounded-2xl bg-[var(--surface)] p-6">
        <div className="mb-2 text-[28px]">💵</div>
        <p className="text-[15px] italic leading-relaxed text-[var(--text-2)]">
          you just converted $10,000 to stablecoins. let&apos;s check how stable
          they really are.
        </p>
      </div>

      {/* coin pills */}
      <div className="mb-6">
        <p className="label mb-3">pick a stablecoin</p>
        <div className="flex gap-2">
          {(Object.keys(COINS) as CoinKey[]).map((key) => {
            const active = selected === key
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`press flex-1 cursor-pointer rounded-xl py-3 text-sm font-semibold tracking-[-0.01em] transition-colors duration-150 ${
                  active
                    ? 'bg-base-blue text-white'
                    : 'bg-[var(--surface)] text-white/70 hover:bg-[var(--surface-2)]'
                }`}
              >
                {key}
              </button>
            )
          })}
        </div>
      </div>

      {/* chart */}
      <div className="mb-8 h-64 w-full rounded-2xl bg-[var(--surface)] p-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={coin.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.25)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0.995, 1.005]}
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.25)' }}
              tickFormatter={(v: number) => `$${v.toFixed(3)}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(4)}`, coin.label]}
              contentStyle={tooltipStyle}
              cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <ReferenceArea y1={0.995} y2={1.005} fill="#ffd12f" fillOpacity={0.04} />
            <ReferenceLine y={1} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0000ff"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#0000ff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* health score */}
      <div className={`mb-8 rounded-2xl p-6 text-center ring-1 ${coin.healthBg}`}>
        <p className="label mb-3">health score</p>
        <p className={`text-2xl font-bold tracking-[-0.02em] ${coin.healthColor}`}>
          {coin.health}
        </p>
        <p className="mt-4 text-sm text-[var(--text-3)]">
          max deviation this week:{' '}
          <span className="font-bold tabular-nums text-white">
            ${deviation.toFixed(4)}
          </span>
        </p>
        <p className="mt-3 text-xs text-[var(--text-3)]">
          issued by {coin.issuer} · {coin.type}
        </p>
      </div>

      {/* fun fact */}
      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-sm italic leading-relaxed text-[var(--text-3)]">
          💡 USDC on Base is natively issued by Circle — no bridge risk, no
          wrapping.
        </p>
      </div>
    </div>
  )
}
