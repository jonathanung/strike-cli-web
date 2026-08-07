# Checkpoints

Per-turn file snapshots power `/undo` so you can drop the last model turn and
optionally restore workspace files — without `git reset --hard`.

## Commands

| Command | Behavior |
|---|---|
| `/undo` | Idle only. Bare opens a picker with **path preview** (create/update/delete from the last turn), **skipped-file count**, and coverage warnings |
| `/undo chat` | Drop the last turn from history only (disk unchanged) |
| `/undo files` | Drop the last turn **and** restore snapshotted files from that turn |
| `/rewind` | Fork a **new** session from a completed turn (original stays listable). Does **not** revert workspace files — use `/undo files` on the live session |

## What is snapshotted

Harness file tools (`write`, `edit`, `apply_patch`, `move`, `delete`,
`notebook_edit`, …) capture pre-mutation bytes before they change the tree.

| Limit | Detail |
|---|---|
| Size cap | Files over **2 MiB** (`DefaultCheckpointMaxBytes`) are skipped and counted |
| Unreadable | Missing/unreadable originals are skipped and counted |
| Restore | Per-file write-back or remove created paths — never `git reset --hard` |

## Bash coverage (shadow-git)

Bash (and similar non-snapshotted tools) used to leave turns *uncovered*: file
restore still ran for harness tools, but shell side effects (formatters,
codegen, `sed -i`, `go generate`, …) could remain.

Strike now covers bash-driven mutations with a **per-session shadow-git
baseline** reconciled at turn end:

1. Before bash mutates the tree, a lightweight shadow baseline records the
   worktree state for the session.
2. At turn end, changed paths are folded into the turn checkpoint.
3. If shadow-git is unavailable, the turn is marked **uncovered** and the undo
   notice warns that shell changes may remain.

Directory deletes and other gaps may still mark a turn uncovered so the UI stays
honest.

## Persistence across `--continue`

Checkpoint stacks live under:

```text
~/.strike/checkpoints/<session-id>/
```

| Property | Behavior |
|---|---|
| Resume | `strike --continue` / `/session <id>` reloads the stack so `/undo files` still works |
| Retention | Last **50** turns kept |
| Cleanup | Removed with the session (destroy / retention) |

This is separate from:

- Human-readable markdown `/export` ([Usage](/docs/usage))
- Machine-readable session packages in `internal/session`
- Multi-agent run snapshots under `~/.strike/runs/`

## Honesty rules

- Undo never claims full success when the turn was **uncovered**.
- Skipped oversized/unreadable files are counted in the picker and notice.
- `/rewind` is lineage-only for chat history; file restore is always `/undo files`.

## Related

- [Usage](/docs/usage) — full slash-command table and UI
- [Config](/docs/config) — session retention and durability dials
- [Multi-agent](/docs/multi-agent) — child handoffs and path ownership
