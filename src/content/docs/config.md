# Config

`~/.strike/config` (global) merged with `./.strike/config` (project), then
optional **managed/MDM** system config (highest). User and project files
accept **JSON or JSONC** (`//` line comments and `/* block comments */`, same
stripper as `mcp.jsonc` / `providers.jsonc` / `keybinds.jsonc`). An optional
top-level `"$schema"` key is **ignored** at load (editor autocomplete only;
Strike never fetches a schema URL at runtime).

**Published JSON Schema (editor DX):** point `$schema` at the versioned file in
this repo (stable `main` raw URL):

```text
https://raw.githubusercontent.com/jonathanung/strike/main/schemas/strike-config.schema.json
```

Local path (clone/checkout): `schemas/strike-config.schema.json`. The schema
documents high-traffic main-config keys (dials, permissions, hooks, sandbox,
compaction/prune, session, scheduler, MCP/LSP shapes, …). Root and nested
objects use **`additionalProperties: true`** so unknown/future keys and
editor-only fields stay valid — matching runtime `encoding/json` (unknown keys
ignored). Alignment with Go structs is best-effort via
`TestStrikeConfigSchemaAlign` (not full codegen). Sidecar files
(`mcp.jsonc` / `providers.jsonc` / `keybinds.jsonc`) are **not** fully schema'd
here yet.

**Load order (later wins for scalars; permission rules concatenate):**

1. Built-in defaults
2. Global `~/.strike/config` (+ `mcp.jsonc` / `providers.jsonc` / `keybinds.jsonc`)
3. Project `./.strike/config` (+ same sidecar files)
4. **Managed/MDM** system `managed-config` (+ `managed-config.d/`) — see
   [Managed / MDM config](#managed-mdm-config-enterprise) below

**Round-trip / save policy:** hand-edited comments and `$schema` are kept on
disk until a **programmatic write** runs (`SetGlobalDefaults`, theme /
presentation / dials / scheduler presets, custom provider upsert/remove,
`AppendProjectPermission`, etc.). Those paths read JSONC, then rewrite
**pretty-printed pure JSON** via `encoding/json` — comments and `$schema` are
dropped. Prefer keeping durable commentary in a sibling note, or avoid
`/settings`-style writers if you need comments to survive. For raw
comment-preserving edits, use **`/config`** (picker opens `~/.strike` /
`./.strike` files in the embedded editor without a JSON round-trip on close).
Programmatic saves only touch user/project paths — they never write managed
files.

**Symlinks:** `~/.strike` and `<project>/.strike` may be directory symlinks
(state lives elsewhere). Strike resolves them before opening history/memory/
issues and before writing config. A file symlink at `~/.strike/config` (for
example stow/dotfiles) is preserved on save — the referent is updated, not
replaced by a plain file.

## Managed / MDM config (enterprise)

For organizations that need centralized policy users cannot override, Strike
loads a **managed** config layer from a system directory (file-based MDM,
same idea as Claude Code `managed-settings.json`). This is **out of scope for
casual users** — leave the directory empty and Strike behaves as before.

### Paths

| Platform | Directory |
|---|---|
| Linux / other Unix | `/etc/strike/` |
| macOS | `/Library/Application Support/Strike/` |
| Windows | `%ProgramFiles%\Strike\` (usually `C:\Program Files\Strike\`) |

Files under that root:

| File | Role |
|---|---|
| `managed-config` / `managed-config.json` / `managed-config.jsonc` | Primary policy (first existing extension wins) |
| `managed-config.d/*.json` and `*.jsonc` | Drop-in fragments, sorted by filename, merged after the primary file |

Hidden drop-ins (names starting with `.`) are ignored. Use numeric prefixes to
control order (`10-sandbox.json`, `20-permissions.json`).

**Test / custom deploy root:** set `STRIKE_MANAGED_ROOT` to an absolute
directory; system defaults are skipped when the env var is set.

Managed files use the **same JSON/JSONC schema** as user config. Typical
enterprise keys:

```jsonc
// /etc/strike/managed-config.jsonc
{
  "sandbox": "read-only",
  "permissionMode": "default",
  "permissionPreset": "dev",
  "permissions": [
    { "permission": "bash", "pattern": "rm -rf *", "action": "deny" },
    { "permission": "write", "pattern": "**/.env", "action": "deny" },
    { "permission": "webfetch", "pattern": "*", "action": "deny" }
  ]
}
```

### What is enforceable

| Control | Behavior when set in managed |
|---|---|
| `sandbox` | Wins over global/project. **CLI `--sandbox` is ignored** so operators cannot loosen OS isolation from the command line. |
| `permissionMode` | Wins over global/project and **session resume**. Mid-session `/mode` / Shift+Tab is **rejected** while locked. |
| `permissionPreset` | Wins over user/project preset selection. |
| `permissions[]` | Concatenated after user/project rules (last-match in the config layer). **Deny** rules are also installed as a late evaluation **ceiling** so session always-grants, scoped grants, `--auto` / `--dangerously-skip-permissions`, and workflow phase widens cannot re-allow a managed deny. |

Other managed keys (theme, model, MCP, …) merge with normal last-wins
semantics; only the security dials above are hard-locked against CLI/session
override. Invalid managed files **fail Load** (fail closed) so a broken MDM
push is visible at startup rather than silently dropped.

Strike never writes managed paths. Deploy with your OS package manager, MDM
profile, or configuration management (Ansible, Puppet, …).

## First-time onboarding

Global acknowledgement lives at `~/.strike/onboarding.json`. Clean interactive
TUI installs auto-open `/ftue` once until finish or dismiss; established
installs migrate without a surprise modal. Full wizard steps, tour, and
scheduler presets: [First-time setup](/docs/ftue).


```jsonc
// ~/.strike/config or ./.strike/config — JSONC comments allowed
{
  // Optional editor hint; ignored by Strike at load (no network fetch)
  "$schema": "https://raw.githubusercontent.com/jonathanung/strike/main/schemas/strike-config.schema.json",
  "provider": "anthropic",
  "model": "claude-sonnet-5",
  "effort": "high",
  "defaultAgent": "build",
  "leanCode": "lite",
  "deferTools": "off",
  "theme": "strike",
  "vimMode": "pane",
  "nanoMode": "pane",
  "mdReadMode": "embedded",
  "notify": "unfocused-only",
  "autoupdate": "notify",
  "permissionMode": "default",
  "sandbox": "workspace-write",
  "network": {
    "allow": ["api.github.com", "*.npmjs.org", "10.0.0.0/8"]
  },
  "permissionAutoApproveSeconds": 0,
  "permissionAutoApproveExclude": ["bash"],
  "maxChildDepth": 0,
  "toolRetry": {
    "maxAttempts": 3,
    "baseDelayMs": 200,
    "maxDelayMs": 2000,
    "loopThreshold": 3
  },
  "compactionStrategy": "trim",
  "compactionModel": "",
  "compactionThreshold": 0.70,
  "compactionBuffer": 4096,
  "keepUserTurns": 2,
  "pruneProtectTokens": 40000,
  "pruneMinimumTokens": 20000,
  "pruneKeepUserTurns": 2,
  "pruneProtectTools": [],
  "session": {
    "worktree": "off",
    "worktreeCleanup": "keep",
    "overlapPolicy": "warn",
    // Optional durability retention hooks (#803). Zero / omitted = unlimited.
    // Applied via session.ApplyRetention (not automatic on every launch).
    "retentionMaxSessions": 0,
    "retentionMaxAgeDays": 0,
    "retentionMaxBytes": 0,
    // Timeline / trace storage bounds (#810). Coordinates with retention* above.
    "timelineMaxEntries": 0,
    "timelineArgsPreviewMax": 0,
    "timelineOutputPreviewMax": 0,
    "timelineBlobSpill": false,
    "traceRetentionMaxFiles": 0,
    "traceRetentionMaxAgeDays": 0,
    "traceRetentionMaxBytes": 0,
    "delegationPolicy": {
      "mode": "enforce",
      "tinyPromptRunes": 280,
      "maxPathsLocal": 1,
      "maxLiveChildren": 0
    },
    "agentBudget": {
      "maxWallClockS": 0,
      "maxTokens": 0,
      "maxCostUsd": 0,
      "maxToolCalls": 0,
      "maxDangerousTools": 0,
      "stallAfterS": 0,
      "loopDetectN": 0
    }
  },
  "scheduler": {
    "presets": ["cargo", "npm"],
    "limits": {
      "process": 8,
      "build": 2,
      "test": 4,
      "model": 3,
      "container": 1
    },
    "commands": [
      { "pattern": "go test *", "class": "test" },
      { "pattern": "go *", "class": "build" },
      { "pattern": "make *", "class": "build" }
    ]
  },
  "permissionPreset": "dev",
  "permissions": [
    { "permission": "bash", "pattern": "go *", "action": "allow" },
    { "permission": "write", "pattern": "**/*.env", "action": "deny" }
  ]
}
```

Rules concatenate across layers; the last matching rule wins, so project
config overrides global, managed overrides both for rules present there, and
session "always" grants override user/project — but **not** managed denies
(see evaluation order).

**Evaluation order (last-match-wins):** defaults → optional
`permissionPreset` → `permissions[]` (global then project then managed) →
optional `--dangerously-skip-permissions` allow-all → project runtime grants
→ active agent profile → session always grants → scoped TTL grants →
permission-mode late denies (plan) → workflow phase profile → **managed deny
ceiling** → mode ask-upgrade (yolo / accept-edits only upgrade remaining
Ask→Allow; never widen Deny).

**Permission presets (`permissionPreset`):** shipped named rulesets inserted
after defaults and before `permissions[]`. Empty means no preset layer.
Inspect with `/permission presets`.

| ID | Behavior |
|---|---|
| `read-only` | Allow read/search/LSP; **deny** write, edit, bash, webfetch, websearch, mcp, hooks |
| `dev` | Allow common local-dev bash (`go *`, `git status/diff/log/show`, `make test*`); deny force-push and `.env` writes; other mutations stay ask |
| `yolo-with-sandbox` | Rule-level allow-all (`* *` allow). Does **not** turn off OS sandbox — keep `sandbox` at `workspace-write` or `read-only`. Later deny rules still win. Distinct from `permissionMode: yolo` |

**Explain:** `/permission explain <tool> [pattern]` (or the
`permission.Explain` / `Service.Explain` API) returns the effective action,
matched rule, layer name, and match trail for a sample tool call.

**Scoped approvals:** runtime grants may be bounded by scope and optional
wall-clock TTL (`session`, `path-prefix`, `tool`, `command-class`). A scoped
grant that would override a parent **Deny** is rejected (does not silently
widen). Session always / project decisions remain the TUI reply path;
programmatic `Service.Grant` is the scoped+TTL API.

**Audit trail:** hard **deny**, **ask** suspend, and user **reply** outcomes
emit `permission.decided` (plus `permission.asked` / `permission.resolved`
when the user is prompted). Synchronous allows are not audited (avoids
flooding session JSONL on high-frequency read/search tools). `/timeline`
folds audit events into `kind: permission` entries with redacted patterns
(see [secrets.md](/docs/secrets) / `pkg/redact`).

**Two-dial model:** `sandbox` (what OS isolation makes *possible* for bash)
and `permissionMode` (when the agent is *asked*) are independent. Default
`sandbox` is `workspace-write` (`off` | `read-only` | `workspace-write`);
override with `--sandbox`. `yolo` + `sandbox: off` requires `--i-know`.
OS backends, permission→profile compile, bash text guard honesty, and TOCTOU
path hardening: [Sandbox](/docs/sandbox). Full layer map (worktrees, scheduler,
planned containers, process caps): [Isolation](/docs/isolation).


**Permission mode dial:** `permissionMode` sets the default tool-permission
posture for **new** sessions: `default` | `plan` | `soft-approve` |
`accept-edits` | `yolo` (see [usage.md](/docs/usage)). Session changes via
Shift+Tab or `/mode` persist in the session JSONL, not back into this file.
Distinct from `/autonomy` (workflow exit gates) and from `sandbox` (OS
isolation).

**Lean code:** `leanCode` is `off` | `lite` (default) | `full`. Injects
agent-scoped efficiency guidance into the system prompt (strict ladder for
build/general/debugger; softer scaling-aware lean for plan/orchestrator;
none for explore/reviewer/tester/validator/commit). Inspired by
[ponytail](https://github.com/DietrichGebert/ponytail) (clean-room wording).
Details: [agents-skills.md](/docs/multi-agent#lean-code-ponytail-lite).

**Deferred tool schemas:** `deferTools` is `on` | `off` (default off). When
`on`, non-core tools are omitted from the provider `tools[]` array until
`toolsearch` discovers them (or the model calls them by name). Core coding
tools stay always available: `read`/`glob`/`grep`/`edit`/`write`/
`apply_patch`/`bash`, the `task*` family, `toolsearch`, `question`, and plan
workflow tools. Deferred surface includes optional built-ins (`webfetch`,
`websearch`, todo/memory/issue, `sleep`, `skill`, `notebook_edit`, …) and all
`mcp_*` tools. Discovery lives on the process registry: matches from `toolsearch`
load full schemas on the **next** model request (including the next
iteration of the same turn’s tool loop). Tools already present as assistant
tool calls in history are re-promoted on each stream (so `--continue` keeps
schemas for tools used earlier). Set `"deferTools": "on"` in global or
project config to enable.

**Permission soft-approve / auto-approve:** session mode `soft-approve`
(`permissionMode`, `/mode`, Shift+Tab) arms a **visible** 15s countdown on
permission asks and submits **allow once** at zero if the user does nothing.
Esc, reject, or any explicit once/session/project choice cancels the timer.
Hard deny rules always win. Queued/hidden asks (behind another modal) do not
count down or auto-approve. Disabled by default (mode `default`, seconds `0`).

`permissionAutoApproveSeconds` (1–60) optionally sets/overrides the countdown
duration without selecting soft-approve mode; when soft-approve is active and
seconds is unset/`0`, the default is **15**. Names in
`permissionAutoApproveExclude` (case-insensitive) never auto-approve.
Both are editable under `/settings` → Defaults (auto-approve applies to the
current session immediately).

**Max child depth:** `maxChildDepth` bounds nested `task` tool spawns (root
depth 0). Zero/unset means the engine default (**1**: children cannot spawn
further tasks). Values above **8** clamp to 8. Editable under `/settings` →
Defaults; takes effect for **new** sessions (already-running engines keep their
bound).

**Tool retry / error recovery:** `toolRetry` controls harness auto-retry and
loop detection for tool dispatch (issue #795). Policy is **error code ×
idempotency** (see `internal/tool/retry.go`):

| | `safe-retry` | `conditional` | `unsafe` |
|---|---|---|---|
| `transient` / `timeout` | auto-retry + backoff | fail (no blind mutation retry) | fail |
| `precondition_failed` | recover hint | recover hint | fail |
| other codes | fail | fail | fail |

Mutative tools (`edit` / `write` / `apply_patch` / `bash` / …) never
auto-retry on generic or transient failure — that prevents double-apply.
Provider stream retries remain separate (`MaxStreamAttempts` in the engine).

| Key | Meaning | Default |
|---|---|---|
| `toolRetry.maxAttempts` | attempts per tool call including the first; `1` disables auto-retry | `3` |
| `toolRetry.baseDelayMs` | first backoff step (full jitter applied) | `200` |
| `toolRetry.maxDelayMs` | backoff cap | `2000` |
| `toolRetry.loopThreshold` | identical consecutive failing tool+args before the turn stops with `loop_detected` | `3` |

When the loop detector trips the engine emits `tool.loop_detected`, settles the
tool as blocked, and ends the turn (`stopReason: loop_detected`). Auto-retries
emit `tool.retrying` (timeline) before each backoff sleep.


## Desktop notifications (`notify`)

When the terminal is unfocused, strike can ring the bell and emit OSC 9
desktop notifications for **needs attention** (permission / question) and
**long turn complete** (≥30s). Notification text is fixed labels only — never
paths, prompts, or secrets.

| Value | Behavior |
|---|---|
| `unfocused-only` (default) | notify when unfocused; if the terminal never reports focus, use the same path for attention + long turns |
| `on` | always notify (attention + long turns), even when focused |
| `off` | never notify |

Unknown values are ignored at load time.

## Autoupdate (`autoupdate`)

Startup (and at most once per 24h) GitHub Releases check that reuses the same
release metadata path as `strike upgrade` / `/upgrade`. The probe is async and
time-bounded so TUI startup is not blocked on the network. Offline, rate-limit,
and API failures stay silent.

| Value | Behavior |
|---|---|
| `notify` (default) | when a newer release exists, show status chrome + optional desktop notify; path is `/upgrade` or `strike upgrade` |
| `off` | no startup release check |
| `auto` | opt-in: when the binary is writable, download+replace in place (no re-exec); otherwise same as `notify` with a Nix/package-manager hint |

**Default never replaces the binary** — only `auto` may. Nix store installs and
other non-writable binaries never attempt replace; the notice tells you to
update the flake/lock input or re-run the install script. Windows self-update
remains unsupported (same as manual upgrade).

Probe state is cached under `~/.strike/cache/update-check.json`. Editable under
`/settings` → Defaults.

## Scheduler

`scheduler` bounds concurrent agent work **inside one Strike OS process**
(named pools, presets, command classification, queue events). Separate
`strike` processes do not share capacity. Full reference: [Scheduler](/docs/scheduler).


## Session worktrees

When concurrent root sessions would otherwise share one working tree, strike
can bind each session's tool CWD to its own `git worktree` under
`<repo>/.strike/worktrees/<session-id>/` (gitignored via `*/worktrees`).

| `session.worktree` | Behavior |
|---|---|
| `off` (default) | launch cwd; no isolation |
| `auto` | worktree when a second root session starts in-process |
| `always` | every new root session gets a worktree (git repos only) |

| `session.worktreeCleanup` | Behavior |
|---|---|
| `keep` (default) | leave the worktree and branch after session close |
| `delete` | `git worktree remove` + delete the branch on close |

CLI: `strike --worktree` forces a worktree for that invocation (same as always
for one session). Non-git directories soft-fail: the app launches on the launch
cwd and shows a dismissible modal (TUI) or stderr line (exec) explaining that
no git repository was detected. Other `git worktree add` failures still return
a clear error and do not leave a half-bound session. Project-scoped state
(history, memory, issues) stays keyed to the main repo, not the worktree path.
Tools (`bash`, `read`, `write`, …) resolve paths inside the session worktree.
Each `bash` invocation is a fresh process whose cwd is that session workdir
(workspace root, or the bound git worktree root). A `cd` inside one command
does not affect later bash calls or other tools; chain with `&&` or
`(cd subdir && …)` when a single command needs a subdirectory.

### Parallel children and path overlap

Within one session team, `task` children share the lead's tool CWD. Write tools
(`edit`, `write`, `apply_patch`, `notebook_edit`) register path touches on a
shared ownership map. When two **active** agents claim the same path:

| `session.overlapPolicy` | Behavior |
|---|---|
| `warn` (default) | write proceeds; tool output gets a warning; engine emits `path.overlap` |
| `block` | conflicting write is refused |
| `off` | track only (no warning/event) |

### Session log durability and retention

Session transcripts are JSONL under `~/.strike/sessions/<id>.jsonl` with a
sidecar `<id>.meta.json`. New logs start with a `session.header` line carrying
`schemaVersion` (currently `1`). Each event append writes a full JSON line and
`fsync`s so a crash cannot leave an unreadable half-record; resume skips a
trailing torn line and fails with an actionable error on interior corruption or
an unsupported newer schema (upgrade strike). Secrets are scrubbed on append
via `secret.RedactEvent` (see [secrets.md](/docs/secrets)).

Portable **session packages** (`format: strike.session`) export/import the
redacted event sequence + meta for support bundles — distinct from the
human-readable markdown transcript (`/export`, #221) and from checkpoint stack
persistence across `--continue` (#573). Live `/fork` / `/rewind` copy into a new
id with `meta.forkedFrom` lineage.

| `session.retentionMaxSessions` | Cap closed sessions retained (0 = unlimited) |
| `session.retentionMaxAgeDays` | Drop closed sessions older than N days (0 = off) |
| `session.retentionMaxBytes` | Cap total closed log+meta bytes (0 = off) |
| `session.timelineMaxEntries` | Cap in-memory run timeline entries (0 = library default 10000) |
| `session.timelineArgsPreviewMax` | Inline tool-args preview rune cap (0 = 512) |
| `session.timelineOutputPreviewMax` | Inline tool-output preview rune cap (0 = 2048) |
| `session.timelineBlobSpill` | Spill oversized redacted payloads to `~/.strike/traces/<id>/blobs/` with `blob:sha256:` refs |
| `session.traceRetentionMaxFiles` | Cap top-level trees under traces + runs (0 = unlimited) |
| `session.traceRetentionMaxAgeDays` | Drop trace/run session trees older than N days (0 = off) |
| `session.traceRetentionMaxBytes` | Cap total bytes under traces + runs trees (0 = off) |

Build a policy with `session.RetentionFromConfig` and run
`Manager.ApplyRetention` from tooling or a maintenance path. Open sessions are
never deleted. Project config overrides global per field when non-zero.

**Trace storage (#810):** the structured run timeline (`pkg/timeline`, `/timeline`)
keeps bounded inline previews. With `timelineBlobSpill`, full redacted payloads
that exceed the preview caps are written under
`~/.strike/traces/<sessionId>/blobs/` (content-addressed; **no fsync** — session
JSONL remains the durability boundary so the turn/UI loop is not blocked on
observability I/O). Entries carry `argsRef` / `outputRef` (`blob:sha256:<hex>`)
and `truncated: true`. In-memory builders prune oldest **terminal** entries when
over `timelineMaxEntries`. `Builder.Metrics()` exposes Observe latency and
spill/truncate/prune counters.

Sidecar retention uses the same count/age/size axes as session retention:

- `session.ApplyTraceRetention(tracesDir, runsDir, policy)` — caps
  `~/.strike/traces` and `~/.strike/runs` (recordings / run snapshots)
- `Manager.ApplyRetentionWithSidecars` — session JSONL retention then deletes
  matching trace/run trees for each removed session id

Build the sidecar policy with `session.TraceRetentionFromConfig` from
`traceRetentionMax*`. Not automatic on launch.

Lead and children can query the map with `agent_ownership` (`list`), and claim
path prefixes with `lease` / `release` (exclusive or shared). Finished children
are deactivated so they no longer cause overlap. Structured handoff
`files_changed` (when available) can be merged via the same tracker.

### Delegation-worthiness policy (`session.delegationPolicy`)

Before every `task` / `delegate` create, the engine runs a deterministic
worthiness gate (#876) so tiny or tightly coupled work stays local and fan-out
respects concurrency/budget ceilings. Capability routing (#778) runs only after
the policy chooses to delegate.

| Field | Meaning |
|---|---|
| `mode` | `off` (always spawn), `advise` (record preferred action but spawn), `enforce` (soft-local returns status `local`; hard ceilings deny). When the block is omitted, the CLI defaults to `enforce`. Zero-value engine Options (tests/embedders) stay `off`. |
| `tinyPromptRunes` | Bare prompts at or below this rune count prefer local (default 280) |
| `maxPathsLocal` | Bare tasks with ≤N `context_bundle` paths prefer local (default 1; negative disables) |
| `maxLiveChildren` | Hard-deny when live children reach this count (0 = unlimited) |

**Soft prefer local** (overridable with `force_delegate=true` on the tool call):

- Bare tiny prompt (no agent/specialty/criteria/deps/verify) with few scoped paths
- Requested paths overlap active ownership claims of other live agents

**Soft prefer delegate**: intentional signals (agent pin, specialty/capabilities,
criteria, deps, verify gates) or multi-path independent work.

**Hard deny** (never overridable): depth ceiling (`maxChildDepth`), optional
`maxLiveChildren`, delegation object ceiling, and session budget exhausted when
a `SessionBudgetExhausted` hook is wired (session cost envelope #577).

Decisions expose a structured `policyReason` on tool metadata and
`child.started`. Engine counters (`delegate` / `local` / `deny` / `override`)
support comparing elapsed time and cost with policy on vs off.

Orchestrator guidance has a single pre-spawn decision table matching this gate.

### Per-agent budgets (`session.agentBudget`)

Optional defaults for every `task` / `delegate` child in a session. Spawn-time
`budget` fields on the tool call overlay any non-zero dimension. Zero means
unlimited for that dimension.

| Field | Meaning |
|---|---|
| `maxWallClockS` | Wall-clock seconds before fail + interrupt |
| `maxTokens` | Accumulated stream tokens before fail |
| `maxCostUsd` | USD before fail (enforced when cost pricing lands; see below) |
| `maxToolCalls` | Tool invocations before fail |
| `maxDangerousTools` | bash/write/edit/apply_patch/notebook_edit calls before fail |
| `stallAfterS` | Hard block after this many seconds without progress |
| `loopDetectN` | Hard block when the same tool name repeats N times |

On hard exceed the engine emits `child.escalated` and stops the child. Soft
resource budgets (`wall_clock`, `tokens`, `cost_usd`, `tool_calls`,
`dangerous_tools`, and hard `stall`/`loop`) first attempt **one reserved
finalization turn** (tools disabled, ~45s wall ceiling) so the child can return
a structured partial handoff before termination (#879). `child.escalated`
`action` is `finalizing` then the child ends with `ChildCompleted.budgetKind` +
`finalization` (`succeeded`|`failed`) and handoff `quality`
(`complete`|`partial`|`unavailable`). Hard cancel, parent shutdown, and trust
boundary failures skip finalization (`finalization=skipped_hard`,
`action=interrupted`). Already-written typed artifacts and engine-tracked
`files_changed` are always merged into the terminal handoff.

Delegation is marked `failed` or `blocked`, and a structured lead/owner mailbox
notice is delivered. Soft stall (default 300s idle) and loop (default 6
identical tools) flags always appear on `task_status` / `agent_roster` without
killing when no hard threshold is set.

**Stale children (#517):** folded into stall — same `stall` signal and optional
`stallAfterS` hard threshold; not a second detector.

**Session cost envelope (#577 / #542):** when `maxSessionCostUSD` is configured
it remains the **outer** cost cap for the whole session. Per-agent
`maxCostUsd` nests inside that envelope and never raises the session ceiling.
Until session cost pricing ships, `maxCostUsd` is accepted and exposed but not
enforced (usage stays 0).

**Isolated worktree path (explicit apply):** for true filesystem isolation,
prefer separate root sessions with `session.worktree=always` (or
`strike --worktree`), or dogfood sibling checkouts (e.g. under
`strike-cli-worktrees/`). Apply back to the primary tree with an explicit
`git merge` / `cherry-pick` / patch apply from the child branch or worktree —
never silent clobber of the shared primary checkout. Per-child worktrees inside
one `task` fan-out remain a follow-up; overlap detection is the in-session
safety rail today.

**ctrl+d saves defaults**: on the main screen it persists the current
provider/model/agent/effort/theme to `~/.strike/config`; in the provider
picker it saves the highlighted provider; in the model picker it saves
provider + model; in the effort picker it saves the highlighted level; in
the theme picker it saves the highlighted theme id.

**/settings Defaults**: interactive editor for theme, vimMode, nanoMode,
mdReadMode, **permissionMode**, **permissionAutoApproveSeconds**,
**permissionAutoApproveExclude**, **sandbox**, **notify**, **autoupdate**,
**leanCode**, **deferTools**, **session.worktree**, **maxChildDepth**, and
effort (plus a read-only view of provider/model/agent). Changes write
`~/.strike/config`. Theme, editor/reader presentation, notify, and auto-approve
countdown/exclude apply to the current session immediately; permissionMode,
sandbox, leanCode, deferTools, session.worktree, autoupdate, and maxChildDepth
affect **new** sessions (use `/mode` / Shift+Tab for the live permission dial,
and `/sandbox` to inspect the OS dial already bound for this process).
Autoupdate probes run at process start from the config loaded at launch.
Programmatic `/settings` saves drop JSONC comments; use **`/config`** (or
Settings → **Open config files…**) for hand-edited files and sidecars
(`mcp.jsonc`, `providers.jsonc`, `keybinds.jsonc`, agents/skills/themes/
workflows).

**/settings Compaction**: editor for history compaction and continuous prune
dials (`compactionStrategy`, `compactionModel`, `compactionThreshold`,
`compactionBuffer`, `keepUserTurns`, `pruneProtectTokens`,
`pruneMinimumTokens`, `pruneKeepUserTurns`, `pruneProtectTools`). Writes
`~/.strike/config`; values apply to **new** sessions (the running engine keeps
the dials it was started with). Pick lists cover common ranges; summarize
model and prune-protect tools use free-text input (empty clears).

Peer settings inventory (Claude Code / OpenCode → strike): see
[peer-ecosystem.md](/docs/peer-ecosystem#settings-inventory).

## Theme

`theme` is a color-theme id (bundled + `~/.strike/themes` + `./.strike/themes`
+ plugin contributions). In the TUI: bare `/theme` opens a picker; `/theme <id>`
applies one. Full chrome modes, surfaces, and web cockpit parity: [Theme](/docs/theme).


## Keybinds

Remap app-level chords without recompiling. Ids match the in-app cheatsheet
(`/keys` / `f1`). Prefer a dedicated file (JSONC comments allowed); the
`keybinds` object in config still works:

```jsonc
// ~/.strike/keybinds.jsonc or ./.strike/keybinds.jsonc
// Flat map (preferred). Wrapped {"keybinds": {...}} is also accepted.
{
  "nav.jump-bottom": "ctrl+b",
  "global.palette": "ctrl+k",
  "composer.newline": ["ctrl+j", "alt+enter"],
  "nav.window-next": "ctrl+o",
  "nav.window-prev": "ctrl+p",
  "nav.group-next": "ctrl+shift+o",
  "nav.group-prev": "ctrl+shift+p",
  "nav.tool-expand": "alt+enter"
}
```

Legacy shape in `~/.strike/config` or `./.strike/config`:

```json
{
  "keybinds": {
    "nav.jump-bottom": "ctrl+b",
    "global.palette": "ctrl+k"
  }
}
```

Layers merge last-wins per id:

`defaults → ~/.strike/config → ~/.strike/keybinds.jsonc → ./.strike/config → ./.strike/keybinds.jsonc`

(`.json` is accepted as well as `.jsonc`. In the same root, the dedicated file
overrides the config object.) Unknown binding ids and invalid/empty chords
fail config load with a clear error. Critical `global.quit` and
`global.interrupt` cannot be cleared.

Shared chords across different actions are allowed (context-specific routing
in the TUI decides the winner — e.g. default `alt+enter` is newline while
typing and tool expand only when the composer is empty). `/keys` shows the
effective map; `/keys reset` restores built-in defaults for the current
session only — remove remaps from `keybinds.jsonc` / the config `keybinds`
object to persist defaults.

List/permission modal conventions (`lists.*`, `perm.*`) and agents-pane local
controls (`agents.*`) are not remappable.

## Language servers (LSP)

Configure stdio language servers so file tool mutations (`write` / `edit` /
`apply_patch` / `notebook_edit`) drive `textDocument/didOpen` /
`didChange` / `didClose`, and `publishDiagnostics` notifications are collected
per URI. A dead language server degrades to no diagnostics and never takes
down the session (same crash isolation as MCP).

By default strike ships a server map for **Go** (`gopls`), **TypeScript**
(`typescript-language-server --stdio`), **Python** (`pylsp`), and **Rust**
(`rust-analyzer`). Missing binaries degrade to per-server `error` status and
never take down the session. Clear the map with `"servers": {}`, or replace it
entirely by setting `lsp.servers` in config.

```json
// ~/.strike/config or ./.strike/config
{
  "lsp": {
    "servers": {
      "go": {
        "command": "gopls",
        "extensions": [".go"]
      },
      "typescript": {
        "command": "typescript-language-server",
        "args": ["--stdio"],
        "extensions": [".ts", ".tsx", ".js", ".jsx"]
      },
      "python": {
        "command": "pylsp",
        "extensions": [".py"]
      },
      "rust": {
        "command": "rust-analyzer",
        "extensions": [".rs"]
      }
    }
  }
}
```

| Field | Required | Notes |
|---|---|---|
| `command` | yes | Executable on `PATH` or absolute path |
| `args` | no | Extra argv after command |
| `env` | no | Env overlay for the subprocess (never logged) |
| `extensions` | yes | File extensions this server owns (with or without leading `.`). First server claiming an extension wins. Servers with no extensions are skipped. |

**Layering:** when a config layer sets `lsp.servers` (including `{}`), it
**replaces** the previous layer's server map entirely (same as MCP). Omitted
`servers` leaves the lower layer's map. Scalar diagnostics knobs
(`diagnosticsSeverity`, `diagnosticsMaxChars`, `diagnosticsWaitMs`) overlay
last-wins when set. Omitted `lsp` leaves the lower layer unchanged.

### Diagnostics in tool results

After a successful `write` / `edit` / `apply_patch` / `notebook_edit`, strike
waits briefly for `publishDiagnostics` on the touched paths and appends a
single `--- diagnostics ---` block to the tool `Result` the model sees.
Multi-file `apply_patch` shares one wait window and one block (not one block
per file). A dead language server degrades to no injection.

| Field | Default | Notes |
|---|---|---|
| `diagnosticsSeverity` | `error` | Minimum severity to inject: `error`, `warning`, `info`, or `hint`. Errors-only by default; set `warning` to opt in to warnings. |
| `diagnosticsMaxChars` | `4000` | Cap on injected text (runes). Excess lines become `… (N more diagnostic(s) truncated)`. |
| `diagnosticsWaitMs` | `400` | Max wait for `publishDiagnostics` after a mutation. Negative skips the wait (snapshot immediately). |

```json
{
  "lsp": {
    "diagnosticsSeverity": "warning",
    "diagnosticsMaxChars": 6000,
    "diagnosticsWaitMs": 600,
    "servers": {
      "go": { "command": "gopls", "extensions": [".go"] }
    }
  }
}
```

### `/lsp` and the diagnostics pane

- `/lsp` — status (`up` / `down` / `error` / `disabled`); command, extensions, open docs
- `/lsp retry [name]` — reconnect one server, or every non-up server
- `/lsp disable <name>` — stop a server for the session
- `/diagnostics` — focus the right-pane diagnostics browser (findings from live servers; Enter opens the file)

### Navigation and diagnostics tools (optional)

Read-only tools call the language server for code navigation and diagnostics
queries. They are **not** core tools: when `deferTools` is `on`, their schemas
stay out of the hot provider Tools array until `toolsearch` discovers them (or
the model calls them by name).

| Tool | LSP method / source | Args |
|---|---|---|
| `definition` | `textDocument/definition` | `filePath`, `line` (1-based), optional `character` (0-based) |
| `references` | `textDocument/references` | same position args; includes declaration |
| `symbols` | `textDocument/documentSymbol` or `workspace/symbol` | `filePath` and/or `query` |
| `diagnostics` | cached `publishDiagnostics` from live servers | optional `path` (file or directory; omit = workspace), optional `severity` (`error` default, `warning`, `info`, `hint`), optional `maxResults` (default 100, max 500) |

`diagnostics` returns a stable JSON payload: `file`, `range` (1-based
line/character start+end), `severity`, `source`, `code`, `message`, plus
server status, counts, and a `truncated` flag. Results are sorted
deterministically. Paths stay workspace-scoped.

A missing or dead language server returns structured status / a soft message in
the tool result (never hangs or takes down the session). Default permission is
Allow (read-only).

## External harnesses

Named subprocess harnesses used by agent frontmatter `harness: <name>`.
Config keys (`command`, `args`, `env`, `mode`, persistent-worker limits):
see the full reference — [Harnesses](/docs/harnesses#external-process-configuration).


## MCP servers

Connect Model Context Protocol servers over **stdio** or **streamable HTTP**.
Prefer `mcp.jsonc`; legacy `mcp` in config still works. Full setup, fields,
permissions, and TUI controls: [MCP](/docs/mcp).


## Custom providers

Add OpenAI-compatible (chat completions) or Anthropic-compatible (messages)
endpoints via **`providers.jsonc`** (preferred) or the `providers` array in
config. Layers merge last-wins by name:

`defaults → ~/.strike/config → ~/.strike/providers.jsonc → ./.strike/config → ./.strike/providers.jsonc`

(`.json` is accepted as well as `.jsonc`.) Credentials never live in these
files — use env refs and/or `/auth` / the auth store.

### Disable default (builtin) providers

Hide stock catalog providers (`anthropic`, `openai`, `xai`, `google`, `kimi`,
`deepseek`, `echo`) so only custom endpoints appear in `/provider`, `/auth`,
and model pickers. The shipped alias `gemini` is accepted on
`disable-default-gemini` and routes to `google`. Same keys work in
**`providers.jsonc`** or config JSON; later layers win (project overrides
global; providers.jsonc overrides the config file in the same root).

```jsonc
// ~/.strike/providers.jsonc — custom-only setup, keep openai available
{
  "disable-default-providers": true,
  "disable-default-openai": false, // per-provider override re-enables
  "disable-default-anthropic": true, // redundant when all are disabled
  "acme": {
    "options": {
      "baseURL": "https://api.example.com/v1",
      "apiKey": "{env:ACME_API_KEY}"
    },
    "models": ["acme-latest"]
  }
}
```

| Key | Effect |
|---|---|
| `disable-default-providers` | `true` hides **all** builtins unless a per-provider flag says otherwise |
| `disable-default-<name>` | `true` disables that builtin; `false` **re-enables** it when the bulk flag is on |

Customs are never affected. Selecting a disabled builtin (`--provider`,
`/provider`, config default) fails with a clear error. Overlays/endpoints for
a disabled builtin are ignored for selection until it is re-enabled.

### `providers.jsonc` (OpenCode-style)

```jsonc
// ~/.strike/providers.jsonc or ./.strike/providers.jsonc
{
  // Custom / self-hosted endpoint
  "acme": {
    "npm": "@ai-sdk/openai-compatible", // optional; hints wire dialect only (not loaded)
    "name": "Acme",
    "options": {
      "baseURL": "https://api.example.com/v1",
      "apiKey": "{env:ACME_API_KEY}"
    },
    // Legacy flat ids still work:
    // "models": ["acme-latest"]
    // Nested rich objects (display name, limits, variants):
    "models": {
      "acme-latest": {
        "name": "Acme Latest",
        "limit": { "context": 128000, "output": 8192 },
        "options": { "forcedReasoning": true },
        "variants": {
          "high": { "reasoningEffort": "high", "textVerbosity": "low" },
          "low": { "reasoningEffort": "low" }
        }
      }
    }
  },
  // Built-in overlay — does NOT become a separate custom provider.
  // options.baseURL / options.apiKey customize the stock endpoint (proxy).
  // Omit models (or leave empty) to keep the full models.dev catalog.
  // Overlay one id to refine name/limits/variants; other catalog ids remain.
  "anthropic": {
    "name": "Corp Anthropic",
    "options": {
      // OpenCode/AI SDK shape: include /v1 (strike also accepts origin-only).
      "baseURL": "https://proxy.example/anthropic/v1",
      "apiKey": "{env:CORP_ANTHROPIC_KEY}"
    }
  },
  "openai": {
    "models": {
      "gpt-5.5": {
        "name": "GPT-5.5",
        "limit": { "context": 272000, "output": 128000 },
        "variants": {
          "high": { "reasoningEffort": "high" },
          "xhigh": { "reasoningEffort": "xhigh" }
        }
      }
    }
  },
  "claude-proxy": {
    "npm": "@ai-sdk/anthropic",
    "options": {
      "baseURL": "$ANTHROPIC_BASE_URL",
      "apiKey": "${ANTHROPIC_AUTH_TOKEN}"
    }
  }
}
```

| Field | Required | Notes |
|---|---|---|
| map key | yes | provider id (lowercased slug). Built-ins (`anthropic`/`openai`/`xai`/`google`/`kimi`/`deepseek`/`echo`) stay builtins: options → **endpoint overlay**, models → **catalog overlay**. The shipped alias `gemini` is accepted and canonicalized to `google`. Other keys are custom providers. |
| `options.baseURL` | custom yes | absolute `http`/`https` URL, or `{env:VAR}` / `$VAR` / `${VAR}`. On builtins, optional — overrides the stock endpoint. **OpenCode shape:** include `/v1` (Anthropic → `…/v1` + `/messages`; OpenAI → `…/v1` + `/chat/completions` or `/responses`). Origin-only Anthropic bases still work. |
| `options.apiKey` | no | env ref only (`{env:NAME}`, `$NAME`, `${NAME}`) → checked before auth store. On builtins, pins the env var used for that provider. Missing env fails at select time with a clear error. |
| `npm` | no | **advisory only** — never installed; `anthropic` → Messages; `@ai-sdk/openai` → **Responses** (`/responses`); `@ai-sdk/openai-compatible` (default) → chat completions |
| `api` | no | strike override: `openai` (chat), `responses`, or `anthropic` (wins over npm hint) |
| `models` | no | `[]string` (legacy) **or** object map id → model def; see merge rules below |
| `models.<id>` map key | yes (when nested) | **wire model id** sent on the API `model` field and used by `/model` selection |
| `models.<id>.name` | no | **display label only** in `/model` (never sent on the wire; default: id or models.dev name) |
| `models.<id>.limit.context` / `.output` | no | token ceilings; overlay wins over models.dev when set (>0) |
| `models.<id>.options` | no | opaque bag (unsupported keys ignored; must not change the wire id) |
| `models.<id>.variants` | no | named effort presets; `reasoningEffort`/`effort` map onto `/effort` |
| `options.headers` | no | extra HTTP headers (values may use env refs) |

#### Wire id vs display name

Nested `models` object **keys** are the ids strike selects and sends on the wire
(`{"model":"<key>"}`). The optional `name` field is a UI label only. Example:
`"gpt-5.5": { "name": "GPT-5.5" }` lists as “GPT-5.5” but requests `gpt-5.5`.
Variants and options never rewrite the wire id.

#### Builtin endpoint overlay (anthropic / openai / …)

Defining `"anthropic": { "options": { "baseURL", "apiKey" } }` (with or without
`models`) keeps the builtin provider registered, routes HTTP to the custom
endpoint, resolves the pinned apiKey env, and still lists models.dev when
`models` is omitted. Same for other credential builtins (openai chat-completions
path when baseURL/apiKey is set — not the ChatGPT OAuth backend).

#### baseURL path join (OpenCode parity)

| Wire | `options.baseURL` example | Request path |
|---|---|---|
| anthropic | `https://proxy.example/v1` (OpenCode) | `…/v1/messages` |
| anthropic | `https://proxy.example` (origin-only) | `…/v1/messages` |
| openai (chat) | `https://proxy.example/v1` | `…/v1/chat/completions` |
| responses (`@ai-sdk/openai`) | `https://proxy.example/v1` | `…/v1/responses` |

Do **not** put `/messages` or `/chat/completions` in `baseURL` unless the whole
URL is already the final endpoint (strike leaves a trailing `/messages` or
`/responses` alone).

#### models.dev / catalog merge

| Situation | Behavior |
|---|---|
| Builtin (openai, anthropic, …) with models.dev data | `/model` lists **catalog** models by default |
| Builtin with only `options` (no `models`) | endpoint overlay applied; **full catalog** unchanged |
| Config omits `models` or `models` is empty | full catalog unchanged |
| Config nested/flat models on a **builtin** | **merge/overlay** by id: config wins name/limits/variants; catalog-only ids still appear |
| Config nested/flat models on a **custom** provider | config list is the full `/model` list (no models.dev); map keys are wire ids |
| Config sets limits for a catalog id | config wins for those fields; other catalog metadata kept |

You never need to paste an entire upstream catalog into `providers.jsonc` just to set one variant, context limit, or proxy baseURL.

#### Default model precedence

1. `config.model` / `--model` when set  
2. Custom provider: first configured model id (`models` array order, or sorted nested keys)  
3. Built-in pin via `DefaultModel(provider)` (e.g. openai → `gpt-5.5`)  
4. Otherwise unset (freeform `/model <id>`)

#### Variants → effort

Variant bags may include `reasoningEffort` or `effort` (`off`\|`low`\|`medium`\|`high`\|`xhigh`\|`max`). Selecting a variant (from the `/effort` picker when the active model has variants, or `/effort <variant-id>`) sets the session effort dial; adapters map that onto wire fields (`reasoning_effort`, Anthropic `output_config.effort`, …). Other variant keys are ignored for now.

### Config `providers` array (legacy)

```json
{
  "providers": [
    {
      "name": "acme",
      "baseURL": "https://api.example.com/v1",
      "api": "openai",
      "apiKeyEnv": "ACME_API_KEY",
      "models": ["acme-latest"],
      "headers": { "X-Custom": "optional" }
    }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `name` | yes | lowercase slug (`[a-z][a-z0-9_-]{0,63}`); not `anthropic`/`openai`/`xai`/`google`/`gemini`/`kimi`/`deepseek`/`echo` (`gemini` is reserved as an alias of `google`) |
| `baseURL` | yes | absolute URL or env ref template |
| `api` | yes | wire dialect: `openai` (chat), `responses`, or `anthropic` |
| `apiKeyEnv` | no | env var name (or `{env:NAME}` / `$NAME`) checked before the auth store |
| `models` | no | flat `[]string` ids listed in `/model`; first is the default when unset (rich nested models use `providers.jsonc`) |
| `headers` | no | extra HTTP headers on every request (values may use env refs) |

**Migration:** existing `models: ["a","b"]` keeps working everywhere. Prefer
`providers.jsonc` nested objects when you need display names, limits, or
variants. Built-in overlays go under the builtin key in `providers.jsonc`
(not in the `providers` array — builtin names remain reserved there).

**Env interpolation:** `{env:NAME}`, `$NAME`, and `${NAME}` expand from the
process environment (vars exported to the strike process, e.g. via bashrc).

**TUI:** `/settings` CRUD and `/provider` → “Add custom provider…”. Custom
names appear in `/provider` like built-ins. **Logout** (`ctrl+x` or
`/auth logout <name>`) of a custom provider **deletes** its definition from
config/providers.jsonc and clears credentials; `/settings` `d` does the same.
Built-in logout only clears credentials.

## Surface presentation (editors)

`vimMode`, `nanoMode`, and `mdReadMode` control how `/vim`, `/nano`, and
`/md-read` present (embedded pane, modal overlay, or takeover). Full reference:
[Editors](/docs/editors).


## Hooks

Lifecycle hooks live in the same JSON config under `hooks` (global then
project **concatenate**). Each entry is either a **declarative rule**
(`action`) or a **shell command** (`command`) — not both.

```json
{
  "hooks": [
    {
      "event": "pre_tool_use",
      "matcher": "bash",
      "action": "log"
    },
    {
      "event": "pre_tool_use",
      "matcher": "write",
      "action": "block",
      "message": "writes blocked by policy"
    },
    {
      "event": "post_tool_use",
      "matcher": "edit",
      "command": "echo ok",
      "timeoutMs": 10000
    }
  ]
}
```

| Field | Notes |
|---|---|
| `event` | `pre_tool_use`, `post_tool_use`, `turn_start`, `turn_end` |
| `matcher` | doublestar on tool name; empty/`*` = all (turn events: empty/`*` only) |
| `action` | `log`, `block`, or `notify` (block only on `pre_tool_use`) |
| `message` | optional block/notify text |
| `command` | `bash -c` with event JSON on stdin (shell hooks: tool events) |
| `timeoutMs` | shell bound; default 30000, max 120000 |

Invalid rows are dropped at load. Peer event-name mapping (CC/OpenCode/Crush):
[peer-ecosystem.md](/docs/peer-ecosystem#hooks-alignment).

### Shell hook stdin payload

Shell hooks (`command`) receive one JSON object on stdin (not env vars):

| Field | When | Notes |
|---|---|---|
| `event` | always | `pre_tool_use` or `post_tool_use` |
| `session_id` | always | session id |
| `cwd` | always | engine workdir |
| `tool_name` | tool events | e.g. `edit`, `write` |
| `tool_call_id` | tool events | call id |
| `tool_input` | tool events | raw tool args object (`filePath` for `edit`/`write`) |
| `tool_output` | `post_tool_use` | tool result text |
| `is_error` | `post_tool_use` | `true` when the tool failed |

Exit **0** allows; non-zero **blocks** (pre: deny tool; post: mark the completed call blocked and replace feedback). Timeouts and start failures **fail-open**. Prefer always-exit-0 recipes for non-blocking side effects (formatters, notify).

### Post-edit formatters (recipe)

Strike has **no** first-class `formatters` map (OpenCode-style plugin host is out of scope). Run formatters with `post_tool_use` shell hooks after successful `edit` / `write`. Requires `jq` on `PATH` for the snippets below.

**Non-blocking Go format** (recommended default — formatter failure does not fail the tool):

```json
{
  "hooks": [
    {
      "event": "post_tool_use",
      "matcher": "{edit,write}",
      "timeoutMs": 15000,
      "command": "payload=$(cat); echo \"$payload\" | jq -e '.is_error == true' >/dev/null 2>&1 && exit 0; f=$(echo \"$payload\" | jq -r '.tool_input.filePath // empty'); [ -n \"$f\" ] || exit 0; case \"$f\" in *.go) gofmt -w \"$f\" 2>/dev/null || true ;; esac; exit 0"
    }
  ]
}
```

**Multi-language sketch** (still non-blocking; adjust tools to taste):

```json
{
  "hooks": [
    {
      "event": "post_tool_use",
      "matcher": "{edit,write}",
      "timeoutMs": 30000,
      "command": "payload=$(cat); echo \"$payload\" | jq -e '.is_error == true' >/dev/null 2>&1 && exit 0; f=$(echo \"$payload\" | jq -r '.tool_input.filePath // empty'); [ -n \"$f\" ] || exit 0; case \"$f\" in *.go) gofmt -w \"$f\" 2>/dev/null || true ;; *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md) command -v prettier >/dev/null && prettier --write \"$f\" 2>/dev/null || true ;; *.py) command -v ruff >/dev/null && ruff format \"$f\" 2>/dev/null || true ;; esac; exit 0"
    }
  ]
}
```

**Blocking format** (rare): omit the trailing `|| true` / `exit 0` so a non-zero formatter exit marks the tool result blocked. Prefer non-blocking unless you intentionally gate the agent on format success.

Notes:

- Matcher is doublestar on **tool name** (`{edit,write}` is fine); it does not filter by file extension — do that in the shell `case`.
- `apply_patch` and other mutators are not covered by this matcher; add separate rows if you format those paths.
- Project hooks concatenate after global hooks; put team formatters in `./.strike/config` (or your project config path).
- Editor/`$EDITOR` format-on-save remains a valid alternative outside the agent loop.
- Peer inventory: [peer-ecosystem.md](/docs/peer-ecosystem#settings-inventory) (Formatters → hooks recipe).

## History compaction

`/compact` and automatic threshold/overflow compaction shrink model-facing
history while keeping a recent tail. Continuous tool-result prune
(`internal/engine/prune.go`) blanks older tool bodies under that ceiling;
threshold compaction is the coarser whole-history rewrite. Edit these dials in
JSON or interactively via **`/settings` → Compaction**.

| Field | Values | Default |
|---|---|---|
| `compactionStrategy` | `trim` (drop older turns) or `summarize` (model-authored summary of dropped turns) | `trim` |
| `compactionModel` | optional model id for the summarize call (same provider as the session) | session model |
| `compactionThreshold` | occupancy fraction of the known context window that triggers auto-compact before a Stream; `>=1` disables threshold compaction; omit/`0` uses the engine default | `0.70` |
| `compactionBuffer` | extra token headroom reserved with `MaxTokens` so threshold compaction fires before hard exhaustion; omit/`0` uses the engine default | `4096` |
| `keepUserTurns` | trailing real user turns preserved when compacting (compact markers do not count); omit/`0` uses the engine default | `2` |
| `pruneProtectTokens` | recent tool-output tokens kept intact while walking history backward during continuous prune; omit/`0` uses the engine default; negatives clamp to `0` | `40000` |
| `pruneMinimumTokens` | minimum estimated tokens that must be freed before prune mutates history (avoids thrash); omit/`0` uses the engine default; negatives clamp to `0` | `20000` |
| `pruneKeepUserTurns` | real user turns whose tool results stay complete during prune (compact markers do not count); omit/`0` uses the engine default; negatives clamp to `0` | `2` |
| `pruneProtectTools` | extra tool names whose results are never blanked (merged with built-in `skill`); names lowercased/deduped; omit/empty adds none | `[]` (+ built-in `skill`) |

Recommended ranges: threshold `0.60`–`0.85` (lower = earlier pressure response;
too low thrash-compacts short sessions), buffer `1024`–`8192`, keep turns
`1`–`4`. For prune, lower `pruneProtectTokens` / `pruneMinimumTokens` on
MCP-heavy sessions (tighter reclaim); raise minimum on short interactive
sessions to avoid thrash. Overflow recovery still compacts on context-length
provider errors regardless of threshold.

On summarize failure the engine falls back to trim and emits a notice. The
summary path never re-runs tools.

## Reasoning effort

`/effort` sets how much internal reasoning the model spends before answering.
The active level shows on the top status bar once set. Persist a default with
`ctrl+d` in the effort picker, `/settings` → Defaults → Effort, config
`"effort"`, or `--effort`. The ladder is normalized across vendors and each
adapter maps it to its own wire fields — Anthropic to adaptive thinking plus
`output_config.effort`, the OpenAI family to a `reasoning_effort` string. With
no level set, strike sends no reasoning fields at all and each provider's own
default applies. The `task` tool accepts optional `effort` so a parent can pin
a child dial independently of the UI default.

The two ends of the ladder are requests, not guarantees, because the vendor
ladders differ in length: `off` disables thinking outright on Anthropic but
floors at `minimal` on the OpenAI family (which has no zero setting), and
`xhigh`/`max` clamp down to `high` there for the same reason.

| Level | Meaning |
|---|---|
| `off` | least reasoning the provider allows — fastest and cheapest |
| `low` | minimal reasoning for short, scoped tasks |
| `medium` | balanced reasoning for routine work |
| `high` | thorough reasoning — the provider default |
| `xhigh` | deeper reasoning, best for coding and agentic work |
| `max` | maximum reasoning when correctness beats cost |

Agents, skills, and workflows (including `.claude` / `.opencode` discovery
roots and merge order): [agents-skills.md](/docs/multi-agent). Peer import
inventory: [peer-ecosystem.md](/docs/peer-ecosystem).
