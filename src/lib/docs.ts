import installMd from '../content/docs/install.md?raw'
import quickstartMd from '../content/docs/quickstart.md?raw'
import usageMd from '../content/docs/usage.md?raw'
import keybindsMd from '../content/docs/keybinds.md?raw'
import multiAgentMd from '../content/docs/multi-agent.md?raw'
import configMd from '../content/docs/config.md?raw'
import mcpMd from '../content/docs/mcp.md?raw'
import webMd from '../content/docs/web.md?raw'
import authMd from '../content/docs/auth.md?raw'

export type DocPage = {
  slug: string
  title: string
  summary: string
  markdown: string
  experimental?: boolean
}

/** On-domain docs hub. Markdown is vendored from jonathanung/strike `docs/*.md`. */
export const DOC_PAGES: DocPage[] = [
  {
    slug: 'install',
    title: 'Install',
    summary: 'Install Strike on macOS and Linux with the one-line installer.',
    markdown: installMd,
  },
  {
    slug: 'quickstart',
    title: 'Quickstart',
    summary: 'Install, authenticate, launch the TUI, and run your first session.',
    markdown: quickstartMd,
  },
  {
    slug: 'usage',
    title: 'Usage',
    summary: 'Launch the TUI, sessions, slash commands, and day-to-day workflows.',
    markdown: usageMd,
  },
  {
    slug: 'keybinds',
    title: 'Keybinds',
    summary: 'Keyboard reference for the TUI (also available via F1 / /keys).',
    markdown: keybindsMd,
  },
  {
    slug: 'multi-agent',
    title: 'Multi-agent',
    summary: 'Agents, skills, discovery roots, and coordinating work in one workspace.',
    markdown: multiAgentMd,
  },
  {
    slug: 'config',
    title: 'Config',
    summary: 'Providers, models, themes, permissions, and configuration files.',
    markdown: configMd,
  },
  {
    slug: 'mcp',
    title: 'MCP',
    summary: 'Connect Model Context Protocol servers and tools.',
    markdown: mcpMd,
  },
  {
    slug: 'web',
    title: 'Web',
    summary:
      'Experimental strike serve cockpit — TUI is primary. Localhost default, LAN --expose threat model, no production multiplayer web IDE.',
    markdown: webMd,
    experimental: true,
  },
  {
    slug: 'auth',
    title: 'Auth',
    summary: 'Providers, credentials, OAuth, and environment variables.',
    markdown: authMd,
  },
]

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug)
}

/** Strip the first ATX H1 so the page shell can own the title. */
export function docBodyMarkdown(markdown: string): string {
  return markdown.replace(/^#[ \t]+[^\n]*\n+/, '')
}
