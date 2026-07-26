export type ProductStill = {
  id: string
  src: string
  alt: string
  label: string
  caption: string
}

/** Hero carousel + LCP primary (first item is above-the-fold). */
export const heroSlides: readonly ProductStill[] = [
  {
    id: 'hero-cockpit',
    src: '/product/hero-cockpit.svg',
    alt: 'Strike dark multi-pane cockpit with session transcript on the left and context and activity panes on the right',
    label: 'Multi-pane cockpit',
    caption: 'Transcript, composer, and side panes in one workspace.',
  },
  {
    id: 'hero-agents',
    src: '/product/agents-tree.svg',
    alt: 'Strike agents tree showing concurrent roots and a child explore task beside the transcript',
    label: 'Agents tree',
    caption: 'Concurrent roots, children, and visualizer telemetry.',
  },
  {
    id: 'hero-permissions',
    src: '/product/permission-modal.svg',
    alt: 'Strike centered permission modal asking to allow a bash tool call',
    label: 'Permissions',
    caption: 'Native allow once / session / deny prompts.',
  },
  {
    id: 'hero-light',
    src: '/product/hero-cockpit-light.svg',
    alt: 'Strike multi-pane cockpit in light appearance',
    label: 'Light theme',
    caption: 'Secondary light appearance via /theme light.',
  },
] as const

/** Secondary stills deep-linked from feature cards and shown in the gallery. */
export const productStills: readonly ProductStill[] = [
  {
    id: 'stills-agents',
    src: '/product/agents-tree.svg',
    alt: 'Strike agents pane with concurrent roots, child tasks, and activity sparkline',
    label: 'Agents & tree',
    caption: 'Multi-root sessions, child transcripts, and visualizer status.',
  },
  {
    id: 'stills-permissions',
    src: '/product/permission-modal.svg',
    alt: 'Strike permission dialog for a bash go test command with allow and deny actions',
    label: 'Tools & permissions',
    caption: 'Fine-grained allow / ask / deny without leaving the TUI.',
  },
  {
    id: 'stills-mentions',
    src: '/product/file-mention.svg',
    alt: 'Strike composer showing @file fuzzy completion for project paths',
    label: '@file mentions',
    caption: 'Fuzzy @path attach from the composer.',
  },
  {
    id: 'stills-worktrees',
    src: '/product/worktrees.svg',
    alt: 'Strike concurrent roots running in isolated git worktrees under .strike/worktrees',
    label: 'Worktrees',
    caption: 'Isolated worktrees so parallel agents do not collide on disk.',
  },
  {
    id: 'stills-telemetry',
    src: '/product/telemetry.svg',
    alt: 'Strike context doctor bars and session cost telemetry in the visualizer pane',
    label: 'Telemetry bars',
    caption: 'Context layers, token totals, and estimated cost in-pane.',
  },
] as const

export const demoMedia = [
  {
    slot: 'launch',
    title: 'Launch & first prompt',
    caption:
      'Open Strike, send a coding prompt, and watch the multi-pane cockpit stream the agent turn with tools in the activity pane.',
    src: '/product/hero-cockpit.svg',
    alt: 'Strike cockpit during a first coding prompt with tool activity',
  },
  {
    slot: 'tools',
    title: 'Tools & permissions',
    caption:
      'When the agent needs bash or edits, a centered permission prompt offers allow once, allow session, or deny.',
    src: '/product/permission-modal.svg',
    alt: 'Strike permission modal over the cockpit',
  },
  {
    slot: 'sessions',
    title: 'Agents & continue',
    caption:
      'Run concurrent roots, open child transcripts, and resume with strike --continue when you return.',
    src: '/product/agents-tree.svg',
    alt: 'Strike agents tree with concurrent roots and children',
  },
] as const

/** @deprecated Prefer stillId on feature cards in Features.tsx. Kept for any residual lookups. */
export const featureStillId: Record<string, string> = {
  'Solid-surface TUI': 'stills-agents',
  'Compaction & context doctor': 'stills-telemetry',
  'In-TUI pickers': 'stills-mentions',
  'Concurrent roots': 'stills-agents',
  'Git worktrees per session': 'stills-worktrees',
  'Agents & skills': 'stills-agents',
  'Tools & permissions': 'stills-permissions',
}
