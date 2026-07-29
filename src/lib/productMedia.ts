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
    src: '/product/multi-pane-cockpit.gif',
    alt: 'Strike multi-pane cockpit with session transcript on the left and live side panes on the right',
    label: 'Multi-pane cockpit',
    caption: 'Transcript, composer, and side panes in one workspace.',
  },
  {
    id: 'hero-agents',
    src: '/product/multiple-agents.webp',
    alt: 'Strike agents tree showing concurrent agent roots beside the transcript',
    label: 'Multiple agents',
    caption: 'Concurrent roots, children, and status at a glance.',
  },
  {
    id: 'hero-permissions',
    src: '/product/permissions.webp',
    alt: 'Strike permission prompt asking to allow a tool call in the TUI',
    label: 'Permissions',
    caption: 'Native allow once / session / deny prompts.',
  },
  {
    id: 'hero-visualizer',
    src: '/product/visualizer.webp',
    alt: 'Strike visualizer pane with activity and context telemetry',
    label: 'Visualizer',
    caption: 'Live activity, context, and session telemetry.',
  },
] as const

/** Secondary stills deep-linked from feature cards and shown in the gallery. */
export const productStills: readonly ProductStill[] = [
  {
    id: 'stills-agents',
    src: '/product/multiple-agents.webp',
    alt: 'Strike agents pane with concurrent roots and child tasks',
    label: 'Multiple agents',
    caption: 'Multi-root sessions and child transcripts side by side.',
  },
  {
    id: 'stills-permissions',
    src: '/product/permissions.webp',
    alt: 'Strike permission dialog for a tool call with allow and deny actions',
    label: 'Tools & permissions',
    caption: 'Fine-grained allow / ask / deny without leaving the TUI.',
  },
  {
    id: 'stills-mentions',
    src: '/product/file-mentions.gif',
    alt: 'Strike composer showing @file fuzzy completion for project paths',
    label: '@file mentions',
    caption: 'Fuzzy @path attach from the composer.',
  },
  {
    id: 'stills-memories',
    src: '/product/memories.gif',
    alt: 'Strike memory pane with saved notes beside the transcript',
    label: 'Memories',
    caption: 'In-TUI memory so durable context stays next to the session.',
  },
  {
    id: 'stills-telemetry',
    src: '/product/visualizer.webp',
    alt: 'Strike visualizer with activity and context telemetry',
    label: 'Visualizer & telemetry',
    caption: 'Activity stream and context signals in-pane.',
  },
  {
    id: 'stills-md',
    src: '/product/md-reader.gif',
    alt: 'Strike markdown reader pane rendering a project document',
    label: 'Markdown reader',
    caption: 'Read and review docs without leaving the cockpit.',
  },
  {
    id: 'stills-vim',
    src: '/product/vim.gif',
    alt: 'Strike embedded nvim/vim/nano PTY editor inside the TUI',
    label: 'Embedded editors',
    caption: 'nvim/vim/nano PTY — pane, overlay, or takeover presentation.',
  },
] as const

export const demoMedia = [
  {
    slot: 'launch',
    title: 'Launch & first prompt',
    caption:
      'Open Strike, send a coding prompt, and watch the multi-pane cockpit stream the agent turn with tools in the activity pane.',
    src: '/product/multi-pane-cockpit.gif',
    alt: 'Strike cockpit during a first coding prompt with tool activity',
  },
  {
    slot: 'tools',
    title: 'Tools & permissions',
    caption:
      'When the agent needs bash or edits, a centered permission prompt offers allow once, allow session, or deny.',
    src: '/product/permissions.webp',
    alt: 'Strike permission modal over the cockpit',
  },
  {
    slot: 'sessions',
    title: 'Agents & continue',
    caption:
      'Run concurrent roots, open child transcripts, and resume with strike --continue when you return.',
    src: '/product/multiple-agents.webp',
    alt: 'Strike agents tree with concurrent roots and children',
  },
] as const
