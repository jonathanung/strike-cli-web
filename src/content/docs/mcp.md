# MCP

Connect external [Model Context Protocol](https://modelcontextprotocol.io)
servers so their tools appear in the model registry as `mcp_<server>_<tool>`.
Supported transports: **stdio** (local subprocess) and **streamable HTTP**
(remote endpoint; JSON or SSE responses).

Prefer **`mcp.jsonc`** (or `mcp.json`) for server definitions. The legacy
`mcp` object in config still works. Layers merge last-wins by file:

`defaults → ~/.strike/config → ~/.strike/mcp.jsonc → ./.strike/config → ./.strike/mcp.jsonc`

(`.json` is accepted as well as `.jsonc`.) When a layer sets servers
(including `{}`), it **replaces** the previous layer's server map. Omitted
`mcp` / missing mcp file leaves the lower layer unchanged.

### `mcp.jsonc` (preferred)

Bare server map or wrapped `servers` object; JSONC comments allowed:

```jsonc
// ~/.strike/mcp.jsonc or ./.strike/mcp.jsonc
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "…" }
  },
  "remote": {
    "type": "http",
    "url": "https://mcp.example.com/mcp",
    "headers": { "Authorization": "Bearer …" }
  }
}
```

Equivalent wrapped form:

```jsonc
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

### Prompts, resources, OAuth, catalog refresh

After `initialize`, Strike negotiates server capabilities before exposing tools,
prompts, or resources:

| Capability | Strike tools (when advertised) |
|---|---|
| `tools` | `mcp_<server>_<tool>` bridges (existing) |
| `prompts` | `mcp_<server>_list_prompts`, `mcp_<server>_get_prompt` |
| `resources` | `mcp_<server>_list_resources`, `mcp_<server>_read_resource` |

Servers lacking a capability degrade cleanly (no tools registered for that
surface). External content is permission-gated (`mcp`), size-bounded, secret-
redacted, and tagged with provenance metadata (`mcpServer` / `mcpKind`).

`notifications/tools|prompts|resources/list_changed` refreshes the in-process
catalog without restarting Strike (malformed notifications are ignored).

HTTP servers may set `oauth` for discovery + token refresh:

```jsonc
{
  "servers": {
    "remote": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "strike",
        "discoveryUrl": "https://auth.example.com/.well-known/oauth-authorization-server",
        "tokenFile": "~/.strike/mcp-tokens/remote.json",
        "scopes": "mcp"
      }
    }
  }
}
```

Token files are mode `0600`. Access/refresh tokens are never logged. On HTTP
401, Strike refreshes once and retries. Hosts can drive login via
`mcp.OAuthLoginURL` + authorization-code exchange / `Revoke`.

### Legacy: `mcp` in config

```json
{
  "mcp": {
    "servers": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "…" }
      }
    }
  }
}
```

| Field | Required | Notes |
|---|---|---|
| `servers.<name>` | yes | short letter-led slug (`[A-Za-z][A-Za-z0-9_-]*`) |
| `type` | no | `stdio` (default) or `http` (`sse` is accepted as an alias for `http`) |
| `command` | stdio | executable on `PATH` or absolute path |
| `args` | no | argv after the command |
| `env` | no | stdio env overlay; **never logged** |
| `url` | http | MCP endpoint URL (if set without `type`, transport is `http`) |
| `headers` | no | HTTP request headers (e.g. `Authorization`); **never logged or shown in `/mcp`** |

Lifecycle: servers start with the session (after the tool worktree is bound),
list tools once, and shut down on exit. A crashed or unreachable server does
not take down strike — its tools error cleanly; `/mcp` shows `up` / `down` /
`error` / `disabled`.

Control from the TUI:

- `/mcp` — status (transport, endpoint label, tools, errors)
- `/mcp retry [name]` — reconnect one server, or every non-up server
- `/mcp disable <name>` — stop a server and unregister its tools

Permissions: every MCP tool call asks with permission name `mcp` and pattern
`<server>/<tool>` (default action **ask**). Allow a server or tool in config:

```json
{
  "permissions": [
    { "permission": "mcp", "pattern": "github/*", "action": "allow" },
    { "permission": "mcp", "pattern": "github/delete_*", "action": "deny" }
  ]
}
```

Treat project-local MCP config like shell hooks: stdio runs local commands;
HTTP may send secrets via `headers`. Prefer global `~/.strike/mcp.jsonc` for
shared servers; review `command`/`args`/`env`/`url`/`headers` before trusting
a project's `.strike/mcp.jsonc`.
