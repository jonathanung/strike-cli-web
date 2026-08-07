# Sandbox

OS-level isolation for agent bash (and composer `!` shell), separate from the
permission-mode dial that decides *when* you are asked. Full isolation matrix
(action facts, egress allowlist, tool-chain correlation, worktrees, containers):
[Isolation](/docs/isolation).

## Two dials

| Dial | Config / CLI | Controls |
|---|---|---|
| **sandbox** | `sandbox`, `--sandbox` | What OS isolation makes *possible* for bash |
| **permissionMode** | `permissionMode`, `/mode`, Shift+Tab | *When* the agent is asked before a tool runs |

They are independent. Turning off permission prompts (`yolo`) does **not**
disable the OS sandbox. Setting `sandbox: off` does **not** skip permission
asks. Full permission modes: [Usage](/docs/usage). Config overview:
[Config](/docs/config).

## Modes

`sandbox` is `off` | `read-only` | `workspace-write`. Default:
**`workspace-write`**.

| Mode | Effect |
|---|---|
| `workspace-write` | Host filesystem mostly read-only; session work directory re-bound writable |
| `read-only` | No writable workspace bind |
| `off` | No OS wrap — argv runs unsandboxed |

Applies to the **bash** tool and composer `!` shell via:

- **Linux:** [bubblewrap](https://github.com/containers/bubblewrap) (`bwrap`)
- **macOS:** seatbelt profiles through `sandbox-exec`

When the backend is missing or blocked (for example locked-down user
namespaces), bash **degrades** to unsandboxed execution with a one-shot startup
warning (unless `sandbox` is already `off`). Strike does not pretend isolation
is active when it is not.

### CLI

```sh
strike --sandbox workspace-write
strike --sandbox read-only
strike --sandbox off
```

**Yolo + sandbox off:** `permissionMode: yolo` (or a resumed session in yolo)
combined with `sandbox: off` **refuses to start** unless you pass `--i-know`.
Mid-session `/mode yolo` is also rejected while sandbox is off without that
startup override. This is the only supported way to run with neither OS
isolation nor permission prompts.

## Permission rules → OS profile

Hard `write` / `edit` **deny** rules are compiled into OS filesystem denials
inside the bash sandbox:

- Globs become seatbelt regexes on macOS
- When paths exist on Linux, bwrap `--ro-bind` remounts apply
- A deny on `write`/`edit` `*` (including plan mode) suppresses the writable
  workspace bind

**Network** inside the OS sandbox stays **on** by default (so bash can run
`gh`, `git`, package managers). It turns **off** only when `webfetch`,
`websearch`, and `mcp` are all hard-**deny** on `*` (patterned allows do not
open or close full bash network). Ask/yolo posture does not widen the OS
profile. Composer `!` uses the config-layer compile; agent bash uses live
layers (agent / phase / session).

Inspect the effective policy:

```
/sandbox           # mode, backend, summary
/sandbox explain   # generated profile (bwrap flags or seatbelt SBPL),
                   # network.allow, egress enforcement level
```

OS capability blocks surface on bash as `errorCode=sandbox_denied` with a
human reason (timeline + model tool result).

## Network egress allowlist (`network.allow`)

Optional host/CIDR/`*.suffix` whitelist for **application-layer** egress
([#892](https://github.com/jonathanung/strike/issues/892)). Same policy shape
for webfetch, websearch, and bash preflight:

| Surface | Enforcement |
|---|---|
| `webfetch` / `websearch` | Dial/redirect checks + SSRF private blocks |
| bash preflight (v1) | Known clients (`curl`, `wget`, `ssh`, `scp`, `sftp`, `nc`/…) including common wrappers. Outside list → `network_denied`. Unparseable destinations fail closed when the list is non-empty |
| OS sandbox profile | **Not** per-host — all-or-nothing host net (see above) |

Empty/`[]` = unrestricted **public** hosts (SSRF private blocks unchanged).
`/sandbox explain` prints the allowlist and `egress enforcement: preflight`
vs `OS host filter: none`. Prefer `webfetch` for ordinary fetches; bash
preflight is best-effort argv parse, not a transparent proxy.

```jsonc
{
  "network": {
    "allow": ["api.github.com", "*.npmjs.org", "10.0.0.0/8"]
  }
}
```

Details: [Isolation](/docs/isolation) and [Config](/docs/config).

## Shared writable roots

Under any non-`off` mode the sandbox keeps common scratch dirs writable
(`/tmp`, `/var/tmp`, `$TMPDIR`, and on Linux `/dev/shm`). In
**`workspace-write`** it also binds user/tool caches when present
(`$XDG_CACHE_HOME` or `~/.cache`, `$GOCACHE` / `$GOMODCACHE`, `~/.npm`,
`~/.cargo`, …) so builds and package managers work without disabling
isolation. The rest of the host stays read-only aside from the session workdir.

## What is *not* a security boundary

Permission rules and modes (including `yolo`, `--auto`, and
`--dangerously-skip-permissions`) only control whether the agent is *asked*
before a tool runs. Prefer keeping `sandbox` at `workspace-write` or
`read-only` so OS isolation still applies.

The bash tool also applies a separate **best-effort static path guard** on a
small set of destructive command forms (same guard as composer `!`). That
guard is **incomplete** and must **not** be treated as isolation or as a
substitute for the OS sandbox. It closes cheap mistakes; it is not a hard
boundary.

Linux glob denials expand existing paths at compile time — new files matching a
deny glob are covered on the next compile (seatbelt regex covers them on
macOS).

## Path mutation tools (TOCTOU + safefile)

`write`, `edit`, `apply_patch`, and `notebook_edit` re-validate workspace paths
at exec time and open leaf files with hardened I/O (`internal/safefile`): refuse
symlink-leaf mutations, reject FIFO/device/socket, timed reads, atomic replace.
See [Safefile](/docs/safefile). This is complementary to the bash OS sandbox:
structured file tools do not go through bwrap/seatbelt the same way shell does.

## Related security layers

| Layer | Doc |
|---|---|
| Action facts + tool-chain correlation | [Isolation](/docs/isolation) |
| Permission explain / diff / presets | [Config](/docs/config), [Usage](/docs/usage) |
| Write-time content guards | [Secrets](/docs/secrets#write-time-content-guards-890) |
| Admission (MCP / skills / plugins) | [Admission](/docs/admission) |
| Durable audit sink | [Audit](/docs/audit) |
| Scheduler pools | [Scheduler](/docs/scheduler) (concurrency, not isolation) |

## Practical defaults

- Leave `sandbox` at **`workspace-write`** unless you have a reason not to
- Use `read-only` when the agent should not mutate the tree via bash
- Use `off` only when the OS backend cannot run or you deliberately need host
  shell behavior — pair with careful permission rules, not yolo, unless you
  pass `--i-know`
- Deny sensitive globs in [permissions](/docs/config) so they compile into the
  OS profile
- Set `network.allow` when you want application-layer egress limits

## Related

- [Isolation](/docs/isolation) — full matrix
- [Config](/docs/config) — `sandbox`, `network.allow`, permissions
- [Usage](/docs/usage) — permission mode dial, `/sandbox`, composer `!`
- [Scheduler](/docs/scheduler) — concurrency limits (not isolation)
- [First-time setup](/docs/ftue) — optional onboarding path
