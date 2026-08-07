# Docs content source

Markdown under this directory is vendored for the on-domain `/docs` hub.

| Site slug | Category | Upstream (jonathanung/strike) |
|---|---|---|
| `install` | start | `docs/install.md` (site proxy wording for brand URL) |
| `quickstart` | start | Site-authored from product README + install/usage |
| `auth` | start | `docs/auth.md` |
| `ftue` | start | **Web-only** — first-run `/ftue` wizard |
| `usage` | use | `docs/usage.md` |
| `keybinds` | use | `docs/keybinds.md` |
| `editors` | use | Surface presentation section of `docs/config.md` |
| `sandbox` | use | **Web-only** — OS sandbox dial + honesty notes |
| `isolation` | use | `docs/isolation.md` (hub polish → containers/admission) |
| `containers` | use | **Web-only** — Docker/Podman runtime isolation |
| `scheduler` | use | **Web-only** — in-process pools, presets, queue UI |
| `checkpoints` | use | **Web-only** — `/undo` file snapshots |
| `multi-agent` | agents | `docs/agents-skills.md` |
| `goal` | agents | `docs/goal.md` |
| `loop` | agents | `docs/loop.md` |
| `harnesses` | agents | `docs/harnesses.md` |
| `config` | configure | `docs/config.md` (slimmed → hub pages) |
| `mcp` | configure | MCP section of `docs/config.md` |
| `theme` | configure | `docs/theme.md` |
| `plugins` | configure | **Web-only** — install/trust/catalog user guide |
| `secrets` | configure | `docs/secrets.md` (+ hub write-time guards section) |
| `admission` | configure | **Web-only** — MCP/skills/plugin bind-time scans |
| `audit` | configure | **Web-only** — durable trust-boundary decision log |
| `safefile` | configure | **Web-only** — hardened path I/O |
| `telemetry` | configure | **Web-only** — versioned export families (not cloud analytics) |
| `web` | advanced | `docs/web.md` (experimental) |
| `peer-ecosystem` | advanced | `docs/peer-ecosystem.md` |
| `plugin-panes` | use | **Web-only** — pane/1 user overview |
| `eval` | advanced | **Web-only** — internal SWE-bench / tbench runners |

Relative links rewrite to `/docs/<slug>`. Architecture, contributing, nix,
chaos, protocol, sdk, and investigations link to GitHub:
`https://github.com/jonathanung/strike/blob/main/docs/…`

Repo-relative paths (`../examples`, `../pkg`, …) rewrite to the GitHub blob root.

Web-only pages are **not** overwritten by the sync script — edit them here.

Re-sync: `node scripts/sync-docs-from-cli.mjs [path-to-strike-cli]`
Keep `npm test` (broken-link check) green.
