import { type ButtonHTMLAttributes } from 'react'

const variantStyles = {
  primary:
    'bg-base-blue text-white shadow-[0_0_16px_rgba(0,0,255,0.25)] hover:shadow-[0_0_24px_rgba(0,0,255,0.35)] hover:brightness-[1.08]',
  secondary:
    'glass text-white/80 hover:border-white/20 hover:text-white dark:text-white/80',
  ghost:
    'bg-transparent text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]',
  success:
    'bg-green text-white shadow-[0_0_16px_rgba(102,200,0,0.2)] hover:brightness-[1.08]',
  danger:
    'bg-red text-white shadow-[0_0_16px_rgba(252,64,31,0.2)] hover:brightness-[1.08]',
} as const

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-7 py-4 text-lg',
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
      className={`press min-h-11 cursor-pointer rounded-sm font-medium tracking-[-0.01em] transition-all duration-150 ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? 'cursor-not-allowed opacity-40' : ''
      } ${className}`}
      {...props}
    />
  )
}
