# Plugins

Versioned **contribution packages** that extend Strike with agents, skills,
workflows, themes, provider profiles, MCP servers, harnesses, hooks, and
[plugin panes](/docs/plugin-panes). Plugins reuse existing loaders — they are
**not** a Node/Go in-process host or a way to inject arbitrary provider code.

Normative contract (manifest shape, digests, path confinement):
[plugins.md on GitHub](https://github.com/jonathanung/strike/blob/main/docs/plugins.md).

## What a plugin is

A plugin is a directory with a root `plugin.json` (or `plugin.jsonc`) plus
contribution assets:

```text
my-plugin/
  plugin.json
  agents/          # optional *.md
  skills/          # optional name.md or name/SKILL.md
  workflows/       # optional *.json
  themes/          # optional theme JSON
  providers/       # optional provider profile fragments
  mcp/             # optional MCP definitions
  harnesses/       # optional harness commands
  hooks/           # optional hook fragments
  panes/           # optional pane/1 definitions
  bin/             # optional executables (relative paths only)
```

| Class | Contributions | When they load |
|---|---|---|
| **Passive** | agents, skills, workflows, themes, provider profiles, static panes | When the plugin is **enabled** |
| **Executable** | MCP stdio/http, harnesses, shell hooks, process panes | Only after explicit **trust** for the current digest + source |

Disabled plugins contribute **nothing**. Changes apply on the next Strike
restart (hot reload is a non-goal).

## Install roots and lockfile

| Scope | Directory | Precedence |
|---|---|---|
| Global | `~/.strike/plugins/<id>/` | lower |
| Project | `./.strike/plugins/<id>/` | higher (same id shadows global) |

Lockfiles (`~/.strike/plugins.lock.json`, `./.strike/plugins.lock.json`) record
source identity, pinned version, content digest, enablement, and trust — **never**
credentials.

## Lifecycle CLI

```sh
strike plugin install <path|git-url|catalog:pkg[@ver]>
strike plugin search <query> --registry <url>
strike plugin list
strike plugin inspect <id>
strike plugin enable <id>
strike plugin disable <id>
strike plugin trust <id>
strike plugin untrust <id>
strike plugin outdated [--registry]
strike plugin update <id> --yes
strike plugin remove <id> --yes
strike plugin doctor [id]
```

| Command | Behavior |
|---|---|
| `install` | Validate, copy/clone/download into scope root, write lockfile. Atomic — failed validation leaves nothing partially enabled. |
| `search` | Search a remote catalog index. |
| `list` / `inspect` | Installed plugins (including disabled): scope, digest, source, trust. |
| `enable` / `disable` | Toggle lockfile `enabled`. Disable **keeps** files; contributions stop on next launch. |
| `trust` / `untrust` | Grant or revoke executable trust for the current digest + source + capabilities. |
| `outdated` / `update` | Catalog updates with contribution/capability review; `--yes` required after review. Prior trust clears when digest/source/executables change. |
| `remove` | Delete install dir + lockfile entry (confirmation required). |
| `doctor` | Paths, provenance, collisions, trust state. Prints env/header **keys** only — never secret values. |

Flags: `--scope global|project` (install defaults to global), git `--ref` /
`--commit` / `--subdir`, catalog `--registry` / `--version`, install `--force`
to replace.

### Sources

| Type | Identity | Notes |
|---|---|---|
| **local** | Absolute path | Copied under the plugins root; no root escape. |
| **git** | URL + **pinned full commit** | Mutable branches are never followed silently on later launches. |
| **catalog** | Registry + package + version + artifact digest | Metadata alone cannot enable execution or grant trust. Zip-slip / traversal fail closed. |

## Trust model

1. Install an enabled plugin → **passive** contributions may load after
   validation.
2. Executable contributions stay **inactive** until you run `strike plugin trust
   <id>` (or trust from `/plugin` / the web inspector).
3. Trust binds to **plugin id + source identity + content digest + capability
   set**. Any payload change, source change, or executable entry change
   invalidates trust — re-review required.
4. Catalog metadata is **not** trust. Updates never run unattended.

Treat plugin-sourced MCP/harness/hook binaries like any other native command you
chose to run. Stock `mcp.jsonc` / config hooks remain separate (local scripts
you edited); plugin executables are stricter.

Admission scans may also gate bind-time MCP/skills/plugin surfaces — see
[Admission](/docs/admission).

## Themes from plugins

Theme JSON under `contributions.themes` merges into the theme catalog with
provenance `plugin:<id>`. Pick with `/theme` (cursor previews; enter applies;
esc reverts; ctrl+d saves default). Install and update theme packs through the
generic plugin lifecycle — there is no separate theme marketplace.

Full chrome tokens: [Theme](/docs/theme).

## TUI and web

| Surface | How |
|---|---|
| TUI | `/plugin` — browse, install, trust, update, enable/disable, remove with confirmation |
| Web cockpit | Inspector **plugins** tab when `capabilities.plugins` is true ([Web](/docs/web)) |
| CLI | `strike plugin …` (above) |

Doctor and inspect never print resolved secrets. Secret handling:
[Secrets](/docs/secrets).

## Contribution types (summary)

| Type | Trust | Notes |
|---|---|---|
| Agents / skills / workflows | Passive | Same markdown/JSON loaders as native roots |
| Themes | Passive | See [Theme](/docs/theme) |
| Provider profiles | Passive | Shipped wire adapters only — no arbitrary provider code |
| MCP | Executable | Path-confined command or HTTP; secret refs for env/headers |
| Harnesses | Executable | See [Harnesses](/docs/harnesses) |
| Hooks (command) | Executable | Declarative-only hooks follow enablement without process trust |
| Panes | Static = passive; process = executable | See [Plugin panes](/docs/plugin-panes) |

Name collisions: agents/skills/workflows/themes use precedence (later wins with
a diagnostic). MCP, harness, and pane **ids** fail closed on collision.

## Practical defaults

- Prefer **project** scope for repo-specific packs; **global** for personal
  themes and tools.
- Review capability diffs on every update before `--yes`.
- Trust only packs you understand; untrust when experimenting.
- Keep credentials in the auth store / `secret://` refs — never inside the
  bundle tree.

## Related

- [Plugin panes](/docs/plugin-panes) — right-pane contributions (`pane/1`)
- [Multi-agent](/docs/multi-agent) — agents and skills discovery
- [MCP](/docs/mcp) — stock MCP config (non-plugin)
- [Harnesses](/docs/harnesses) — external task functions
- [Theme](/docs/theme) — theme loading order and picker
- [Config](/docs/config) — permissions, providers, hooks
- [Secrets](/docs/secrets) — redaction and secret refs
- [Admission](/docs/admission) — bind-time capability scans
- [Web](/docs/web) — cockpit plugin manager APIs
- [Peer ecosystem](/docs/peer-ecosystem) — what Strike does **not** import from peer CLIs
