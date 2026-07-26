import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { DOC_PAGES, getDocPage } from '../lib/docs'
import { usePageTitle } from '../lib/usePageTitle'
import { NotFoundPage } from './NotFoundPage'

function DocsNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav aria-label="Documentation" className="min-w-0">
      <p className="mb-3 font-mono text-xs font-medium tracking-wide text-text-muted uppercase">
        Docs
      </p>
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            to="/docs"
            className={`block rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              !activeSlug
                ? 'bg-accent-soft font-medium text-accent'
                : 'text-text-muted hover:bg-surface hover:text-text'
            }`}
          >
            Overview
          </Link>
        </li>
        {DOC_PAGES.map((page) => {
          const active = page.slug === activeSlug
          return (
            <li key={page.slug}>
              <Link
                to={`/docs/${page.slug}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  active
                    ? 'bg-accent-soft font-medium text-accent'
                    : 'text-text-muted hover:bg-surface hover:text-text'
                }`}
              >
                {page.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function DocsShell({
  title,
  children,
  activeSlug,
}: {
  title: string
  children: ReactNode
  activeSlug?: string
}) {
  return (
    <Section className="pb-20 pt-10 sm:pb-28 sm:pt-14" narrow={false}>
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Home
        </Link>
      </div>

      <div className="grid min-w-0 gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <DocsNav activeSlug={activeSlug} />
        </aside>

        <article className="min-w-0">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 font-mono text-xs font-medium text-accent">
            <BookOpen className="size-3.5" aria-hidden />
            Documentation
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{title}</h1>
          <div className="mt-8">{children}</div>
        </article>
      </div>
    </Section>
  )
}

export function DocsIndexPage() {
  usePageTitle('Docs')
  return (
    <DocsShell title="Documentation">
      <p className="max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
        Guides for installing and using Strike. These pages are stubs for the site IA —
        full content lands in follow-up docs work.
      </p>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {DOC_PAGES.map((page) => (
          <li key={page.slug}>
            <Link
              to={`/docs/${page.slug}`}
              className="block h-full min-w-0 rounded-2xl border border-border bg-surface/80 p-5 transition-all hover:border-accent/40 hover:shadow-[0_0_40px_-12px] hover:shadow-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span className="text-base font-semibold text-text">{page.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-text-muted">
                {page.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-text-muted">
        Need the binary now?{' '}
        <Link
          to="/#install"
          className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Jump to install
        </Link>
        {' · '}
        <Link
          to="/#quickstart"
          className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Quickstart
        </Link>
      </p>
    </DocsShell>
  )
}

export function DocsSlugPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const page = getDocPage(slug)

  if (!page) {
    return <NotFoundPage />
  }

  return <DocsArticlePage page={page} />
}

function DocsArticlePage({ page }: { page: NonNullable<ReturnType<typeof getDocPage>> }) {
  usePageTitle(page.title)

  return (
    <DocsShell title={page.title} activeSlug={page.slug}>
      <p className="max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
        {page.summary}
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
        <p className="font-mono text-xs font-medium tracking-wide text-accent uppercase">
          Coming soon
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
          Full documentation for this topic is on the way. Meanwhile, install Strike and
          explore the TUI, or check the open-source repo.
        </p>
        <div className="mt-6 flex min-w-0 flex-wrap gap-3">
          <Link
            to="/#install"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Install
          </Link>
          <Link
            to="/docs"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            All docs
          </Link>
        </div>
      </div>
    </DocsShell>
  )
}
