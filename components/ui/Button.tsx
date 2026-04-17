import { type ButtonHTMLAttributes } from 'react'

const variantStyles = {
  primary:
    'bg-base-blue text-white hover:brightness-[1.04]',
  secondary:
    'bg-transparent text-[var(--foreground)] border border-gray-30 hover:bg-gray-10 dark:hover:bg-gray-80',
  ghost:
    'bg-transparent text-[var(--text-muted)] hover:bg-gray-10 dark:hover:bg-gray-80',
  success:
    'bg-green text-white hover:brightness-[1.04]',
  danger:
    'bg-red text-white hover:brightness-[1.04]',
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
      className={`min-h-11 cursor-pointer rounded-sm font-medium transition-all duration-120 active:scale-[0.98] ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
      {...props}
    />
  )
}
