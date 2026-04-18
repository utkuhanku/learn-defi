'use client'

import { useState, useRef, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { NumberTicker } from '@/components/ui/NumberTicker'
import { useProgress } from '@/stores/useProgress'
import { aprToApy } from '@/lib/formulas/aprToApy'

const FREQUENCIES = [
  { label: 'daily', n: 365 },
  { label: 'weekly', n: 52 },
  { label: 'monthly', n: 12 },
  { label: 'yearly', n: 1 },
  { label: 'continuous', n: Infinity },
] as const

const tooltipStyle = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
}

export function AprApyCalc() {
  const [apr, setApr] = useState(10)
  const [freqIndex, setFreqIndex] = useState(0)
  const [amount, setAmount] = useState(1000)
  const [months, setMonths] = useState(12)
  const { markToolUsed, addXp, toolsUsed } = useProgress()
  const trackedRef = useRef(false)

  function trackUsage() {
    if (!trackedRef.current && !toolsUsed.includes('apr-apy-calc')) {
      markToolUsed('apr-apy-calc')
      addXp(15)
      trackedRef.current = true
    }
  }

  const freq = FREQUENCIES[freqIndex]
  const apy = aprToApy(apr / 100, freq.n)
  const years = months / 12
  const compoundFinal = amount * Math.pow(1 + apy, years)
  const simpleFinal = amount * (1 + (apr / 100) * years)
  const advantage = compoundFinal - simpleFinal

  const chartData = useMemo(() => {
    const points = []
    for (let m = 0; m <= months; m++) {
      const y = m / 12
      points.push({
        month: m,
        compound: Math.round(amount * Math.pow(1 + apy, y)),
        simple: Math.round(amount * (1 + (apr / 100) * y)),
      })
    }
    return points
  }, [amount, apr, apy, months])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-[-0.02em]">
          APR → APY calculator
        </h2>
        <p className="mt-1 text-sm text-[var(--text-3)]">
          see how compounding frequency affects your returns
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-2)]">APR: {apr}%</label>
        <input
          type="range"
          min={1}
          max={200}
          step={1}
          value={apr}
          onChange={(e) => { setApr(Number(e.target.value)); trackUsage() }}
          className="w-full accent-base-blue"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-2)]">compounding</label>
        <div className="flex flex-wrap gap-2">
          {FREQUENCIES.map((f, i) => (
            <Button
              key={f.label}
              variant={freqIndex === i ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => { setFreqIndex(i); trackUsage() }}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)]">
            invest: ${amount.toLocaleString()}
          </label>
          <input
            type="range"
            min={100}
            max={100000}
            step={100}
            value={amount}
            onChange={(e) => { setAmount(Number(e.target.value)); trackUsage() }}
            className="w-full accent-base-blue"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)]">
            duration: {months}mo
          </label>
          <input
            type="range"
            min={1}
            max={60}
            step={1}
            value={months}
            onChange={(e) => { setMonths(Number(e.target.value)); trackUsage() }}
            className="w-full accent-base-blue"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 rounded-xl bg-[var(--surface)] p-6">
        <span className="text-sm text-[var(--text-3)]">APY:</span>
        <span className="text-4xl font-bold tracking-[-0.02em] text-white">
          <NumberTicker value={Math.round(apy * 10000) / 100} />%
        </span>
      </div>

      <div className="h-56 w-full rounded-xl bg-[var(--surface)] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.25)' }} tickFormatter={(v: number) => `${v}mo`} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.25)' }} tickFormatter={(v: number) => `$${v}`} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
            <Line type="monotone" dataKey="compound" stroke="#0000ff" strokeWidth={2} dot={false} name="compound" />
            <Line type="monotone" dataKey="simple" stroke="rgba(255,255,255,0.3)" strokeWidth={2} dot={false} name="simple" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-[var(--text-2)]">compound advantage:</span>
        <Chip variant="green">+${advantage.toFixed(0)}</Chip>
      </div>
    </div>
  )
}
