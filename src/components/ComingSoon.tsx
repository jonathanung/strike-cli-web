import { motion, useReducedMotion } from 'framer-motion'
import { Globe, Server } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from './ui/Section'
import { Card } from './ui/Card'

type Upcoming = {
  title: string
  description: string
  icon: LucideIcon
}

const upcoming: Upcoming[] = [
  {
    title: 'Hardened remote access',
    description:
      'TLS, stronger auth, and safer remote patterns beyond today’s experimental localhost/LAN serve — TUI stays primary.',
    icon: Globe,
  },
  {
    title: 'Server daemon',
    description:
      'An always-on Strike daemon for long-running agent work. Not a multiplayer web IDE.',
    icon: Server,
  },
]

export function ComingSoon() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="coming-soon" className="pb-20 sm:pb-28">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">Coming soon</h2>
        <p className="mt-3 text-text-muted">
          On the roadmap — the CLI stays first-class.
        </p>
      </div>

      <ul className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        {upcoming.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.li
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <Card as="article" interactive className="relative h-full min-w-0 overflow-hidden p-5 sm:p-6">
                <span className="absolute right-4 top-4 rounded-md border border-border-muted bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  Soon
                </span>
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="pr-14 text-base font-semibold text-text">{item.title}</h3>
                <p className="mt-2 break-words text-sm leading-relaxed text-text-muted">
                  {item.description}
                </p>
              </Card>
            </motion.li>
          )
        })}
      </ul>
    </Section>
  )
}
