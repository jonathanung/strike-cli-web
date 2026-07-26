import { motion, useReducedMotion } from 'framer-motion'
import { Section } from './ui/Section'
import { demoMedia } from '../lib/productMedia'

export function Demos() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="demos" className="pb-20 sm:pb-28">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">See it in action</h2>
        <p className="mt-3 text-text-muted">Short walkthroughs of the core Strike workflow.</p>
      </div>

      <ul className="flex flex-col gap-12 md:gap-16">
        {demoMedia.map((demo, i) => {
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
                <div
                  data-demo-slot={demo.slot}
                  className="relative aspect-video min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-terminal-bg shadow-[0_0_40px_-16px] shadow-accent-glow/30"
                >
                  <img
                    src={demo.src}
                    alt={demo.alt}
                    width={960}
                    height={600}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
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
