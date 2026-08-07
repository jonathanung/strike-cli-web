# Plugin panes

Plugins can contribute **right-pane surfaces** you focus and cycle alongside
built-in windows (context, agents, files, …). The ABI is **`pane/1`**: the same
definition and process protocol map to the TUI and the [web cockpit](/docs/web)
without importing TUI types.

Normative contract:
[plugin-panes.md on GitHub](https://github.com/jonathanung/strike/blob/main/docs/plugin-panes.md).
Bundle packaging: [Plugins](/docs/plugins).

## Two modes

| Mode | Process? | Trust | Use when |
|---|---|---|---|
| **`static`** | No | **Passive** (like themes) | Fixed UI driven by host data feeds (`session.summary`, `usage`, …) |
| **`process`** | Yes — one supervised subprocess | **Executable** (like MCP/harness) | Dynamic logic, polling, custom state |

Both modes paint a **bounded view tree** (column/row/text/list/table/meter/…).
No raw terminal escapes, no private Go `window` interface, no unrestricted PTY
from plugins.

## Install and enable

1. Install a plugin that declares `contributions.panes` ([Plugins](/docs/plugins)).
2. **Static** panes appear when the plugin is enabled.
3. **Process** panes need `strike plugin trust <id>` (or `/plugin` trust) first.
4. Restart Strike (or remount in the web inspector) so descriptors register.

Manifest entry shape:

```jsonc
"contributions": {
  "panes": [
    {
      "id": "acme.status",
      "path": "panes/status.json",
      "abi": "pane/1"
    }
  ]
}
```

Pane ids must be unique across enabled plugins. Built-in window ids
(`context`, `agents`, `files`, …) are reserved.

## Using panes in the TUI

- Plugin panes join the shared **Plugin** stack group (host UX).
- Cycle windows with the usual chords (`ctrl+o` / `ctrl+p`, group cycle) —
  see [Keybinds](/docs/keybinds).
- Host draws chrome, title, and focus border; the contribution paints **inner
  content only**.
- Global navigation keys are **not** delivered to the pane.
- On crash or hang, the pane shows an error empty-state — Strike itself keeps
  running. Other panes are unaffected.

## Static panes

Definition includes a `view` tree and `subscriptions` to host feeds:

| Feed | Example fields |
|---|---|
| `session.summary` | cwd, model, agent, session title |
| `usage` | context used/limit |
| `agents.roster` | active agents (redacted) |
| `clock` | low-frequency time |

Bindings use `valueFrom` / `textFrom` paths into the latest snapshot. Missing
paths render as empty — they must not crash the host.

## Process panes

Strike starts `command` + `args` under the plugin root, speaks JSONL on stdio
(`pane.start`, `pane.data`, `pane.input` → `pane.render`, …), and enforces
timeouts and rate limits. Stdout is protocol-only; stderr is a small redacted
ring for doctor.

Permissions are **default deny**:

| Axis | Typical values |
|---|---|
| `host` | Which feeds may be subscribed |
| `fs` | `none` \| `read-workspace` (I/O still happens in the child process) |
| `network` | `none` (v1) |
| `command` | `none` (v1) |

Process panes are trusted native code — same honesty as
[harnesses](/docs/harnesses): trust review is mandatory because OS isolation of
the child is not a full sandbox.

## Web cockpit

When `capabilities.panes` is true:

- Inspector **panes** tab lists enabled contributions.
- **Mount** static views (client resolves bindings) or process panes
  (server-supervised; browser receives view trees / errors only).
- No `PluginRoot`, secrets, or TUI types on the wire.

APIs: `GET/POST /v1/panes…` — see [Web](/docs/web).

## What panes are not

- Not a replacement for built-in windows.
- Not OpenCode-style Node pane hosts or in-process Go plugins.
- Not unrestricted ANSI/VT streams.
- Not a way to register tools, hooks, or MCP (those are separate contribution
  types on [Plugins](/docs/plugins)).

## Related

- [Plugins](/docs/plugins) — install, trust, catalog
- [Theme](/docs/theme) — semantic style roles panes reference
- [Web](/docs/web) — cockpit pane host
- [Multi-agent](/docs/multi-agent) — agents roster feed
- [Usage](/docs/usage) — right-pane navigation
- [Secrets](/docs/secrets) — redaction on host feeds
