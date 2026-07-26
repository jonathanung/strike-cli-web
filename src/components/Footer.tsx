import { Github } from 'lucide-react'
import { GITHUB_URL } from '../lib/github'

const SITE = 'strike.jonathanung.ca'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border bg-bg-elevated/90">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
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
              className="underline-offset-2 hover:text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              {SITE}
            </a>
          </p>
        </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
        >
          <Github className="size-4" aria-hidden />
          GitHub
        </a>
      </div>
    </footer>
  )
}
