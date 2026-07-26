import type { ReactNode } from 'react'

type CodeBlockProps = {
  children: ReactNode
  className?: string
  /** Optional title bar label, e.g. terminal */
  label?: string
  /** Right-side title bar slot (e.g. copy control) */
  action?: ReactNode
}

export function CodeBlock({ children, className = '', label, action }: CodeBlockProps) {
  const showChrome = Boolean(label || action)

  return (
    <div
      className={`overflow-hidden rounded-lg border border-border-muted bg-terminal-bg ${className}`}
    >
      {showChrome ? (
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border-muted bg-bg-elevated px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="size-1.5 shrink-0 rounded-full bg-accent"
              aria-hidden
            />
            {label ? (
              <span className="truncate font-mono text-xs text-terminal-comment">{label}</span>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-terminal-fg sm:text-[0.9375rem]">
        <code>{children}</code>
      </pre>
    </div>
  )
}
