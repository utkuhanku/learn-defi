type CardProps = {
  variant?: 'default' | 'surface'
  hoverable?: boolean
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function Card({
  variant = 'default',
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const bg =
    variant === 'surface'
      ? 'bg-[var(--surface)]'
      : 'bg-[var(--background)]'

  return (
    <div
      className={`rounded-md border border-[var(--border)] p-5 ${bg} ${
        hoverable ? 'transition-shadow duration-120 hover:shadow-[0_4px_24px_rgba(0,0,255,0.08)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
