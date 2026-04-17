const FILL = {
  blue: '#0000ff',
  white: '#ffffff',
  black: '#0a0b0d',
} as const

type BaseSquareProps = {
  size?: number
  variant?: keyof typeof FILL
  /** When true (default), hides from screen readers. Set false + provide aria-label for standalone use. */
  decorative?: boolean
  className?: string
} & React.SVGProps<SVGSVGElement>

export function BaseSquare({
  size = 32,
  variant = 'blue',
  decorative = true,
  className,
  ...props
}: BaseSquareProps) {
  const r = size * 0.22

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...(decorative
        ? { 'aria-hidden': true, role: 'presentation' }
        : {})}
      {...props}
    >
      <rect
        width={size}
        height={size}
        rx={r}
        ry={r}
        fill={FILL[variant]}
      />
    </svg>
  )
}
