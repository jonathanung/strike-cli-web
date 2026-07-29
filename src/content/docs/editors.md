# Editors

Embedded and modal editors for files and markdown inside the TUI — not a
separate IDE. Configure presentation with `vimMode`, `nanoMode`, and
`mdReadMode` in [Config](/docs/config); change defaults via `/settings`.

Editor and markdown-reader surfaces share a presentation vocabulary:
**embedded** (right-pane chrome) vs **modal** (large centered overlay with
background scrim). Prefer those names for new config; legacy aliases remain.

### Embedded editor (`vimMode`)

`/vim [path|@path[:line]]` opens a file in an editor resolved from `$VISUAL` →
`$EDITOR` → nvim/vim/vi/nano on `PATH`. `vimMode` selects how:

| Value | Aliases | Behavior |
|---|---|---|
| `pane` (default) | `embedded` | embed the editor in the right-pane `editor` window (PTY) |
| `overlay` | `modal` | large modal popout with background scrim |
| `takeover` | — | full-screen handoff via `tea.ExecProcess` |

Unknown values are ignored at load time. GUI `$EDITOR` values always take
over the terminal regardless of `vimMode`. Leave the embedded/modal editor
with `ctrl+g`.

### Nano (`nanoMode`)

`/nano [path|@path[:line]]` opens **nano** specifically (does not use `$VISUAL`/
`$EDITOR`). `nanoMode` uses the same values and aliases as `vimMode`
(default `pane`/`embedded`). Missing `nano` on `PATH` shows a clear error.
Leave the embedded/modal editor with `ctrl+g`.

### Markdown reader (`mdReadMode`)

`/md-read <path|@path>` opens a markdown file. `mdReadMode` selects how:

| Value | Aliases | Behavior |
|---|---|---|
| `embedded` (default) | `pane` | right-pane `markdown` window |
| `modal` | `overlay` | large modal popout with background scrim |

Unknown values are ignored at load time. Dismiss the modal with `esc`, `q`,
or `ctrl+g`. Preference is read from config at session start (global then
project merge).
