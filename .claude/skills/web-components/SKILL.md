---
name: web-components
description: Use when building or restyling the strike-cli-web marketing site — page sections, UI primitives, design tokens, motion, demos, install CTA, or layout work under `src/`. Covers the component catalog, `src/index.css` `@theme` tokens, and composition in `src/App.tsx`. Do not use for the strike-cli Go/TUI product codebase.
---

# Web components (strike-cli-web)

Marketing and information site for [strike-cli](https://github.com/jonathanung/strike-cli) — “agentic coding in your terminal.” Live: [strike.jonathanung.ca](https://strike.jonathanung.ca).

**Stack:** React 19 + Vite 7 + TypeScript 5.9 + Tailwind CSS v4 + framer-motion + lucide-react.

**Composition** lives in `src/App.tsx` (single SPA, no router):

```
BackgroundEffects → Header → main(Hero, HappyPath, Demos, Features, ComingSoon) → Footer
```

**Design tokens** live in `src/index.css` under `@theme`. Prefer Tailwind theme classes (`bg-bg`, `text-accent`, `border-border`, `font-mono`, …) over raw hex.

## Boundaries

- **This repo only** — marketing/info website. Do not implement the Go CLI, Bubble Tea TUI, or `internal/*` packages here.
- **CLI/TUI terms in copy only** — product claims (install command, “TUI”, agent features) are marketing text, not implementation targets.
- **Prefer existing primitives:** `Section`, `CodeBlock`, `INSTALL_COMMAND` from `InstallCommand.tsx`, `copyToClipboard` from `src/lib/copy.ts`.
- **Theme tokens, not raw hex** — extend `@theme` in `src/index.css` when a new color/font is needed; do not scatter `#a78bfa` in components.
- **Motion:** honor `useReducedMotion()` from framer-motion; CSS already disables `.animate-orb` / `.animate-curve-dash` under `prefers-reduced-motion`.
- **No client router** — one-page SPA with section `id`s and header anchor links (`scroll-mt-20` via `Section`).
- **Static assets** under `public/` (e.g. `public/demos/*.gif`); reference as `/demos/...`.
- **nginx / Docker / CI** — only edit when the issue is about deploy, `/install` proxy, or infra. Otherwise leave them alone.

## Component catalog

| Piece | Path | Role |
|---|---|---|
| App | `src/App.tsx` | Root layout: background, header, main sections, footer |
| BackgroundEffects | `src/components/BackgroundEffects.tsx` | Ambient orbs / grid / decorative motion behind content |
| Header | `src/components/Header.tsx` | Sticky nav, section anchors, branding |
| Hero | `src/components/Hero.tsx` | Above-the-fold headline, value prop, primary CTA |
| HeroCarousel | `src/components/HeroCarousel.tsx` | Hero visual carousel / rotating showcase |
| InstallCommand | `src/components/InstallCommand.tsx` | Copyable install CTA; exports `INSTALL_COMMAND` |
| HappyPath | `src/components/HappyPath.tsx` | Animated install → launch → upgrade walkthrough; imports `INSTALL_COMMAND` |
| Demos | `src/components/Demos.tsx` | Demo GIF slots (`data-demo-slot`); wire `public/demos/` images here |
| Features | `src/components/Features.tsx` | Feature grid / product highlights |
| ComingSoon | `src/components/ComingSoon.tsx` | Roadmap / upcoming items |
| Footer | `src/components/Footer.tsx` | Footer links and credits |
| Section | `src/components/ui/Section.tsx` | Page section shell: padding, max-width, optional `id` + `scroll-mt-20` |
| CodeBlock | `src/components/ui/CodeBlock.tsx` | Terminal-styled code panel with optional label bar |
| copyToClipboard | `src/lib/copy.ts` | Clipboard helper; returns `{ ok: true }` or `{ ok: false; error }` |
| Entry | `src/main.tsx` | React root mount |
| Tokens / base | `src/index.css` | `@theme` colors/fonts, base styles, utility classes |

### Section API

```ts
Section({ id?, children, className?, narrow? })
```

- Default content width: `max-w-6xl`
- `narrow`: `max-w-3xl`
- When `id` is set: `scroll-mt-20` for sticky-header anchors

### CodeBlock API

```ts
CodeBlock({ children, className?, label? })
```

Terminal chrome (`bg-terminal-bg`, border, optional traffic-light + label bar).

### Install command (single source)

```ts
// src/components/InstallCommand.tsx
export const INSTALL_COMMAND =
  'curl -fsSL https://strike.jonathanung.ca/install | bash'
```

HappyPath and any other surface that shows the install string **must** import `INSTALL_COMMAND` — do not duplicate the curl string.

## Design tokens

From `src/index.css` `@theme` (exact values):

| Token | Value | Typical Tailwind |
|---|---|---|
| `--color-bg` | `#0c0b10` | `bg-bg` |
| `--color-bg-elevated` | `#14121a` | `bg-bg-elevated` |
| `--color-surface` | `#1a1722` | `bg-surface` |
| `--color-border` | `#2e2838` | `border-border` |
| `--color-text` | `#f4f0fa` | `text-text` |
| `--color-text-muted` | `#9b93a8` | `text-text-muted` |
| `--color-accent` | `#a78bfa` | `text-accent` / `bg-accent` |
| `--color-accent-soft` | `#2a2140` | `bg-accent-soft` |
| `--color-accent-glow` | `#7c5cbf` | glow / shadow accents |
| `--color-sky` | `#67e8f9` | `text-sky` |
| `--color-bolt` | `#f0b429` | `text-bolt` |
| `--color-neon-pink` | `#f472b6` | `text-neon-pink` (e.g. copy success) |
| `--color-terminal-bg` | `#121018` | `bg-terminal-bg` |
| `--color-terminal-fg` | `#e4e0ec` | `text-terminal-fg` |
| `--color-terminal-green` | `#4ade80` | `text-terminal-green` |
| `--color-terminal-comment` | `#6b6580` | `text-terminal-comment` |
| `--font-sans` | Inter + system stack | `font-sans` |
| `--font-mono` | JetBrains Mono + mono stack | `font-mono` |

### Utility classes (`@layer utilities`)

| Class | Purpose |
|---|---|
| `.bg-grid` | Faded grid background with radial mask |
| `.animate-orb` | Ambient orb drift (`--orb-duration`, default 22s) |
| `.animate-curve-dash` | SVG stroke dash animation (`--curve-duration`, default 50s) |
| `.text-gradient-accent` | Text gradient: text → accent → sky |

### Extending tokens

1. Add or change values only in `src/index.css` `@theme` (or shared utilities there).
2. Use the new token via Tailwind class names generated from the theme.
3. Keep contrast readable on dark `bg` / `surface`; accent is purple — sky/bolt/neon-pink are accents, not body text defaults.
4. Do not introduce a second design system or CSS-in-JS theme.

## Recipes

### New page section

1. Create `src/components/MySection.tsx`.
2. Wrap content in `<Section id="my-section" className="…">`.
3. Import and place it in `src/App.tsx` in the intended order inside `<main>`.
4. Add a Header nav link to `#my-section` if it should be reachable from the sticky nav.
5. Match existing spacing rhythm (`pb-20 sm:pb-28`, etc.) and typography patterns from neighboring sections.

### Reuse install command

```tsx
import { INSTALL_COMMAND } from './InstallCommand'
// or show the full CTA:
import { InstallCommand } from './InstallCommand'
```

Never hardcode a second curl URL.

### Code / terminal snippet

```tsx
import { CodeBlock } from './ui/CodeBlock'

<CodeBlock label="terminal">
  {`strike --continue`}
</CodeBlock>
```

### Wire a demo GIF

1. Drop the file in `public/demos/` (e.g. `launch.gif`).
2. In `Demos.tsx`, set `img: '/demos/launch.gif'` (or replace the placeholder with `<img src="..." alt="..." className="h-full w-full object-cover" />`).
3. Keep `data-demo-slot` attributes for findability.
4. Optionally surface the same asset in `HeroCarousel` if the hero should showcase it.

### Icons

```tsx
import { Copy, Check, Github } from 'lucide-react'
```

Use lucide-react consistently; mark decorative icons `aria-hidden` and put accessible names on controls (`aria-label` on icon-only buttons/links).

### Touch / focus patterns

- Interactive controls: prefer `min-h-11` (or equivalent) for touch targets.
- Focus: `focus-visible:ring-2 focus-visible:ring-accent` with appropriate `ring-offset-*` against the local background (`bg`, `terminal-bg`, …).
- Global `:focus-visible` outline is already set in `index.css`; do not remove it.
- Copy feedback: use `aria-live="polite"` for status text (see `InstallCommand`).

### Motion

```tsx
import { motion, useReducedMotion } from 'framer-motion'

const reduceMotion = useReducedMotion()
// Skip or simplify enter/loop animations when reduceMotion is true
```

## Extending and verification

- New shared UI chrome → prefer `src/components/ui/` and document it in this catalog in the same change.
- New colors/fonts/utilities → `src/index.css` only.
- After UI work, verify with **`test-and-validate`**:

```sh
npm run build
# optional visual check:
npm run preview
# or: npm run dev
```

Docker / `/install` smoke only when infra or install proxy is in scope (see `test-and-validate`).

## Do not

- Implement or edit the strike-cli Go/TUI product in this repo.
- Duplicate `INSTALL_COMMAND` string literals across files.
- Use raw hex colors when a `@theme` token exists.
- Add react-router or multi-page routing without an explicit product decision.
- Ignore `prefers-reduced-motion` / `useReducedMotion`.
- Edit `nginx.conf`, `Dockerfile`, or `.github/workflows/ci-cd.yml` for pure visual polish.
- Leave broken TypeScript — `npm run build` runs `tsc -b && vite build`.
