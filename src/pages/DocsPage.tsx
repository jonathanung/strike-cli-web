import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Lock, Scale } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { MarkdownDoc } from '../components/docs/MarkdownDoc'
import { DOC_PAGES, docBodyMarkdown, getDocPage } from '../lib/docs'
import {
  GITHUB_LICENSE_URL,
  LICENSE_NAME,
  LICENSE_PLAIN,
  LICENSE_SPDX,
} from '../lib/github'
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
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  active
                    ? 'bg-accent-soft font-medium text-accent'
                    : 'text-text-muted hover:bg-surface hover:text-text'
                }`}
              >
                <span>{page.title}</span>
                {page.experimental ? (
                  <span className="shrink-0 rounded-full border border-bolt/40 bg-bolt/10 px-1.5 py-0.5 text-[0.65rem] font-medium leading-none text-bolt">
                    Exp
                  </span>
                ) : null}
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
  experimental,
}: {
  title: string
  children: ReactNode
  activeSlug?: string
  experimental?: boolean
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
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 font-mono text-xs font-medium text-accent">
              <BookOpen className="size-3.5" aria-hidden />
              Documentation
            </div>
            {experimental ? (
              <span className="inline-flex items-center rounded-full border border-bolt/40 bg-bolt/10 px-2.5 py-0.5 text-xs font-medium text-bolt">
                Experimental
              </span>
            ) : null}
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
        Guides for installing and using Strike — mirrored from the product docs so you
        stay on-domain.
      </p>

      <aside
        aria-label="License and privacy"
        className="mt-8 grid min-w-0 gap-3 sm:grid-cols-2"
      >
        <div className="min-w-0 rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-text">
            <Scale className="size-4 shrink-0 text-accent" aria-hidden />
            {LICENSE_NAME}{' '}
            <span className="font-mono text-xs font-medium text-accent">({LICENSE_SPDX})</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            {LICENSE_PLAIN}{' '}
            <a
              href={GITHUB_LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Full license
            </a>
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-text">
            <Lock className="size-4 shrink-0 text-accent" aria-hidden />
            Your code stays local
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Local-first: sessions and config on your machine under{' '}
            <code className="font-mono text-terminal-fg">~/.strike</code>. No silent cloud
            sync from Strike itself.
          </p>
        </div>
      </aside>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {DOC_PAGES.map((page) => (
          <li key={page.slug}>
            <Link
              to={`/docs/${page.slug}`}
              className="relative block h-full min-w-0 rounded-2xl border border-border bg-surface/80 p-5 transition-all hover:border-accent/40 hover:shadow-[0_0_40px_-12px] hover:shadow-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {page.experimental ? (
                <span className="absolute right-4 top-4 rounded-full border border-bolt/40 bg-bolt/10 px-2.5 py-0.5 text-xs font-medium text-bolt">
                  Experimental
                </span>
              ) : null}
              <span
                className={`text-base font-semibold text-text ${page.experimental ? 'pr-24' : ''}`}
              >
                {page.title}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-text-muted">
                {page.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-text-muted">
        New here? Start with{' '}
        <Link
          to="/docs/install"
          className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Install
        </Link>
        {' · '}
        <Link
          to="/docs/quickstart"
          className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Quickstart
        </Link>
        {' · '}
        <Link
          to="/docs/multi-agent"
          className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Multi-agent
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
  usePageTitle(page.experimental ? `${page.title} (experimental)` : page.title)

  const idx = DOC_PAGES.findIndex((p) => p.slug === page.slug)
  const prev = idx > 0 ? DOC_PAGES[idx - 1] : undefined
  const next = idx >= 0 && idx < DOC_PAGES.length - 1 ? DOC_PAGES[idx + 1] : undefined

  return (
    <DocsShell title={page.title} activeSlug={page.slug} experimental={page.experimental}>
      <p className="max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
        {page.summary}
      </p>

      <div className="mt-8 border-t border-border pt-8">
        <MarkdownDoc markdown={docBodyMarkdown(page.markdown)} />
      </div>

      <nav
        aria-label="Adjacent docs"
        className="mt-12 flex min-w-0 flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between"
      >
        {prev ? (
          <Link
            to={`/docs/${prev.slug}`}
            className="inline-flex min-h-11 max-w-full items-center rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <span className="truncate">← {prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/docs/${next.slug}`}
            className="inline-flex min-h-11 max-w-full items-center justify-end rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:ml-auto"
          >
            <span className="truncate">{next.title} →</span>
          </Link>
        ) : null}
      </nav>
    </DocsShell>
  )
}
