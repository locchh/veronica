import { writeLock } from "../lock";

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
