#!/usr/bin/env node
/**
 * One-shot vendor of strike-cli docs into src/content/docs with link rewrites.
 * Run: node scripts/sync-docs-from-cli.mjs [path-to-strike-cli]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cliRoot =
  process.argv[2] || join(root, '..', 'strike-cli')
const cliDocs = join(cliRoot, 'docs')
const outDir = join(root, 'src/content/docs')

const GH = 'https://github.com/jonathanung/strike/blob/main/docs'

/** Upstream basename (no .md) → hub slug */
const SLUG = {
  install: 'install',
  usage: 'usage',
  keybinds: 'keybinds',
  auth: 'auth',
  config: 'config',
  web: 'web',
  goal: 'goal',
  loop: 'loop',
  theme: 'theme',
  'peer-ecosystem': 'peer-ecosystem',
  'agents-skills': 'multi-agent',
}

/** Pages not on the hub → GitHub blob */
const GITHUB_ONLY = new Set([
  'ARCHITECTURE',
  'contributing',
  'nix',
  'harnesses',
])

function readCli(name) {
  return readFileSync(join(cliDocs, name), 'utf8')
}

function rewriteLinks(md) {
  return md.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (full, text, href) => {
    const trimmed = href.trim()
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('#')
    ) {
      return full
    }

    const [pathPart, frag = ''] = trimmed.split('#')
    const base = pathPart.replace(/^\.\//, '').split('/').pop() || ''
    const fragSuffix = frag ? `#${frag}` : ''

    if (base.endsWith('.md')) {
      const stem = base.replace(/\.md$/, '')
      if (GITHUB_ONLY.has(stem) || stem.startsWith('investigations')) {
        const ghPath =
          stem === 'ARCHITECTURE'
            ? 'ARCHITECTURE.md'
            : stem.startsWith('investigations')
              ? `investigations/${stem.replace(/^investigations\//, '')}.md`
              : `${stem}.md`
        // investigations links may be investigations/foo.md
        let blob = `${GH}/${stem}.md`
        if (pathPart.includes('investigations/')) {
          blob = `${GH}/${pathPart.replace(/^\.\//, '')}`
        } else if (stem === 'ARCHITECTURE') {
          blob = `${GH}/ARCHITECTURE.md`
        }
        return `[${text}](${blob}${fragSuffix})`
      }
      if (SLUG[stem]) {
        return `[${text}](/docs/${SLUG[stem]}${fragSuffix})`
      }
      // unknown relative md → GitHub
      return `[${text}](${GH}/${stem}.md${fragSuffix})`
    }

    // bare relative without .md (rare)
    if (SLUG[pathPart]) {
      return `[${text}](/docs/${SLUG[pathPart]}${fragSuffix})`
    }
    return full
  })
}

function extractSection(md, heading) {
  const re = new RegExp(
    `^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
    'm',
  )
  const m = re.exec(md)
  if (!m) throw new Error(`section not found: ${heading}`)
  const start = m.index
  const rest = md.slice(start + m[0].length)
  const next = /^## /m.exec(rest)
  const body = next ? rest.slice(0, next.index) : rest
  return md.slice(start, start + m[0].length + body.length).trimEnd()
}

function stripSection(md, heading) {
  const re = new RegExp(
    `^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
    'm',
  )
  const m = re.exec(md)
  if (!m) return md
  const start = m.index
  const rest = md.slice(start + m[0].length)
  const next = /^## /m.exec(rest)
  const end = next ? start + m[0].length + next.index : md.length
  return (md.slice(0, start) + md.slice(end)).replace(/\n{3,}/g, '\n\n')
}

function siteInstall(cliInstall) {
  // Keep marketing-site proxy semantics for /install brand URL.
  let md = cliInstall
  md = md.replace(
    /`https:\/\/strike\.jonathanung\.ca\/install` is a \*\*stable brand URL\*\* that should\n\*\*redirect\*\* \(301\/302\) to the raw install script on GitHub, for example:\n\n```\nhttps:\/\/raw\.githubusercontent\.com\/jonathanung\/strike-cli\/main\/scripts\/install\.sh\n```\n\nBinaries are \*\*not\*\* hosted on the VPS long-term\. The script resolves the\nlatest \[GitHub Release\]\(https:\/\/github\.com\/jonathanung\/strike-cli\/releases\)/,
    `\`https://strike.jonathanung.ca/install\` is a **stable brand URL**. The marketing
site **proxies** (does not redirect) the install script body so
\`curl … | bash\` receives the script directly. Upstream source:

\`\`\`
https://raw.githubusercontent.com/jonathanung/strike/main/scripts/install.sh
\`\`\`

Binaries are **not** hosted on the VPS long-term. The script resolves the
latest [GitHub Release](https://github.com/jonathanung/strike/releases)`,
  )
  // Fallback simpler replacements if the big regex misses
  md = md.replaceAll('jonathanung/strike-cli', 'jonathanung/strike')
  md = md.replace(
    /## Domain \/ DNS \(ops\)\n\nConfigure `strike\.jonathanung\.ca` with TLS and \*\*redirect-only\*\* rules:\n\n\| Public URL \| Redirects to \|\n\|---\|---\|\n\| `https:\/\/strike\.jonathanung\.ca\/install` \| raw `scripts\/install\.sh` on default branch \|\n\| `https:\/\/strike\.jonathanung\.ca\/` \(optional\) \| this repo or docs \|\n\| `https:\/\/strike\.jonathanung\.ca\/latest` \(optional\) \| GitHub Releases latest \|\n\nSmoke:\n\n```sh\ncurl -fsSLI https:\/\/strike\.jonathanung\.ca\/install\n# expect a 301\/302 chain ending at raw\.githubusercontent\.com\/\.\.\.\/install\.sh\n```/,
    `## Domain / DNS (ops)

Configure \`strike.jonathanung.ca\` with TLS. Container nginx on this site:

| Public URL | Behavior |
|---|---|
| \`https://strike.jonathanung.ca/install\` | **Proxy** to raw \`scripts/install.sh\` on the strike default branch (script body, not an HTML redirect) |
| \`https://strike.jonathanung.ca/\` | Marketing site + on-domain \`/docs\` |
| \`https://strike.jonathanung.ca/latest\` (optional) | GitHub Releases latest |

Smoke:

\`\`\`sh
curl -fsSL -o /dev/null -w "%{http_code}\\n" https://strike.jonathanung.ca/install
# expect 200 and a shell script body (not a redirect HTML page)
curl -fsSL https://strike.jonathanung.ca/install | head
\`\`\``,
  )
  return rewriteLinks(md)
}

function slimConfig(full) {
  let md = full
  // Replace Theme section with one-liner
  md = md.replace(
    /## Theme\n\n[\s\S]*?(?=\n## )/,
    `## Theme

\`theme\` is a color-theme id (bundled + \`~/.strike/themes\` + \`./.strike/themes\`).
In the TUI: bare \`/theme\` opens a picker; \`/theme <id>\` applies one. Full chrome
modes, surfaces, and web cockpit parity: [Theme](/docs/theme).

`,
  )
  // Replace MCP section with short blurb
  md = md.replace(
    /## MCP servers \(stdio \+ HTTP\)\n\n[\s\S]*?(?=\n## )/,
    `## MCP servers

Connect Model Context Protocol servers over **stdio** or **streamable HTTP**.
Prefer \`mcp.jsonc\`; legacy \`mcp\` in config still works. Full setup, fields,
permissions, and TUI controls: [MCP](/docs/mcp).

`,
  )
  // Replace Surface presentation with pointer to editors
  md = md.replace(
    /## Surface presentation \(`vimMode`, `nanoMode`, `mdReadMode`\)\n\n[\s\S]*?(?=\n## )/,
    `## Surface presentation (editors)

\`vimMode\`, \`nanoMode\`, and \`mdReadMode\` control how \`/vim\`, \`/nano\`, and
\`/md-read\` present (embedded pane, modal overlay, or takeover). Full reference:
[Editors](/docs/editors).

`,
  )
  // peer-ecosystem / agents-skills already rewritten by rewriteLinks
  return rewriteLinks(md)
}

function editorsFromConfig(full) {
  const section = extractSection(
    full,
    'Surface presentation (`vimMode`, `nanoMode`, `mdReadMode`)',
  )
  // Drop the ## heading; use Editors H1
  const body = section.replace(
    /^## Surface presentation \(`vimMode`, `nanoMode`, `mdReadMode`\)\s*\n+/,
    '',
  )
  const md = `# Editors

Embedded and modal editors for files and markdown inside the TUI — not a
separate IDE. Configure presentation with \`vimMode\`, \`nanoMode\`, and
\`mdReadMode\` in [Config](/docs/config); change defaults via \`/settings\`.

${body}
`
  return rewriteLinks(md)
}

function mcpFromConfig(full) {
  const section = extractSection(full, 'MCP servers (stdio + HTTP)')
  const body = section
    .replace(/^## MCP servers \(stdio \+ HTTP\)\s*\n+/, '')
    // Ensure single intro (section already has one)
  const md = `# MCP

${body}
`
  return rewriteLinks(md)
}

function quickstart() {
  return `# Quickstart

Get Strike running in a few minutes. For full detail see [Install](/docs/install),
[Usage](/docs/usage), and [Auth](/docs/auth).

## 1. Install

\`\`\`sh
curl -fsSL https://strike.jonathanung.ca/install | bash
\`\`\`

The installer downloads the latest [GitHub Release](https://github.com/jonathanung/strike/releases),
verifies checksums, and places the binary at \`~/.strike/bin/strike\` (no root).

Open a new shell (or \`export PATH="$HOME/.strike/bin:$PATH"\`), then:

\`\`\`sh
strike version
\`\`\`

macOS and Linux (arm64 / amd64) are supported. Nix: \`nix run github:jonathanung/strike\`.
Details, PATH options, upgrade, and uninstall: [Install](/docs/install).

## 2. Authenticate a provider

Strike can launch without credentials; pick a provider in the TUI or log in first:

\`\`\`sh
strike auth login anthropic   # or openai / xai / google / kimi / deepseek
# or set ANTHROPIC_API_KEY / OPENAI_API_KEY / XAI_API_KEY /
#     GEMINI_API_KEY|GOOGLE_API_KEY / KIMI_API_KEY / DEEPSEEK_API_KEY
\`\`\`

Built-ins: Anthropic, OpenAI, xAI, Google, Kimi, DeepSeek, plus custom endpoints
via \`providers.jsonc\`. Credentials live in \`~/.strike/auth.json\`. See [Auth](/docs/auth).

## 3. Launch the TUI

\`\`\`sh
strike
# optional pins:
strike --provider anthropic --model <id>
\`\`\`

In the TUI:

| Action | How |
|---|---|
| Send message | Enter |
| Newline | Shift+Enter |
| Interrupt | Esc |
| Jump to latest output | Ctrl+T |
| Quit | Ctrl+C |
| Provider / model / auth | \`/provider\`, \`/model\`, \`/auth\` |
| Permission mode | Shift+Tab or \`/mode\` |
| Help | \`/help\` |
| Keybind cheatsheet | \`F1\` or \`/keys\` |

Attach project files with \`@path\`. Full slash-command list: [Usage](/docs/usage).
Keyboard reference: [Keybinds](/docs/keybinds).

## 4. Resume and headless runs

\`\`\`sh
strike --continue                 # resume last root session
strike --session <id>             # resume a specific session
strike exec "summarize this repo" # headless one-shot → stdout
\`\`\`

Sessions are JSONL event logs under \`~/.strike\`. Fork / undo / rewind:
\`/fork\`, \`/undo\`, \`/rewind\` — see [Usage](/docs/usage).

## 5. Agents and multi-agent work

Tab cycles agents (\`build\`, \`plan\`, \`explore\`, …). Use \`/agent\` to pick one.
Skills and custom personas load from \`~/.strike\` and the project. Deep dive:
[Multi-agent](/docs/multi-agent). Goal harness: [Goal](/docs/goal). Recurring jobs:
[Loop](/docs/loop).

## 6. Optional: web cockpit

\`\`\`sh
strike serve --addr 127.0.0.1:8787 --token <secret>
# open http://127.0.0.1:8787/attach?token=<secret>
\`\`\`

Experimental browser UI; the TUI remains primary. See [Web](/docs/web).

## Next steps

- [Config](/docs/config) — permissions, models, MCP, providers
- [Editors](/docs/editors) — \`/vim\`, \`/nano\`, \`/md-read\` presentation
- [MCP](/docs/mcp) — stdio + streamable HTTP tools
- [Theme](/docs/theme) — TUI chrome and color themes
- [Multi-agent](/docs/multi-agent) — agents, skills, discovery roots
- [Keybinds](/docs/keybinds) — full keyboard map

Build from source (Go 1.26+): clone [jonathanung/strike](https://github.com/jonathanung/strike),
then \`make setup && make build && make run-echo\`.
`
}

mkdirSync(outDir, { recursive: true })

const configFull = readCli('config.md')

const pages = {
  install: siteInstall(readCli('install.md')),
  quickstart: quickstart(),
  auth: rewriteLinks(readCli('auth.md')),
  usage: rewriteLinks(readCli('usage.md')),
  keybinds: rewriteLinks(readCli('keybinds.md')),
  editors: editorsFromConfig(configFull),
  'multi-agent': rewriteLinks(readCli('agents-skills.md')),
  goal: rewriteLinks(readCli('goal.md')),
  loop: rewriteLinks(readCli('loop.md')),
  config: slimConfig(configFull),
  mcp: mcpFromConfig(configFull),
  theme: rewriteLinks(readCli('theme.md')),
  web: rewriteLinks(readCli('web.md')),
  'peer-ecosystem': rewriteLinks(readCli('peer-ecosystem.md')),
}

for (const [slug, md] of Object.entries(pages)) {
  writeFileSync(join(outDir, `${slug}.md`), md.endsWith('\n') ? md : md + '\n')
  console.log(`wrote ${slug}.md (${md.length} bytes)`)
}

const sourceMd = `# Docs content source

Markdown under this directory is vendored for the on-domain \`/docs\` hub.

| Site slug | Category | Upstream (jonathanung/strike) |
|---|---|---|
| \`install\` | start | \`docs/install.md\` (site proxy wording for brand URL) |
| \`quickstart\` | start | Site-authored from product README + install/usage |
| \`auth\` | start | \`docs/auth.md\` |
| \`usage\` | use | \`docs/usage.md\` |
| \`keybinds\` | use | \`docs/keybinds.md\` |
| \`editors\` | use | Surface presentation section of \`docs/config.md\` |
| \`multi-agent\` | agents | \`docs/agents-skills.md\` |
| \`goal\` | agents | \`docs/goal.md\` |
| \`loop\` | agents | \`docs/loop.md\` |
| \`config\` | configure | \`docs/config.md\` (slimmed: editors/MCP/theme → hub pages) |
| \`mcp\` | configure | MCP section of \`docs/config.md\` |
| \`theme\` | configure | \`docs/theme.md\` |
| \`web\` | advanced | \`docs/web.md\` (experimental) |
| \`peer-ecosystem\` | advanced | \`docs/peer-ecosystem.md\` |

Relative links were rewritten to \`/docs/<slug>\`. Architecture, contributing, nix,
harnesses, and investigations link to GitHub:
\`https://github.com/jonathanung/strike/blob/main/docs/…\`

Re-sync: \`node scripts/sync-docs-from-cli.mjs [path-to-strike-cli]\`
Keep \`npm test\` (broken-link check) green.
`
writeFileSync(join(root, 'src/content/DOCS_SOURCE.md'), sourceMd)
console.log('wrote DOCS_SOURCE.md')
console.log('done')
