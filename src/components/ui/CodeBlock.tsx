import type { ReactNode } from 'react'

type CodeBlockProps = {
  children: ReactNode
  className?: string
  /** Optional title bar label, e.g. terminal */
  label?: string
}

export function CodeBlock({ children, className = '', label }: CodeBlockProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-terminal-bg shadow-[0_0_30px_-18px] shadow-accent-glow/20 ${className}`}
    >
      {label ? (
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-border" aria-hidden />
          <span className="size-2.5 rounded-full bg-border" aria-hidden />
          <span className="size-2.5 rounded-full bg-border" aria-hidden />
          <span className="ml-2 font-mono text-xs text-terminal-comment">{label}</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-terminal-fg sm:text-[0.9375rem]">
        <code>{children}</code>
      </pre>
    </div>
  )
}
