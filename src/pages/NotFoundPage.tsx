import { Link } from 'react-router-dom'
import { Home, BookOpen, Download } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <Section className="flex flex-1 flex-col justify-center pb-20 pt-16 sm:pb-28 sm:pt-24" narrow>
      <p className="font-mono text-sm font-medium text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
        That URL is not part of this site. Try the home page, docs, or the install
        command.
      </p>

      <ul className="mt-10 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
        <li>
          <Link
            to="/"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
          >
            <Home className="size-4" aria-hidden />
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/docs"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
          >
            <BookOpen className="size-4" aria-hidden />
            Docs
          </Link>
        </li>
        <li>
          <Link
            to="/#install"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
          >
            <Download className="size-4" aria-hidden />
            Install
          </Link>
        </li>
      </ul>
    </Section>
  )
}
