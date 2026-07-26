import { useEffect, useState } from 'react'
import { fetchGithubStars } from './github'

export type StarsStatus = 'loading' | 'ok' | 'error'

/** Live stargazer count for jonathanung/strike (cached in github.ts). */
export function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null)
  const [status, setStatus] = useState<StarsStatus>('loading')

  useEffect(() => {
    const ctrl = new AbortController()
    fetchGithubStars(ctrl.signal)
      .then((count) => {
        if (ctrl.signal.aborted) return
        setStars(count)
        setStatus(count == null ? 'error' : 'ok')
      })
      .catch(() => {
        if (!ctrl.signal.aborted) {
          setStars(null)
          setStatus('error')
        }
      })
    return () => ctrl.abort()
  }, [])

  return { stars, status }
}
