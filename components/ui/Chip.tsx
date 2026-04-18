const variantStyles = {
  default: 'bg-white/[0.06] text-[var(--text-secondary)] border border-white/[0.06]',
  blue: 'bg-base-blue/10 text-base-blue border border-base-blue/20',
  green: 'bg-green/10 text-green border border-green/20',
  yellow: 'bg-yellow/10 text-yellow border border-yellow/20',
  red: 'bg-red/10 text-red border border-red/20',
} as const

type ChipProps = {
  variant?: keyof typeof variantStyles
  className?: string
  children: React.ReactNode
}

export function Chip({
  variant = 'default',
  className = '',
  children,
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-[-0.01em] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
