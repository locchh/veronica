import { unlink } from "node:fs/promises";

const LOCK_PATH = ".veronica-lock";

/**
 * Reads the lock file and returns the active armor name or null if no lock exists.
 * File operations touch the disk, which is slow compared to memory. So they're async — they return a Promise.
 */
export async function readLock(
  projectRoot: string = ".",
): Promise<{ active: string } | null> {
  // Looking for .veronica-lock at project root
  const file = Bun.file(`${projectRoot}/${LOCK_PATH}`);
  const exists = await file.exists();

  // If file doesn't exist, return null
  if (!exists) {
    return null;
  }

  // If file exists, read it and parse JSON
  const data = await file.json();

  return data;
}

/**
 * Writes the lock file with the active armor name.
 * @param name - The armor's folder name (e.g. "mod-01").
 */
export async function writeLock(
  name: string,
  projectRoot: string = ".",
): Promise<void> {
  const file = Bun.file(`${projectRoot}/${LOCK_PATH}`);
  await file.write(JSON.stringify({ active: name }));
}

/**
 * Clears the lock file.
 */
export async function clearLock(projectRoot: string = "."): Promise<void> {
  try {
    await unlink(`${projectRoot}/${LOCK_PATH}`);
  } catch {
    // already gone — that's fine
  }
}
