import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  Bot,
  Boxes,
  Download,
  GitBranch,
  Globe,
  Goal,
  History,
  ImageIcon,
  KeyRound,
  MemoryStick,
  Pencil,
  Plug,
  Repeat,
  Shield,
  Sparkles,
  Terminal,
  Command,
  ArrowUpRight,
  Undo2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { productStills } from '../lib/productMedia'

type Feature = {
  title: string
  description: string
  icon: LucideIcon
  /** Optional product-still anchor under #product-stills */
  stillId?: string
  /** Optional docs deep-link */
  docsTo?: string
  experimental?: boolean
}

type FeatureGroup = {
  id: string
  title: string
  blurb: string
  features: Feature[]
}

const groups: FeatureGroup[] = [
  {
    id: 'cockpit',
    title: 'Cockpit',
    blurb: 'Multi-pane TUI workspace — transcript, side panes, and live telemetry.',
    features: [
      {
        title: 'Solid-surface TUI',
        description:
          'Go + Bubble Tea multi-pane cockpit: transcript, composer, and side panes with polished solid surfaces.',
        icon: Terminal,
        stillId: 'stills-agents',
        docsTo: '/docs/quickstart',
      },
      {
        title: 'Memory & issues panes',
        description:
          'In-TUI memory and issues panes with matching tools so context and tracked work stay beside the transcript.',
        icon: MemoryStick,
        stillId: 'stills-memories',
        docsTo: '/docs/usage',
      },
      {
        title: 'Compaction & context doctor',
        description:
          'Session compaction, cost/context doctor bars, token attribution, and a thinking toggle so you can see and steer model spend.',
        icon: Activity,
        stillId: 'stills-telemetry',
        docsTo: '/docs/usage',
      },
      {
        title: 'Embedded editors',
        description:
          '/vim, /nano, and /md-read with pane, overlay, or takeover presentation — nvim/vim/nano PTY inside the cockpit.',
        icon: Pencil,
        stillId: 'stills-vim',
        docsTo: '/docs/editors',
      },
      {
        title: 'In-TUI pickers',
        description:
          'Slash commands for /provider, /model, /auth, /theme, and more — no config spelunking.',
        icon: Sparkles,
        stillId: 'stills-mentions',
        docsTo: '/docs/keybinds',
      },
    ],
  },
  {
    id: 'agents',
    title: 'Agents',
    blurb: 'Concurrent agent roots, isolation, goals, loops, and customizable personas.',
    features: [
      {
        title: 'Concurrent roots',
        description:
          'Spin up n agent roots in the agents pane, filter by status, and watch children and activity side by side.',
        icon: Bot,
        stillId: 'stills-agents',
        docsTo: '/docs/multi-agent',
      },
      {
        title: 'Git worktrees per session',
        description:
          'Each session can run in an isolated git worktree so parallel agents do not collide on disk.',
        icon: GitBranch,
        stillId: 'stills-agents',
        docsTo: '/docs/config#session-worktrees',
      },
      {
        title: 'Agents, skills & workflows',
        description:
          'Markdown personas and skills, plan-implement workflows, and lean-code efficiency guidance — shape how each agent works.',
        icon: Boxes,
        stillId: 'stills-agents',
        docsTo: '/docs/multi-agent',
      },
      {
        title: 'Goal harness',
        description:
          '/goal runs observe → plan → act → evaluate until falsifiable criteria pass or a budget/guard fires.',
        icon: Goal,
        docsTo: '/docs/goal',
      },
      {
        title: 'Recurring loops',
        description:
          '/loop schedules session-scoped prompts on an interval — periodic checks without a full goal runtime (distinct from the resource scheduler).',
        icon: Repeat,
        docsTo: '/docs/loop',
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety',
    blurb: 'Permission dial, OS sandbox, and hard gates so tools only run with your say-so.',
    features: [
      {
        title: 'Permission mode dial',
        description:
          'Shift+Tab or /mode: default, plan, soft-approve, accept-edits, or yolo — plus fine-grained allow once / session / deny prompts.',
        icon: Shield,
        stillId: 'stills-permissions',
        docsTo: '/docs/config',
      },
      {
        title: 'OS sandbox dial',
        description:
          'Linux bwrap / macOS seatbelt for bash (workspace-write by default). Independent of permission mode; yolo + sandbox off needs --i-know.',
        icon: Shield,
        docsTo: '/docs/sandbox',
      },
      {
        title: 'In-process scheduler',
        description:
          'Named pools (process, build, test, model, …) and build-system presets cap concurrent agent work; queue chips when blocked.',
        icon: Activity,
        docsTo: '/docs/scheduler',
      },
    ],
  },
  {
    id: 'extensibility',
    title: 'Extensibility',
    blurb: 'Providers, MCP, auth, and experimental strike serve (TUI primary).',
    features: [
      {
        title: 'Providers & auth',
        description:
          'Anthropic, OpenAI, xAI, Google, Kimi, DeepSeek — plus custom OpenAI-/Anthropic-compatible endpoints in providers.jsonc. OAuth and API keys in-TUI.',
        icon: KeyRound,
        docsTo: '/docs/auth',
      },
      {
        title: 'MCP (stdio + HTTP)',
        description:
          'Connect Model Context Protocol servers over stdio or streamable HTTP and expose their tools inside Strike.',
        icon: Plug,
        docsTo: '/docs/mcp',
      },
      {
        title: 'strike serve',
        description:
          'Experimental browser cockpit for a live local session. Defaults to localhost; --expose is LAN-only with no TLS. TUI is primary.',
        icon: Globe,
        docsTo: '/docs/web',
        experimental: true,
      },
    ],
  },
  {
    id: 'continuity',
    title: 'Continuity',
    blurb: 'Install, upgrade, fork, undo, resume, and script without losing the thread.',
    features: [
      {
        title: 'Fork, undo & rewind',
        description:
          '/fork duplicates a session; /undo drops the last turn (chat or files); /rewind forks from an earlier turn.',
        icon: Undo2,
        docsTo: '/docs/usage',
      },
      {
        title: 'Session resume',
        description:
          'Continue with --continue / --session. Transcripts stored as JSONL for durable history.',
        icon: History,
        docsTo: '/docs/usage',
      },
      {
        title: 'Install & upgrade',
        description:
          'One-line install on macOS and Linux, then strike --upgrade when a newer build is ready.',
        icon: Download,
        docsTo: '/docs/install',
      },
      {
        title: 'Headless one-shot',
        description:
          'Run strike exec for scripted, non-interactive agent turns in CI or pipelines.',
        icon: Command,
        docsTo: '/docs/usage',
      },
    ],
  },
]

function stillForId(id: string | undefined) {
  if (!id) return undefined
  return productStills.find((s) => s.id === id)
}

export function Features() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="features" className="pb-20 sm:pb-28">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">Features</h2>
        <p className="mx-auto mt-3 max-w-2xl text-text-muted">
          What ships in Strike today — Cockpit · Agents · Safety · Extensibility · Continuity.
        </p>
      </div>

      <div className="flex flex-col gap-12 sm:gap-14">
        {groups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`features-${group.id}`}
            className="min-w-0"
          >
            <div className="mb-5 sm:mb-6">
              <h3
                id={`features-${group.id}`}
                className="font-mono text-sm font-semibold tracking-wide text-accent uppercase"
              >
                {group.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
                {group.blurb}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.features.map((feature, i) => {
                const Icon = feature.icon
                const still = stillForId(feature.stillId)
                return (
                  <motion.li
                    key={feature.title}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.4, delay: Math.min(i * 0.05, 0.2), ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <Card
                      as="article"
                      interactive
                      className="group relative flex h-full min-w-0 flex-col p-5 sm:p-6"
                    >
                      {feature.experimental ? (
                        <span className="absolute right-4 top-4 rounded-md border border-bolt/40 bg-bolt/10 px-2.5 py-0.5 text-xs font-medium text-bolt">
                          Experimental
                        </span>
                      ) : null}
                      <div className="mb-4 inline-flex size-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <h4
                        className={`text-base font-semibold text-text ${feature.experimental ? 'pr-24' : ''}`}
                      >
                        {feature.title}
                      </h4>
                      <p className="mt-2 flex-1 break-words text-sm leading-relaxed text-text-muted">
                        {feature.description}
                      </p>

                      <div className="mt-4 flex min-w-0 flex-col gap-2">
                        {feature.docsTo ? (
                          <Link
                            to={feature.docsTo}
                            aria-label={`Docs: ${feature.title}`}
                            className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-lg text-sm font-medium text-accent transition-colors hover:text-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            Docs
                            <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                          </Link>
                        ) : null}

                        {still ? (
                          <a
                            href={`#${still.id}`}
                            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border-muted bg-bg-elevated px-2 py-2 text-left transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                          >
                            <span className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border-muted bg-terminal-bg">
                              <img
                                src={still.src}
                                alt=""
                                width={96}
                                height={60}
                                className="h-full w-full object-cover object-top"
                                loading="lazy"
                                decoding="async"
                                draggable={false}
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-accent">
                                <ImageIcon className="size-3.5 shrink-0" aria-hidden />
                                View still
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-text-muted">
                                {still.label}
                              </span>
                            </span>
                          </a>
                        ) : null}
                      </div>
                    </Card>
                  </motion.li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  )
}
