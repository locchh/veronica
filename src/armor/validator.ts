import type { GitHubEntry } from "../github";

const ALLOWED_FILES = new Set([
  "description.md",
  "CLAUDE.md",
  ".mcp.json",
  ".worktreeinclude",
]);

const ALLOWED_DIRS = new Set([".claude"]);

export type ArmorVerdict = 
  | { ok: true }
  | { ok: false; reason: string };

export function validateArmor(armorName: string,
    entries: GitHubEntry[]): ArmorVerdict {
    
    let hasDescription = false;
    // Validate armor name
    if (!/^[a-zA-Z0-9_-]+$/.test(armorName)) {
        return { ok: false, reason: "Armor name must contain only alphanumeric characters, hyphens, and underscores" };
    }

    for (const entry of entries) {
        // Check if file or directory
        const isFile = entry.type === "file";
        // If file check if it's allowed
        if (isFile) {
            if (!ALLOWED_FILES.has(entry.name)) {
                return { ok: false, reason: `File ${entry.name} is not allowed` };
            }
            if (entry.name === "description.md") {
                hasDescription = true;
            }
        }
        // If directory check if start with .claude
        else {
            if (!ALLOWED_DIRS.has(entry.name)) {
                return { ok: false, reason: `Directory ${entry.name} is not allowed` };
            }
        }
    }
    if (!hasDescription) {
        return { ok: false, reason: "missing description.md" };
    }
    return { ok: true };
}
