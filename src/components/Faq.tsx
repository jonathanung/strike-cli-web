import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Section } from './ui/Section'
import { FAQ_ITEMS } from '../lib/faq'

export function Faq() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="faq" className="pb-20 sm:pb-28">
      <motion.div
        className="mb-10 text-center sm:mb-12"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">FAQ</h2>
        <p className="mx-auto mt-3 max-w-2xl text-text-muted">
          Purchase, trust, and multi-agent questions — honest answers that should track the product.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto max-w-3xl"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <ul className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <li key={item.id}>
              <details className="group rounded-2xl border border-border bg-surface/80 open:border-accent/35 open:shadow-[0_0_40px_-16px] open:shadow-accent/25">
                <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1 text-left text-sm font-semibold text-text sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className="mt-0.5 size-5 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180 group-open:text-accent"
                    aria-hidden
                  />
                </summary>
                <div className="border-t border-border/70 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                  <p className="text-sm leading-relaxed text-text-muted">{item.answer}</p>
                  {item.links && item.links.length > 0 ? (
                    <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                      {item.links.map((link) => (
                        <Link
                          key={link.to + link.label}
                          to={link.to}
                          className="text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </p>
                  ) : null}
                </div>
              </details>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-sm text-text-muted">
          Prefer docs? Same answers live at{' '}
          <Link
            to="/docs/faq"
            className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            /docs/faq
          </Link>
          .
        </p>
      </motion.div>
    </Section>
  )
}
