# Containers

Native **Docker/Podman** isolation for the agent runtime (epic E12 / #547).
Strike shells out to `docker` or `podman` — it does not vendor the Moby SDK.
One managed container per repo; multiple sessions **attach** rather than
spawning duplicates.

Containers compose with the [OS sandbox](/docs/sandbox), session worktrees, and
[scheduler](/docs/scheduler) pools. None replaces the others.

Layer map: [Isolation](/docs/isolation). Upstream design notes may also live on
the CLI repo under `docs/` when present.

## When to use

| Goal | Prefer |
|---|---|
| Day-to-day coding on the host | [Sandbox](/docs/sandbox) `workspace-write` + permissions |
| Reproducible project toolchain (Node/Go/Python/Rust images) | Container execution |
| Full host isolation for untrusted work | Container + tight `network.mode` / allowlists |
| Concurrent bash/model caps only | [Scheduler](/docs/scheduler) (not a security boundary) |

## Prerequisites

- `docker` or `podman` on `PATH` (or set `container.engine`)
- Engine daemon reachable (`docker info` / `podman info`)
- A Dockerfile: ejected `Dockerfile.devcontainer` and/or config-driven build

## Launch inside the container

```sh
strike --launch-inside-container
# or config:
# "container": { "execution": "container" }
```

On success Strike builds/starts the managed container (or attaches), copies the
host `strike` binary in, and `docker exec -it` with the workspace mount and
forwarded credential env. Nested launch is refused via `STRIKE_ISOLATION`.

### Preflight failures

| Code | Meaning |
|---|---|
| `already_inside_container` | Nested launch refused |
| `engine_not_found` | No docker/podman binary |
| `engine_unavailable` | Daemon not reachable |
| `no_dockerfile` | Nothing to build from |
| `dockerfile_drift` | Ejected file out of date with config hash |
| `required_env` | Missing required forwarded env |

### Attach vs rebuild

One container name per repo: `strike-<repo>-<sha256[:16]>`.

```sh
strike --launch-inside-container
# stale live container (interactive): attach [a] / rebuild [r] / cancel [c]

strike --launch-inside-container --container-attach-stale
strike --launch-inside-container --container-rebuild
strike --launch-inside-container --container-cancel   # non-interactive refuse
```

Launch prints e.g. `strike: attached to existing container …`. Modes:
`attached` | `started` | `restarted` | `rebuilt`.

```sh
strike container ls            # this repo + live state
strike container ls --all      # every com.strike.managed container
strike container status        # running + config-hash compatibility
```

## Eject Dockerfile

Materialize a commit-friendly Dockerfile from config:

```sh
strike container eject [--out Dockerfile.devcontainer] [--force] [--dockerfile path]
strike container drift [--dockerfile path]
```

- Default output: `Dockerfile.devcontainer` with a `# strike-config-hash:` header.
- Drift refuses overwrite unless `--force`.
- `--dockerfile` uses a hand-edited body while still stamping the hash.
- Manager prefers the ejected file when present.

## Scaffold with `/devcontainer`

Built-in skill plus CLI detect:

```sh
strike container detect          # human summary
strike container detect --json   # markers + suggested config fragment
```

Detection reads common markers (`go.mod`, `package.json`, Python/Cargo/Nix
files, `Makefile`, …). The skill asks (base image, deps, network, resources),
writes `.strike/container.json`, shows the Dockerfile diff, then runs eject.

## Config

Layered like the rest of Strike: **defaults → global → project → managed**.

| Source | Path |
|---|---|
| Inline | `"container": { … }` in `~/.strike/config` or `./.strike/config` |
| Dedicated file | `container.jsonc` / `container.json` under the same `.strike` roots |

```jsonc
{
  "container": {
    "execution": "local",           // or "container"
    "baseImage": "ubuntu:24.04",
    "packages": [],
    "shell": "/bin/bash",
    "resources": {
      "memory": "",
      "cpus": "",
      "pidsLimit": 512,
      "gpus": ""
    },
    "workspace": {
      "mountPath": "/workspace",
      "ports": [],
      "persistHome": true
    },
    "auth": {
      "forwardEnv": ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "STRIKE_*"],
      "forwardSSHAgent": false
    },
    "network": { "mode": "default", "allow": [] },
    "engine": "",                   // docker | podman | absolute path
    "needsNode": false,
    "nodeVersion": 22,
    "needsPython": false,
    "needsGo": false,
    "needsRust": false
  }
}
```

| Field | Meaning |
|---|---|
| `execution` | `local` (default) or `container` |
| `baseImage` | Dockerfile `FROM` |
| `packages` | Extra apt packages at build |
| `resources` | memory / cpus / pids / gpus → create flags |
| `workspace` | mount path, ports (`host:container`), persist home, extra binds |
| `auth` | `forwardEnv` globs, `envFile`, `requiredEnv`, SSH agent — **never baked into images** |
| `network.mode` | `default` (bridge) or `none` |
| `network.allow` | Reserved container egress shape (same idea as top-level `network.allow`) |
| `dockerfile` | Optional hand-written Dockerfile path |
| `engine` | Override CLI binary |
| `needsNode` / `needsPython` / `needsGo` / `needsRust` | Language toolchain flags for scaffold/eject |

Full field notes: [Config](/docs/config).

## Isolation badge

Descriptive posture ladder (not a grade):

`host+yolo` → `host+default` → `host+sandbox` → `container` → `container+no-network`

- Injected as `STRIKE_ISOLATION` at process/container launch (not via
  `/.dockerenv` alone).
- Header badge (muted) next to the permission dial.
- Full view: `/container`; also `/legend` and the context right-pane row.
- Recorded on `session.meta.isolation` for reproducibility.

OS sandbox and permission mode still apply **inside** the container for bash
tool calls unless you deliberately turn them off.

## Scheduler pool

Pool name `container` is reserved for container-class admission (eval and
related workloads). Set capacity under `scheduler.limits` — see
[Scheduler](/docs/scheduler).

## Honesty notes

- Containers isolate the **runtime environment**; they do not replace
  permission asks or the bash OS sandbox unless you configure those dials.
- Credentials are forwarded as env at launch — never written into image layers.
- Harnesses and process plugin panes remain trusted native executables even
  inside a container unless you further constrain the image.
- Engine selection: explicit `container.engine`, else first of `docker` /
  `podman` on `PATH`.

## Related

- [Sandbox](/docs/sandbox) — OS isolation dial for bash
- [Scheduler](/docs/scheduler) — in-process pools including `container`
- [Config](/docs/config) — `container` block and layering
- [Usage](/docs/usage) — slash commands and header chrome
- [Plugins](/docs/plugins) — contribution packages (orthogonal to containers)
- [Web](/docs/web) — cockpit when serving from a containerized host
