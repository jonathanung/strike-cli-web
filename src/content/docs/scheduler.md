# Scheduler

In-process resource limits so concurrent agent work does not thrash the
machine. Bounds apply **inside one Strike OS process**. Separate `strike`
programs do **not** coordinate leases or share capacity — each process applies
its own effective limits independently.

This is **not** [`/loop`](/docs/loop) (session-scoped recurring LLM jobs on a
wall-clock interval). The scheduler caps concurrent bash and model streams;
`/loop` fires prompts on a timer.

## Named pools

| Pool | Typical use |
|---|---|
| `process` | Every bash admission (base concurrency) |
| `build` | Classified build commands (in addition to `process`) |
| `test` | Classified test commands (in addition to `process`) |
| `model` | Provider stream attempts (turns, children, compaction summarize, …) |
| `container` | Reserved for container-class work |

Omitted pools stay **unlimited** (same as pre-scheduler behavior). An explicit
`0` or negative capacity **fails config load** — use omission for unlimited,
not zero.

## Config

Under `scheduler` in global and/or project config ([Config](/docs/config)):

| Field | Meaning |
|---|---|
| `presets` | Ordered list of shipped build-system preset IDs |
| `limits` | Map of pool name → positive integer capacity |
| `commands` | Ordered `{ "pattern", "class" }` classification rules |

**Layering:** project `limits` override global **per pool**. `presets` and
`commands` concatenate (global then project; duplicate preset IDs keep the
first). Malformed patterns, unknown classes, or unknown/duplicate preset IDs
fail load before the engine starts and name the source file and index.

```json
// ~/.strike/config
{
  "scheduler": {
    "presets": ["cargo"],
    "limits": { "process": 8, "build": 2 },
    "commands": [
      { "pattern": "go *", "class": "build" }
    ]
  }
}

// ./.strike/config
{
  "scheduler": {
    "limits": { "build": 4, "test": 2 },
    "commands": [
      { "pattern": "go test *", "class": "test" },
      { "pattern": "cargo test *", "class": "general" }
    ]
  }
}
```

Effective example: `process=8`, `build=4` (project overlays), `test=2`, other
pools unlimited. `cargo build` → `build` (preset); `cargo test --lib` →
`general` (project rule wins); `go test ./...` → `test`; `go build .` →
`build`.

## Presets

Versioned bundles for common resource-heavy tools. At compile time each
selected ID expands into ordinary suggested `limits` and `commands` (no second
runtime matcher). Expansion order follows the shipped catalog among selected
IDs (not the order written in config). Then:

1. User/project `limits` overlay preset-suggested capacities per pool
2. User/project `commands` append after expanded preset rules (last-match-wins,
   so a later user rule can reclassify a preset pattern)

Shipped preset IDs: `cmake`, `ninja`, `gradle`, `bazel`, `maven`, `cargo`,
`npm` (covers npm / yarn / pnpm / bun).

The [`/ftue`](/docs/ftue) wizard can checkbox-select these presets and write the
global `presets` list atomically (custom `limits` / `commands` are preserved;
skip leaves config unchanged).

## Command classification

Each rule's `pattern` is a full-string glob over the submitted shell command
(`*` = any run of runes, `?` = one rune, `\` escapes the next byte). Matching
is case-sensitive. `class` is `general` | `build` | `test`.

Evaluation is **last-match-wins**. When nothing matches, the class is
`general`.

## Admission

Fair, cancellable `Acquire` with layered multi-pool leases (waiters never hold
partial grants, so multi-pool acquire cannot deadlock):

- **Model streams** acquire the `model` pool for each `Provider.Stream`
  attempt. The lease is released when the stream is fully drained, before retry
  backoff, and reacquired fairly on the next attempt.
- **Bash** acquires `process` after permission approval and before process
  start (command timeout begins after admission). `build` / `test` classes
  acquire those pools in addition.

Omitted / unlimited capacity means no wait.

## Queue UI

When a caller **blocks** on capacity, the engine emits protocol events:

| Event | When |
|---|---|
| `scheduler.queued` | Waiting on capacity (`requestId`, constrained `pools`, short `label`) |
| `scheduler.admitted` | Lease granted (`waitMs`) |
| `scheduler.canceled` | Cancel or scheduler close (`reason` `canceled` \| `closed`) |

Immediate grants (unlimited pools or free capacity) emit **no** queue events,
so default sessions stay quiet. After `canceled` for a `requestId`, `admitted`
never follows.

Exact queue **positions are not on the wire** — FIFO is internal and may
change. The TUI activity / agents panes show pool and label only (no “you are
#3” guarantees). Session JSONL replay reconstructs queued→admitted or
queued→canceled so waiting roots/children are not mistaken for idle.

## vs `/loop`

| | Scheduler | `/loop` |
|---|---|---|
| Purpose | Cap concurrent bash / model work | Fire a prompt on an interval |
| Scope | One OS process | One TUI session |
| Persistence | Config (`scheduler`) | Session memory only |
| UI | Queue chips when blocked | Loop list / stop commands |

See [Loop](/docs/loop) for recurring jobs and [Goal](/docs/goal) for criteria
harnesses.

## Related

- [Config](/docs/config) — `scheduler` field placement
- [First-time setup](/docs/ftue) — optional preset checkboxes
- [Sandbox](/docs/sandbox) — OS isolation (orthogonal to concurrency)
- [Usage](/docs/usage) — day-to-day TUI commands
