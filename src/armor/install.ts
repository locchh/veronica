import { writeLock } from "../lock";

/**
 * Install an armor by writing its files to the project and updating the lock file.
 * @param name The name of the armor to install.
 * @param files The files to install.
 * @param projectRoot The root directory of the project.
 */
export async function installArmor(
  name: string,
  files: Array<{ path: string; content: string }>,
  projectRoot: string,
): Promise<void> {
  // Write each file to the project root
  for (const file of files) {
    await Bun.write(`${projectRoot}/${file.path}`, file.content);
  }
  // Write the lock file
  await writeLock(name, projectRoot);
}
