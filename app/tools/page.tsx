'use client'

import Link from 'next/link'
import {
  Fuel,
  LineChart,
  ShieldCheck,
  ArrowLeftRight,
  Calculator,
  Lock,
} from 'lucide-react'
import { AppShell } from '@/components/ui/AppShell'
import { Chip } from '@/components/ui/Chip'
import { useProgress } from '@/stores/useProgress'

const tools = [
  {
    id: 'gas-comparator',
    name: 'gas cost comparator',
    desc: 'compare Ethereum L1 vs Base transaction costs',
    href: '/module/defi-basics/tool',
    icon: Fuel,
    locked: false,
  },
  {
    id: 'peg-tracker',
    name: 'stablecoin peg tracker',
    desc: '7-day peg deviation for USDC, USDT, DAI',
    href: '/module/stablecoins/tool',
    icon: LineChart,
    locked: false,
  },
  {
    id: 'health-factor-calc',
    name: 'health factor calculator',
    desc: 'check if your lending position is safe',
    href: '/module/lending/tool',
    icon: ShieldCheck,
    locked: false,
  },
  {
    id: 'il-simulator',
    name: 'impermanent loss simulator',
    desc: 'see how price changes affect your LP position',
    href: '/module/dex-swaps/tool',
    icon: ArrowLeftRight,
    locked: false,
  },
  {
    id: 'apr-apy-calc',
    name: 'APR → APY calculator',
    desc: 'compare compounding frequencies and returns',
    href: '/module/yield/tool',
    icon: Calculator,
    locked: false,
  },
  {
    id: 'strategy-calc',
    name: 'defi strategy calculator',
    desc: 'delta-neutral, funding rate scenarios',
    href: '#',
    icon: Calculator,
    locked: true,
  },
]

export default function ToolsPage() {
  const { toolsUsed } = useProgress()

  return (
    <AppShell>
      <div className="px-4 py-8">
        <h1 className="mb-8 text-3xl font-semibold tracking-[-0.02em]">
          calculators
        </h1>
        <div className="space-y-3">
          {tools.map((tool) => {
            const used = toolsUsed.includes(tool.id)
            const Icon = tool.icon

            if (tool.locked) {
              return (
                <div
                  key={tool.id}
                  className="glass flex items-center gap-4 rounded-md p-4 opacity-30"
                >
                  <Lock
                    size={22}
                    strokeWidth={1.5}
                    className="shrink-0 text-[var(--text-muted)]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium tracking-[-0.01em]">
                      {tool.name}
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">
                      coming soon
                    </p>
                  </div>
                </div>
              )
            }

            return (
              <Link key={tool.id} href={tool.href}>
                <div className="glass glass-hover press flex cursor-pointer items-center gap-4 rounded-md p-4">
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className="shrink-0 text-base-blue"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,255,0.3))' }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium tracking-[-0.01em]">
                      {tool.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {tool.desc}
                    </p>
                  </div>
                  {used && <Chip variant="green">used</Chip>}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
