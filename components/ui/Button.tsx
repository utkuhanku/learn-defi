import { type ButtonHTMLAttributes } from 'react'

const variantStyles = {
  primary: 'bg-base-blue text-white hover:brightness-110',
  secondary: 'bg-[var(--surface)] text-white/80 hover:bg-[var(--surface-2)] hover:text-white',
  ghost: 'bg-transparent text-white/40 hover:bg-[var(--surface)] hover:text-white',
  success: 'bg-green text-white hover:brightness-110',
  danger: 'bg-red text-white hover:brightness-110',
} as const

const sizeStyles = {
  sm: 'px-4 py-2 text-sm min-h-10',
  md: 'px-5 py-3 text-base min-h-12',
  lg: 'px-7 py-4 text-lg min-h-14',
} as const

type ButtonProps = {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`press cursor-pointer rounded-xl font-semibold tracking-[-0.01em] transition-colors duration-150 ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? 'cursor-not-allowed opacity-40' : ''
      } ${className}`}
      {...props}
    />
  )
}
