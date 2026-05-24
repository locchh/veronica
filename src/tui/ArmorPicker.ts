import {
  createCliRenderer,
  BoxRenderable,
  TextRenderable,
} from "@opentui/core";

const CARD_WIDTH = 60;
const BODY_INNER_WIDTH = CARD_WIDTH - 4; // borders + padding

/** Wrap text to a max line width without breaking words. */
function wrapText(text: string, width: number): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= width) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.join("\n");
}

/** Truncate a name if it would overflow the title area. */
function fitTitle(name: string, maxChars: number): string {
  return name.length > maxChars ? name.slice(0, maxChars - 1) + "…" : name;
}

/**
 * Show a Yu-Gi-Oh style armor picker — one card at a time.
 *
 * Arrow keys cycle through armors, Enter selects, Esc cancels.
 *
 * @param armors The list of armors to display
 * @returns The selected armor's name, or null if cancelled
 */
export async function pickArmor(
  armors: Array<{ name: string; description: string }>,
): Promise<string | null> {
  if (armors.length === 0) return null;

  const renderer = await createCliRenderer({
    exitOnCtrlC: false,
  });

  return new Promise<string | null>((resolve) => {
    let selectedIndex = 0;
    let settled = false;

    const settle = (value: string | null) => {
      if (settled) return;
      settled = true;
      renderer.destroy();
      resolve(value);
    };

    // Center the card on the screen
    renderer.root.alignItems = "center";
    renderer.root.justifyContent = "center";

    const card = new BoxRenderable(renderer, {
      width: CARD_WIDTH,
      height: 14,
      borderStyle: "double",
      border: true,
      borderColor: "#D4A843",
      backgroundColor: "#1A1918",
      titleAlignment: "center",
      bottomTitleAlignment: "center",
      padding: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });

    const logo = new TextRenderable(renderer, {
      content: " ▐▛███▜▌\n▝▜█████▛▘\n   ▘▘ ▝▝",
      fg: "#D4A843",
    });
    card.add(logo);

    const spacer = new BoxRenderable(renderer, { height: 1, width: 1 });
    card.add(spacer);

    const body = new TextRenderable(renderer, {
      content: "",
      fg: "#E8E6DC",
    });
    card.add(body);

    const footer = new TextRenderable(renderer, {
      content: "↑/↓ Navigate · Enter Select · Esc Cancel",
      fg: "#73726C",
      marginTop: 1,
    });

    renderer.root.add(card);
    renderer.root.add(footer);

    const update = () => {
      const armor = armors[selectedIndex]!;
      // Title decoration is `【 NAME 】` plus surrounding spaces — reserve 10 chars for them
      const name = fitTitle(armor.name.toUpperCase(), CARD_WIDTH - 10);
      card.title = ` 【 ${name} 】 `;
      card.bottomTitle = ` ${selectedIndex + 1} / ${armors.length} `;
      body.content = wrapText(armor.description, BODY_INNER_WIDTH);
    };
    update();

    renderer.keyInput.on("keypress", (event) => {
      if (event.name === "up" || event.name === "left") {
        selectedIndex = (selectedIndex - 1 + armors.length) % armors.length;
        update();
      } else if (event.name === "down" || event.name === "right") {
        selectedIndex = (selectedIndex + 1) % armors.length;
        update();
      } else if (event.name === "return") {
        settle(armors[selectedIndex]!.name);
      } else if (event.name === "escape" || (event.ctrl && event.name === "c")) {
        settle(null);
      }
    });

    renderer.start();
  });
}
