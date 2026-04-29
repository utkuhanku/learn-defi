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

const LESSON_COUNT = 5

type Tool = {
  id: string
  name: string
  desc: string
  href: string
  icon: typeof Fuel
  /** Module slug whose lessons unlock this tool. null = always locked (coming soon). */
  moduleSlug: string | null
}

const tools: Tool[] = [
  {
    id: 'gas-comparator',
    name: 'gas cost comparator',
    desc: 'Ethereum L1 vs Base costs',
    href: '/module/defi-basics/tool',
    icon: Fuel,
    moduleSlug: 'defi-basics',
  },
  {
    id: 'peg-tracker',
    name: 'stablecoin peg tracker',
    desc: '7-day peg deviation',
    href: '/module/stablecoins/tool',
    icon: LineChart,
    moduleSlug: 'stablecoins',
  },
  {
    id: 'health-factor-calc',
    name: 'health factor calculator',
    desc: 'lending position safety',
    href: '/module/lending/tool',
    icon: ShieldCheck,
    moduleSlug: 'lending',
  },
  {
    id: 'il-simulator',
    name: 'impermanent loss simulator',
    desc: 'LP vs HODL comparison',
    href: '/module/dex-swaps/tool',
    icon: ArrowLeftRight,
    moduleSlug: 'dex-swaps',
  },
  {
    id: 'apr-apy-calc',
    name: 'APR → APY calculator',
    desc: 'compounding frequencies',
    href: '/module/yield/tool',
    icon: Calculator,
    moduleSlug: 'yield',
  },
  {
    id: 'strategy-calc',
    name: 'defi strategy calculator',
    desc: 'delta-neutral scenarios',
    href: '#',
    icon: Calculator,
    moduleSlug: null,
  },
]

export default function ToolsPage() {
  const { toolsUsed, completedLessons } = useProgress()

  function isUnlocked(moduleSlug: string | null): boolean {
    if (!moduleSlug) return false
    const lessonIds = Array.from(
      { length: LESSON_COUNT },
      (_, i) => `${moduleSlug}-${i + 1}`,
    )
    return lessonIds.every((id) => completedLessons[id])
  }

  function lessonProgress(moduleSlug: string | null): string {
    if (!moduleSlug) return 'coming soon'
    const lessonIds = Array.from(
      { length: LESSON_COUNT },
      (_, i) => `${moduleSlug}-${i + 1}`,
    )
    const done = lessonIds.filter((id) => completedLessons[id]).length
    return `complete ${LESSON_COUNT - done} more lesson${
      LESSON_COUNT - done === 1 ? '' : 's'
    } to unlock`
  }

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
            const unlocked = isUnlocked(tool.moduleSlug)
            const comingSoon = tool.moduleSlug === null

            const rowClasses = `flex items-center gap-4 px-5 py-4 ${
              isLast ? '' : 'border-b border-[var(--border)]'
            }`

            // Coming soon — fully locked
            if (comingSoon) {
              return (
                <div key={tool.id} className={`${rowClasses} opacity-30`}>
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

            // Locked — module not yet completed
            if (!unlocked) {
              return (
                <div key={tool.id} className={`${rowClasses} opacity-40`}>
                  <Lock
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 text-[var(--text-3)]"
                  />
                  <div className="flex-1">
                    <p className="text-[15px] font-medium tracking-[-0.01em]">
                      {tool.name}
                    </p>
                    <p className="text-xs text-[var(--text-3)]">
                      {lessonProgress(tool.moduleSlug)}
                    </p>
                  </div>
                </div>
              )
            }

            // Unlocked
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
                  <ChevronRight size={16} className="text-[var(--text-4)]" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
