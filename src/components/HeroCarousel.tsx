import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { heroSlides } from '../lib/productMedia'

const ROTATE_MS = 4500

export function HeroCarousel() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i: number) => {
    setIndex(((i % heroSlides.length) + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    if (reduceMotion || paused) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, paused])

  const slide = heroSlides[index]
  const isPrimary = index === 0

  return (
    <div
      className="relative w-full min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative aspect-[16/10] w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-terminal-bg shadow-[0_0_48px_-12px] shadow-accent-glow/35"
        data-demo-slot={slide.id}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <img
              src={slide.src}
              alt={slide.alt}
              width={960}
              height={600}
              className="h-full w-full object-cover object-top"
              decoding="async"
              // Primary slide is the LCP candidate — eager + high priority only for index 0 mount path
              loading={isPrimary ? 'eager' : 'lazy'}
              fetchPriority={isPrimary ? 'high' : 'auto'}
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 via-bg/40 to-transparent px-4 pb-3 pt-10">
              <p className="font-mono text-xs font-medium text-accent">{slide.label}</p>
              <p className="mt-0.5 text-sm text-text-muted">{slide.caption}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-1"
        role="tablist"
        aria-label="Hero product stills"
      >
        {heroSlides.map((s, i) => {
          const active = i === index
          return (
            <button
              key={s.id}
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
