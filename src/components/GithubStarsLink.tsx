import { Star } from 'lucide-react'
import { formatStarCount, GITHUB_STARS_URL } from '../lib/github'
import { useGithubStars } from '../lib/useGithubStars'

type GithubStarsLinkProps = {
  /** Compact badge for header; default is footer-style text link. */
  variant?: 'badge' | 'link'
  className?: string
  onNavigate?: () => void
}

export function GithubStarsLink({
  variant = 'link',
  className = '',
  onNavigate,
}: GithubStarsLinkProps) {
  const { stars, status } = useGithubStars()
  const countLabel =
    status === 'ok' && stars != null ? formatStarCount(stars) : null
  const aria =
    countLabel != null
      ? `Strike on GitHub, ${stars} stars`
      : 'Strike on GitHub'

  if (variant === 'badge') {
    return (
      <a
        href={GITHUB_STARS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={aria}
        onClick={onNavigate}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border-muted bg-surface px-2.5 py-1.5 font-mono text-xs font-medium text-text-muted transition-colors hover:border-border hover:bg-surface-focus hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${className}`}
      >
        <Star className="size-3.5 text-bolt" aria-hidden />
        {countLabel != null ? (
          <span className="tabular-nums text-text">{countLabel}</span>
        ) : (
          <span>Star</span>
        )}
      </a>
    )
  }

  return (
    <a
      href={GITHUB_STARS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      onClick={onNavigate}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      <Star className="size-3.5 text-bolt" aria-hidden />
      {countLabel != null ? (
        <>
          <span className="font-mono tabular-nums text-accent">{countLabel}</span>
          <span>stars on GitHub</span>
        </>
      ) : (
        <span>Star on GitHub</span>
      )}
    </a>
  )
}
