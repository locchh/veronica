// Demo: run the deploy animation with a fake 4-second "download".
import { deployAnimation } from "../src/tui/animation";

const fakeDownload = new Promise((resolve) => setTimeout(() => resolve("done"), 4000));

await deployAnimation("mod-01", fakeDownload);
