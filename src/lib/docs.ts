import installMd from '../content/docs/install.md?raw'
import quickstartMd from '../content/docs/quickstart.md?raw'
import authMd from '../content/docs/auth.md?raw'
import usageMd from '../content/docs/usage.md?raw'
import keybindsMd from '../content/docs/keybinds.md?raw'
import editorsMd from '../content/docs/editors.md?raw'
import multiAgentMd from '../content/docs/multi-agent.md?raw'
import goalMd from '../content/docs/goal.md?raw'
import loopMd from '../content/docs/loop.md?raw'
import configMd from '../content/docs/config.md?raw'
import mcpMd from '../content/docs/mcp.md?raw'
import themeMd from '../content/docs/theme.md?raw'
import webMd from '../content/docs/web.md?raw'
import peerEcosystemMd from '../content/docs/peer-ecosystem.md?raw'

export type DocCategoryId = 'start' | 'use' | 'agents' | 'configure' | 'advanced'

export type DocPage = {
  slug: string
  title: string
  summary: string
  markdown: string
  category: DocCategoryId
  experimental?: boolean
}

export type DocCategory = {
  id: DocCategoryId
  label: string
  order: number
}

/** Sidebar / index category order. */
export const DOC_CATEGORIES: DocCategory[] = [
  { id: 'start', label: 'Start', order: 0 },
  { id: 'use', label: 'Use', order: 1 },
  { id: 'agents', label: 'Agents', order: 2 },
  { id: 'configure', label: 'Configure', order: 3 },
  { id: 'advanced', label: 'Advanced', order: 4 },
]

/** On-domain docs hub. Markdown is vendored from jonathanung/strike `docs/*.md`. */
export const DOC_PAGES: DocPage[] = [
  {
    slug: 'install',
    title: 'Install',
    summary: 'Install Strike on macOS and Linux with the one-line installer.',
    markdown: installMd,
    category: 'start',
  },
  {
    slug: 'quickstart',
    title: 'Quickstart',
    summary: 'Install, authenticate, launch the TUI, and run your first session.',
    markdown: quickstartMd,
    category: 'start',
  },
  {
    slug: 'auth',
    title: 'Auth',
    summary: 'Providers, credentials, OAuth, and environment variables.',
    markdown: authMd,
    category: 'start',
  },
  {
    slug: 'usage',
    title: 'Usage',
    summary: 'Launch the TUI, sessions, slash commands, and day-to-day workflows.',
    markdown: usageMd,
    category: 'use',
  },
  {
    slug: 'keybinds',
    title: 'Keybinds',
    summary: 'Keyboard reference for the TUI (also available via F1 / /keys).',
    markdown: keybindsMd,
    category: 'use',
  },
  {
    slug: 'editors',
    title: 'Editors',
    summary: 'Embedded vim/nano and markdown reader — pane, overlay, or takeover.',
    markdown: editorsMd,
    category: 'use',
  },
  {
    slug: 'multi-agent',
    title: 'Multi-agent',
    summary: 'Agents, skills, discovery roots, and coordinating work in one workspace.',
    markdown: multiAgentMd,
    category: 'agents',
  },
  {
    slug: 'goal',
    title: 'Goal',
    summary: 'Deterministic /goal harness — criteria, budgets, and termination guards.',
    markdown: goalMd,
    category: 'agents',
  },
  {
    slug: 'loop',
    title: 'Loop',
    summary: 'Session-scoped /loop recurring jobs on a fixed interval.',
    markdown: loopMd,
    category: 'agents',
  },
  {
    slug: 'config',
    title: 'Config',
    summary: 'Providers, models, permissions, keybinds, and configuration files.',
    markdown: configMd,
    category: 'configure',
  },
  {
    slug: 'mcp',
    title: 'MCP',
    summary: 'Connect Model Context Protocol servers over stdio or streamable HTTP.',
    markdown: mcpMd,
    category: 'configure',
  },
  {
    slug: 'theme',
    title: 'Theme',
    summary: 'TUI color themes, solid chrome, and surface tokens.',
    markdown: themeMd,
    category: 'configure',
  },
  {
    slug: 'web',
    title: 'Web',
    summary:
      'Experimental strike serve cockpit — TUI is primary. Localhost default, LAN --expose threat model, no production multiplayer web IDE.',
    markdown: webMd,
    category: 'advanced',
    experimental: true,
  },
  {
    slug: 'peer-ecosystem',
    title: 'Peer ecosystem',
    summary: 'What Strike imports from peer CLIs — skills, workflows, hooks mapping.',
    markdown: peerEcosystemMd,
    category: 'advanced',
  },
]

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug)
}

/** Pages grouped by DOC_CATEGORIES order. */
export function docsByCategory(): { category: DocCategory; pages: DocPage[] }[] {
  return DOC_CATEGORIES.map((category) => ({
    category,
    pages: DOC_PAGES.filter((p) => p.category === category.id),
  })).filter((g) => g.pages.length > 0)
}

/** Strip the first ATX H1 so the page shell can own the title. */
export function docBodyMarkdown(markdown: string): string {
  return markdown.replace(/^#[ \t]+[^\n]*\n+/, '')
}
