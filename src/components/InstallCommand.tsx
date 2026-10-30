import { useCallback, useEffect, useState } from 'react'
import { Check, Copy, Github } from 'lucide-react'
import { copyToClipboard } from '../lib/copy'
import {
  GITHUB_PRE_RELEASE_URL,
  GITHUB_RELEASES_API,
  GITHUB_RELEASES_LATEST_URL,
  GITHUB_URL,
  PRE_RELEASE_TAG,
} from '../lib/github'
import { CodeBlock } from './ui/CodeBlock'

export const INSTALL_COMMAND =
  'curl -fsSL https://strike.jonathanung.ca/install | bash'

/** The 0.10.x line ships as GitHub pre-releases only, so pin the tag explicitly. */
export const PRERELEASE_INSTALL_COMMAND = `curl -fsSL https://strike.jonathanung.ca/install | bash -s -- --version=${PRE_RELEASE_TAG}`

type InstallChannel = 'stable' | 'prerelease'

export { GITHUB_URL }

const PLATFORMS = [
  'macOS arm64',
  'macOS amd64',
  'Linux arm64',
  'Linux amd64',
  'Windows (WSL2)',
] as const

type LatestRelease = {
  tag: string
  publishedAt: string
}

function formatReleaseDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function useLatestRelease() {
  const [release, setRelease] = useState<LatestRelease | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    const ctrl = new AbortController()

    fetch(GITHUB_RELEASES_API, {
      signal: ctrl.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ tag_name?: string; published_at?: string }>
      })
      .then((data) => {
        if (!data.tag_name || !data.published_at) throw new Error('missing fields')
        setRelease({ tag: data.tag_name, publishedAt: data.published_at })
        setStatus('ok')
      })
      .catch(() => {
        if (!ctrl.signal.aborted) {
          setRelease(null)
          setStatus('error')
        }
      })

    return () => ctrl.abort()
  }, [])

  return { release, status }
}

export function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<InstallChannel>('stable')
  const { release, status } = useLatestRelease()

  const command = channel === 'stable' ? INSTALL_COMMAND : PRERELEASE_INSTALL_COMMAND

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  const handleCopy = useCallback(async () => {
    setError(null)
    const result = await copyToClipboard(command)
    if (result.ok) {
      setCopied(true)
    } else {
      setError(result.error)
    }
  }, [command])

  const copyAction = (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy install command'}
      className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-terminal-bg ${
        copied
          ? 'bg-success/15 text-success'
          : 'bg-surface text-text-muted hover:bg-surface-focus hover:text-text'
      }`}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-success" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3.5" aria-hidden />
          Copy
        </>
      )}
    </button>
  )

  return (
    <div className="w-full min-w-0 max-w-full">
      <div
        className="mb-3 inline-flex items-center gap-1 rounded-md border border-border-muted bg-bg-elevated p-1"
        role="group"
        aria-label="Release channel"
      >
        {(
          [
            { id: 'stable', label: 'Stable' },
            { id: 'prerelease', label: `Pre-release ${PRE_RELEASE_TAG}` },
          ] as const
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={channel === option.id}
            onClick={() => {
              setChannel(option.id)
              setCopied(false)
              setError(null)
            }}
            className={`min-h-9 rounded px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              channel === option.id
                ? 'bg-surface text-accent'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
        {channel === 'stable' && status === 'loading' ? (
          <span className="font-mono text-xs text-text-muted">Checking latest release…</span>
        ) : null}
        {channel === 'prerelease' ? (
          <a
            href={GITHUB_PRE_RELEASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border-muted bg-surface px-3 py-1 font-mono text-xs font-medium text-accent transition-colors hover:border-border hover:bg-surface-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <span>{PRE_RELEASE_TAG}</span>
            <span className="text-text-muted" aria-hidden>
              ·
            </span>
            <span className="text-text-muted">pre-release</span>
          </a>
        ) : null}
        {channel === 'stable' && status === 'ok' && release ? (
          <a
            href={GITHUB_RELEASES_LATEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border-muted bg-surface px-3 py-1 font-mono text-xs font-medium text-accent transition-colors hover:border-border hover:bg-surface-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <span>{release.tag}</span>
            <span className="text-text-muted" aria-hidden>
              ·
            </span>
            <span className="text-text-muted">{formatReleaseDate(release.publishedAt)}</span>
          </a>
        ) : null}
        {channel === 'stable' && status === 'error' ? (
          <a
            href={GITHUB_RELEASES_LATEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center rounded-md border border-border-muted bg-surface px-3 py-1 font-mono text-xs font-medium text-text-muted transition-colors hover:border-border hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Latest release on GitHub
          </a>
        ) : null}

        <ul className="flex min-w-0 flex-wrap gap-1.5" aria-label="Supported platforms">
          {PLATFORMS.map((label) => (
            <li
              key={label}
              className="rounded-md border border-border-muted bg-bg-elevated px-2.5 py-1 font-mono text-[0.65rem] font-medium text-text-muted sm:text-xs"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      <CodeBlock
        label="~/ install"
        action={copyAction}
        className={copied ? 'border-success/50' : ''}
      >
        <span className="flex min-w-0 items-start gap-3">
          <span
            className="select-none font-mono text-sm text-terminal-green sm:text-base"
            aria-hidden
          >
            $
          </span>
          <span className="min-w-0 font-mono text-sm leading-relaxed whitespace-nowrap text-terminal-fg sm:text-base">
            {command}
          </span>
        </span>
      </CodeBlock>

      <div className="mt-3 min-h-5 text-left" aria-live="polite">
        {error ? (
          <p className="text-sm text-text-muted" role="status">
            {error}
          </p>
        ) : copied ? (
          <p className="text-sm text-success">Command copied to clipboard</p>
        ) : null}
      </div>

      <div className="mt-2 space-y-1.5 px-1 text-left text-xs text-text-muted sm:text-sm">
        {channel === 'prerelease' ? (
          <p>
            Pre-release build of {PRE_RELEASE_TAG} — newest features, ahead of the stable
            line. Switch back to Stable for the latest stable release.
          </p>
        ) : null}
        <p>
          <span className="text-text-muted/90">Verify: </span>
          <code className="rounded-md border border-border-muted bg-terminal-bg px-1.5 py-0.5 font-mono text-[0.8em] text-terminal-fg">
            strike version
          </code>
          <span className="mx-1.5 text-border" aria-hidden>
            ·
          </span>
          <span className="text-text-muted/90">Upgrade: </span>
          <code className="rounded-md border border-border-muted bg-terminal-bg px-1.5 py-0.5 font-mono text-[0.8em] text-terminal-fg">
            strike --upgrade
          </code>
        </p>
        <p>Windows: WSL2 only — native Windows is not supported.</p>
      </div>

      <div className="mt-3 flex min-w-0 items-center justify-start gap-2 px-1">
        <p className="min-w-0 text-xs text-text-muted sm:text-sm">and it&apos;s open source.</p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Strike on GitHub"
          className="inline-flex size-9 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-border-muted bg-surface text-text-muted transition-colors hover:border-border hover:bg-surface-focus hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Github className="size-3.5" />
        </a>
      </div>
    </div>
  )
}
