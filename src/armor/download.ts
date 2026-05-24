import { listFolder, fetchRaw } from "../github";

/**
 * Recursively collect all files from a folder
 * @param folder The folder to collect files from
 * @returns An array of files with their content
 */

async function collectFiles(folder: string): Promise<Array<{ path: string; content: string }>> {
    const entries = await listFolder(folder);
    const results: Array<{ path: string; content: string }> = [];

    // Recursively download all files
    for (const entry of entries) {
        if (entry.type === "file") {
            // Skip description.md
            if (entry.name === "description.md") continue;
            // base case: file
            const content = await fetchRaw(entry.path);
            results.push({ path: entry.path, content });
        }
        else if (entry.type === "dir") {
            // recursive case: dir
            const subResults = await collectFiles(entry.path);
            results.push(...subResults);
        }
    }

    return results;
}

/**
 * Download all files from a armor folder
 * @param name The name of the armor
 * @returns An array of files with their content
 */
export async function downloadArmor(name: string): Promise<Array<{ path: string; content: string }>> {
    // Validate armor name
    if (!name) {
        throw new Error("Armor name is required");
    }
    const armorRoot = `armors/${name}`;
    // Collect all files
    const files = await collectFiles(armorRoot);
    // Remove armor root prefix from path
    const prefix = `${armorRoot}/`;
    return files.map(file => ({
        path: file.path.replace(prefix, ""),
        content: file.content
    }));
}
