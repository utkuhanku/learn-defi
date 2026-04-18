type CardProps = {
  /** kept for API compat */
  variant?: 'default' | 'surface'
  hoverable?: boolean
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function Card({
  variant,
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  void variant
  return (
    <div
      className={`rounded-xl bg-[var(--surface)] p-5 ${
        hoverable
          ? 'press cursor-pointer transition-colors duration-150 hover:bg-[var(--surface-2)]'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
