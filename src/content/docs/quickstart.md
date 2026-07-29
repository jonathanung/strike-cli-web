# Quickstart

Get Strike running in a few minutes. For full detail see [Install](/docs/install),
[Usage](/docs/usage), and [Auth](/docs/auth).

## 1. Install

```sh
curl -fsSL https://strike.jonathanung.ca/install | bash
```

The installer downloads the latest [GitHub Release](https://github.com/jonathanung/strike/releases),
verifies checksums, and places the binary at `~/.strike/bin/strike` (no root).

Open a new shell (or `export PATH="$HOME/.strike/bin:$PATH"`), then:

```sh
strike version
```

macOS and Linux (arm64 / amd64) are supported. Nix: `nix run github:jonathanung/strike`.
Details, PATH options, upgrade, and uninstall: [Install](/docs/install).

## 2. Authenticate a provider

Strike can launch without credentials; pick a provider in the TUI or log in first:

```sh
strike auth login anthropic   # or openai / xai / google / kimi / deepseek
# or set ANTHROPIC_API_KEY / OPENAI_API_KEY / XAI_API_KEY /
#     GEMINI_API_KEY|GOOGLE_API_KEY / KIMI_API_KEY / DEEPSEEK_API_KEY
```

Built-ins: Anthropic, OpenAI, xAI, Google, Kimi, DeepSeek, plus custom endpoints
via `providers.jsonc`. Credentials live in `~/.strike/auth.json`. See [Auth](/docs/auth).

## 3. Launch the TUI

```sh
strike
# optional pins:
strike --provider anthropic --model <id>
```

In the TUI:

| Action | How |
|---|---|
| Send message | Enter |
| Newline | Shift+Enter |
| Interrupt | Esc |
| Jump to latest output | Ctrl+T |
| Quit | Ctrl+C |
| Provider / model / auth | `/provider`, `/model`, `/auth` |
| Permission mode | Shift+Tab or `/mode` |
| Help | `/help` |
| Keybind cheatsheet | `F1` or `/keys` |

Attach project files with `@path`. Full slash-command list: [Usage](/docs/usage).
Keyboard reference: [Keybinds](/docs/keybinds).

## 4. Resume and headless runs

```sh
strike --continue                 # resume last root session
strike --session <id>             # resume a specific session
strike exec "summarize this repo" # headless one-shot → stdout
```

Sessions are JSONL event logs under `~/.strike`. Fork / undo / rewind:
`/fork`, `/undo`, `/rewind` — see [Usage](/docs/usage).

## 5. Agents and multi-agent work

Tab cycles agents (`build`, `plan`, `explore`, …). Use `/agent` to pick one.
Skills and custom personas load from `~/.strike` and the project. Deep dive:
[Multi-agent](/docs/multi-agent). Goal harness: [Goal](/docs/goal). Recurring jobs:
[Loop](/docs/loop).

## 6. Optional: web cockpit

```sh
strike serve --addr 127.0.0.1:8787 --token <secret>
# open http://127.0.0.1:8787/attach?token=<secret>
```

Experimental browser UI; the TUI remains primary. See [Web](/docs/web).

## Next steps

- [Config](/docs/config) — permissions, models, MCP, providers
- [Editors](/docs/editors) — `/vim`, `/nano`, `/md-read` presentation
- [MCP](/docs/mcp) — stdio + streamable HTTP tools
- [Theme](/docs/theme) — TUI chrome and color themes
- [Multi-agent](/docs/multi-agent) — agents, skills, discovery roots
- [Keybinds](/docs/keybinds) — full keyboard map

Build from source (Go 1.26+): clone [jonathanung/strike](https://github.com/jonathanung/strike),
then `make setup && make build && make run-echo`.
