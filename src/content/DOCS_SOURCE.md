# Docs content source

Markdown under this directory is vendored for the on-domain `/docs` hub.

| Site slug | Category | Upstream (jonathanung/strike) |
|---|---|---|
| `install` | start | `docs/install.md` (site proxy wording for brand URL) |
| `quickstart` | start | Site-authored from product README + install/usage |
| `auth` | start | `docs/auth.md` |
| `usage` | use | `docs/usage.md` |
| `keybinds` | use | `docs/keybinds.md` |
| `editors` | use | Surface presentation section of `docs/config.md` |
| `multi-agent` | agents | `docs/agents-skills.md` |
| `goal` | agents | `docs/goal.md` |
| `loop` | agents | `docs/loop.md` |
| `config` | configure | `docs/config.md` (slimmed: editors/MCP/theme → hub pages) |
| `mcp` | configure | MCP section of `docs/config.md` |
| `theme` | configure | `docs/theme.md` |
| `web` | advanced | `docs/web.md` (experimental) |
| `peer-ecosystem` | advanced | `docs/peer-ecosystem.md` |

Relative links were rewritten to `/docs/<slug>`. Architecture, contributing, nix,
harnesses, and investigations link to GitHub:
`https://github.com/jonathanung/strike/blob/main/docs/…`

Re-sync: `node scripts/sync-docs-from-cli.mjs [path-to-strike-cli]`
Keep `npm test` (broken-link check) green.
