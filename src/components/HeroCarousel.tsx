import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { heroSlides } from '../lib/productMedia'

const ROTATE_MS = 4500
const primary = heroSlides[0]

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
  const showingPrimary = index === 0

  return (
    <div
      className="relative w-full min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Solid TUI chrome frame — matches product cockpit, not SaaS glass */}
      <div className="overflow-hidden rounded-lg border border-border-muted bg-terminal-bg">
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border-muted bg-bg-elevated px-3 py-2 sm:px-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-sm leading-none text-bolt" aria-hidden>
              ⚡
            </span>
            <span className="truncate font-mono text-xs font-medium text-text">
              strike
            </span>
            <span className="hidden text-border sm:inline" aria-hidden>
              ·
            </span>
            <span className="hidden truncate font-mono text-xs text-terminal-comment sm:inline">
              multi-pane cockpit
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 font-mono text-[0.65rem] text-terminal-comment">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              ready
            </span>
            <span className="hidden text-border-muted sm:inline" aria-hidden>
              |
            </span>
            <span className="hidden sm:inline text-sky">agents 1</span>
          </div>
        </div>

        <div
          className="relative aspect-[16/10] w-full min-w-0 overflow-hidden bg-terminal-bg"
          data-demo-slot={slide.id}
        >
          {/* Primary still stays mounted for stable LCP */}
          <img
            src={primary.src}
            alt={showingPrimary ? primary.alt : ''}
            width={960}
            height={600}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ${
              showingPrimary ? 'opacity-100' : 'opacity-0'
            }`}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            draggable={false}
            aria-hidden={!showingPrimary}
          />

          <AnimatePresence mode="wait" initial={false}>
            {!showingPrimary ? (
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
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-terminal-bg via-terminal-bg/70 to-transparent px-3 pb-2.5 pt-10 sm:px-4">
            <p className="font-mono text-xs font-medium text-accent">{slide.label}</p>
            <p className="mt-0.5 text-sm text-text-muted">{slide.caption}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border-muted bg-bg-elevated px-3 py-1.5 font-mono text-[0.65rem] text-terminal-comment sm:px-3.5">
          <span className="truncate">
            <span className="text-sky">you</span>
            <span className="mx-1.5 text-border-muted" aria-hidden>
              ·
            </span>
            session
          </span>
          <span className="shrink-0 text-text-muted">
            {index + 1}/{heroSlides.length}
          </span>
        </div>
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
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span
                className={`block h-1.5 rounded-sm transition-all ${
                  active
                    ? 'w-6 bg-accent'
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
