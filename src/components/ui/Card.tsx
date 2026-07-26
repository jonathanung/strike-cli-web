import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  /** Slightly raised fill (bg-elevated) */
  elevated?: boolean
  /** Interactive hover: focus surface */
  interactive?: boolean
  as?: 'div' | 'article' | 'li' | 'figure'
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>

export function Card({
  children,
  className = '',
  elevated = false,
  interactive = false,
  as: Tag = 'div',
  ...rest
}: CardProps) {
  return (
    <Tag
      className={`min-w-0 rounded-lg border border-border-muted ${
        elevated ? 'bg-bg-elevated' : 'bg-surface'
      } ${
        interactive
          ? 'transition-colors hover:border-border hover:bg-surface-focus'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
