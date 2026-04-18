type CardProps = {
  /** kept for API compatibility; all cards now use glass surface */
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
      className={`glass rounded-md p-5 ${hoverable ? 'glass-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
