import { listArmors } from "./src/armor/list";
import { pickArmor } from "./src/tui/ArmorPicker";
import { wipeArmor } from "./src/armor/wipe";
import { downloadArmor } from "./src/armor/download";
import { installArmor } from "./src/armor/install";
import { deployAnimation } from "./src/tui/animation";



async function main() {
  const projectRoot = process.cwd();

  // 1. List armors
  const armors = await listArmors();
  if (armors.length === 0) {
    console.log("No armors available.");
    return;
  }
  
  // 2. Pick armor
  const name = await pickArmor(armors);
  if (name === null) {
    console.log("Cancelled.");
    return;
  }
  
  // 3. Wipe current armor
  await wipeArmor(projectRoot);
  
  // 4. Download + install, wrapped in the animation
  const job = (async () => {
    const files = await downloadArmor(name);
    await installArmor(name, files, projectRoot);
  })();
  await deployAnimation(name, job);
}

main();