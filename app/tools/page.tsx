'use client'

import Link from 'next/link'
import {
  Fuel,
  LineChart,
  ShieldCheck,
  ArrowLeftRight,
  Calculator,
  Lock,
  ChevronRight,
} from 'lucide-react'
import { AppShell } from '@/components/ui/AppShell'
import { Chip } from '@/components/ui/Chip'
import { useProgress } from '@/stores/useProgress'

const tools = [
  {
    id: 'gas-comparator',
    name: 'gas cost comparator',
    desc: 'Ethereum L1 vs Base costs',
    href: '/module/defi-basics/tool',
    icon: Fuel,
    locked: false,
  },
  {
    id: 'peg-tracker',
    name: 'stablecoin peg tracker',
    desc: '7-day peg deviation',
    href: '/module/stablecoins/tool',
    icon: LineChart,
    locked: false,
  },
  {
    id: 'health-factor-calc',
    name: 'health factor calculator',
    desc: 'lending position safety',
    href: '/module/lending/tool',
    icon: ShieldCheck,
    locked: false,
  },
  {
    id: 'il-simulator',
    name: 'impermanent loss simulator',
    desc: 'LP vs HODL comparison',
    href: '/module/dex-swaps/tool',
    icon: ArrowLeftRight,
    locked: false,
  },
  {
    id: 'apr-apy-calc',
    name: 'APR → APY calculator',
    desc: 'compounding frequencies',
    href: '/module/yield/tool',
    icon: Calculator,
    locked: false,
  },
  {
    id: 'strategy-calc',
    name: 'defi strategy calculator',
    desc: 'delta-neutral scenarios',
    href: '#',
    icon: Calculator,
    locked: true,
  },
]

export default function ToolsPage() {
  const { toolsUsed } = useProgress()

  return (
    <AppShell>
      <div className="px-5 py-8">
        <h1 className="mb-8 text-4xl font-bold tracking-[-0.03em]">
          calculators
        </h1>
        <div className="overflow-hidden rounded-xl bg-[var(--surface)]">
          {tools.map((tool, i) => {
            const used = toolsUsed.includes(tool.id)
            const Icon = tool.icon
            const isLast = i === tools.length - 1

            const rowClasses = `flex items-center gap-4 px-5 py-4 ${
              isLast ? '' : 'border-b border-[var(--border)]'
            }`

            if (tool.locked) {
              return (
                <div
                  key={tool.id}
                  className={`${rowClasses} opacity-30`}
                >
                  <Lock
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 text-[var(--text-3)]"
                  />
                  <div className="flex-1">
                    <p className="text-[15px] font-medium tracking-[-0.01em]">
                      {tool.name}
                    </p>
                    <p className="text-xs text-[var(--text-3)]">coming soon</p>
                  </div>
                </div>
              )
            }

            return (
              <Link key={tool.id} href={tool.href}>
                <div
                  className={`press cursor-pointer transition-colors duration-150 hover:bg-[var(--surface-2)] ${rowClasses}`}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 text-base-blue"
                  />
                  <div className="flex-1">
                    <p className="text-[15px] font-medium tracking-[-0.01em]">
                      {tool.name}
                    </p>
                    <p className="text-xs text-[var(--text-3)]">{tool.desc}</p>
                  </div>
                  {used && <Chip variant="green">used</Chip>}
                  <ChevronRight
                    size={16}
                    className="text-[var(--text-4)]"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
