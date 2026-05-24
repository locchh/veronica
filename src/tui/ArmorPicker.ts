import {
  createCliRenderer,
  SelectRenderable,
  SelectRenderableEvents,
  type SelectOption,
} from "@opentui/core";

/**
 * Show a card-based picker for armors. Returns the selected armor's name,
 * or null if the user cancelled (Esc / Ctrl+C).
 *
 * Arrow up/down to navigate, Enter to select, Esc to cancel.
 *
 * @param armors The list of armors to display
 */
export async function pickArmor(
  armors: Array<{ name: string; description: string }>,
): Promise<string | null> {
  if (armors.length === 0) return null;

  const renderer = await createCliRenderer({
    exitOnCtrlC: false,
  });

  return new Promise<string | null>((resolve) => {
    let settled = false;
    const settle = (value: string | null) => {
      if (settled) return;
      settled = true;
      renderer.destroy();
      resolve(value);
    };

    const select = new SelectRenderable(renderer, {
      options: armors.map((a) => ({
        name: a.name,
        description: a.description,
        value: a.name,
      })),
      width: "100%",
      height: "100%",
      showDescription: true,
      wrapSelection: true,
    });

    renderer.root.add(select);
    renderer.focusRenderable(select);

    // Enter / select
    select.on(SelectRenderableEvents.ITEM_SELECTED, (_index: number, option: SelectOption) => {
      settle(option.value as string);
    });

    // Esc / Ctrl+C cancels
    renderer.keyInput.on("keypress", (event) => {
      if (event.name === "escape" || (event.ctrl && event.name === "c")) {
        settle(null);
      }
    });

    renderer.start();
  });
}
