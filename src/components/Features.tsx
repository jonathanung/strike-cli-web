import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  Bot,
  Boxes,
  ClipboardList,
  Container,
  Download,
  FlaskConical,
  GitBranch,
  Globe,
  Goal,
  History,
  ImageIcon,
  KeyRound,
  Layers,
  MemoryStick,
  Package,
  PanelRight,
  Pencil,
  Plug,
  Repeat,
  ScanSearch,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Command,
  ArrowUpRight,
  Undo2,
  Wallet,
  Wrench,
  Palette,
  Keyboard,
  Settings2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { productStills } from '../lib/productMedia'

type Feature = {
  title: string
  description: string
  icon: LucideIcon
  /** Docs deep-link — every headlining feature must point at a real /docs slug */
  docsTo: string
  /** Optional product-still anchor under #product-stills */
  stillId?: string
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
    blurb: 'Multi-pane TUI workspace — transcript, side panes, themes, and live telemetry.',
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
        title: 'Themes',
        description:
          'Solid chrome themes with adaptive terminal colors — pick live in-TUI, including plugin-contributed palettes.',
        icon: Palette,
        docsTo: '/docs/theme',
      },
      {
        title: 'Keybinds & pickers',
        description:
          'F1 / /keys cheatsheet plus slash pickers for /provider, /model, /auth, /theme, and more — no config spelunking.',
        icon: Keyboard,
        stillId: 'stills-mentions',
        docsTo: '/docs/keybinds',
      },
      {
        title: 'Plugin panes',
        description:
          'Right-pane contributions via the pane/1 ABI — static or process panes cycle beside agents, files, and context.',
        icon: PanelRight,
        docsTo: '/docs/plugin-panes',
      },
    ],
  },
  {
    id: 'agents',
    title: 'Agents',
    blurb: 'Concurrent roots, delegation, goals, loops, harnesses, and isolation that composes.',
    features: [
      {
        title: 'Multi-agent orchestration',
        description:
          'Concurrent agent roots, progressive task/delegate, structured handoffs, teams, and path-ownership so parallel work stays coordinated.',
        icon: Bot,
        stillId: 'stills-agents',
        docsTo: '/docs/multi-agent',
      },
      {
        title: 'Isolation & worktrees',
        description:
          'Layered isolation map — sandbox, session git worktrees, scheduler pools, process caps, and containers compose without replacing each other.',
        icon: GitBranch,
        stillId: 'stills-agents',
        docsTo: '/docs/isolation',
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
      {
        title: 'Function harnesses',
        description:
          'Custom task functions (Go/TS/Lean) with brokered tools, provider calls, and the same permissions, sandbox, and protocol events as the built-in loop.',
        icon: Wrench,
        docsTo: '/docs/harnesses',
      },
      {
        title: 'Cost & agent budgets',
        description:
          'Session --max-cost / maxSessionCostUSD envelopes, turn deadlines, per-child budgets with soft finalization, and TUI budget warnings.',
        icon: Wallet,
        docsTo: '/docs/config',
      },
      {
        title: 'Active-turn steer',
        description:
          'Redirect a running root turn at the next safe boundary — distinct from queued prompts and hard interrupt — with durable turn.steered events.',
        icon: GitBranch,
        docsTo: '/docs/usage',
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety',
    blurb: 'Permission dial, OS sandbox, containers, admission, and audit — tools only run with your say-so.',
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
          'Linux bwrap / macOS seatbelt for bash (workspace-write by default). Fail-closed when the backend is missing; network.allow egress preflight; yolo + sandbox off needs --i-know.',
        icon: ShieldCheck,
        docsTo: '/docs/sandbox',
      },
      {
        title: 'Containers',
        description:
          'Native Docker/Podman runtime isolation — launch-inside, eject, attach, isolation badge, and one managed container per repo.',
        icon: Container,
        docsTo: '/docs/containers',
      },
      {
        title: 'In-process scheduler',
        description:
          'Named pools (process, build, test, model, …) and build-system presets cap concurrent agent work; queue chips when blocked.',
        icon: Layers,
        docsTo: '/docs/scheduler',
      },
      {
        title: 'Admission scans',
        description:
          'Load-time admission for MCP, skills, and plugins — capability surfaces are scanned before they bind into the registry.',
        icon: ScanSearch,
        docsTo: '/docs/admission',
      },
      {
        title: 'Audit log',
        description:
          'Compact trust-boundary decision log under ~/.strike/audit/ — complements session JSONL without storing chat payloads.',
        icon: ClipboardList,
        docsTo: '/docs/audit',
      },
      {
        title: 'Secrets redaction',
        description:
          'Credential scrubbing on exports, traces, and tool results, plus secret-ref env indirection so keys stay out of logs.',
        icon: KeyRound,
        docsTo: '/docs/secrets',
      },
    ],
  },
  {
    id: 'extensibility',
    title: 'Extensibility',
    blurb: 'Plugins, MCP, providers, progressive tools, config, and experimental strike serve.',
    features: [
      {
        title: 'Plugins',
        description:
          'Versioned contribution packs — agents, skills, workflows, themes, MCP, harnesses, and panes with install, trust, catalog, and lockfile integrity.',
        icon: Package,
        docsTo: '/docs/plugins',
      },
      {
        title: 'MCP (stdio + HTTP)',
        description:
          'Stdio or streamable HTTP servers with tools, prompts, resources, OAuth, and live catalog refresh — capability-negotiated and permissioned.',
        icon: Plug,
        docsTo: '/docs/mcp',
      },
      {
        title: 'Providers & auth',
        description:
          'Anthropic, OpenAI, xAI, Google, Kimi, DeepSeek — plus custom OpenAI-/Anthropic-compatible endpoints. OAuth and API keys in-TUI.',
        icon: Sparkles,
        docsTo: '/docs/auth',
      },
      {
        title: 'Progressive tools',
        description:
          'deferTools keeps a lean always-on core; toolsearch and workflow activation promote optional tools (websearch, team, MCP) on demand.',
        icon: ScanSearch,
        docsTo: '/docs/config',
      },
      {
        title: 'Config & settings',
        description:
          'Global/project JSONC, managed MDM layer, /settings ports, and a versioned config schema for editor autocomplete.',
        icon: Settings2,
        docsTo: '/docs/config',
      },
      {
        title: 'First-time setup',
        description:
          '/ftue wizard — provider, model, optional tour, scheduler presets, and onboarding state for a clean first run.',
        icon: Sparkles,
        docsTo: '/docs/ftue',
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
    blurb: 'Checkpoints, sessions, workspace tools, eval, install, and headless runs without losing the thread.',
    features: [
      {
        title: 'Checkpoints & undo',
        description:
          'Per-turn file snapshots plus bash shadow-git coverage power /undo — restore formatter and shell side effects without git reset --hard.',
        icon: Undo2,
        docsTo: '/docs/checkpoints',
      },
      {
        title: 'Session resume & fork',
        description:
          '/fork duplicates a session; --continue / --session resumes durable JSONL history; /rewind forks from an earlier turn.',
        icon: History,
        docsTo: '/docs/usage',
      },
      {
        title: 'Session tools',
        description:
          'Private session temp dir, websearch, diagnostics (LSP), and move/delete path tools — permissioned workspace helpers beside bash.',
        icon: Wrench,
        docsTo: '/docs/usage',
      },
      {
        title: 'Eval runners',
        description:
          'Internal swebench, tbench, parameter sweeps, and progressive-disclosure fixtures for regression signal — not published pass rates.',
        icon: FlaskConical,
        docsTo: '/docs/eval',
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
          'Run strike exec for scripted, non-interactive agent turns in CI or pipelines — JSON envelopes when you need them.',
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
          Each card links to the docs.
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
                        <Link
                          to={feature.docsTo}
                          aria-label={`Docs: ${feature.title}`}
                          className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-lg text-sm font-medium text-accent transition-colors hover:text-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        >
                          Docs
                          <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                        </Link>

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
