import { rm } from "node:fs/promises";
import { MANAGED_PATHS } from "../paths";
import { clearLock } from "../lock";

/**
 * Wipe all files and directories managed by Veronica from the project.
 * @param projectRoot The root directory of the project.
 */
export async function wipeArmor(projectRoot: string): Promise<void> {
  // 1. Delete every managed path (force: true means missing is OK)
  for (const path of MANAGED_PATHS) {
    await rm(`${projectRoot}/${path}`, { recursive: true, force: true });
  }
  // 2. Clear the lock file
  await clearLock(projectRoot);
}