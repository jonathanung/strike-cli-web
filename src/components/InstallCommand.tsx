import { useCallback, useEffect, useState } from 'react'
import { Check, Copy, Github } from 'lucide-react'
import { copyToClipboard } from '../lib/copy'

export const INSTALL_COMMAND =
  'curl -fsSL https://strike.jonathanung.ca/install | bash'

const GITHUB_URL = 'https://github.com/jonathanung/strike-cli'

export function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  const handleCopy = useCallback(async () => {
    setError(null)
    const result = await copyToClipboard(INSTALL_COMMAND)
    if (result.ok) {
      setCopied(true)
    } else {
      setError(result.error)
    }
  }, [])

  return (
    <div className="w-full min-w-0 max-w-full">
      <div
        className={`min-w-0 overflow-hidden rounded-2xl border bg-terminal-bg shadow-[0_0_60px_-20px] shadow-accent-glow/40 transition-colors duration-300 ${
          copied ? 'border-neon-pink' : 'border-border'
        }`}
      >
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full bg-neon-pink/70" aria-hidden />
            <span className="size-2.5 shrink-0 rounded-full bg-bolt" aria-hidden />
            <span className="size-2.5 shrink-0 rounded-full bg-terminal-green" aria-hidden />
            <span className="ml-2 font-mono text-xs text-terminal-comment">install</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy install command'}
            className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-terminal-bg ${
              copied
                ? 'bg-neon-pink/20 text-neon-pink'
                : 'bg-surface text-text-muted hover:bg-accent-soft hover:text-text'
            }`}
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-neon-pink" aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" aria-hidden />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="flex min-w-0 items-start gap-3 overflow-x-auto p-4 sm:p-5">
          <span
            className="select-none font-mono text-sm text-terminal-green sm:text-base"
            aria-hidden
          >
            $
          </span>
          <code className="min-w-0 font-mono text-sm leading-relaxed whitespace-nowrap text-terminal-fg sm:text-base">
            {INSTALL_COMMAND}
          </code>
        </div>
      </div>

      <div className="mt-3 min-h-5 text-left" aria-live="polite">
        {error ? (
          <p className="text-sm text-text-muted" role="status">
            {error}
          </p>
        ) : copied ? (
          <p className="text-sm text-neon-pink">Command copied to clipboard</p>
        ) : null}
      </div>

      <div className="mt-1 flex min-w-0 items-center justify-start gap-2 px-1">
        <p className="min-w-0 text-xs text-text-muted sm:text-sm">and it&apos;s open source.</p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Strike CLI on GitHub"
          className="inline-flex size-9 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-all hover:border-accent/50 hover:bg-accent-soft hover:text-accent hover:shadow-[0_0_24px_-6px] hover:shadow-accent-glow/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Github className="size-3.5" />
        </a>
      </div>
    </div>
  )
}
