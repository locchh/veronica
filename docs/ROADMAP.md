# Roadmap

Implementation broken into small, verifiable tasks. Build bottom-up: foundation → operations → UI → wiring.

---

## [x] Phase 1 — Foundation

### [x] Task 1.1 — `src/paths.ts`

Define every managed path as a constant in one place.

**Done when:** Exports a `MANAGED_PATHS` array of strings (e.g. `["CLAUDE.md", ".mcp.json", ".claude/skills", ...]`) covering everything in DESIGN.md's Managed table.

**Verify:** `bun -e 'import { MANAGED_PATHS } from "./src/paths"; console.log(MANAGED_PATHS)'` prints all 9 paths.

---

### [x] Task 1.2 — `src/lock.ts`

Read and write `.veronica-lock` JSON at the project root.

**Done when:** Exports `readLock()` → `{ active: string } | null` and `writeLock(name: string)` / `clearLock()`.

**Verify:** Write `mod-01`, read it back, clear it, read returns null.

---

## [x] Phase 2 — GitHub Client

### [x] Task 2.1 — `src/github.ts`

Two thin functions:
- `listFolder(path: string)` → array of `{ name, type, path }` via GitHub Contents API
- `fetchRaw(path: string)` → string content from `raw.githubusercontent.com`

**Done when:** Both functions work against the live `locchh/veronica` repo.

**Verify:** `listFolder("armors")` returns at least one entry once an armor exists in the repo.

---

## [ ] Phase 3 — Armor Operations

### [x] Task 3.1 — `src/armor/schema.ts`

Zod schema for armor metadata (name + description).

**Done when:** Exports `ArmorSchema` validating `{ name: string (alphanumeric, <50 chars), description: string (<120 chars) }`.

**Verify:** `ArmorSchema.parse({ name: "mod-01", description: "test" })` passes; invalid input throws.

---

### [x] Task 3.2 — `src/armor/validator.ts`

Given a folder listing, check that it follows the armor convention (has `description.md`, no unexpected files at root).

**Done when:** Exports `validateArmor(name, entries) → { ok: true } | { ok: false, reason: string }`.

**Verify:** Pass a fake entry list; assert valid + invalid cases.

---

### [ ] Task 3.3 — `src/armor/list.ts`

Enumerate all armors from the cloud + read each `description.md`.

**Done when:** Exports `listArmors()` → `Array<{ name, description }>`.

**Verify:** Returns at least one armor with a non-empty description once `armors/mod-01/` exists in the repo.

---

### [ ] Task 3.4 — `src/armor/download.ts`

Recursively fetch all files of one armor (excluding `description.md`).

**Done when:** Exports `downloadArmor(name)` → `Array<{ path, content }>`.

**Verify:** Download an armor; output array length matches file count in the cloud folder.

---

### [ ] Task 3.5 — `src/armor/install.ts`

Write downloaded files to their target paths in the project.

**Done when:** Exports `installArmor(files, projectRoot)`. Creates parent dirs as needed. Writes `.veronica-lock`.

**Verify:** Install an armor; `.claude/skills/...` and `.veronica-lock` exist in a test directory.

---

### [ ] Task 3.6 — `src/armor/wipe.ts`

Delete every path in `MANAGED_PATHS` and clear the lock.

**Done when:** Exports `wipeArmor(projectRoot)`. Missing paths are skipped silently.

**Verify:** After install + wipe, none of the managed paths exist; lock is gone.

---

## [ ] Phase 4 — TUI

### [ ] Task 4.1 — `src/tui/animation.ts`

Move and adapt `misc/deploy-animation.ts` into the real source tree.

**Done when:** Exports `deployAnimation(armorName, downloadPromise)` — runs intro, loops while the promise is pending, plays outro on resolve.

**Verify:** Animation completes when a fake 3-second promise resolves.

---

### [ ] Task 4.2 — `src/tui/ArmorPicker.ts`

Card-based selector using `@opentui/core`. Each card shows armor name + description. Arrow keys navigate, Enter selects.

**Done when:** Exports `pickArmor(armors)` → `Promise<string | null>` (returns selected armor name or null on cancel).

**Verify:** Run standalone with a hard-coded list; arrow + Enter returns the right name.

---

## [ ] Phase 5 — Wire It Up

### [ ] Task 5.1 — `index.ts`

The full flow:
1. `listArmors()` from cloud
2. `pickArmor()` shows TUI
3. On select: `wipeArmor()` then `downloadArmor()` + `installArmor()` (wrapped in `deployAnimation()`)

**Done when:** Running `bun run index.ts` shows the picker, selecting an armor wipes the old one and installs the new one with animation.

**Verify:** End-to-end manual test with at least 2 armors in the repo.

---

## [ ] Phase 6 — Distribution

### [ ] Task 6.1 — `scripts/install.sh`

Bootstrap script: check for Bun (install if missing), clone the repo, link `bun run index.ts` as `veronica` in PATH.

**Done when:** Fresh machine can run the one-line install and end up with a working `veronica` command.

**Verify:** Test in a clean Docker container or VM.

---

## [ ] Phase 7 — First Armor

### [ ] Task 7.1 — `armors/mod-01/`

Create one real armor in the repo to validate the full flow.

**Done when:** `armors/mod-01/` contains `description.md`, `CLAUDE.md`, and at least one skill or rule.

**Verify:** `veronica` picks it up, installs it, and the resulting `.claude/` works in a Claude Code session.

---

## Notes

- **Test each task in isolation.** Don't move on until the verify step passes.
- **Don't add error handling beyond what's obvious.** Trust the happy path first; harden once the flow works end-to-end.
- **Skip features not in the verify step.** `wipe-only` from the TUI, progress bars, retry logic — all later.
