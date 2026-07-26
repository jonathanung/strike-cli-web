import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Github, Menu, X } from 'lucide-react'
import { GITHUB_URL } from '../lib/github'
import { Button } from './ui/Button'
import { GithubStarsLink } from './GithubStarsLink'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
    isActive
      ? 'text-accent'
      : 'text-text-muted hover:bg-surface-focus hover:text-text'
  }`

const hashLinkClass =
  'rounded-md px-2.5 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-focus hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

export function Header() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-border-muted bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 min-w-0 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={close}
          className="group flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <span className="shrink-0 text-xl leading-none text-bolt" aria-hidden>
            ⚡
          </span>
          <span className="truncate text-sm font-semibold tracking-[0.25em] text-text sm:text-base sm:tracking-[0.35em]">
            S T R I K E
          </span>
        </Link>

        <nav
          className="hidden min-w-0 items-center gap-0.5 md:flex"
          aria-label="Primary"
        >
          <Link to="/#quickstart" className={hashLinkClass}>
            Quickstart
          </Link>
          <Link to="/#features" className={hashLinkClass}>
            Features
          </Link>
          <Link to="/#faq" className={hashLinkClass}>
            FAQ
          </Link>
          <NavLink to="/docs" className={navLinkClass}>
            Docs
          </NavLink>
          <NavLink to="/changelog" className={navLinkClass}>
            Changelog
          </NavLink>
          <GithubStarsLink variant="badge" className="ml-1" />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Strike on GitHub"
            className="inline-flex size-10 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-focus hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Github className="size-5" aria-hidden />
          </a>
          <Button to="/#install" className="ml-1 px-3.5">
            Install
          </Button>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <Button to="/#install" onClick={close} className="px-3">
            Install
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex size-10 min-h-11 min-w-11 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-focus hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-border-muted bg-bg px-4 py-3 md:hidden sm:px-6"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                to="/#quickstart"
                onClick={close}
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-text-muted hover:bg-surface-focus hover:text-text"
              >
                Quickstart
              </Link>
            </li>
            <li>
              <Link
                to="/#features"
                onClick={close}
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-text-muted hover:bg-surface-focus hover:text-text"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/#faq"
                onClick={close}
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-text-muted hover:bg-surface-focus hover:text-text"
              >
                FAQ
              </Link>
            </li>
            <li>
              <NavLink
                to="/docs"
                onClick={close}
                className={({ isActive }) =>
                  `flex min-h-11 items-center rounded-md px-3 text-sm font-medium ${
                    isActive ? 'bg-surface-focus text-accent' : 'text-text-muted hover:bg-surface-focus hover:text-text'
                  }`
                }
              >
                Docs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/changelog"
                onClick={close}
                className={({ isActive }) =>
                  `flex min-h-11 items-center rounded-md px-3 text-sm font-medium ${
                    isActive ? 'bg-surface-focus text-accent' : 'text-text-muted hover:bg-surface-focus hover:text-text'
                  }`
                }
              >
                Changelog
              </NavLink>
            </li>
            <li className="px-3 py-1">
              <GithubStarsLink variant="badge" onNavigate={close} />
            </li>
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-text-muted hover:bg-surface-focus hover:text-text"
              >
                <Github className="size-4" aria-hidden />
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
