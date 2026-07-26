---
name: test-and-validate
description: Use when running build, typecheck, validation, CI checks, Docker smoke, or verifying strike-cli-web changes. Trigger on `npm run build`, preview, lint/test if present, Docker, verify, validate, or before claiming work done.
---

# Test and validate (strike-cli-web)

Read-only verification skill for the **strike-cli-web** marketing site. Observe and report — do not fix failures here. Implementation fixes belong to the caller (e.g. `issue-handler`).

There is **no required unit-test suite** today. `package.json` scripts are `dev`, `build`, and `preview`. CI runs `npm run test --if-present` and `npm run lint --if-present` so missing scripts are not failures.

## Commands

| Check | Command |
|---|---|
| Install (CI-equivalent) | `npm ci` |
| Typecheck + production build | `npm run build` (`tsc -b && vite build`) |
| Dev server | `npm run dev` |
| Preview production build | `npm run preview` |
| Tests (if script exists) | `npm run test --if-present` |
| Lint (if script exists) | `npm run lint --if-present` |
| Docker image | `docker build -t strike-cli-web .` |
| Compose (site on :8080) | `docker compose up --build` |
| `/install` proxy smoke (container up) | `curl -fsSL -o /dev/null -w "%{http_code}\n" http://localhost:8080/install` then optionally `curl -fsSL http://localhost:8080/install \| head` — body should be the install script, **not** an HTML redirect |

Prefer project npm scripts and documented Docker entrypoints over inventing new tooling.

## CI note

Workflow: **`.github/workflows/ci-cd.yml`**

| Job | When | What |
|---|---|---|
| **build** | push/PR to `main` | Node 22 → `npm ci` → `npm run build` → `test`/`lint` if-present |
| **deploy** | push to `main` only (not PRs) | SSH to droplet, `git pull`, `docker-compose up -d --build` |

**Validators do not deploy.** Never run deploy steps, touch droplet secrets, or merge solely to “test deploy” as part of this skill.

## Required workflow

1. **Diff** — `git diff` / changed paths; note UI vs infra vs copy-only.
2. **Build** — always `npm run build` for TypeScript or `src/` changes (and before claiming done).
3. **Optional test/lint** — `npm run test --if-present` and `npm run lint --if-present` (matches CI).
4. **Docker** — when `Dockerfile`, `docker-compose.yml`, `nginx.conf`, or install-proxy behavior changed: build image and/or `docker compose up --build`, then smoke `/` and `/install`.
5. **Visual** — when Hero, layout, motion, tokens, or section composition changed: `npm run dev` or `npm run preview` and sanity-check the affected sections (and reduced-motion if animations changed).

Fresh clone / clean CI parity: run `npm ci` before build when `node_modules` may be stale or missing.

## Report format

1. **Verdict** — pass / fail (and what was green).
2. **Commands run** — exact shell lines.
3. **Failures** — verbatim output, never paraphrased.
4. **Gaps** — surfaces not exercised and why (e.g. “Docker not run — only `Features.tsx` copy changed”).

## Risk map (marketing site)

| Surface | Higher risk signals |
|---|---|
| `InstallCommand.tsx` / `INSTALL_COMMAND` | Wrong install URL; duplicated string vs HappyPath; copy UX / a11y |
| `nginx.conf` `/install` | Must **proxy** (not redirect) to CLI `install.sh`; curl\|bash breaks on 3xx HTML |
| `Dockerfile` / `docker-compose.yml` | Broken static serve, wrong port map (`8080:80`), missing nginx config |
| `src/index.css` | Token regressions, contrast, reduced-motion utilities, global focus styles |
| `Section.tsx` | Anchor scroll offset, width (`narrow` vs default), layout overflow |
| `CodeBlock.tsx` | Overflow, mono readability, label chrome |
| `Hero` / `HeroCarousel` | LCP-ish visuals, motion, carousel a11y |
| `HappyPath.tsx` | Animation timers, `INSTALL_COMMAND` import, reduced motion |
| `Demos.tsx` / `public/demos/` | Broken image paths, missing alts, placeholder vs real GIFs |
| `src/lib/copy.ts` | Clipboard failures in non-secure contexts; error paths |
| `src/App.tsx` | Section order, missing imports, structure regressions |
| `.github/workflows/ci-cd.yml` | Node version, deploy `if:` guard, secret usage — PRs must not deploy |
| Marketing copy constants | Stale product claims, broken external links (GitHub, live site) |

## Rules

- Never edit source, config, or tests to make verification green.
- Never skip a failing command without marking **FAIL** and pasting output.
- Never deploy or use production SSH secrets as part of validation.
- Prefer `npm run build` as the default gate; add Docker when infra is in the diff.
- If no test/lint script exists, report that as a **Gap**, not a failure.

## Do not

- Implement fixes inside this skill (report only).
- Claim “CI green” without running local build (and Docker when infra-touched) or without reading actual `gh pr checks` / Actions output when babysitting a PR.
- Run or approve production deploy from a validation pass.
- Invent Go/Makefile gates from the CLI product repo — this is the web marketing site.
