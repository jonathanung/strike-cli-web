import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { Section } from './ui/Section'

type Row = {
  id: string
  strike: ReactNode
  them: string
}

const rows: Row[] = [
  {
    id: 'multi-root',
    strike: 'Multi-root agents in one TUI + worktrees',
    them: 'One session / external orchestration',
  },
  {
    id: 'cockpit',
    strike: 'Right-pane cockpit (agents, activity, files, md, vim, memory/issues)',
    them: 'Chat-first column',
  },
  {
    id: 'permissions',
    strike: 'Hard permission modes + plan gates',
    them: 'Softer / IDE-tied controls',
  },
  {
    id: 'sessions',
    strike: (
      <>
        JSONL sessions, fork/resume, headless{' '}
        <code className="font-mono text-terminal-fg">exec</code>
      </>
    ),
    them: 'Varies by product',
  },
  {
    id: 'local-first',
    strike: 'Local-first, open source, self-host web attach',
    them: 'Cloud / product lock-in risk',
  },
]

export function Differentiation() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="why-strike" className="pb-20 sm:pb-28">
      <motion.div
        className="mb-10 text-center sm:mb-12"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Why not just Claude Code / Codex / OpenCode?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
          The multi-agent coding cockpit for your terminal — concurrent sessions,
          worktrees, permissions, and a live side panel that stays out of your way.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-text-muted">
          Not another chat box in a shell. A cockpit built for concurrent agents.
        </p>
      </motion.div>

      <motion.div
        className="overflow-hidden rounded-2xl border border-border bg-surface/80"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Strike compared with typical Claude Code, Codex, and OpenCode workflows
            </caption>
            <thead>
              <tr className="border-b border-border bg-bg-elevated/80">
                <th
                  scope="col"
                  className="px-4 py-3.5 font-semibold text-accent sm:px-6 sm:py-4"
                >
                  Strike
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 font-semibold text-text-muted sm:px-6 sm:py-4"
                >
                  Them (typical)
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/70 last:border-b-0"
                >
                  <td className="px-4 py-3.5 align-top sm:px-6 sm:py-4">
                    <div className="flex gap-2.5">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-terminal-green"
                        aria-hidden
                      />
                      <span className="leading-relaxed text-text">{row.strike}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 align-top sm:px-6 sm:py-4">
                    <div className="flex gap-2.5">
                      <Minus
                        className="mt-0.5 size-4 shrink-0 text-text-muted"
                        aria-hidden
                      />
                      <span className="leading-relaxed text-text-muted">{row.them}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <p className="mt-4 text-center text-xs text-text-muted">
        Comparison reflects typical workflows — products evolve; check each tool&apos;s docs.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/docs/multi-agent"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-surface/80 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Multi-agent docs
        </Link>
        <Link
          to="/docs/config"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-surface/80 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Permissions docs
        </Link>
      </div>
    </Section>
  )
}
