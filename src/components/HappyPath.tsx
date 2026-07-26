import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Section } from './ui/Section'
import { CodeBlock } from './ui/CodeBlock'
import { INSTALL_COMMAND } from './InstallCommand'

const CHAR_MS = 30
const STEP_PAUSE_MS = 1200
const LOOP_PAUSE_MS = 2000
const COMMENT_DELAY_MS = 300

const steps = [
  {
    n: '01',
    title: 'Install',
    cmd: INSTALL_COMMAND,
    comment: null as string | null,
  },
  {
    n: '02',
    title: 'Launch',
    cmd: 'strike',
    comment: null as string | null,
  },
  {
    n: '03',
    title: 'Stay current',
    cmd: 'strike --upgrade',
    comment: '# or /upgrade in TUI' as string | null,
  },
] as const

function Cursor({ animate }: { animate: boolean }) {
  if (!animate) {
    return (
      <span
        className="ml-0.5 inline-block h-[1.05em] w-2 translate-y-0.5 bg-terminal-fg align-text-bottom"
        aria-hidden
      />
    )
  }

  return (
    <motion.span
      className="ml-0.5 inline-block h-[1.05em] w-2 translate-y-0.5 bg-terminal-fg align-text-bottom"
      aria-hidden
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
    />
  )
}

function CmdLine({
  text,
  dimmed,
  showCursor,
  cursorAnimate,
}: {
  text: string
  dimmed?: boolean
  showCursor?: boolean
  cursorAnimate?: boolean
}) {
  return (
    <span className={`block ${dimmed ? 'text-terminal-fg/45' : ''}`}>
      <span className={dimmed ? 'text-terminal-green/45' : 'text-terminal-green'}>$ </span>
      <span>{text}</span>
      {showCursor ? <Cursor animate={cursorAnimate ?? true} /> : null}
    </span>
  )
}

function CommentLine({ text, dimmed }: { text: string; dimmed?: boolean }) {
  return (
    <span className={`block text-terminal-comment ${dimmed ? 'opacity-45' : ''}`}>{text}</span>
  )
}

export function HappyPath() {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { margin: '-80px' })

  const [activeStep, setActiveStep] = useState(0)
  const [cmdChars, setCmdChars] = useState(0)
  const [showComment, setShowComment] = useState(false)
  const [paused, setPaused] = useState(false)

  const jumpToStep = useCallback(
    (index: number) => {
      const i = Math.max(0, Math.min(steps.length - 1, index))
      setActiveStep(i)
      if (reduceMotion) {
        setCmdChars(steps[i].cmd.length)
        setShowComment(Boolean(steps[i].comment))
      } else {
        setCmdChars(0)
        setShowComment(false)
      }
    },
    [reduceMotion],
  )

  // Keep reduced-motion view fully typed
  useEffect(() => {
    if (!reduceMotion) return
    setActiveStep(steps.length - 1)
    setCmdChars(steps[steps.length - 1].cmd.length)
    setShowComment(true)
  }, [reduceMotion])

  // Typewriter + auto-advance loop
  useEffect(() => {
    if (reduceMotion || !inView || paused) return

    const step = steps[activeStep]
    const cmdLen = step.cmd.length

    if (cmdChars < cmdLen) {
      const id = window.setTimeout(() => {
        setCmdChars((c) => Math.min(c + 1, cmdLen))
      }, CHAR_MS)
      return () => window.clearTimeout(id)
    }

    if (step.comment && !showComment) {
      const id = window.setTimeout(() => setShowComment(true), COMMENT_DELAY_MS)
      return () => window.clearTimeout(id)
    }

    const isLast = activeStep >= steps.length - 1
    const id = window.setTimeout(
      () => {
        if (isLast) {
          setActiveStep(0)
          setCmdChars(0)
          setShowComment(false)
        } else {
          setActiveStep((s) => s + 1)
          setCmdChars(0)
          setShowComment(false)
        }
      },
      isLast ? LOOP_PAUSE_MS : STEP_PAUSE_MS,
    )
    return () => window.clearTimeout(id)
  }, [reduceMotion, inView, paused, activeStep, cmdChars, showComment])

  const renderTranscript = () => {
    if (reduceMotion) {
      return steps.map((step) => (
        <span key={step.n} className="block">
          <CmdLine text={step.cmd} />
          {step.comment ? <CommentLine text={step.comment} /> : null}
        </span>
      ))
    }

    const lines: ReactNode[] = []

    for (let i = 0; i < activeStep; i++) {
      const step = steps[i]
      lines.push(
        <span key={step.n} className="block">
          <CmdLine text={step.cmd} dimmed />
          {step.comment ? <CommentLine text={step.comment} dimmed /> : null}
        </span>,
      )
    }

    const current = steps[activeStep]
    const typed = current.cmd.slice(0, cmdChars)

    lines.push(
      <span key={current.n} className="block">
        <CmdLine text={typed} showCursor cursorAnimate />
        {current.comment && showComment ? <CommentLine text={current.comment} /> : null}
      </span>,
    )

    return lines
  }

  return (
    <Section id="get-started" className="pb-20 sm:pb-28">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Get started in seconds
        </h2>
        <p className="mt-3 text-text-muted">
          The intended workflow — install, open the TUI, upgrade when you want.
        </p>
      </div>

      <div
        ref={rootRef}
        className="flex min-w-0 flex-col gap-6 md:flex-row md:items-stretch md:gap-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <ol
          className="relative grid shrink-0 grid-cols-3 gap-2 md:flex md:w-44 md:flex-col md:gap-2 lg:w-52"
          aria-label="Getting started steps"
        >
          {/* Vertical connector (md+) — centered on step badges */}
          <span
            className="pointer-events-none absolute top-6 bottom-6 left-[1.75rem] hidden w-px bg-border md:block"
            aria-hidden
          />

          {steps.map((step, i) => {
            const isActive = reduceMotion ? true : i === activeStep
            const isComplete = reduceMotion ? true : i < activeStep
            const isUpcoming = !reduceMotion && i > activeStep

            return (
              <li key={step.n} className="relative min-w-0 md:pl-0">
                <button
                  type="button"
                  onClick={() => jumpToStep(i)}
                  aria-current={i === activeStep ? 'step' : undefined}
                  aria-label={`Step ${step.n}: ${step.title}`}
                  className={`group relative flex min-h-11 w-full min-w-0 items-center gap-2 rounded-md border px-2 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:gap-3 sm:px-3 md:py-3 ${
                    isActive && !reduceMotion
                      ? 'border-border bg-surface-focus'
                      : isComplete
                        ? 'border-border-muted bg-surface hover:border-border'
                        : 'border-border-muted bg-transparent hover:border-border hover:bg-surface'
                  } ${reduceMotion ? 'border-border-muted bg-surface' : ''}`}
                >
                  <span
                    className={`relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold transition-colors ${
                      isActive && !reduceMotion
                        ? 'bg-accent text-bg'
                        : isComplete
                          ? 'bg-accent-soft text-accent'
                          : 'bg-bg-elevated text-text-muted group-hover:text-text'
                    } ${reduceMotion ? 'bg-accent-soft text-accent' : ''} ${
                      isUpcoming ? 'opacity-70' : ''
                    }`}
                  >
                    {isComplete && !isActive && !reduceMotion ? (
                      <Check className="size-3.5" aria-hidden strokeWidth={2.5} />
                    ) : (
                      step.n
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block font-mono text-[0.65rem] font-medium tracking-wide ${
                        isActive && !reduceMotion
                          ? 'text-accent'
                          : isComplete || reduceMotion
                            ? 'text-accent/70'
                            : 'text-text-muted'
                      }`}
                    >
                      {step.n}
                    </span>
                    <span
                      className={`block text-sm font-semibold leading-tight ${
                        isUpcoming ? 'text-text-muted' : 'text-text'
                      }`}
                    >
                      {step.title}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <CodeBlock
          className="min-h-[11.5rem] min-w-0 flex-1 sm:min-h-[12.5rem]"
          label="strike"
        >
          <div className="flex min-h-[7.5rem] flex-col gap-1 sm:min-h-[8.5rem]">
            {renderTranscript()}
          </div>
        </CodeBlock>
      </div>
    </Section>
  )
}
