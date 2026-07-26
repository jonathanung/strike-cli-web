import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Copy, Keyboard, Users } from 'lucide-react'
import { Section } from './ui/Section'
import { copyToClipboard } from '../lib/copy'

type Step = {
  n: string
  title: string
  detail: string
  /** Text copied to clipboard (and shown in the mono chip). */
  copy: string
  /** shell = terminal prompt; tui = in-app action path */
  kind: 'shell' | 'tui'
  /** Optional secondary label under the chip (not copied). */
  hint?: string
}

const steps: Step[] = [
  {
    n: '01',
    title: 'Launch',
    detail: 'Open the TUI from any project directory.',
    copy: 'strike',
    kind: 'shell',
  },
  {
    n: '02',
    title: 'Provider & auth',
    detail: 'Pick a provider, then sign in — both are in-TUI slash commands.',
    copy: '/provider → /auth',
    kind: 'tui',
    hint: 'Or: strike auth login anthropic',
  },
  {
    n: '03',
    title: 'First prompt',
    detail: 'Attach a file with @ and ask for something useful immediately.',
    copy: '@README.md summarize this repo',
    kind: 'tui',
  },
  {
    n: '04',
    title: 'Second agent',
    detail: 'Focus the right pane, open Agents, start a concurrent root.',
    copy: 'ctrl+l → agents → n',
    kind: 'tui',
    hint: 'n = new concurrent root session',
  },
]

const OFFLINE_COPY = 'strike --provider echo'
const OFFLINE_HINT = 'Contributors: make run-echo from a source checkout'

function CopyChip({
  text,
  label,
  kind = 'shell',
}: {
  text: string
  label: string
  kind?: 'shell' | 'tui'
}) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  const handleCopy = useCallback(async () => {
    setError(null)
    const result = await copyToClipboard(text)
    if (result.ok) {
      setCopied(true)
    } else {
      setError(result.error)
    }
  }, [text])

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        className={`group flex w-full min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
          copied
            ? 'border-neon-pink/60 bg-neon-pink/10'
            : 'border-border bg-terminal-bg hover:border-accent/40 hover:bg-accent-soft/40'
        }`}
      >
        {kind === 'shell' ? (
          <span
            className="select-none font-mono text-sm text-terminal-green"
            aria-hidden
          >
            $
          </span>
        ) : (
          <span
            className="select-none font-mono text-sm text-accent"
            aria-hidden
          >
            ›
          </span>
        )}
        <code className="min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-sm leading-snug text-terminal-fg">
          {text}
        </code>
        <span
          className={`inline-flex size-9 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
            copied
              ? 'text-neon-pink'
              : 'text-text-muted group-hover:text-accent'
          }`}
        >
          {copied ? (
            <Check className="size-4" aria-hidden strokeWidth={2.5} />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
        </span>
      </button>
      <div className="mt-1.5 min-h-5" aria-live="polite">
        {error ? (
          <p className="text-xs text-text-muted" role="status">
            {error}
          </p>
        ) : copied ? (
          <p className="text-xs text-neon-pink">Copied</p>
        ) : null}
      </div>
    </div>
  )
}

export function Quickstart() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="quickstart" className="pb-20 sm:pb-28">
      <motion.div
        className="mb-10 text-center sm:mb-12"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-3 font-mono text-xs font-medium tracking-wide text-accent uppercase">
          After install
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          First 60 seconds
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-text-muted">
          Not just install — path to product value. Copy each step, then go deeper
          in the docs.
        </p>
      </motion.div>

      <ol className="grid gap-4 sm:grid-cols-2" aria-label="60-second quickstart steps">
        {steps.map((step, i) => (
          <motion.li
            key={step.n}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }
            }
            className="flex min-w-0 flex-col rounded-2xl border border-border bg-surface/80 p-5 sm:p-6"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft font-mono text-xs font-semibold text-accent">
                {step.n}
              </span>
              <h3 className="text-base font-semibold text-text">{step.title}</h3>
            </div>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted">
              {step.detail}
            </p>
            <CopyChip text={step.copy} label={step.title} kind={step.kind} />
            {step.hint ? (
              <p className="mt-1 font-mono text-xs text-terminal-comment">{step.hint}</p>
            ) : null}
          </motion.li>
        ))}
      </ol>

      <motion.div
        className="mt-6 rounded-2xl border border-border/80 bg-bg-elevated/60 p-5 sm:p-6"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-text">Try offline</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              No API keys needed — Echo provider for a local dry run. Contributors can
              also use the Makefile target from a source checkout.
            </p>
          </div>
          <div className="w-full min-w-0 sm:max-w-sm">
            <CopyChip text={OFFLINE_COPY} label="offline try command" />
            <p className="mt-1 font-mono text-xs text-terminal-comment">{OFFLINE_HINT}</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/docs/keybinds"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-surface/80 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Keyboard className="size-4" aria-hidden />
          Keybinds
        </Link>
        <Link
          to="/docs/multi-agent"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-surface/80 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Users className="size-4" aria-hidden />
          Multi-agent
        </Link>
        <Link
          to="/docs/quickstart"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-surface/80 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Full quickstart docs
        </Link>
      </div>
    </Section>
  )
}
