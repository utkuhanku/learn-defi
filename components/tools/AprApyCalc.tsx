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
import { useProgress } from '@/stores/useProgress'
import { aprToApy } from '@/lib/formulas/aprToApy'

const FREQUENCIES = [
  { label: 'daily', n: 365 },
  { label: 'weekly', n: 52 },
  { label: 'monthly', n: 12 },
  { label: 'yearly', n: 1 },
] as const

const PRESETS = [
  { id: 'safe', label: 'safe 5%', apr: 5 },
  { id: 'moderate', label: 'moderate 20%', apr: 20 },
  { id: 'degen', label: 'degen 100%', apr: 100 },
  { id: 'custom', label: 'custom', apr: null },
] as const

type PresetId = (typeof PRESETS)[number]['id']

const tooltipStyle = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
}

export function AprApyCalc() {
  const [preset, setPreset] = useState<PresetId>('degen')
  const [apr, setApr] = useState(100)
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

  function handlePreset(id: PresetId) {
    setPreset(id)
    const p = PRESETS.find((x) => x.id === id)
    if (p && p.apr !== null) setApr(p.apr)
    trackUsage()
  }

  // daily APY (best case) for headline
  const apyDaily = aprToApy(apr / 100, 365)
  const years = months / 12
  const compoundFinal = amount * Math.pow(1 + apyDaily, years)
  const simpleFinal = amount * (1 + (apr / 100) * years)
  const advantage = compoundFinal - simpleFinal

  // frequency comparison table
  const freqRows = FREQUENCIES.map((f) => {
    const apy = aprToApy(apr / 100, f.n)
    const final = amount * Math.pow(1 + apy, years)
    return { label: f.label, apy: apy * 100, final }
  })

  const chartData = useMemo(() => {
    const points = []
    for (let m = 0; m <= months; m++) {
      const y = m / 12
      points.push({
        month: m,
        compound: Math.round(amount * Math.pow(1 + apyDaily, y)),
        simple: Math.round(amount * (1 + (apr / 100) * y)),
      })
    }
    return points
  }, [amount, apr, apyDaily, months])

  return (
    <div>
      {/* scenario */}
      <div className="mb-8 rounded-2xl bg-[var(--surface)] p-6">
        <div className="mb-2 text-[28px]">🌾</div>
        <p className="text-[15px] italic leading-relaxed text-[var(--text-2)]">
          a protocol advertises a juicy APR. but what does that actually mean
          for your money? let&apos;s find out.
        </p>
      </div>

      {/* APR presets */}
      <div className="mb-6">
        <p className="label mb-3">pick a yield</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = preset === p.id
            return (
              <button
                key={p.id}
                onClick={() => handlePreset(p.id)}
                className={`press cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold tracking-[-0.01em] transition-colors duration-150 ${
                  active
                    ? 'bg-base-blue text-white'
                    : 'bg-[var(--surface)] text-white/70 hover:bg-[var(--surface-2)]'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {preset === 'custom' && (
        <div className="mb-6 rounded-2xl bg-[var(--surface)] p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">APR</span>
            <span className="text-lg font-bold tabular-nums tracking-[-0.02em]">
              {apr}%
            </span>
          </div>
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
      )}

      {/* amount + duration */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[var(--surface)] p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">invest</span>
            <span className="text-sm font-bold tabular-nums">
              ${amount.toLocaleString()}
            </span>
          </div>
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
        <div className="rounded-2xl bg-[var(--surface)] p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">duration</span>
            <span className="text-sm font-bold tabular-nums">{months}mo</span>
          </div>
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

      {/* big APY display */}
      <div className="mb-8 rounded-2xl bg-base-blue/5 p-6 text-center ring-1 ring-base-blue/20">
        <p className="label mb-2">APR: {apr}%</p>
        <p className="text-sm text-[var(--text-3)]">↓</p>
        <p className="mt-1 text-5xl font-bold tracking-[-0.03em] text-base-blue">
          {(apyDaily * 100).toFixed(1)}%
        </p>
        <p className="mt-1 text-sm text-[var(--text-3)]">APY compounded daily</p>

        <div className="mt-6 border-t border-[var(--border)] pt-6">
          <p className="text-sm text-[var(--text-3)]">
            ${amount.toLocaleString()} →
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-[-0.02em]">
            ${compoundFinal.toFixed(0).toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-green tabular-nums">
            compound bonus: +${advantage.toFixed(0)}
          </p>
        </div>
      </div>

      {/* frequency comparison table */}
      <div className="mb-8">
        <p className="label mb-3">frequency comparison</p>
        <div className="overflow-hidden rounded-2xl bg-[var(--surface)]">
          {freqRows.map((r, i) => {
            const isBest = i === 0
            return (
              <div
                key={r.label}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i < freqRows.length - 1 ? 'border-b border-[var(--border)]' : ''
                } ${isBest ? 'bg-base-blue/5' : ''}`}
              >
                <span
                  className={`text-sm ${
                    isBest ? 'font-bold text-base-blue' : 'font-medium text-white/80'
                  }`}
                >
                  {r.label}
                </span>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm tabular-nums ${
                      isBest ? 'font-bold text-base-blue' : 'text-white/60'
                    }`}
                  >
                    {r.apy.toFixed(1)}%
                  </span>
                  <span
                    className={`w-20 text-right text-sm tabular-nums ${
                      isBest ? 'font-bold text-white' : 'text-[var(--text-3)]'
                    }`}
                  >
                    ${r.final.toFixed(0)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* chart */}
      <div className="h-56 w-full rounded-2xl bg-[var(--surface)] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.25)' }}
              tickFormatter={(v: number) => `${v}mo`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.25)' }}
              tickFormatter={(v: number) => `$${v}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
            <Line type="monotone" dataKey="compound" stroke="#0000ff" strokeWidth={2} dot={false} name="compound" />
            <Line type="monotone" dataKey="simple" stroke="rgba(255,255,255,0.3)" strokeWidth={2} dot={false} name="simple" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* fun fact */}
      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-sm italic leading-relaxed text-[var(--text-3)]">
          💡 at 100% APR, daily compounding gives you 171% APY. that&apos;s 3.4x
          more than simple interest.
        </p>
      </div>
    </div>
  )
}
