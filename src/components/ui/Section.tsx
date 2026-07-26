import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
  narrow?: boolean
}

export function Section({ id, children, className = '', narrow = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`min-w-0 px-4 sm:px-6 lg:px-8 ${id ? 'scroll-mt-20' : ''} ${className}`}
    >
      <div className={`mx-auto w-full min-w-0 ${narrow ? 'max-w-3xl' : 'max-w-6xl'}`}>
        {children}
      </div>
    </section>
  )
}
