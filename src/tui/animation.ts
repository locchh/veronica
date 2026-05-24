// ANSI escape codes
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const YELLOW = "\x1b[33m";
const BRIGHT_YELLOW = "\x1b[93m";
const CYAN = "\x1b[36m";
const BRIGHT_CYAN = "\x1b[96m";
const WHITE = "\x1b[97m";
const BRIGHT_GREEN = "\x1b[92m";
const RED = "\x1b[31m";
const HIDE_CURSOR = "\x1b[?25l";
const SHOW_CURSOR = "\x1b[?25h";
const CLEAR = "\x1b[2J\x1b[H";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const WIDTH = 32;
const CAPSULE_COL = 15;
const TOTAL_ROWS = 10;

const STAR_CHARS = ["✦", "✧", "*", ".", "·"];
const STAR_COLORS = [DIM, "", CYAN];

function randomStarfield(rows: number, seed: number): string[] {
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < WIDTH; c++) {
      const v = Math.sin((r * 7 + c * 13 + seed * 3) * 12.9898) * 43758.5453;
      const frac = v - Math.floor(v);
      if (frac > 0.88) {
        const ch = STAR_CHARS[Math.floor(frac * 100) % STAR_CHARS.length]!;
        const color =
          STAR_COLORS[Math.floor(frac * 1000) % STAR_COLORS.length]!;
        line += `${color}${ch}${RESET}`;
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }
  return lines;
}

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

function center(text: string): string {
  const visibleLen = stripAnsi(text).length;
  const pad = Math.max(0, Math.floor((WIDTH - visibleLen) / 2));
  return " ".repeat(pad) + text;
}

function padLeft(content: string, col: number): string {
  return " ".repeat(col) + content;
}

function render(lines: string[]) {
  process.stdout.write(CLEAR + lines.join("\n") + "\n");
}

type SkyFrameOpts = {
  capsuleRow: number;
  trailLength: number;
  capsuleChar: string;
  capsuleColor: string;
  status: string;
  starSeed: number;
};

function buildSkyFrame(opts: SkyFrameOpts): string[] {
  const lines = randomStarfield(TOTAL_ROWS, opts.starSeed);

  const trailChars = ["▓", "▒", "░"];
  for (let i = 1; i <= opts.trailLength; i++) {
    const row = opts.capsuleRow - i;
    if (row < 0) break;
    const ch = trailChars[Math.min(i - 1, trailChars.length - 1)]!;
    const color = i === 1 ? BRIGHT_CYAN : i === 2 ? CYAN : DIM + CYAN;
    lines[row] = padLeft(`${color}${ch}${RESET}`, CAPSULE_COL);
  }

  if (opts.capsuleRow >= 0 && opts.capsuleRow < TOTAL_ROWS) {
    lines[opts.capsuleRow] = padLeft(
      `${opts.capsuleColor}${BOLD}${opts.capsuleChar}${RESET}`,
      CAPSULE_COL,
    );
  }

  lines.push("");
  lines.push(center(opts.status));
  return lines;
}

const GROUND_LINE = `${DIM}________________________________${RESET}`;

async function playIntro() {
  for (let row = 0; row < 3; row++) {
    render(
      buildSkyFrame({
        capsuleRow: row,
        trailLength: row,
        capsuleChar: "◆",
        capsuleColor: BRIGHT_YELLOW,
        status: `${DIM}Establishing link...${RESET}`,
        starSeed: row,
      }),
    );
    await sleep(180);
  }
}

const STATUS_MESSAGES = [
  `${DIM}Receiving data${RESET}`,
  `${DIM}Receiving data.${RESET}`,
  `${DIM}Receiving data..${RESET}`,
  `${DIM}Receiving data...${RESET}`,
];

/**
 * Animate while `promise` is pending. Returns whatever the promise resolves to.
 */
async function playLoop<T>(promise: Promise<T>): Promise<T> {
  let done = false;
  let result!: T;
  let error: unknown;

  promise.then(
    (value) => {
      result = value;
      done = true;
    },
    (err) => {
      error = err;
      done = true;
    },
  );

  let tick = 0;
  while (!done) {
    const pulse = tick % 4;
    const capsuleColor =
      pulse === 0
        ? BRIGHT_YELLOW
        : pulse === 1
          ? YELLOW
          : pulse === 2
            ? WHITE
            : BRIGHT_YELLOW;
    const capsuleChar = tick % 6 < 3 ? "◆" : "◇";
    const trailLength = 2 + (tick % 4);

    render(
      buildSkyFrame({
        capsuleRow: 4,
        trailLength,
        capsuleChar,
        capsuleColor,
        status: STATUS_MESSAGES[tick % STATUS_MESSAGES.length]!,
        starSeed: tick + 10,
      }),
    );
    await sleep(150);
    tick++;
  }

  if (error) throw error;
  return result;
}

async function playOutro(armorName: string) {
  for (let row = 5; row <= 8; row++) {
    render(
      buildSkyFrame({
        capsuleRow: row,
        trailLength: 4,
        capsuleChar: "◆",
        capsuleColor: BRIGHT_YELLOW,
        status: `${DIM}Approaching surface...${RESET}`,
        starSeed: 99 + row,
      }),
    );
    await sleep(110);
  }

  for (let i = 0; i < 2; i++) {
    const lines: string[] = [];
    while (lines.length < TOTAL_ROWS - 2) lines.push("");
    lines.push(center(`${BOLD}${WHITE}\\ | /${RESET}`));
    lines.push(center(`${BOLD}${BRIGHT_YELLOW}◆${RESET}`));
    lines.push(GROUND_LINE);
    lines.push("");
    lines.push(center(`${BOLD}${RED}IMPACT${RESET}`));
    render(lines);
    await sleep(140);
  }

  const unpackFrames: Array<{
    lines: string[];
    status: string;
    pause: number;
  }> = [
    {
      lines: ["", "", `${BOLD}${BRIGHT_YELLOW}◆${RESET}`],
      status: `${DIM}Unpacking...${RESET}`,
      pause: 350,
    },
    {
      lines: ["", "", `${BOLD}${BRIGHT_YELLOW}◇${RESET}`],
      status: `${DIM}Unpacking...${RESET}`,
      pause: 300,
    },
    {
      lines: ["", "", `${BOLD}${BRIGHT_YELLOW}✦${RESET}`],
      status: `${DIM}Activating...${RESET}`,
      pause: 250,
    },
    {
      lines: [
        `${BOLD}${BRIGHT_YELLOW} ▐▛███▜▌${RESET}`,
        `${BOLD}${BRIGHT_YELLOW}▝▜█████▛▘${RESET}`,
        `${BOLD}${BRIGHT_YELLOW}  ▘▘ ▝▝${RESET}`,
      ],
      status: `${DIM}Activating...${RESET}`,
      pause: 400,
    },
    {
      lines: [
        `${BOLD}${BRIGHT_YELLOW} ▐▛███▜▌${RESET}`,
        `${BOLD}${BRIGHT_YELLOW}▝▜█████▛▘${RESET}`,
        `${BOLD}${BRIGHT_YELLOW}  ▘▘ ▝▝${RESET}`,
      ],
      status: `${BOLD}${BRIGHT_GREEN}${armorName} — DEPLOYED${RESET}`,
      pause: 1500,
    },
  ];

  for (const frame of unpackFrames) {
    const lines: string[] = [];
    while (lines.length < TOTAL_ROWS - 2 - frame.lines.length) lines.push("");
    const widest = Math.max(...frame.lines.map((l) => stripAnsi(l).length));
    const pad = " ".repeat(Math.max(0, Math.floor((WIDTH - widest) / 2)));
    for (const fl of frame.lines) lines.push(pad + fl);
    lines.push(GROUND_LINE);
    lines.push("");
    lines.push(center(frame.status));
    render(lines);
    await sleep(frame.pause);
  }
}

/**
 * Wrap any promise with animation.
 * Whatever type the input promise resolves to, that's what this function returns.
 * @param armorName Shown in the final "DEPLOYED" message
 * @param promise The work to do during the loop (e.g. downloadArmor)
 */
export async function deployAnimation<T>(
  armorName: string,
  promise: Promise<T>,
): Promise<T> {
  process.stdout.write(HIDE_CURSOR);
  try {
    await playIntro();
    const result = await playLoop(promise);
    await playOutro(armorName);
    return result;
  } finally {
    process.stdout.write(SHOW_CURSOR);
  }
}
