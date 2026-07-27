# Product visuals

Real Strike TUI captures in `public/product/`, referenced as `/product/...` from `src/lib/productMedia.ts`.

## Current assets

| File | Scene | Where used |
|---|---|---|
| `multi-pane-cockpit.gif` | Dark multi-pane cockpit in motion | Hero (primary LCP), demos “launch” |
| `multiple-agents.webp` | Concurrent agent roots | Hero, stills, demos “sessions”, feature thumbs |
| `permissions.webp` | Permission prompt | Hero, stills, demos “tools”, feature thumbs |
| `visualizer.webp` | Activity / context visualizer | Hero, stills, feature thumbs |
| `file-mentions.gif` | `@file` fuzzy completion | Stills, feature thumbs |
| `memories.gif` | Memory pane | Stills, feature thumbs |
| `md-reader.gif` | Markdown reader pane | Stills |
| `vim.gif` | Vim mode in the TUI | Stills |

Social share:

| File | Scene | Where used |
|---|---|---|
| `../og-image.jpg` | 1200×630 crop of multi-agent cockpit | `og:image` / Twitter in `index.html` |

## Source

Captures from `~/Downloads/images-for-strike-cli-web` (Jul 2026). Static frames resized to ≤1200px wide and encoded as WebP (q82); GIFs kept at 800×458.

## Drop-in replacement

1. Overwrite files under `public/product/` (same names) or add new ones.
2. Point `src/lib/productMedia.ts` at the new paths/extensions.
3. Keep alt text accurate to the frame.

## Perf

- Hero primary: `fetchPriority="high"`, eager.
- Other slides / stills: `loading="lazy"`.
- Prefer short GIFs or WebP stills; avoid multi‑MB hero media.
