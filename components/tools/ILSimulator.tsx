'use client'

import { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
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
import { useProgress } from '@/stores/useProgress'
import { impermanentLoss } from '@/lib/formulas/impermanentLoss'

const INITIAL_VALUE = 1000

const tooltipStyle = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
}

const PRESETS = [
  { id: 'eth-2x', label: 'ETH 2x', a: 100, b: 0 },
  { id: 'eth-down50', label: 'ETH -50%', a: -50, b: 0 },
  { id: 'both-up', label: 'both +20%', a: 20, b: 20 },
  { id: 'custom', label: 'custom', a: null, b: null },
] as const

type PresetId = (typeof PRESETS)[number]['id']

export function ILSimulator() {
  const [preset, setPreset] = useState<PresetId>('eth-2x')
  const [priceChangeA, setPriceChangeA] = useState(100)
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

  function handlePreset(id: PresetId) {
    setPreset(id)
    const p = PRESETS.find((x) => x.id === id)
    if (p && p.a !== null && p.b !== null) {
      setPriceChangeA(p.a)
      setPriceChangeB(p.b)
    }
    trackUsage()
  }

  const ratioA = 1 + priceChangeA / 100
  const ratioB = 1 + priceChangeB / 100
  const priceRatio = ratioB > 0 ? ratioA / ratioB : ratioA
  const il = impermanentLoss(priceRatio)
  const holdValue = INITIAL_VALUE * ((ratioA + ratioB) / 2)
  const lpValue = holdValue * (1 + il)
  const ilPct = il * 100
  const ilAbs = Math.abs(ilPct)

  const feedback =
    ilAbs > 5
      ? { emoji: '😬', text: 'ouch — fees need to cover this' }
      : ilAbs > 2
        ? { emoji: '🤔', text: 'moderate — keep an eye on fees' }
        : ilAbs > 0.01
          ? { emoji: '😌', text: 'minimal — fees should compensate' }
          : { emoji: '🎯', text: 'perfect — no divergence' }

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
    <div>
      {/* scenario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 rounded-2xl bg-[var(--surface)] p-6"
      >
        <div className="mb-2 text-[28px]">🔄</div>
        <p className="text-[15px] italic leading-relaxed text-[var(--text-2)]">
          you put $1,000 into an ETH/USDC pool as an LP. now let&apos;s see
          what happens when prices move.
        </p>
      </motion.div>

      {/* presets */}
      <div className="mb-6">
        <p className="label mb-3">quick scenarios</p>
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

      {/* sliders — shown in custom mode */}
      {preset === 'custom' && (
        <div className="mb-8 space-y-4">
          <div className="rounded-2xl bg-[var(--surface)] p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="label">token A price change</span>
              <span className="text-lg font-bold tabular-nums tracking-[-0.02em]">
                {priceChangeA > 0 ? '+' : ''}{priceChangeA}%
              </span>
            </div>
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
          <div className="rounded-2xl bg-[var(--surface)] p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="label">token B price change</span>
              <span className="text-lg font-bold tabular-nums tracking-[-0.02em]">
                {priceChangeB > 0 ? '+' : ''}{priceChangeB}%
              </span>
            </div>
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
      )}

      {/* results — side by side */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[var(--surface)] p-6 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-3)]">
            if you held
          </p>
          <p className="text-4xl font-bold tabular-nums tracking-[-0.02em]">
            ${holdValue.toFixed(0)}
          </p>
        </div>
        <div className="rounded-2xl bg-base-blue/5 p-6 text-center ring-1 ring-base-blue/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-3)]">
            as LP
          </p>
          <p className="text-4xl font-bold tabular-nums tracking-[-0.02em]">
            ${lpValue.toFixed(0)}
          </p>
          <p className="mt-2 text-sm text-[var(--text-3)]">
            IL: <span className="font-bold text-red tabular-nums">{ilPct.toFixed(2)}%</span>
          </p>
        </div>
      </div>

      {/* feedback */}
      <div className="mb-8 text-center">
        <p className="text-3xl">{feedback.emoji}</p>
        <p className="mt-1 text-sm text-[var(--text-2)]">{feedback.text}</p>
      </div>

      {/* chart */}
      <div className="h-56 w-full rounded-2xl bg-[var(--surface)] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="change"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }}
              interval={3}
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
            <Area type="monotone" dataKey="hold" stroke="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.04)" name="HODL" />
            <Area type="monotone" dataKey="lp" stroke="#0000ff" fill="rgba(0,0,255,0.08)" name="LP" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* fun fact */}
      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-sm italic leading-relaxed text-[var(--text-3)]">
          💡 impermanent loss is only &quot;impermanent&quot; if prices return to their
          original ratio. if you withdraw early, it&apos;s permanent.
        </p>
      </div>
    </div>
  )
}
