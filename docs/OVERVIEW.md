# Overview

An armor manager CLI for Claude Code plugins. Instead of accumulating all plugins at once, you define named armors (curated sets of skills, agents, hooks, MCPs, LSP configs) and switch between them on demand via a TUI.

## Core Workflow

1. User runs `veronica` in the terminal
2. TUI presents available armors
3. User selects one
4. Veronica wipes the old armor and installs the new one — replacing whatever was active before

## Tech Stack

| Tool | Role |
|---|---|
| [Bun](https://bun.sh/) | Runtime + package manager (TypeScript) |
| [Zod](https://zod.dev/) | Schema validation for armor definitions |
| [@opentui/core](https://opentui.com/) | Terminal UI framework for the armor selector (Bun-exclusive, Zig-native) |
| [Prettier](https://prettier.io/) | Code formatting |

## Design Decisions

- Where armors are defined/stored? Of course, in this repository's `armors/` folder
- Whether switching armors is per-project or global? Per-project for now, but can be extended to support global in the future