# FAQ

Purchase, trust, and multi-agent questions. Answers should stay honest as the
product changes. The homepage also surfaces this list under [#faq](/#faq).

## How does Strike compare to Claude Code?

Claude Code is Anthropic’s agentic coding CLI — strong if you live in that
ecosystem. Strike is a multi-agent coding cockpit for your terminal: concurrent
sessions and worktrees, a right-pane side panel (agents, activity, files,
memory/issues), and hard permission modes with plan gates. You can still use
Anthropic models via your own keys; Strike is not tied to a single vendor UI.

See also: [Why Strike](/#why-strike) · [Multi-agent](/docs/multi-agent)

## How does Strike compare to Codex?

Codex is OpenAI’s coding agent product. Strike can talk to OpenAI models (API
key or ChatGPT OAuth) but ships as open-source, local-first software you run
yourself — multi-root agents in one TUI, JSONL session history, fork/resume,
and headless `exec` for scripts. You are not buying a separate Strike cloud
seat.

See also: [Why Strike](/#why-strike) · [Auth & providers](/docs/auth)

## How does Strike compare to OpenCode?

OpenCode is a peer open-source coding agent. Strike deliberately loads
compatible agents and skills from OpenCode (and Claude) discovery roots so your
existing markdown personas can come along — but Strike does **not** execute
OpenCode plugin JS/TS. The product bet is the multi-agent cockpit: concurrent
agents, worktrees, permissions, and a live side panel, not a one-to-one clone
of any peer TUI.

See also: [Why Strike](/#why-strike) · [Multi-agent](/docs/multi-agent)

## Do I need a subscription?

No Strike subscription. The CLI is open source. You bring provider credentials —
API keys and/or OAuth for Anthropic, OpenAI, xAI, and custom providers. If you
sign in to OpenAI with ChatGPT OAuth, usage can bill to a ChatGPT Plus/Pro
subscription instead of the platform API; that is optional and provider-side,
not a Strike plan.

See also: [Auth & providers](/docs/auth)

## Where is my data?

Local-first. Session transcripts live as JSONL on your machine; credentials are
stored under `~/.strike` (e.g. `auth.json` with restrictive permissions).
Environment variables always win over stored keys. When you call a model
provider, prompts and tool context go to that provider under their terms —
Strike does not require a Strike-hosted cloud backend for normal TUI use.
Experimental `strike serve` stays loopback by default; LAN expose is opt-in and
token-gated.

See also: [Auth & providers](/docs/auth) · [Web](/docs/web)

## How does multi-agent work?

Agents and skills are markdown (frontmatter + body) discovered from built-in,
user, project, and peer roots (`.strike`, `.claude`, `.opencode`). Tab and
`/agent` switch personas; the `task` tool can delegate to named agents;
workflows chain phases with exit gates. Permissions layer defaults → config →
agent profile so specialists stay read-only or scoped when you want them to.

See also: [Multi-agent](/docs/multi-agent)

## What is the status of the web UI?

The TUI is primary. `strike serve` hosts an **experimental** browser cockpit
that can drive a live engine session or read-only attach to JSONL logs — useful
for attach and LAN experiments, not a replacement for the terminal UI. A fuller
remote/hosted browser experience remains on the roadmap.

See also: [Web](/docs/web) · [Coming soon](/#coming-soon)

## How much does it cost?

Strike itself is free and open source. You pay your model providers for tokens
(and any optional ChatGPT subscription if you choose OAuth billing). There is
no Strike seat fee, usage meter, or required hosted plan — cost is whatever
your keys and providers charge.

See also: [Install](/docs/install) · [Auth & providers](/docs/auth)
