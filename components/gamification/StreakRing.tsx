'use client'

type Props = {
  current: number
  longest: number
  size?: number
}

export function StreakRing({ current, longest, size = 96 }: Props) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(current / 30, 1)
  const dashOffset = circumference * (1 - progress)
  const isActive = current >= 7
  const color = isActive ? '#ffd12f' : 'rgba(255,255,255,0.4)'

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          filter: isActive ? 'drop-shadow(0 0 16px rgba(255,209,47,0.3))' : undefined,
        }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-[-0.02em]">{current}</span>
          <span className="text-xs text-[var(--text-muted)]">days</span>
        </div>
      </div>
      <span className="text-xs text-[var(--text-dim)]">longest: {longest}</span>
    </div>
  )
}
