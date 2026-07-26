import { motion, useReducedMotion } from 'framer-motion'
import { Section } from './ui/Section'
import { InstallCommand } from './InstallCommand'
import { HeroCarousel } from './HeroCarousel'

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <Section className="pb-16 pt-16 sm:pb-24 sm:pt-24 lg:pt-28">
      <motion.div
        className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-12 xl:gap-16"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex min-w-0 flex-col items-start text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 font-mono text-xs font-medium text-accent shadow-[0_0_24px_-8px] shadow-accent-glow/40">
            <span className="text-bolt" aria-hidden>
              ⚡
            </span>
            strike
          </p>

          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
            Agentic coding in your{' '}
            <span className="text-gradient-accent">terminal</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
            A terminal UI actually designed for agentic work — multi-pane workspace,
            in-TUI pickers, and permissions that feel native. Fast Go/Bubble Tea craft,
            not a chat box squeezed into a shell.
          </p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Key UX features">
            {['Multi-pane workspace', 'In-TUI pickers', 'Native permissions'].map((label) => (
              <li
                key={label}
                className="rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs font-medium text-text-muted"
              >
                {label}
              </li>
            ))}
          </ul>

          <div id="install" className="mt-10 w-full min-w-0 scroll-mt-20">
            <InstallCommand />
          </div>
        </div>

        <div className="w-full min-w-0 lg:justify-self-end">
          <HeroCarousel />
        </div>
      </motion.div>
    </Section>
  )
}
