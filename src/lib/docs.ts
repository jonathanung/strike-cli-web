export type DocPage = {
  slug: string
  title: string
  summary: string
}

/** Docs IA stubs — later epics fill content under these routes. */
export const DOC_PAGES: DocPage[] = [
  {
    slug: 'install',
    title: 'Install',
    summary: 'Install Strike on macOS and Linux with the one-line installer.',
  },
  {
    slug: 'usage',
    title: 'Usage',
    summary: 'Launch the TUI, sessions, slash commands, and day-to-day workflows.',
  },
  {
    slug: 'multi-agent',
    title: 'Multi-agent',
    summary: 'Run and coordinate multiple agents in one workspace.',
  },
  {
    slug: 'config',
    title: 'Config',
    summary: 'Providers, models, themes, and configuration files.',
  },
  {
    slug: 'mcp',
    title: 'MCP',
    summary: 'Connect Model Context Protocol servers and tools.',
  },
  {
    slug: 'web',
    title: 'Web',
    summary: 'Experimental strike serve web attach, plus remote experiences on the roadmap.',
  },
]

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug)
}
