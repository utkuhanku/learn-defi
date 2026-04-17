const variantStyles = {
  default: 'bg-gray-10 text-gray-60 dark:bg-gray-80 dark:text-gray-30',
  blue: 'bg-base-blue/10 text-base-blue',
  green: 'bg-green/10 text-green',
  yellow: 'bg-yellow/10 text-yellow',
  red: 'bg-red/10 text-red',
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
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
