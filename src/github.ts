const OWNER = "locchh";
const REPO = "veronica";
const BRANCH = "main";
const BASE_URL = "https://api.github.com";
const RAW_BASE_URL = "https://raw.githubusercontent.com";

/**
 * GitHub API response shape for a folder entry
 */
export type GitHubEntry = {
    name: string;
    type: "file" | "dir";
    path: string;
}

/**
 * Use GitHub Contents API to list files and directories in a repository folder
 * GET https://api.github.com/repos/locchh/veronica/contents/<path>
 * Response: Array of files and directories with their names, types (file or dir), and paths
 * @param path The path to the folder in the repository
 * @returns Array of files and directories with their names, types, and paths
 */
export async function listFolder(path: string): Promise<GitHubEntry[]> {
    // Build the URL
    const url = `${BASE_URL}/repos/${OWNER}/${REPO}/contents/${path}`;

    // Send the request
    const response = await fetch(url);

    // Check if the response is ok
    if (!response.ok) {
        throw new Error(`Failed to fetch folder: ${response.statusText}`);
    }

    // Parse the response as JSON
    const data: GitHubEntry[] = await response.json() as GitHubEntry[];

    // Pick out the name, type, and path fields
    const entries = data.map((item) => ({
        name: item.name,
        type: item.type,
        path: item.path,
    }));

    // Return the cleaned entries
    return entries;
}

/**
 * Takes a path like README.md and returns the raw content as a string
 * @param path The path to the file in the repository
 * @returns The raw content of the file as a string
 */
export async function fetchRaw(path: string): Promise<string> {
    // Build the URL
    const url = `${RAW_BASE_URL}/${OWNER}/${REPO}/${BRANCH}/${path}`;

    // Send the request
    const response = await fetch(url);

    // Check if the response is ok
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Parse the response as text
    const data = await response.text();

    // Return the raw content
    return data;
}
