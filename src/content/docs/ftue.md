# First-time setup (`/ftue`)

Guided onboarding from a fresh install to a working first prompt. The wizard
reuses existing host services and modals — it does not invent a second settings
system.

## When it opens

On a **clean install**, the interactive TUI auto-opens `/ftue` once until you
**Finish** or **dismiss** (Esc). State is versioned in:

```json
// ~/.strike/onboarding.json
{
  "version": 1,
  "acknowledged": true
}
```

| Situation | Behavior |
|---|---|
| Missing file or `acknowledged: false` on a clean install | Auto-open `/ftue` |
| Finish or dismiss | Sets `acknowledged: true` atomically |
| Interrupted session (never finish/dismiss) | Stays unacknowledged — wizard can reopen next launch |
| Established install (session logs or real provider credentials) | Migrates to acknowledged **without** a surprise modal |
| Empty precreated `~/.strike` only | Does **not** suppress first launch |
| `strike exec`, `auth`, `serve`, `version`, `upgrade` | Neither display nor write onboarding state |

Manual `/ftue` remains available after acknowledgement anytime.

## Wizard steps

Opening the wizard does **not** change settings by itself. Child pickers, the
tour, and preset selection return to the same wizard step.

1. **Provider** — connect / pick a provider (same flows as `/provider` /
   `/auth`)
2. **Model** — pick a model for the current provider
3. **Optional `/init`** — create or update project `AGENTS.md` (confirm before
   replace)
4. **Feature tour** (skippable) — panes, agents/subagents, permissions,
   autonomy, key help, command discovery. Copy uses **live keybinds**, omits
   unavailable surfaces, stays readable at 80×24, and never mutates settings or
   arms timers
5. **Scheduler presets** (optional checkboxes) — shipped build-system catalog
   (CMake, Ninja, Gradle, Bazel, Maven, Cargo, npm/yarn/pnpm/bun). Preview
   shows limits and command rules; apply writes global `scheduler.presets`
   atomically and preserves custom `limits` / `commands`; skip leaves config
   unchanged; re-runs are idempotent. Details: [Scheduler](/docs/scheduler)
6. **Ready** — first-prompt guidance; **Finish** focuses the composer

Esc dismisses and still acknowledges global onboarding so auto-open does not
repeat.

## Day-to-day

```
/ftue     # re-run the full guided setup
/init     # project AGENTS.md only
/provider /model /auth   # same pieces outside the wizard
```

A fresh empty transcript also shows a dashboard with keybindings and
get-started rows when no provider is ready; first-run copy mentions `/init`.
See [Usage](/docs/usage) and [Quickstart](/docs/quickstart).

## Related

- [Quickstart](/docs/quickstart) — install → first session
- [Auth](/docs/auth) — credentials and OAuth
- [Config](/docs/config) — onboarding file + defaults
- [Scheduler](/docs/scheduler) — what presets configure
- [Sandbox](/docs/sandbox) — OS isolation dial (not part of the wizard)
