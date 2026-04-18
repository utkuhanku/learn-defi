'use client'

type Props = {
  current: number
  longest: number
  size?: number
}

export function StreakRing({ current, longest, size = 80 }: Props) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(current / 30, 1)
  const dashOffset = circumference * (1 - progress)
  const color = current >= 7 ? 'var(--color-yellow, #ffd12f)' : 'var(--color-gray-50, #717886)'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          {/* fill */}
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
        {/* center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{current}</span>
          <span className="text-xs text-[var(--text-muted)]">days</span>
        </div>
      </div>
      <span className="text-xs text-[var(--text-muted)]">
        longest: {longest}
      </span>
    </div>
  )
}
