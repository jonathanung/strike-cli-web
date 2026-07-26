---
name: issue-orchestrator
description: Drive open GitHub issues on strike-cli-web to merge via parallel worktrees — parse wave/depends/blocks/conflicts headers, dispatch issue-handler agents, prefer bugs-first, never parallelize conflicting issues. Use when asked to orchestrate issues, farm the backlog, run the issue board, or coordinate multiple agents on GitHub issues.
---

# Issue orchestrator (strike-cli-web)

You coordinate **many** issues on the **strike-cli-web** marketing site. You do **not** implement feature code in the primary checkout. Each shippable unit is owned by an **issue-handler** agent (or you acting as handler for a single issue) inside its own git worktree under `strike-cli-web-worktrees`.

## When to use

- User asks to orchestrate / farm / drain open issues
- User wants parallel agents on the backlog
- After filing a wave of issues and wanting them driven to `main`

## Source of truth

```sh
gh issue list --state open --limit 100
gh issue view N
gh pr list --state open
git fetch origin main
git worktree list
```

### Issue body headers (machine-readable)

Issues should start with:

```text
wave: N
depends: none | #a #b
blocks: none | #c #d
conflicts: none | #e #f
priority: bugs-first | feature
```

| Field | Meaning |
|---|---|
| `wave` | Lower ships first. Wave 0 = bugs / broken site baseline. |
| `depends` | All listed issues must be **CLOSED** before start |
| `conflicts` | Do not run in parallel with these (shared files / same agent) |
| `blocks` | What this unlocks (scheduling hint) |
| `priority` | `bugs-first` before `feature` within the same wave |

Closed `depends` count as satisfied. Missing headers: treat as `wave: 99`, `depends: none`, `conflicts: none`, `priority: feature` and prefer issues that have proper headers.

## Sibling skills

| Skill | Role |
|---|---|
| `issue-handler` | One issue → worktree → implement → validate → PR → **review-agent loop** → CI → merge → cleanup |
| `test-and-validate` | Verification report format / build gates |
| `web-components` | UI/sections/tokens/motion work inside a handler |

Orchestrator **dispatches handlers**; handlers load domain skills. Do not dispatch obsolete CLI-only skills.

## Priority order

1. **Wave 0** (`priority: bugs-first`) until none remain open  
2. Lowest open `wave` with `depends` satisfied  
3. Within a wave: `bugs-first`, then issues that unlock the most open `blocks`, then lowest number  

**Bugs-first** on this site means: broken `npm run build`, broken `/install` proxy, deploy/CI breakage, severe a11y or layout breakage — before pure polish, copy tweaks, or net-new marketing sections.

Do **not** start large features while wave-0 bugs that touch the same surface are open, unless the user overrides.

## Conflict rules

- If A lists B under `conflicts` (or vice versa), **at most one** of A/B may be in-progress (open PR or active worktree) at a time.
- Same-file hotspots without headers — serialize when both touch:
  - `src/index.css` (design tokens / global utilities)
  - `src/App.tsx` (section composition order)
  - `src/components/InstallCommand.tsx` / `INSTALL_COMMAND` (and consumers like HappyPath)
  - `nginx.conf` (especially `/install` proxy)
  - `.github/workflows/ci-cd.yml`
- Prefer explicit `conflicts` on new issues that share those paths.
- Multi-issue “cluster” (e.g. all install-CTA bugs): **one worktree / one handler** for the whole cluster when they conflict with each other.

## Ready set

An issue is **ready** when all are true:

- state `OPEN`
- every `depends` issue is `CLOSED` (or not listed)
- none of `conflicts` are in-progress (open PR titled/body `Fixes #N`, or worktree branch `worktree-*N*` / clearly for that issue)
- `wave` is the current minimum eligible wave (or user pinned this issue)
- no open PR already fixing it (attach/babysit that PR instead of duplicating)

## Dispatch

For each ready issue (up to a sensible parallelism cap, default **4** unless user says otherwise):

1. Spawn or instruct an agent to load **`issue-handler`** with the issue number.
2. Handler must: worktree off `origin/main` under `strike-cli-web-worktrees`, implement, validate per `test-and-validate` / `web-components`, PR `Fixes #N`, review loop, CI, merge, cleanup.
3. Orchestrator tracks: issue → branch → PR URL → status (`queued` / `in_progress` / `review` / `merged` / `blocked`).

Do **not** implement production code in the primary checkout as the orchestrator.

## Orchestrator loop

```text
loop:
  1. Refresh issues, PRs, worktrees, origin/main
  2. Build ready set
  3. Fill free slots with highest-priority ready issues
  4. For in-flight PRs: ensure handler/review/CI progress; re-dispatch handler if stalled
  5. On merge: mark done, unlock dependents, pull main awareness
  6. On block: comment on issue, mark blocked, free the slot
  7. Exit when no open issues left, or user stops, or only blocked remain
```

### Stalls

- CI red > reasonable time → handler fixes or orchestrator assigns handler to that PR  
- Review loop > 5 passes → stop-and-ask per issue-handler  
- Merge conflict with main → handler merges `origin/main` in worktree  
- Ambiguous product/design decision → comment on issue + stop that lane  

## Reporting

Lead with board status:

```text
Wave 0: done | in flight | blocked
Ready: #N #M
In flight: #N → PR URL
Blocked: #N (reason)
Next: #N (why)
```

Do not claim “all green” without `gh pr checks` / issue state.

## Hard rules

1. Bugs (`wave: 0`, `bugs-first`) before features when both are open.  
2. Never parallelize `conflicts`.  
3. Never duplicate an existing open PR for the same issue.  
4. Never force-push `main`; never commit secrets.  
5. Handlers own merge gates (review + CI); orchestrator does not merge over failing checks.  
6. `.plan/` is optional research for handlers — orchestrator schedules **GitHub issues**, not an unscoped roadmap file.  
7. Stop-and-ask when `gh` auth fails, user must choose between conflicting product directions, or only blocked issues remain.  
8. Stay on strike-cli-web scope — do not farm Go CLI product work into this repo’s board.

## What this skill is not

- Not a substitute for `issue-handler` on a single issue (use handler directly)
- Not an implementer of unscoped roadmap items without issues
- Not a requirement to max out parallel agents if conflicts forbid it
- Not a production deploy babysitter (merge to main triggers Actions deploy; orchestrator does not SSH to the droplet)
