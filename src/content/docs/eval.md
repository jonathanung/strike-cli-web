# Eval

Internal regression runners for fixed benchmark subsets and config dial
matrices. **Do not publish pass rates in the product README** (SWE-ABS caveat).

```bash
strike eval swebench …   # SWE-bench Verified subset (#561)
strike eval tbench …     # Terminal-Bench 2 subset (#562)
strike eval sweep …      # parameter matrix over either benchmark (#563)
```

Offline progressive-disclosure fixtures (no Docker / no live model):

```bash
go test ./internal/eval/progressive -count=1 -v
```

## SWE-bench Verified subset

Fixed **50-instance** slice of
[SWE-bench Verified](https://huggingface.co/datasets/SWE-bench/SWE-bench_Verified).
Docker-per-instance workspace, `strike exec --json` agent driver, patch
extraction, graders: `docker` / `harness` / `none`.

```bash
# List committed subset ids
strike eval swebench --subset-only

# Wiring check (no Docker / no model calls)
strike eval swebench --dry-run --grader none --out /tmp/swe-dry

# Real run
strike eval swebench \
  --provider anthropic \
  --model claude-sonnet-4-20250514 \
  --grader docker \
  --out evals/swebench/results/$(date -u +%Y%m%dT%H%M%SZ)
```

Optional local dataset export avoids HuggingFace fetch at start:

```bash
strike eval swebench --dataset /path/to/verified.jsonl ...
```

Official harness grading (when `pip install swebench` is available):

```bash
strike eval swebench --grader harness ...
```

**Outputs** (per run):

| File | Contents |
|---|---|
| `report.json` | Versioned metrics (pass rate, tokens, cost, wall-clock) |
| `predictions.jsonl` | SWE-bench prediction rows for external re-grade |

Commit `report.json` copies under `evals/swebench/results/` for trend history.

**Config overlays:**

```bash
strike eval swebench --config-json '{"leanCode":"full","deferTools":"on"}' ...
strike eval swebench --exec-arg '--sandbox=off' ...
```

## Terminal-Bench subset

Fixed **25-task** slice of
[Terminal-Bench 2](https://github.com/harbor-framework/terminal-bench-2)
(Harbor task format). Same harness shape as SWE-bench.

| Field | Value |
|---|---|
| Pack | `harbor-framework/terminal-bench-2` |
| Image tag | `20251031` (`alexgshaw/<task>:20251031`) |
| Subset | SHA-256(`strike-e3.4-v1:`+id) order, first 25 |

```bash
git clone --depth 1 https://github.com/harbor-framework/terminal-bench-2.git /path/to/tb2

strike eval tbench --subset-only
strike eval tbench --dry-run --grader none --out /tmp/tb-dry

strike eval tbench \
  --tasks-dir /path/to/tb2 \
  --provider anthropic \
  --model claude-sonnet-4-20250514 \
  --grader docker \
  --out evals/tbench/results/$(date -u +%Y%m%dT%H%M%SZ)
```

**How it works:**

1. Materialize `/app` from the task image onto the host
2. Drive `strike exec --json --auto` in that workspace
3. Grade: fresh container → copy workspace + `tests/` → `bash /tests/test.sh` →
   read `/logs/verifier/reward.txt` (or `reward.json`)

**Outputs:** `report.json` (pass rate, tokens, cost, wall-clock, reward).

## Parameter sweeps

Compare config dials on a fixed eval subset. Each matrix point runs the subset
once with a project-layer `.strike/config` overlay (and optional
`strike exec --effort`).

### Builtin matrices

| Name | Points |
|---|---|
| `compaction` | baseline / tight / loose / aggressive-prune |
| `leanCode` | `off` \| `lite` \| `full` |
| `deferTools` | `off` \| `on` |
| `effort` | `off` \| `low` \| `medium` \| `high` (via `--effort`) |
| `all` | concatenation of the above (default) |

```bash
strike eval sweep --matrix leanCode --list-points

strike eval sweep \
  --benchmark swebench \
  --matrix deferTools \
  --dry-run \
  --limit 2 \
  --grader none \
  --out /tmp/sweep-dry

strike eval sweep \
  --benchmark swebench \
  --matrix compaction \
  --provider anthropic \
  --model claude-sonnet-4-20250514 \
  --limit 10 \
  --out evals/sweep/results/$(date -u +%Y%m%dT%H%M%SZ)

strike eval sweep \
  --benchmark tbench \
  --tasks-dir /path/to/tb2 \
  --matrix leanCode \
  --provider anthropic \
  --model claude-sonnet-4-20250514
```

**Outputs:** `summary.json` comparison table plus `<point-id>/report.json` per
point. Overlays write to `<workspace>/.strike/config` before `strike exec`
(SWE-bench patch extraction excludes `.strike/`).

## Progressive tool disclosure (offline)

Compares **full** tool exposure (`deferTools=off`) vs **progressive** disclosure
(`deferTools=on`, the shipped default after epic
[#993](https://github.com/jonathanung/strike/issues/993)).

| Metric | Meaning |
|---|---|
| First-turn tool count | Tools bound on the first provider request |
| First-turn schema tokens | Rough `chars/4` estimate of name+description+JSON schema |
| Toolsearch calls | Discovery round-trips |
| Invalid / redundant tool calls | Error settlements and repeated failures |
| Completion | Fixture success predicate (solo / plan / multi-agent) |
| Wall time | Fixture duration (ms) |

```bash
go test ./internal/eval/progressive -count=1 -v

strike eval sweep --benchmark swebench --matrix deferTools --dry-run --limit 2 --grader none --out /tmp/sweep-defer
```

**Rollback criterion** (permanent default gate): progressive stays default
unless completion drops by more than **5 absolute points** or median wall time
rises by more than **+25%** vs full exposure on the fixture pack. Schema
reduction below 30% on solo first-turn is a soft warning only.

See [Config](/docs/config) (deferred tools, progressive `task`, workflow
activation) and [Usage](/docs/usage).



## Repeated-trial metrics (pass@k)

Eval point metrics can include repeated-trial statistics when a case is run
multiple times:

| Field | Meaning |
|---|---|
| `pass@k` | Probability at least one of k trials succeeds |
| `pass^k` | Probability all k trials succeed |
| `flakiness` | Trial-to-trial instability signal |
| `confidenceN` | Effective sample size for the estimate |

These appear on `PointMetrics` / report JSON when trials are configured. Still
**internal signal only** — do not publish pass rates in product marketing.

## Related

- [Config](/docs/config) — `deferTools`, `leanCode`, compaction, sandbox dials
- [Multi-agent](/docs/multi-agent) — progressive `task` and orchestration
- [Contributing](https://github.com/jonathanung/strike/blob/main/docs/contributing.md) — `make swebench-eval` and CI notes
