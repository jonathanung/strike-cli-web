import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Lock, Scale } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { MarkdownDoc } from '../components/docs/MarkdownDoc'
import {
  DOC_PAGES,
  docBodyMarkdown,
  docsByCategory,
  getDocPage,
} from '../lib/docs'
import {
  GITHUB_LICENSE_URL,
  LICENSE_NAME,
  LICENSE_PLAIN,
  LICENSE_SPDX,
} from '../lib/github'
import { usePageTitle } from '../lib/usePageTitle'
import { NotFoundPage } from './NotFoundPage'

function DocsNav({ activeSlug }: { activeSlug?: string }) {
  const groups = docsByCategory()

  return (
    <nav aria-label="Documentation" className="min-w-0">
      <p className="mb-3 font-mono text-xs font-medium tracking-wide text-text-muted uppercase">
        Docs
      </p>
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            to="/docs"
            className={`block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              !activeSlug
                ? 'bg-surface-focus font-medium text-accent'
                : 'text-text-muted hover:bg-surface hover:text-text'
            }`}
          >
            Overview
          </Link>
        </li>
      </ul>

      {groups.map(({ category, pages }) => (
        <div key={category.id} className="mt-5">
          <p className="mb-2 px-3 font-mono text-[0.65rem] font-medium tracking-wide text-text-muted uppercase">
            {category.label}
          </p>
          <ul className="flex flex-col gap-1">
            {pages.map((page) => {
              const active = page.slug === activeSlug
              return (
                <li key={page.slug}>
                  <Link
                    to={`/docs/${page.slug}`}
                    className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                      active
                        ? 'bg-surface-focus font-medium text-accent'
                        : 'text-text-muted hover:bg-surface hover:text-text'
                    }`}
                  >
                    <span>{page.title}</span>
                    {page.experimental ? (
                      <span className="shrink-0 rounded-md border border-bolt/40 bg-bolt/10 px-1.5 py-0.5 text-[0.65rem] font-medium leading-none text-bolt">
                        Exp
                      </span>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
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
            <div className="inline-flex items-center gap-2 rounded-md border border-border-muted bg-surface px-3 py-1 font-mono text-xs font-medium text-accent">
              <BookOpen className="size-3.5" aria-hidden />
              Documentation
            </div>
            {experimental ? (
              <span className="inline-flex items-center rounded-md border border-bolt/40 bg-bolt/10 px-2.5 py-0.5 text-xs font-medium text-bolt">
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

function DocCard({
  page,
}: {
  page: (typeof DOC_PAGES)[number]
}) {
  return (
    <Link
      to={`/docs/${page.slug}`}
      className="relative block h-full min-w-0 rounded-lg border border-border-muted bg-surface p-5 transition-colors hover:border-border hover:bg-surface-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {page.experimental ? (
        <span className="absolute right-4 top-4 rounded-md border border-bolt/40 bg-bolt/10 px-2.5 py-0.5 text-xs font-medium text-bolt">
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
  )
}

export function DocsIndexPage() {
  usePageTitle('Docs')
  const groups = docsByCategory()

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
        <Card className="min-w-0 p-4 sm:p-5">
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
        </Card>
        <Card className="min-w-0 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-text">
            <Lock className="size-4 shrink-0 text-accent" aria-hidden />
            Your code stays local
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Local-first: sessions and config on your machine under{' '}
            <code className="font-mono text-terminal-fg">~/.strike</code>. No silent cloud
            sync from Strike itself.
          </p>
        </Card>
      </aside>

      <div className="mt-10 flex flex-col gap-10">
        {groups.map(({ category, pages }) => (
          <section key={category.id} aria-labelledby={`docs-cat-${category.id}`}>
            <h2
              id={`docs-cat-${category.id}`}
              className="font-mono text-sm font-semibold tracking-wide text-accent uppercase"
            >
              {category.label}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <li key={page.slug}>
                  <DocCard page={page} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

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
        {' · '}
        <Link
          to="/#faq"
          className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          FAQ
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

      <div className="mt-8 border-t border-border-muted pt-8">
        <MarkdownDoc markdown={docBodyMarkdown(page.markdown)} />
      </div>

      <nav
        aria-label="Adjacent docs"
        className="mt-12 flex min-w-0 flex-col gap-3 border-t border-border-muted pt-8 sm:flex-row sm:justify-between"
      >
        {prev ? (
          <Button to={`/docs/${prev.slug}`} variant="secondary" className="max-w-full font-medium">
            <span className="truncate">← {prev.title}</span>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button
            to={`/docs/${next.slug}`}
            variant="secondary"
            className="max-w-full font-medium sm:ml-auto"
          >
            <span className="truncate">{next.title} →</span>
          </Button>
        ) : null}
      </nav>
    </DocsShell>
  )
}
