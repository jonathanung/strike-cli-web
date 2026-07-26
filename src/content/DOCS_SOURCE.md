# Docs content source

Markdown under this directory is vendored for the on-domain `/docs` hub.

| Site slug | Upstream (jonathanung/strike) |
|---|---|
| `install` | `docs/install.md` |
| `usage` | `docs/usage.md` |
| `keybinds` | `docs/keybinds.md` |
| `multi-agent` | `docs/agents-skills.md` |
| `config` | `docs/config.md` |
| `auth` | `docs/auth.md` |
| `web` | `docs/web.md` |
| `mcp` | MCP section of `docs/config.md` |
| `quickstart` | Site-authored from product README + install/usage |

Relative links were rewritten to `/docs/<slug>` (or GitHub for pages not on the hub).
Re-sync manually when product docs change; keep `npm test` (broken-link check) green.
