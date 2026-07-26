import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ExternalLink,
  Github,
  Lock,
  Scale,
  Shield,
  Star,
} from 'lucide-react'
import {
  GITHUB_CONTRIBUTING_URL,
  GITHUB_LICENSE_URL,
  GITHUB_NOTICE_URL,
  GITHUB_RELEASES_API,
  GITHUB_RELEASES_LATEST_URL,
  GITHUB_RELEASES_URL,
  GITHUB_SECURITY_URL,
  GITHUB_STARS_URL,
  GITHUB_URL,
  LICENSE_NAME,
  LICENSE_PLAIN,
  LICENSE_SPDX,
} from '../lib/github'

const SITE = 'strike.jonathanung.ca'

const linkClass =
  'rounded-md text-sm text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

const externalLinkClass =
  'inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

function useLatestTag() {
  const [tag, setTag] = useState<string | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(GITHUB_RELEASES_API, {
      signal: ctrl.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ tag_name?: string }>
      })
      .then((data) => {
        if (data.tag_name) setTag(data.tag_name)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  return tag
}

export function Footer() {
  const year = new Date().getFullYear()
  const tag = useLatestTag()

  return (
    <footer className="relative border-t border-border bg-bg-elevated/90">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section aria-labelledby="trust-heading" className="min-w-0">
          <h2 id="trust-heading" className="sr-only">
            License, privacy, and open source
          </h2>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-border bg-surface/70 p-5 sm:p-6">
              <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Scale className="size-4" aria-hidden />
              </div>
              <h3 className="text-sm font-semibold text-text">
                {LICENSE_NAME}{' '}
                <span className="font-mono text-xs font-medium text-accent">
                  ({LICENSE_SPDX})
                </span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {LICENSE_PLAIN} See{' '}
                <a
                  href={GITHUB_LICENSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  LICENSE
                </a>{' '}
                and{' '}
                <a
                  href={GITHUB_NOTICE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  NOTICE
                </a>
                .
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-border bg-surface/70 p-5 sm:p-6">
              <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Lock className="size-4" aria-hidden />
              </div>
              <h3 className="text-sm font-semibold text-text">Your code stays local</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Strike is local-first. Sessions, config, memory, and issues live under{' '}
                <code className="font-mono text-terminal-fg">~/.strike</code> on your
                machine. No silent cloud sync or product telemetry. When you pick a cloud
                model provider, only the prompts and context you send go to that provider.
              </p>
            </div>
          </div>

          <nav
            aria-label="Open source"
            className="mt-5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/80 pt-5"
          >
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClass}
            >
              Releases
              <ExternalLink className="size-3 opacity-60" aria-hidden />
            </a>
            <Link to="/changelog" className={linkClass}>
              Changelog
            </Link>
            {tag ? (
              <a
                href={GITHUB_RELEASES_LATEST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={externalLinkClass}
              >
                <span className="font-mono text-accent">{tag}</span>
                <ExternalLink className="size-3 opacity-60" aria-hidden />
              </a>
            ) : null}
            <a
              href={GITHUB_STARS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClass}
            >
              <Star className="size-3.5 text-bolt" aria-hidden />
              Star on GitHub
              <ExternalLink className="size-3 opacity-60" aria-hidden />
            </a>
            <a
              href={GITHUB_CONTRIBUTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClass}
            >
              Contributing
              <ExternalLink className="size-3 opacity-60" aria-hidden />
            </a>
            <a
              href={GITHUB_SECURITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClass}
            >
              <Shield className="size-3.5" aria-hidden />
              Security
              <ExternalLink className="size-3 opacity-60" aria-hidden />
            </a>
          </nav>
        </section>

        <div className="flex min-w-0 flex-col items-center justify-between gap-6 border-t border-border/80 pt-8 sm:flex-row sm:items-start">
          <div className="flex min-w-0 flex-col items-center gap-1 sm:items-start">
            <p className="flex items-center gap-2 text-sm font-medium text-text">
              <span className="text-bolt" aria-hidden>
                ⚡
              </span>
              <span className="tracking-[0.25em]">STRIKE</span>
            </p>
            <p className="break-words text-sm text-text-muted">
              © {year}{' '}
              <a
                href={`https://${SITE}`}
                className="rounded underline-offset-2 hover:text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {SITE}
              </a>
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Licensed under{' '}
              <a
                href={GITHUB_LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                {LICENSE_SPDX}
              </a>
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex min-w-0 flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            <Link to="/#features" className={linkClass}>
              Features
            </Link>
            <Link to="/#faq" className={linkClass}>
              FAQ
            </Link>
            <Link to="/#web-serve" className={linkClass}>
              Web serve
            </Link>
            <Link to="/docs/web" className={linkClass}>
              Web docs
            </Link>
            <Link to="/docs" className={linkClass}>
              Docs
            </Link>
            <Link to="/changelog" className={linkClass}>
              Changelog
            </Link>
            <Link to="/#install" className={linkClass}>
              Install
            </Link>
            <a
              href={GITHUB_LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClass}
            >
              License
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 py-2 text-sm text-text-muted transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
            >
              <Github className="size-4" aria-hidden />
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
