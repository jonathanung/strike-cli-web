import { useEffect } from 'react'

const BASE = 'Strike — Agentic coding in your terminal'

/** Set document title; restore base title on unmount. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} · Strike` : BASE
    return () => {
      document.title = prev
    }
  }, [title])
}
