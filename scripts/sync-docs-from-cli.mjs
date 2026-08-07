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
const GH_ROOT = 'https://github.com/jonathanung/strike/blob/main'

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
  sandbox: 'sandbox',
  scheduler: 'scheduler',
  ftue: 'ftue',
  'peer-ecosystem': 'peer-ecosystem',
  'agents-skills': 'multi-agent',
  plugins: 'plugins',
  'plugin-panes': 'plugin-panes',
  isolation: 'isolation',
  harnesses: 'harnesses',
  secrets: 'secrets',
}

/** Pages not on the hub → GitHub blob */
const GITHUB_ONLY = new Set([
  'ARCHITECTURE',
  'contributing',
  'nix',
  'chaos',
  'protocol',
  'sdk',
])

/** Slimmed-config anchors that moved to dedicated hub pages + short CLI anchors */
const ANCHOR_REMAP = {
  '/docs/config#mcp-servers-stdio--http': '/docs/mcp',
  '/docs/config#mcp-servers': '/docs/mcp',
  '/docs/config#surface-presentation-vimmode-nanomode-mdreadmode': '/docs/editors',
  '/docs/config#theme': '/docs/theme',
  '/docs/config#scheduler-in-process-resource-limits': '/docs/scheduler',
  '/docs/config#external-harnesses-harnesses': '/docs/harnesses',
  // CLI short anchors omit trailing "(normative)" from numbered sections
  '/docs/plugins#9-path-confinement': '/docs/plugins#9-path-confinement-normative',
  '/docs/plugins#10-secret-handling': '/docs/plugins#10-secret-handling-normative',
}

function readCli(name) {
  return readFileSync(join(cliDocs, name), 'utf8')
}

function remapAnchors(md) {
  let out = md
  for (const [from, to] of Object.entries(ANCHOR_REMAP)) {
    out = out.replaceAll(from, to)
  }
  return out
}

function rewriteLinks(md) {
  const rewritten = md.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (full, text, href) => {
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
    const fragSuffix = frag ? `#${frag}` : ''

    // Repo-relative paths from docs/ (../examples, ../pkg, ../sdk, …)
    if (pathPart.startsWith('../')) {
      const repoPath = pathPart.replace(/^(\.\.\/)+/, '')
      return `[${text}](${GH_ROOT}/${repoPath}${fragSuffix})`
    }

    const base = pathPart.replace(/^\.\//, '').split('/').pop() || ''

    if (base.endsWith('.md')) {
      const stem = base.replace(/\.md$/, '')
      if (GITHUB_ONLY.has(stem) || stem.startsWith('investigations')) {
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

    // Other relative paths (e.g. internal/foo) → GitHub when they look like repo paths
    if (pathPart && !pathPart.startsWith('/')) {
      const cleaned = pathPart.replace(/^\.\//, '')
      if (
        cleaned.startsWith('internal/') ||
        cleaned.startsWith('pkg/') ||
        cleaned.startsWith('sdk/') ||
        cleaned.startsWith('examples/') ||
        cleaned.startsWith('cmd/') ||
        cleaned.startsWith('schemas/')
      ) {
        return `[${text}](${GH_ROOT}/${cleaned}${fragSuffix})`
      }
    }

    return full
  })
  return remapAnchors(rewritten)
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
  // First-time onboarding → FTUE hub page (stop before main config ```jsonc sample)
  md = md.replace(
    /## First-time onboarding state\n\n[\s\S]*?(?=\n```jsonc\n)/,
    `## First-time onboarding

Global acknowledgement lives at \`~/.strike/onboarding.json\`. Clean interactive
TUI installs auto-open \`/ftue\` once until finish or dismiss; established
installs migrate without a surprise modal. Full wizard steps, tour, and
scheduler presets: [First-time setup](/docs/ftue).

`,
  )
  // Two-dial + OS sandbox prose only (stop before Permission mode dial)
  md = md.replace(
    /\*\*Two-dial model \(Codex mental model\):\*\*\n\n[\s\S]*?(?=\n\*\*Permission mode dial:\*\*)/,
    `**Two-dial model:** \`sandbox\` (what OS isolation makes *possible* for bash)
and \`permissionMode\` (when the agent is *asked*) are independent. Default
\`sandbox\` is \`workspace-write\` (\`off\` | \`read-only\` | \`workspace-write\`);
override with \`--sandbox\`. \`yolo\` + \`sandbox: off\` requires \`--i-know\`.
OS backends, permission→profile compile, bash text guard honesty, and TOCTOU
path hardening: [Sandbox](/docs/sandbox). Full layer map (worktrees, scheduler,
planned containers, process caps): [Isolation](/docs/isolation).

`,
  )
  // Scheduler full section → short pointer
  md = md.replace(
    /## Scheduler \(in-process resource limits\)\n\n[\s\S]*?(?=\n## )/,
    `## Scheduler

\`scheduler\` bounds concurrent agent work **inside one Strike OS process**
(named pools, presets, command classification, queue events). Separate
\`strike\` processes do not share capacity. Full reference: [Scheduler](/docs/scheduler).

`,
  )
  // Replace Theme section with one-liner
  md = md.replace(
    /## Theme\n\n[\s\S]*?(?=\n## )/,
    `## Theme

\`theme\` is a color-theme id (bundled + \`~/.strike/themes\` + \`./.strike/themes\`
+ plugin contributions). In the TUI: bare \`/theme\` opens a picker; \`/theme <id>\`
applies one. Full chrome modes, surfaces, and web cockpit parity: [Theme](/docs/theme).

`,
  )
  // External harnesses → short pointer + keep config shape on hub page
  md = md.replace(
    /## External harnesses \(`harnesses`\)\n\n[\s\S]*?(?=\n## )/,
    `## External harnesses

Named subprocess harnesses used by agent frontmatter \`harness: <name>\`.
Config keys (\`command\`, \`args\`, \`env\`, \`mode\`, persistent-worker limits):
see the full reference — [Harnesses](/docs/harnesses#external-process-configuration).

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
  // Secrets / plugins already rewritten by rewriteLinks; add hub pointers near audit mention
  md = md.replace(
    /\(see \[secrets\.md\]\(\/docs\/secrets\) \/ `pkg\/redact`\)\./,
    '(see [Secrets](/docs/secrets) / `pkg/redact`). Plugin bundles: [Plugins](/docs/plugins).',
  )
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

On a **clean install**, the interactive TUI auto-opens the [\`/ftue\`](/docs/ftue)
setup wizard once (provider → model → optional project init → feature tour →
optional scheduler presets → first prompt). Finish or dismiss so it does not
repeat; re-run anytime with \`/ftue\`. Established installs (existing sessions or
credentials) skip the surprise modal.

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
[Loop](/docs/loop). In-process build/test/model caps: [Scheduler](/docs/scheduler).
Plugins: [Plugins](/docs/plugins).

## 6. Optional: web cockpit

\`\`\`sh
strike serve --addr 127.0.0.1:8787 --token <secret>
# open http://127.0.0.1:8787/attach?token=<secret>
\`\`\`

Experimental browser UI; the TUI remains primary. See [Web](/docs/web).

## Next steps

- [First-time setup](/docs/ftue) — \`/ftue\` wizard and onboarding state
- [Sandbox](/docs/sandbox) — OS isolation dial for bash
- [Isolation](/docs/isolation) — sandbox × worktrees × scheduler × planned containers
- [Scheduler](/docs/scheduler) — named pools, presets, queue UI
- [Config](/docs/config) — permissions, models, MCP, providers
- [Plugins](/docs/plugins) — versioned contribution bundles and trust
- [Editors](/docs/editors) — \`/vim\`, \`/nano\`, \`/md-read\` presentation
- [MCP](/docs/mcp) — stdio + streamable HTTP tools
- [Theme](/docs/theme) — TUI chrome and color themes
- [Secrets](/docs/secrets) — redaction and secret refs
- [Multi-agent](/docs/multi-agent) — agents, skills, discovery roots
- [Keybinds](/docs/keybinds) — full keyboard map

Build from source (Go 1.26+): clone [jonathanung/strike](https://github.com/jonathanung/strike),
then \`make setup && make build && make run-echo\`.
`
}

mkdirSync(outDir, { recursive: true })

const configFull = readCli('config.md')

function polishLoop(md) {
  let out = rewriteLinks(md)
  // Distinguish session /loop from in-process scheduler pools.
  out = out.replace(
    /Session-scoped scheduler that submits a prompt to the model on a fixed\ninterval\. Distinct from \[`\/goal`\]\(\/docs\/goal\) \(criteria harness with budgets and\nguards\): `\/loop` is a simple cron-style LLM job, not a goal runtime\./,
    `Session-scoped timer that submits a prompt to the model on a fixed interval.
Distinct from [\`/goal\`](/docs/goal) (criteria harness with budgets and guards)
and from the in-process [Scheduler](/docs/scheduler) (named pools that cap
concurrent bash/model work): \`/loop\` is a simple cron-style LLM job, not a
resource limiter or goal runtime.`,
  )
  return out
}

function polishUsage(md) {
  let out = rewriteLinks(md)
  // Point OS sandbox dial at the hub page (CLI links config.md only).
  out = out.replace(
    /### OS sandbox dial\n\n`sandbox` in \[config\.md\]\(\/docs\/config\) \(or `--sandbox`\) sets OS process isolation\nfor bash: `off` \| `read-only` \| `workspace-write` \(default\)\. This is \*\*what is\npossible\*\*; `permissionMode` is \*\*when you get asked\*\*\. `\/sandbox` prints the\neffective policy and backend; `\/sandbox explain` shows the generated profile\n\(including write-deny globs and network posture compiled from permissions\)\.\n`yolo` with `sandbox: off` requires `--i-know`\./,
    `### OS sandbox dial

\`sandbox\` in [Config](/docs/config) (or \`--sandbox\`) sets OS process isolation
for bash: \`off\` | \`read-only\` | \`workspace-write\` (default). This is **what is
possible**; \`permissionMode\` is **when you get asked**. \`/sandbox\` prints the
effective policy and backend; \`/sandbox explain\` shows the generated profile.
\`yolo\` with \`sandbox: off\` requires \`--i-know\`. Full reference: [Sandbox](/docs/sandbox).`,
  )
  // /ftue table row → hub link
  out = out.replace(
    /\| `\/ftue` \| setup wizard composing provider connect, model pick, optional `\/init`, a skippable feature tour \(panes, agents, permissions, autonomy, keys, commands\), optional scheduler build-system presets \(checkbox catalog with rule\/limit preview; apply writes global `scheduler\.presets` atomically and preserves custom limits\/rules\), and first-prompt guidance; opening does not change settings; tour copy uses live keybinds and omits unavailable surfaces; Finish focuses the composer; esc dismisses\. Finish\/dismiss acknowledge global onboarding so auto-open does not repeat; manual `\/ftue` stays available\. Child pickers\/tour\/presets return to the same wizard step \|/,
    '| `/ftue` | setup wizard (provider → model → optional `/init` → tour → scheduler presets → first prompt). Finish/dismiss acknowledges onboarding; manual re-run always available. Full guide: [First-time setup](/docs/ftue) |',
  )
  // Dashboard onboarding blurb
  out = out.replace(
    /On a clean install the interactive TUI\nauto-opens `\/ftue` once until you finish or dismiss it \(state in\n`~\/\.strike\/onboarding\.json`\)\. Re-run the full guided setup anytime with\n`\/ftue` \(provider → model → optional project init → feature tour → optional scheduler presets → first prompt\)\./,
    `On a clean install the interactive TUI auto-opens \`/ftue\` once until you
finish or dismiss it (state in \`~/.strike/onboarding.json\`). Re-run anytime
with \`/ftue\`. Details: [First-time setup](/docs/ftue).`,
  )
  // /loop row: distinguish in-process scheduler (CLI points at loop.md + /goal only)
  out = out.replace(
    /\| `\/loop` \| schedule a recurring prompt \(`15m`, `2h`, …\); session-only; `\/loop list`, `\/loop stop \[id\]` — see \[[^\]]+\]\(\/docs\/loop\)\. Distinct from \[`\/goal`\]\(\/docs\/goal\) \|/,
    '| `/loop` | schedule a recurring prompt (`15m`, `2h`, …); session-only; `/loop list`, `/loop stop [id]` — see [Loop](/docs/loop). Distinct from [`/goal`](/docs/goal) and from the in-process [Scheduler](/docs/scheduler) resource pools |',
  )
  return out
}

function polishIsolation(md) {
  let out = rewriteLinks(md)
  // Prefer hub sandbox page for deep OS sandbox detail
  out = out.replace(
    /Inspect: `\/sandbox`, `\/sandbox explain`\./,
    `Inspect: \`/sandbox\`, \`/sandbox explain\`. Day-to-day OS sandbox guide: [Sandbox](/docs/sandbox).`,
  )
  // Containers hub page (CLI may still say "planned")
  out = out.replace(
    /\| \*\*Containers\*\* \(planned\) \| Full host isolation for the agent runtime \| epic \[#547\]\(https:\/\/github\.com\/jonathanung\/strike\/issues\/547\) \| Docker\/devcontainer \(Zone port\) \| Not shipped — reuse `network\.allow` shape \|/,
    '| **Containers** | Full host isolation for the agent runtime | epic [#547](https://github.com/jonathanung/strike/issues/547); [Containers](/docs/containers) | Docker/Podman (managed per repo) | Engine missing / attach failures — see containers guide |',
  )
  out = out.replace(
    /## Containers \(#547\)\n\nFull container \/ devcontainer isolation is a separate epic \(absorb Zone runtime\)\.\nUntil shipped:\n\n- Prefer OS sandbox \+ worktrees for day-to-day coding\.\n- `network\.allow` is the shared \*\*shape\*\* for future container egress filters\n  \(application-layer webfetch today; OS bash net remains all-or-nothing\)\.\n- Scheduler pool name `container` is reserved for future admission, not a\n  running runtime\./,
    `## Containers (#547)

Native Docker/Podman runtime isolation (managed container per repo, attach
semantics, network modes). Day-to-day guide: [Containers](/docs/containers).

- Prefer OS sandbox + worktrees for ordinary host coding.
- \`network.allow\` is the shared **shape** for application-layer webfetch and
  container egress filters (OS bash net remains all-or-nothing unless wrapped).
- Scheduler pool name \`container\` is reserved for container-class admission.`,
  )
  out = out.replace(
    /## Related docs\n\n- \[config\.md\]\(\/docs\/config\) — sandbox dial, scheduler, worktrees, network\.allow\n- \[usage\.md\]\(\/docs\/usage\) — `\/sandbox`, `\/permission`, worktree UX\n- \[ARCHITECTURE\.md\]\(https:\/\/github\.com\/jonathanung\/strike\/blob\/main\/docs\/ARCHITECTURE\.md\) — cancel\/deadline\/backpressure, package map\n- \[harnesses\.md\]\(\/docs\/harnesses\) — external harnesses are not OS-sandboxed today/,
    `## Related docs

- [Sandbox](/docs/sandbox) — OS dial, honesty notes, egress allowlist UX
- [Containers](/docs/containers) — Docker/Podman runtime isolation
- [Config](/docs/config) — sandbox dial, scheduler, worktrees, network.allow
- [Usage](/docs/usage) — \`/sandbox\`, \`/permission\`, worktree UX
- [Admission](/docs/admission) — MCP/skills/plugin bind-time scans
- [Audit](/docs/audit) — durable trust-boundary decision log
- [ARCHITECTURE.md](https://github.com/jonathanung/strike/blob/main/docs/ARCHITECTURE.md) — cancel/deadline/backpressure, package map
- [Harnesses](/docs/harnesses) — external harnesses are not OS-sandboxed today`,
  )
  return out
}

function polishSecrets(md) {
  let out = rewriteLinks(md)
  if (!out.includes('## Write-time content guards')) {
    out = out.replace(
      /\n## Related\n/,
      `

## Write-time content guards (#890)

Structured file tools (\`write\`, \`edit\`, \`apply_patch\`, …) can scan **content
about to hit disk** for credential-shaped material and high-risk patterns
before the mutation commits. Findings share \`internal/security.Finding\` types
with [Admission](/docs/admission) scans; guard actions are \`allow\` | \`ask\` |
\`deny\` (distinct from admission's bind-time \`block\` / \`quarantine\`).

This complements egress redaction (above) and [Safefile](/docs/safefile)
path/symlink hardening — redaction cleans what leaves the process; content
guards and safefile bound what enters the workspace.

## Related

- #890 — write-time content guards
- [Admission](/docs/admission) — register/load-time capability scans
- [Audit](/docs/audit) — durable trust-boundary decision log
- [Safefile](/docs/safefile) — hardened path I/O

`,
    )
  }
  return out
}

const pages = {
  install: siteInstall(readCli('install.md')),
  quickstart: quickstart(),
  auth: rewriteLinks(readCli('auth.md')),
  usage: polishUsage(readCli('usage.md')),
  keybinds: rewriteLinks(readCli('keybinds.md')),
  editors: editorsFromConfig(configFull),
  'multi-agent': rewriteLinks(readCli('agents-skills.md')),
  goal: rewriteLinks(readCli('goal.md')),
  loop: polishLoop(readCli('loop.md')),
  config: slimConfig(configFull),
  mcp: mcpFromConfig(configFull),
  theme: rewriteLinks(readCli('theme.md')),
  web: rewriteLinks(readCli('web.md')),
  'peer-ecosystem': rewriteLinks(readCli('peer-ecosystem.md')),
  plugins: rewriteLinks(readCli('plugins.md')),
  'plugin-panes': rewriteLinks(readCli('plugin-panes.md')),
  isolation: polishIsolation(readCli('isolation.md')),
  harnesses: rewriteLinks(readCli('harnesses.md')),
  secrets: polishSecrets(readCli('secrets.md')),
}

// Web-only hub pages are authored under src/content/docs/ and are NOT
// overwritten here: sandbox, scheduler, ftue, containers, admission, audit,
// safefile, telemetry, checkpoints, eval.

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
| \`ftue\` | start | **Web-only** — first-run \`/ftue\` wizard |
| \`usage\` | use | \`docs/usage.md\` |
| \`keybinds\` | use | \`docs/keybinds.md\` |
| \`editors\` | use | Surface presentation section of \`docs/config.md\` |
| \`sandbox\` | use | **Web-only** — OS sandbox dial + honesty notes |
| \`isolation\` | use | \`docs/isolation.md\` (hub polish → containers/admission) |
| \`containers\` | use | **Web-only** — Docker/Podman runtime isolation |
| \`scheduler\` | use | **Web-only** — in-process pools, presets, queue UI |
| \`checkpoints\` | use | **Web-only** — \`/undo\` file snapshots |
| \`multi-agent\` | agents | \`docs/agents-skills.md\` |
| \`goal\` | agents | \`docs/goal.md\` |
| \`loop\` | agents | \`docs/loop.md\` |
| \`harnesses\` | agents | \`docs/harnesses.md\` |
| \`config\` | configure | \`docs/config.md\` (slimmed → hub pages) |
| \`mcp\` | configure | MCP section of \`docs/config.md\` |
| \`theme\` | configure | \`docs/theme.md\` |
| \`plugins\` | configure | \`docs/plugins.md\` |
| \`secrets\` | configure | \`docs/secrets.md\` (+ hub write-time guards section) |
| \`admission\` | configure | **Web-only** — MCP/skills/plugin bind-time scans |
| \`audit\` | configure | **Web-only** — durable trust-boundary decision log |
| \`safefile\` | configure | **Web-only** — hardened path I/O |
| \`telemetry\` | configure | **Web-only** — versioned export families (not cloud analytics) |
| \`web\` | advanced | \`docs/web.md\` (experimental) |
| \`peer-ecosystem\` | advanced | \`docs/peer-ecosystem.md\` |
| \`plugin-panes\` | advanced | \`docs/plugin-panes.md\` |
| \`eval\` | advanced | **Web-only** — internal SWE-bench / tbench runners |

Relative links rewrite to \`/docs/<slug>\`. Architecture, contributing, nix,
chaos, protocol, sdk, and investigations link to GitHub:
\`https://github.com/jonathanung/strike/blob/main/docs/…\`

Repo-relative paths (\`../examples\`, \`../pkg\`, …) rewrite to the GitHub blob root.

Web-only pages are **not** overwritten by the sync script — edit them here.

Re-sync: \`node scripts/sync-docs-from-cli.mjs [path-to-strike-cli]\`
Keep \`npm test\` (broken-link check) green.
`
writeFileSync(join(root, 'src/content/DOCS_SOURCE.md'), sourceMd)
console.log('wrote DOCS_SOURCE.md')
console.log('done')
