/** Canonical product repo after rename (was jonathanung/strike-cli). */
export const GITHUB_OWNER = 'jonathanung'
export const GITHUB_REPO = 'strike'
export const GITHUB_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`
export const GITHUB_RELEASES_URL = `${GITHUB_URL}/releases`
export const GITHUB_RELEASES_LATEST_URL = `${GITHUB_URL}/releases/latest`
export const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`
export const GITHUB_RELEASES_API = `${GITHUB_API_BASE}/releases/latest`
export const GITHUB_RELEASES_LIST_API = `${GITHUB_API_BASE}/releases`
export const GITHUB_REPO_API = GITHUB_API_BASE
export const GITHUB_STARS_URL = GITHUB_URL
export const GITHUB_LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`
export const GITHUB_NOTICE_URL = `${GITHUB_URL}/blob/main/NOTICE`
export const GITHUB_CONTRIBUTING_URL = `${GITHUB_URL}/blob/main/docs/contributing.md`
/** GitHub private vulnerability reporting / advisories. */
export const GITHUB_SECURITY_URL = `${GITHUB_URL}/security`

export const LICENSE_SPDX = 'Apache-2.0'
export const LICENSE_NAME = 'Apache License 2.0'
export const LICENSE_PLAIN =
  'Free to use, modify, and distribute — keep the copyright notice and attribution.'

/** Optional community links — set when accounts exist; omit from UI while null. */
export const DISCORD_URL: string | null = null
export const X_URL: string | null = null

export type GithubRelease = {
  tag_name: string
  name: string | null
  body: string | null
  html_url: string
  published_at: string | null
  prerelease: boolean
  draft: boolean
}

const ghHeaders = { Accept: 'application/vnd.github+json' } as const
const CACHE_TTL_MS = 5 * 60 * 1000

type CacheEntry<T> = { at: number; value: T }

let starsCache: CacheEntry<number> | null = null
let releasesCache: CacheEntry<GithubRelease[]> | null = null

function fresh<T>(entry: CacheEntry<T> | null): T | null {
  if (!entry) return null
  if (Date.now() - entry.at > CACHE_TTL_MS) return null
  return entry.value
}

export function formatReleaseDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Compact star count for badges (1.2k, 12k). */
export function formatStarCount(n: number): string {
  if (n < 1000) return String(n)
  if (n < 10_000) {
    const tenths = Math.round(n / 100) / 10
    return `${tenths % 1 === 0 ? tenths.toFixed(0) : tenths.toFixed(1)}k`
  }
  if (n < 1_000_000) return `${Math.round(n / 1000)}k`
  return `${Math.round(n / 100_000) / 10}m`
}

export async function fetchGithubStars(signal?: AbortSignal): Promise<number | null> {
  const cached = fresh(starsCache)
  if (cached != null) return cached

  const res = await fetch(GITHUB_REPO_API, {
    signal,
    headers: ghHeaders,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as { stargazers_count?: number }
  if (typeof data.stargazers_count !== 'number') throw new Error('missing stargazers_count')
  starsCache = { at: Date.now(), value: data.stargazers_count }
  return data.stargazers_count
}

export async function fetchGithubReleases(
  signal?: AbortSignal,
  perPage = 20,
): Promise<GithubRelease[]> {
  const cached = fresh(releasesCache)
  if (cached) return cached

  const url = `${GITHUB_RELEASES_LIST_API}?per_page=${perPage}`
  const res = await fetch(url, {
    signal,
    headers: ghHeaders,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as GithubRelease[]
  if (!Array.isArray(data)) throw new Error('invalid releases payload')

  const releases = data.filter((r) => !r.draft)
  releasesCache = { at: Date.now(), value: releases }
  return releases
}
