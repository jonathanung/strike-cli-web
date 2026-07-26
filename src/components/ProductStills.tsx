import { motion, useReducedMotion } from 'framer-motion'
import { Section } from './ui/Section'
import { productStills } from '../lib/productMedia'

export function ProductStills() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="product-stills" className="pb-20 sm:pb-28">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">Product stills</h2>
        <p className="mt-3 text-text-muted">
          Multi-pane cockpit details — agents, permissions, @files, worktrees, telemetry.
        </p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productStills.map((still, i) => (
          <motion.li
            key={still.id}
            id={still.id}
            className="scroll-mt-24"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <figure className="overflow-hidden rounded-lg border border-border-muted bg-surface">
              <div className="aspect-[16/10] bg-terminal-bg">
                <img
                  src={still.src}
                  alt={still.alt}
                  width={960}
                  height={600}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
              <figcaption className="border-t border-border-muted bg-bg-elevated px-4 py-3">
                <p className="font-mono text-xs font-medium text-accent">{still.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{still.caption}</p>
              </figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}
