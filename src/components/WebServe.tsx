import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Globe, ShieldAlert, Terminal } from 'lucide-react'
import { Section } from './ui/Section'
import { CodeBlock } from './ui/CodeBlock'

export function WebServe() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="web-serve" className="pb-20 sm:pb-28">
      <motion.div
        className="overflow-hidden rounded-2xl border border-border bg-surface/80"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid min-w-0 gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10 lg:p-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-bolt/40 bg-bolt/10 px-2.5 py-0.5 text-xs font-medium text-bolt">
                Experimental
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 font-mono text-xs font-medium text-accent">
                <Globe className="size-3" aria-hidden />
                strike serve
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Browser cockpit — TUI is primary
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-text-muted">
              Experimental <code className="font-mono text-sm text-terminal-fg">strike serve</code>{' '}
              hosts a local browser attach for a live engine session. It is not a production
              multiplayer web IDE. Day-to-day work stays in the terminal.
            </p>

            <ul className="mt-6 flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
              <li className="flex gap-2.5">
                <Terminal className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  Default bind is <strong className="font-medium text-text">localhost only</strong>
                  {' '}(<code className="font-mono text-terminal-fg">127.0.0.1:8787</code>).
                </span>
              </li>
              <li className="flex gap-2.5">
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-bolt" aria-hidden />
                <span>
                  <code className="font-mono text-terminal-fg">--expose</code> opens LAN bind —
                  token required, <strong className="font-medium text-text">no TLS</strong>, cleartext
                  on the wire. Prefer SSH tunnel over public Wi‑Fi.
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/docs/web"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Web docs
                <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
              </Link>
              <Link
                to="/docs/web#threat-model"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border bg-bg/60 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                LAN threat model
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <CodeBlock label="loopback (default)">
              {`strike serve --addr 127.0.0.1:8787 --token <secret>
# open http://127.0.0.1:8787/attach?token=<secret>`}
            </CodeBlock>
            <p className="mt-3 text-xs leading-relaxed text-text-muted">
              Full flags, auth, CORS, and{' '}
              <code className="font-mono text-terminal-fg">--allow-cidr</code> notes live in{' '}
              <Link
                to="/docs/web"
                className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                /docs/web
              </Link>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
