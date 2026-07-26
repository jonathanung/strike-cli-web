import { motion, useReducedMotion } from 'framer-motion'
import { Section } from './ui/Section'

/**
 * Demo GIF slots.
 * To wire real recordings later:
 *   1. Drop files in public/demos/ (e.g. launch.gif, tools.gif, sessions.gif)
 *   2. Replace each placeholder div with:
 *      <img src="/demos/launch.gif" alt="..." className="h-full w-full object-cover" />
 * data-demo-slot attributes mark each frame for easy find-replace.
 */
const demos = [
  {
    slot: 'launch',
    title: 'Launch & first prompt',
    caption:
      'Record: open strike, pick provider/model if needed, send your first coding prompt and watch the agent respond.',
    // img: '/demos/launch.gif',
  },
  {
    slot: 'tools',
    title: 'Tools & permissions',
    caption:
      'Record: agent requests a tool call; show the permission prompt (allow once / session) and the tool running.',
    // img: '/demos/tools.gif',
  },
  {
    slot: 'sessions',
    title: 'Sessions & continue',
    caption:
      'Record: quit, then `strike --continue` restoring the transcript and picking up where you left off.',
    // img: '/demos/sessions.gif',
  },
] as const

export function Demos() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="demos" className="pb-20 sm:pb-28">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">See it in action</h2>
        <p className="mt-3 text-text-muted">Short walkthroughs of the core Strike workflow.</p>
      </div>

      <ul className="flex flex-col gap-12 md:gap-16">
        {demos.map((demo, i) => {
          const mediaFirst = i % 2 === 0
          return (
            <motion.li
              key={demo.slot}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <figure
                className={`flex min-w-0 flex-col gap-6 md:flex-row md:items-center md:gap-10 ${
                  !mediaFirst ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* data-demo-slot: replace inner placeholder with <img src="/demos/{slot}.gif" /> */}
                <div
                  data-demo-slot={demo.slot}
                  className="relative flex aspect-video min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface/60"
                >
                  <span className="text-sm text-text-muted">Demo coming soon</span>
                </div>
                <figcaption className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold tracking-tight text-text sm:text-xl">
                    {demo.title}
                  </h3>
                  <p className="mt-2 break-words text-sm leading-relaxed text-text-muted sm:text-base">
                    {demo.caption}
                  </p>
                </figcaption>
              </figure>
            </motion.li>
          )
        })}
      </ul>
    </Section>
  )
}
