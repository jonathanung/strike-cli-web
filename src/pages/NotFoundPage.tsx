import { Home, BookOpen, Download } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Button } from '../components/ui/Button'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <Section className="flex flex-1 flex-col justify-center pb-20 pt-16 sm:pb-28 sm:pt-24" narrow>
      <p className="font-mono text-sm font-medium text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
        That URL is not part of this site. Try the home page, docs, or the install
        command.
      </p>

      <ul className="mt-10 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
        <li>
          <Button to="/" className="w-full sm:w-auto">
            <Home className="size-4" aria-hidden />
            Home
          </Button>
        </li>
        <li>
          <Button to="/docs" variant="secondary" className="w-full sm:w-auto">
            <BookOpen className="size-4" aria-hidden />
            Docs
          </Button>
        </li>
        <li>
          <Button to="/#install" variant="secondary" className="w-full sm:w-auto">
            <Download className="size-4" aria-hidden />
            Install
          </Button>
        </li>
      </ul>
    </Section>
  )
}
