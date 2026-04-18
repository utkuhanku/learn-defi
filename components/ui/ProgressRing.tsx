'use client'

type Props = {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  showLabel?: boolean
  className?: string
}

export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  color = '#0000ff',
  showLabel = true,
  className = '',
}: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(value, 0), 100)
  const offset = circumference * (1 - clamped / 100)

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
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
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold tabular-nums">
            {Math.round(clamped)}%
          </span>
        </div>
      )}
    </div>
  )
}
