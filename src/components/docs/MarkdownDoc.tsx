import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { isValidElement, type ReactNode } from 'react'
import { CodeBlock as UiCodeBlock } from '../ui/CodeBlock'

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return flattenText(node.props.children)
  }
  return ''
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function isInternalPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

function DocCodeBlock({ children, className }: { children: ReactNode; className?: string }) {
  const text = flattenText(children).replace(/\n$/, '')
  const lang = className?.replace(/^language-/, '') || 'code'
  return <UiCodeBlock label={lang}>{text}</UiCodeBlock>
}

const components: Components = {
  h1: ({ children }) => {
    const id = slugifyHeading(flattenText(children))
    return (
      <h2 id={id} className="mt-10 scroll-mt-24 text-2xl font-bold tracking-tight text-text first:mt-0">
        {children}
      </h2>
    )
  },
  h2: ({ children }) => {
    const id = slugifyHeading(flattenText(children))
    return (
      <h2 id={id} className="mt-10 scroll-mt-24 text-xl font-bold tracking-tight text-text first:mt-0 sm:text-2xl">
        {children}
      </h2>
    )
  },
  h3: ({ children }) => {
    const id = slugifyHeading(flattenText(children))
    return (
      <h3 id={id} className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight text-text">
        {children}
      </h3>
    )
  },
  h4: ({ children }) => {
    const id = slugifyHeading(flattenText(children))
    return (
      <h4 id={id} className="mt-6 scroll-mt-24 text-base font-semibold text-text">
        {children}
      </h4>
    )
  },
  p: ({ children }) => (
    <p className="mt-4 text-base leading-relaxed text-text-muted first:mt-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-text-muted marker:text-accent">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-relaxed text-text-muted marker:text-accent">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  a: ({ href = '', children }) => {
    if (isInternalPath(href)) {
      return (
        <Link
          to={href}
          className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          {children}
        </Link>
      )
    }
    const external = href.startsWith('http://') || href.startsWith('https://')
    return (
      <a
        href={href}
        className="font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {children}
      </a>
    )
  },
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  em: ({ children }) => <em className="italic text-text-muted">{children}</em>,
  hr: () => <hr className="my-10 border-border-muted" />,
  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-2 border-accent bg-surface py-2 pl-4 pr-3 text-text-muted">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border-muted">
      <table className="w-full min-w-[20rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-bg-elevated">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-border-muted last:border-b-0">{children}</tr>,
  th: ({ children }) => (
    <th scope="col" className="px-3 py-2.5 font-semibold text-text sm:px-4">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2.5 align-top text-text-muted sm:px-4">{children}</td>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.includes('language-'))
    if (isBlock) {
      return <code className={className}>{children}</code>
    }
    return (
      <code className="rounded-md border border-border-muted bg-terminal-bg px-1.5 py-0.5 font-mono text-[0.875em] text-terminal-fg">
        {children}
      </code>
    )
  },
  pre: ({ children }) => {
    if (isValidElement<{ className?: string; children?: ReactNode }>(children)) {
      return (
        <div className="my-4">
          <DocCodeBlock className={children.props.className}>
            {children.props.children}
          </DocCodeBlock>
        </div>
      )
    }
    return (
      <div className="my-4">
        <DocCodeBlock>{children}</DocCodeBlock>
      </div>
    )
  },
}

export function MarkdownDoc({ markdown }: { markdown: string }) {
  return (
    <div className="docs-prose min-w-0 max-w-3xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
