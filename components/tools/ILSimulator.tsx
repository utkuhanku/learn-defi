'use client'

import { useState, useRef, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Chip } from '@/components/ui/Chip'
import { useProgress } from '@/stores/useProgress'
import { impermanentLoss } from '@/lib/formulas/impermanentLoss'

const INITIAL_VALUE = 1000

const tooltipStyle = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
}

export function ILSimulator() {
  const [priceChangeA, setPriceChangeA] = useState(0)
  const [priceChangeB, setPriceChangeB] = useState(0)
  const { markToolUsed, addXp, toolsUsed } = useProgress()
  const trackedRef = useRef(false)

  function trackUsage() {
    if (!trackedRef.current && !toolsUsed.includes('il-simulator')) {
      markToolUsed('il-simulator')
      addXp(15)
      trackedRef.current = true
    }
  }

  const ratioA = 1 + priceChangeA / 100
  const ratioB = 1 + priceChangeB / 100
  const priceRatio = ratioB > 0 ? ratioA / ratioB : ratioA
  const il = impermanentLoss(priceRatio)
  const holdValue = INITIAL_VALUE * ((ratioA + ratioB) / 2)
  const lpValue = holdValue * (1 + il)

  const chartData = useMemo(() => {
    const points = []
    for (let pct = -80; pct <= 300; pct += 10) {
      const r = (1 + pct / 100) / ratioB
      const ilPct = impermanentLoss(r > 0 ? r : 0.001)
      const hv = INITIAL_VALUE * ((1 + pct / 100 + ratioB) / 2)
      points.push({
        change: `${pct}%`,
        hold: Math.round(hv),
        lp: Math.round(hv * (1 + ilPct)),
      })
    }
    return points
  }, [ratioB])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-[-0.02em]">
          impermanent loss simulator
        </h2>
        <p className="mt-1 text-sm text-[var(--text-3)]">
          see how price changes affect your LP position
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)]">
            token A price change: {priceChangeA > 0 ? '+' : ''}{priceChangeA}%
          </label>
          <input
            type="range"
            min={-90}
            max={500}
            step={5}
            value={priceChangeA}
            onChange={(e) => { setPriceChangeA(Number(e.target.value)); trackUsage() }}
            className="w-full accent-base-blue"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)]">
            token B price change: {priceChangeB > 0 ? '+' : ''}{priceChangeB}%
          </label>
          <input
            type="range"
            min={-90}
            max={500}
            step={5}
            value={priceChangeB}
            onChange={(e) => { setPriceChangeB(Number(e.target.value)); trackUsage() }}
            className="w-full accent-base-blue"
          />
        </div>
      </div>

      <div className="h-56 w-full rounded-xl bg-[var(--surface)] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="change" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} interval={3} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.25)' }} tickFormatter={(v: number) => `$${v}`} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
            <Area type="monotone" dataKey="hold" stroke="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.04)" name="HODL" />
            <Area type="monotone" dataKey="lp" stroke="#0000ff" fill="rgba(0,0,255,0.08)" name="LP" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-3)]">if you held</p>
          <p className="mt-1 text-xl font-bold tracking-[-0.02em]">${holdValue.toFixed(0)}</p>
        </div>
        <div className="rounded-xl bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--text-3)]">as LP</p>
          <p className="mt-1 text-xl font-bold tracking-[-0.02em]">${lpValue.toFixed(0)}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-[var(--text-2)]">impermanent loss:</span>
        <Chip variant="red">{(il * 100).toFixed(2)}%</Chip>
      </div>
    </div>
  )
}
