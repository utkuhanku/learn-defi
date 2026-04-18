const variantStyles = {
  default: 'bg-[var(--surface)] text-[var(--text-2)]',
  blue: 'bg-base-blue/15 text-base-blue',
  green: 'bg-green/15 text-green',
  yellow: 'bg-yellow/15 text-yellow',
  red: 'bg-red/15 text-red',
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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-[-0.01em] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
