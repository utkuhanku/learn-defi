type ProgressProps = {
  value: number
  max?: number
  size?: 'sm' | 'md'
  color?: string
  className?: string
}

export function Progress({
  value,
  max = 100,
  size = 'sm',
  color = 'bg-base-blue',
  className = '',
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const h = size === 'sm' ? 'h-1' : 'h-2'

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`${h} w-full overflow-hidden rounded-full bg-[var(--surface-2)] ${className}`}
    >
      <div
        className={`${h} rounded-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
