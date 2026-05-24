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
};

/** Build common headers; include Authorization if GITHUB_TOKEN is set. */
function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  const token = process.env["GITHUB_TOKEN"];
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** Wrap rate-limit errors with actionable guidance. */
function describeFailure(prefix: string, response: Response): Error {
  const remaining = response.headers.get("x-ratelimit-remaining");
  const status = response.status;
  const statusText = (response.statusText || "").toLowerCase();
  const rateLimitHit =
    status === 429 ||
    (status === 403 &&
      (remaining === "0" || statusText.includes("rate limit")));
  if (rateLimitHit) {
    return new Error(
      `GitHub API rate limit hit (60/hour unauthenticated).\n` +
        `Either wait ~1 hour, or set GITHUB_TOKEN to raise the limit to 5000/hour.\n` +
        `Create a token (no scopes needed for public repos):\n` +
        `  https://github.com/settings/tokens`,
    );
  }
  return new Error(`${prefix}: ${status} ${response.statusText}`);
}

/**
 * Use GitHub Contents API to list files and directories in a repository folder.
 * @param path The path to the folder in the repository
 * @returns Array of files and directories with their names, types, and paths
 */
export async function listFolder(path: string): Promise<GitHubEntry[]> {
  const url = `${BASE_URL}/repos/${OWNER}/${REPO}/contents/${path}`;
  const response = await fetch(url, { headers: authHeaders() });
  if (!response.ok) throw describeFailure("Failed to list folder", response);

  const data = (await response.json()) as GitHubEntry[];
  return data.map((item) => ({
    name: item.name,
    type: item.type,
    path: item.path,
  }));
}

/**
 * Fetches a file's raw content from the repo.
 * @param path The path to the file in the repository
 * @returns The raw content of the file as a string
 */
export async function fetchRaw(path: string): Promise<string> {
  const url = `${RAW_BASE_URL}/${OWNER}/${REPO}/${BRANCH}/${path}`;
  const response = await fetch(url, { headers: authHeaders() });
  if (!response.ok) throw describeFailure("Failed to fetch file", response);
  return await response.text();
}
