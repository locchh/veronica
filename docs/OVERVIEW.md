# Overview

A suite manager CLI for Claude Code plugins. Instead of accumulating all plugins at once, you define named suites (curated sets of skills, agents, hooks, MCPs, LSP configs) and switch between them on demand via a TUI.

## Core Workflow

1. User runs `veronica` in the terminal
2. TUI presents available suites
3. User selects one
4. Veronica wipes the old suite and installs the new one — replacing whatever was active before

## Tech Stack

| Tool | Role |
|---|---|
| [Bun](https://bun.sh/) | Runtime + package manager (TypeScript) |
| [Zod](https://zod.dev/) | Schema validation for suite definitions |
| [@opentui/core](https://opentui.com/) | Terminal UI framework for the suite selector (Bun-exclusive, Zig-native) |
| [Prettier](https://prettier.io/) | Code formatting |

## Design Decisions

- Where suites are defined/stored? Ofcourse in this repository folder `suites`
- Whether switching suites is per-project or global? Per-project for now, but can be extended to support global in the future