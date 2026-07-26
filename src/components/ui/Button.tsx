import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

const base =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-accent text-bg hover:bg-accent/90',
  secondary:
    'border border-border-muted bg-surface text-text hover:border-border hover:bg-surface-focus hover:text-accent',
  ghost: 'text-text-muted hover:bg-accent-soft hover:text-accent',
  soft: 'bg-accent-soft text-accent hover:bg-surface-focus',
} as const

export type ButtonVariant = keyof typeof variants

type Common = {
  variant?: ButtonVariant
  className?: string
  children: ReactNode
}

type ButtonAsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: undefined
  }

type ButtonAsLink = Common &
  Omit<LinkProps, 'className' | 'children'> & {
    to: LinkProps['to']
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest
    return (
      <Link to={to} className={cls} {...linkRest}>
        {children}
      </Link>
    )
  }

  const buttonRest = rest as ButtonAsButton
  return (
    <button type={buttonRest.type ?? 'button'} className={cls} {...buttonRest}>
      {children}
    </button>
  )
}
