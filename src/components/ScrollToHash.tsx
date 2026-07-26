import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Scroll to hash targets after client-side navigation (and on first load). */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const id = decodeURIComponent(hash.replace(/^#/, ''))
    if (!id) return

    let cancelled = false
    let attempts = 0
    const maxAttempts = 40

    const tryScroll = () => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start',
        })
        return
      }
      // Lazy routes / markdown headings may mount after the first paint
      attempts += 1
      if (attempts < maxAttempts) {
        window.setTimeout(tryScroll, 50)
      }
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(tryScroll)
    })

    return () => {
      cancelled = true
    }
  }, [pathname, hash])

  return null
}
