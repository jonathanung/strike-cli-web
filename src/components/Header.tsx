import { Github } from 'lucide-react'
import { GITHUB_URL } from '../lib/github'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 min-w-0 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <a
          href="#"
          className="group flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <span className="shrink-0 text-xl leading-none text-bolt" aria-hidden>
            ⚡
          </span>
          <span className="truncate text-sm font-semibold tracking-[0.25em] text-text sm:text-base sm:tracking-[0.35em]">
            S T R I K E
          </span>
        </a>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Strike on GitHub"
          className="inline-flex size-10 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Github className="size-5" />
        </a>
      </div>
    </header>
  )
}
