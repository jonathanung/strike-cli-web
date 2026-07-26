import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, History, Tag } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { MarkdownDoc } from '../components/docs/MarkdownDoc'
import {
  fetchGithubReleases,
  formatReleaseDate,
  GITHUB_RELEASES_LATEST_URL,
  GITHUB_RELEASES_URL,
  GITHUB_URL,
  type GithubRelease,
} from '../lib/github'
import { usePageTitle } from '../lib/usePageTitle'

type LoadState =
  | { status: 'loading' }
  | { status: 'ok'; releases: GithubRelease[] }
  | { status: 'error' }

export function ChangelogPage() {
  usePageTitle('Changelog')
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    const ctrl = new AbortController()
    fetchGithubReleases(ctrl.signal, 30)
      .then((releases) => {
        if (!ctrl.signal.aborted) setState({ status: 'ok', releases })
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ status: 'error' })
      })
    return () => ctrl.abort()
  }, [])

  return (
    <Section className="pb-20 pt-10 sm:pb-28 sm:pt-14" narrow>
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Home
        </Link>
      </div>

      <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border-muted bg-surface px-3 py-1 font-mono text-xs font-medium text-accent">
        <History className="size-3.5" aria-hidden />
        Releases
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Changelog</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
        Release notes from{' '}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          jonathanung/strike
        </a>
        . Built in public — every tag ships here as it lands on GitHub.
      </p>

      <div className="mt-6 flex min-w-0 flex-wrap gap-3">
        <a
          href={GITHUB_RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-border-muted bg-surface px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-border hover:bg-surface-focus hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          All on GitHub
          <ExternalLink className="size-3.5 opacity-70" aria-hidden />
        </a>
        <Button to="/#install" variant="secondary">
          Install
        </Button>
      </div>

      <div className="mt-12" aria-live="polite">
        {state.status === 'loading' ? (
          <p className="text-sm text-text-muted" role="status">
            Loading releases…
          </p>
        ) : null}

        {state.status === 'error' ? (
          <Card className="p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-text-muted">
              Could not load releases from GitHub right now. Open the latest release
              directly, or try again in a moment.
            </p>
            <a
              href={GITHUB_RELEASES_LATEST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Latest release
            </a>
          </Card>
        ) : null}

        {state.status === 'ok' && state.releases.length === 0 ? (
          <Card className="p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-text-muted">
              No published releases yet. Check back soon, or watch the repo on GitHub.
            </p>
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Releases on GitHub
            </a>
          </Card>
        ) : null}

        {state.status === 'ok' && state.releases.length > 0 ? (
          <ol className="flex flex-col gap-6">
            {state.releases.map((release) => (
              <li key={release.html_url}>
                <ReleaseCard release={release} />
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </Section>
  )
}

function ReleaseCard({ release }: { release: GithubRelease }) {
  const title = release.name?.trim() || release.tag_name
  const body = release.body?.trim() ?? ''
  const date =
    release.published_at != null ? formatReleaseDate(release.published_at) : null

  return (
    <Card as="article" className="min-w-0 overflow-hidden p-5 sm:p-7">
      <header className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-border-muted pb-4">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border-muted bg-accent-soft px-2.5 py-1 font-mono text-xs font-medium text-accent">
              <Tag className="size-3" aria-hidden />
              {release.tag_name}
            </span>
            {release.prerelease ? (
              <span className="rounded-md border border-border-muted bg-bg-elevated px-2 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wide text-bolt">
                Pre-release
              </span>
            ) : null}
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-text sm:text-2xl">
            <a
              href={release.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md underline-offset-2 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {title}
            </a>
          </h2>
          {date ? (
            <p className="mt-1.5 font-mono text-xs text-text-muted">
              <time dateTime={release.published_at ?? undefined}>{date}</time>
            </p>
          ) : null}
        </div>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          GitHub
          <ExternalLink className="size-3.5 opacity-70" aria-hidden />
        </a>
      </header>

      {body ? (
        <div className="mt-2 min-w-0">
          <MarkdownDoc markdown={body} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-muted">No release notes for this tag.</p>
      )}
    </Card>
  )
}
