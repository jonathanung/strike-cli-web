import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Hero demo GIF carousel.
 * To wire real recordings later:
 *   1. Drop files in public/demos/ (e.g. hero-launch.gif, hero-tools.gif, hero-sessions.gif)
 *   2. Uncomment the `img` field on each slide and replace the placeholder with:
 *      <img src={slide.img} alt={slide.label} className="h-full w-full object-cover" />
 * data-demo-slot attributes mark each frame for easy find-replace.
 */
const slides = [
  {
    slot: 'hero-launch',
    label: 'Launch & first prompt',
    // img: '/demos/hero-launch.gif',
  },
  {
    slot: 'hero-tools',
    label: 'Tools & permissions',
    // img: '/demos/hero-tools.gif',
  },
  {
    slot: 'hero-sessions',
    label: 'Sessions & continue',
    // img: '/demos/hero-sessions.gif',
  },
] as const

const ROTATE_MS = 4000

export function HeroCarousel() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (reduceMotion || paused) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, paused])

  const slide = slides[index]

  return (
    <div
      className="relative w-full min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative aspect-[16/10] w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_0_48px_-12px] shadow-accent-glow/35"
        data-demo-slot={slide.slot}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.slot}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface/80 px-6 text-center"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Replace this block with <img src={slide.img} ... /> when GIFs are ready */}
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
              {slide.label}
            </span>
            <span className="text-sm text-text-muted">Demo coming soon</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-1"
        role="tablist"
        aria-label="Hero demo slides"
      >
        {slides.map((s, i) => {
          const active = i === index
          return (
            <button
              key={s.slot}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Show ${s.label}`}
              onClick={() => goTo(i)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  active
                    ? 'w-6 bg-accent shadow-[0_0_12px_-2px] shadow-accent-glow/60'
                    : 'w-2 bg-border hover:bg-text-muted'
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
