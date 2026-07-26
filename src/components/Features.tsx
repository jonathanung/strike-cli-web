import { motion, useReducedMotion } from 'framer-motion'
import {
  Bot,
  Boxes,
  History,
  Terminal,
  Command,
  Shield,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from './ui/Section'

type Feature = {
  title: string
  description: string
  icon: LucideIcon
}

const features: Feature[] = [
  {
    title: 'Agentic coding TUI',
    description: 'Built in Go with Bubble Tea — a responsive terminal UI made for agentic workflows.',
    icon: Terminal,
  },
  {
    title: 'Multi-provider',
    description: 'Anthropic, OpenAI, xAI, and Echo (offline) — pick the stack that fits the job.',
    icon: Boxes,
  },
  {
    title: 'Session resume',
    description: 'Continue with --continue / --session. Transcripts stored as JSONL for durable history.',
    icon: History,
  },
  {
    title: 'Headless one-shot',
    description: 'Run strike exec for scripted, non-interactive agent turns in CI or pipelines.',
    icon: Command,
  },
  {
    title: 'In-TUI pickers',
    description: 'Slash commands for /provider, /model, /auth, /theme, and more — no config spelunking.',
    icon: Sparkles,
  },
  {
    title: 'Tools & permissions',
    description: 'Fine-grained allow / ask / deny controls so agents act only with your say-so.',
    icon: Shield,
  },
  {
    title: 'Agents & skills',
    description: 'Customizable personas and workflows — shape how the agent thinks and works.',
    icon: Bot,
  },
]

export function Features() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="features" className="pb-20 sm:pb-28">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">Features</h2>
        <p className="mt-3 text-text-muted">What ships in strike-cli today.</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <motion.li
              key={feature.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <article className="group h-full min-w-0 rounded-2xl border border-border bg-surface/80 p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-[0_0_40px_-12px] hover:shadow-accent/30 sm:p-6">
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-text">{feature.title}</h3>
                <p className="mt-2 break-words text-sm leading-relaxed text-text-muted">
                  {feature.description}
                </p>
              </article>
            </motion.li>
          )
        })}
      </ul>
    </Section>
  )
}
