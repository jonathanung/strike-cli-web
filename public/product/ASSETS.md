# Product visuals

Marketing stills for the Strike multi-pane TUI. Checked into `public/product/` and referenced as `/product/...`.

## Current assets

| File | Scene | Where used |
|---|---|---|
| `hero-cockpit.svg` | Dark multi-pane cockpit (transcript + context/activity) | Hero (primary LCP), demos |
| `hero-cockpit-light.svg` | Light appearance secondary | Hero carousel |
| `agents-tree.svg` | Agents tree + visualizer + transcript | Hero carousel, feature deep-link, demos |
| `permission-modal.svg` | Permission ask modal over cockpit | Hero carousel, feature deep-link, demos |
| `file-mention.svg` | `@file` fuzzy completion in composer | Feature deep-link, product stills |
| `worktrees.svg` | Concurrent roots with worktree isolation | Feature deep-link, product stills |
| `telemetry.svg` | Context doctor bars + cost/telemetry | Feature deep-link, product stills |

These are **high-fidelity dark terminal mockups** aligned to product docs (`docs/usage.md` UI section: left transcript stack, right window registry, permission dialogs, `@` mentions, agents tree, visualizer). They are placeholders structured so real captures can drop in with the same filenames.

## Capture real TUI screenshots (replace later)

Requires a local `strike` binary and a real TTY (or VHS/asciinema).

```sh
# Offline loop (no API key)
strike --provider echo

# Optional: wide terminal for multi-pane split (≥93 cols)
# Record with VHS, asciinema, or macOS screenshot while driving:
#   - first prompt + tool call (hero-cockpit)
#   - agents pane with concurrent roots (agents-tree)
#   - permission ask on bash/edit (permission-modal)
#   - type @path for file mention (file-mention)
#   - strike --worktree / second root (worktrees)
#   - /context and visualizer (telemetry)
#   - /theme light for light secondary
```

### Suggested tooling

1. **[VHS](https://github.com/charmbracelet/vhs)** — scripted `.tape` → GIF/WebP (preferred for hero motion).
2. **asciinema + agg** — cast → GIF.
3. **Manual** — full-screen terminal, macOS `⌘⇧4`, crop chrome.

### Optimize before commit

```sh
# Example: PNG/GIF → WebP (keep SVG mockups until real raster exists)
cwebp -q 82 capture.png -o public/product/hero-cockpit.webp
# or: npx @squoosh/cli --webp auto public/product/*.png
```

Target: hero still ≲150KB; below-fold stills lazy-loaded; prefer WebP/AVIF for rasters. SVGs stay as-is (already light).

### Drop-in replacement

Keep paths stable. Update only files under `public/product/` (and `img` extensions in `src/lib/productMedia.ts` if you switch SVG → WebP). Alt text lives in that module.

## Perf notes

- Hero primary image: `fetchPriority="high"`, eager, no lazy.
- Carousel non-active / below-fold stills: `loading="lazy"`, `decoding="async"`.
- Avoid multi‑MB GIFs in the hero; prefer short muted WebM/WebP or still carousel.
