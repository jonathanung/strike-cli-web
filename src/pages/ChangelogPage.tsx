import { Link } from 'react-router-dom'
import { ArrowLeft, History } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { GITHUB_RELEASES_LATEST_URL } from '../lib/github'

export function ChangelogPage() {
  return (
    <Section className="pb-20 pt-10 sm:pb-28 sm:pt-14" narrow>
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Home
        </Link>
      </div>

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 font-mono text-xs font-medium text-accent">
        <History className="size-3.5" aria-hidden />
        Releases
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Changelog</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
        Release notes for Strike. This page is a stub for the site IA — a full changelog
        will land here; until then, see GitHub releases.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
        <p className="font-mono text-xs font-medium tracking-wide text-accent uppercase">
          Coming soon
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
          We will list version highlights and upgrade notes on this page. For the latest
          tag and assets, open releases on GitHub.
        </p>
        <div className="mt-6 flex min-w-0 flex-wrap gap-3">
          <a
            href={GITHUB_RELEASES_LATEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Latest release
          </a>
          <Link
            to="/#install"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Install
          </Link>
        </div>
      </div>
    </Section>
  )
}
