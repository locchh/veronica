/**
 * Self-update: pull the latest code from GitHub and reinstall dependencies.
 * Runs `git pull --ff-only` and `bun install` in the install directory
 * (whichever directory this script itself lives in).
 */
import { dirname } from "node:path";

export async function runUpdate(): Promise<void> {
  // src/update.ts lives one level below the install root
  const installDir = dirname(import.meta.dir);
  console.log(`Updating Veronica at ${installDir}...`);

  const pull = Bun.spawn(["git", "pull", "--ff-only"], {
    cwd: installDir,
    stdout: "inherit",
    stderr: "inherit",
  });
  if ((await pull.exited) !== 0) {
    console.error("✗ git pull failed");
    process.exit(1);
  }

  const install = Bun.spawn(["bun", "install"], {
    cwd: installDir,
    stdout: "inherit",
    stderr: "inherit",
  });
  if ((await install.exited) !== 0) {
    console.error("✗ bun install failed");
    process.exit(1);
  }

  console.log("✓ Veronica updated");
}
