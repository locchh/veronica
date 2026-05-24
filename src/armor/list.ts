import { listFolder, fetchRaw } from "../github";
import { validateArmor } from "./validator";
import type { GitHubEntry } from "../github";
import type { ArmorVerdict } from "./validator";

const ARMOR_FOLDER = "armors";

/**
 * Lists all valid armors in the armors folder
 * @returns An array of armor names and their descriptions
 */
export async function listArmors(): Promise<Array<{ name: string; description: string }>> {
    // Initialize the results array
    const results: Array<{ name: string; description: string }> = [];
    
    // List the armors folder
    const entries: GitHubEntry[] = await listFolder(ARMOR_FOLDER);

    // Filter to directories only
    const folders = entries.filter(entry => {
        return entry.type === "dir";
    });

    // For each directory, validate the armor and fetch the description
    for (const folder of folders) {
        // List entries in the armor folder
        const armorEntries: GitHubEntry[] = await listFolder(`${ARMOR_FOLDER}/${folder.name}`);
        // Validate the armor
        const verdict: ArmorVerdict = validateArmor(folder.name, armorEntries);
        if (!verdict.ok) {
            console.error(`Armor ${folder.name} is INVALID: ${verdict.reason}`);
            continue;
        }
        //  Fetch the description
        const description = (await fetchRaw(`${ARMOR_FOLDER}/${folder.name}/description.md`)).trim();
        results.push({ name: folder.name, description });
    }

    // Return the list of armors
    return results;
}
