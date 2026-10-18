// Generates the steampunk SVG assets of the game (tiles, lamps, background, favicon).
// Run with: node scripts/generate-assets.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const write = (path, content) => {
  const full = join(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content.trim() + "\n");
  console.log("wrote", path);
};

// Palette: dark burnt orange / copper, brass highlights, bluish lights.
const C = {
  soot: "#120804",
  plateLight: "#6b3516",
  plateMid: "#3f1d0b",
  plateDark: "#1f0e05",
  copper: "#b5602a",
  brassHi: "#ffd08a",
  brass: "#d08a3a",
  brassLow: "#6e3a12",
  blue: "#5ec8ff",
  blueCore: "#d8f4ff",
  blueDeep: "#1b6fb3",
  teal: "#5fffd2",
  red: "#ff4626",
  amber: "#ffb347",
};

const round = (n) => Math.round(n * 100) / 100;

// Builds a gear outline path centred on (cx, cy).
const gearPath = (cx, cy, rOuter, rInner, teeth, holeR = 0) => {
  const pts = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const angles = [
      [a - step * 0.25, rInner],
      [a - step * 0.15, rOuter],
      [a + step * 0.15, rOuter],
      [a + step * 0.25, rInner],
    ];
    for (const [ang, r] of angles) pts.push(`${round(cx + Math.cos(ang) * r)},${round(cy + Math.sin(ang) * r)}`);
  }
  let d = `M${pts.join("L")}Z`;
  if (holeR > 0) {
    d += `M${cx + holeR},${cy}A${holeR},${holeR} 0 1 0 ${cx - holeR},${cy}A${holeR},${holeR} 0 1 0 ${cx + holeR},${cy}Z`;
  }
  return d;
};

const commonDefs = `
  <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.plateLight}"/>
    <stop offset="0.55" stop-color="${C.plateMid}"/>
    <stop offset="1" stop-color="${C.plateDark}"/>
  </linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.brassHi}"/>
    <stop offset="0.45" stop-color="${C.brass}"/>
    <stop offset="1" stop-color="${C.brassLow}"/>
  </linearGradient>
  <radialGradient id="rivet" cx="0.35" cy="0.3" r="0.75">
    <stop offset="0" stop-color="${C.brassHi}"/>
    <stop offset="0.5" stop-color="${C.copper}"/>
    <stop offset="1" stop-color="#3a1a08"/>
  </radialGradient>
  <radialGradient id="glass" cx="0.4" cy="0.35" r="0.8">
    <stop offset="0" stop-color="#1d3646"/>
    <stop offset="1" stop-color="#050c12"/>
  </radialGradient>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0 0.02  0 0 0 -1.6 1.1"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b1"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b2"/>
    <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
`;

const rivet = (x, y, r = 5.5) => `
  <circle cx="${x}" cy="${y + 1.2}" r="${r}" fill="#0c0502" opacity="0.7"/>
  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#rivet)"/>
  <circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.28}" fill="#fff3d6" opacity="0.7"/>`;

// The riveted copper plate every tile is built on (160x160 canvas).
const plate = () => `
  <rect width="160" height="160" fill="${C.soot}"/>
  <rect x="3" y="3" width="154" height="154" rx="10" fill="url(#plate)"/>
  <rect x="3" y="3" width="154" height="154" rx="10" fill="#000" filter="url(#grain)" opacity="0.55"/>
  <path d="M8 150 V13 a5 5 0 0 1 5 -5 H147" fill="none" stroke="#e08a4a" stroke-opacity="0.35" stroke-width="2"/>
  <path d="M152 12 V147 a5 5 0 0 1 -5 5 H12" fill="none" stroke="#000" stroke-opacity="0.5" stroke-width="2"/>
  <rect x="19" y="19" width="122" height="122" rx="8" fill="none" stroke="#0e0602" stroke-opacity="0.75" stroke-width="2"/>
  <rect x="20" y="20" width="122" height="122" rx="8" fill="none" stroke="#c87a40" stroke-opacity="0.18" stroke-width="1.5"/>
  ${rivet(14, 14)}${rivet(146, 14)}${rivet(14, 146)}${rivet(146, 146)}`;

// A brass bezel with a dark glass window, used to frame glowing symbols.
const bezel = (glowColor) => `
  <circle cx="80" cy="82" r="52" fill="#000" opacity="0.45"/>
  <circle cx="80" cy="80" r="52" fill="url(#brass)"/>
  <circle cx="80" cy="80" r="46" fill="${C.brassLow}"/>
  <circle cx="80" cy="80" r="44" fill="url(#glass)"/>
  <circle cx="80" cy="80" r="44" fill="${glowColor}" opacity="0.12"/>
  ${[0, 90, 180, 270].map((a) => {
    const rad = (a + 45) * Math.PI / 180;
    return rivet(round(80 + Math.cos(rad) * 49), round(80 + Math.sin(rad) * 49), 2.6);
  }).join("")}
  <path d="M50 58 A40 40 0 0 1 96 42" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="5" stroke-linecap="round"/>`;

const tile = (inner, extraDefs = "") => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <defs>${commonDefs}${extraDefs}</defs>
  ${plate()}
  ${inner}
</svg>`;

// --- Tiles ------------------------------------------------------------------

const backTile = tile(`
  <path d="${gearPath(80, 80, 40, 32, 12, 12)}" fill="none" stroke="#0d0502" stroke-opacity="0.55" stroke-width="3" fill-rule="evenodd"/>
  <path d="${gearPath(80, 81, 40, 32, 12, 12)}" fill="none" stroke="#d48a50" stroke-opacity="0.12" stroke-width="1.5"/>
  <circle cx="80" cy="80" r="4" fill="${C.blue}" opacity="0.35"/>
  <circle cx="80" cy="80" r="9" fill="${C.blue}" opacity="0.08"/>`);

const arrowShape = (color, core) => `
  <g filter="url(#glow)">
    <path d="M-28,-9 H2 V-24 L30,0 L2,24 V9 H-28 Z" fill="${color}" opacity="0.85"/>
    <path d="M-22,-3.5 H8 V-12 L22,0 L8,12 V3.5 H-22 Z" fill="${core}"/>
  </g>`;

const arrowTile = (rotation) => tile(`
  ${bezel(C.blue)}
  <g transform="translate(80 80) rotate(${rotation})">${arrowShape(C.blue, C.blueCore)}</g>`);

const startTile = tile(`
  <g>
    <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="14s" repeatCount="indefinite"/>
    <path d="${gearPath(80, 82, 56, 46, 14, 0)}" fill="#000" opacity="0.4"/>
    <path d="${gearPath(80, 80, 56, 46, 14, 0)}" fill="url(#brass)"/>
    <circle cx="80" cy="80" r="40" fill="none" stroke="${C.brassLow}" stroke-width="3"/>
    ${[0, 60, 120, 180, 240, 300].map((a) => {
      const rad = a * Math.PI / 180;
      return `<circle cx="${round(80 + Math.cos(rad) * 30)}" cy="${round(80 + Math.sin(rad) * 30)}" r="6" fill="${C.brassLow}"/>`;
    }).join("")}
  </g>
  <circle cx="80" cy="80" r="20" fill="url(#brass)"/>
  <circle cx="80" cy="80" r="15" fill="url(#glass)"/>
  <circle cx="80" cy="80" r="9" fill="${C.blue}" filter="url(#glow)">
    <animate attributeName="opacity" values="1;0.55;1" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="80" cy="80" r="4" fill="${C.blueCore}"/>`);

const successTile = tile(`
  ${bezel(C.teal)}
  <g filter="url(#glow)">
    <path d="M56 82 L73 99 L106 63" fill="none" stroke="${C.teal}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M56 82 L73 99 L106 63" fill="none" stroke="#eafff8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`);

const failTile = tile(`
  ${bezel(C.red)}
  <g stroke="#ffd0c0" stroke-opacity="0.5" stroke-width="1.5" fill="none">
    <path d="M80 80 L58 46 M80 80 L118 70 M80 80 L92 122 M80 80 L44 96 M64 56 L52 60 M104 74 L110 92"/>
  </g>
  <g filter="url(#glow)">
    <path d="M60 60 L100 100 M100 60 L60 100" stroke="${C.red}" stroke-width="13" stroke-linecap="round" opacity="0.85"/>
    <path d="M60 60 L100 100 M100 60 L60 100" stroke="#ffe2d6" stroke-width="5" stroke-linecap="round"/>
  </g>`);

write("src/assets/tiles/back.svg", backTile);
write("src/assets/tiles/start.svg", startTile);
write("src/assets/tiles/right.svg", arrowTile(0));
write("src/assets/tiles/bottom.svg", arrowTile(90));
write("src/assets/tiles/left.svg", arrowTile(180));
write("src/assets/tiles/top.svg", arrowTile(270));
write("src/assets/tiles/success.svg", successTile);
write("src/assets/tiles/fail.svg", failTile);

// --- Status lamps (Tesla-like vacuum tubes) ---------------------------------

const lamp = (color, core, { pulse = false, needle = 0 } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 320" width="140" height="320">
  <defs>${commonDefs}
    <linearGradient id="tube" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="0.25" stop-color="${color}" stop-opacity="0.12"/>
      <stop offset="0.7" stop-color="${color}" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.18"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${color}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cyl" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.brassLow}"/>
      <stop offset="0.35" stop-color="${C.brassHi}"/>
      <stop offset="0.6" stop-color="${C.brass}"/>
      <stop offset="1" stop-color="#3e1d08"/>
    </linearGradient>
  </defs>
  <ellipse cx="70" cy="110" rx="70" ry="110" fill="url(#halo)">
    ${pulse ? `<animate attributeName="opacity" values="1;0.45;1" dur="1.4s" repeatCount="indefinite"/>` : ""}
  </ellipse>
  <!-- glass tube -->
  <rect x="44" y="34" width="52" height="170" rx="26" fill="#0a1218" opacity="0.55"/>
  <g filter="url(#glow)">
    ${pulse ? `<animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite"/>` : ""}
    <path d="M70 196 V60 M70 60 l-10 12 l20 12 l-20 12 l20 12 l-20 12 l20 12 l-20 12 l20 12 l-10 10" fill="none" stroke="${color}" stroke-width="7" stroke-linejoin="round" opacity="0.9"/>
    <path d="M70 60 l-10 12 l20 12 l-20 12 l20 12 l-20 12 l20 12 l-20 12 l20 12 l-10 10" fill="none" stroke="${core}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="70" cy="56" r="7" fill="${core}"/>
  </g>
  <rect x="44" y="34" width="52" height="170" rx="26" fill="url(#tube)" stroke="#e6f6ff" stroke-opacity="0.35" stroke-width="2"/>
  <path d="M54 52 V180" stroke="#fff" stroke-opacity="0.35" stroke-width="4" stroke-linecap="round"/>
  <!-- cap -->
  <path d="M48 36 Q70 8 92 36 Z" fill="url(#cyl)"/>
  <rect x="66" y="6" width="8" height="14" rx="2" fill="url(#cyl)"/>
  <rect x="42" y="32" width="56" height="8" rx="3" fill="url(#cyl)"/>
  <!-- collar -->
  <rect x="36" y="200" width="68" height="14" rx="4" fill="url(#cyl)"/>
  ${rivet(44, 207, 3)}${rivet(96, 207, 3)}
  <!-- body with gauge -->
  <rect x="30" y="214" width="80" height="58" rx="6" fill="url(#cyl)"/>
  <rect x="30" y="214" width="80" height="58" rx="6" fill="#000" filter="url(#grain)" opacity="0.4"/>
  <circle cx="70" cy="243" r="20" fill="url(#brass)"/>
  <circle cx="70" cy="243" r="16" fill="#f3e3c3"/>
  ${[-120, -60, 0, 60, 120].map((a) => {
    const rad = (a - 90) * Math.PI / 180;
    return `<line x1="${round(70 + Math.cos(rad) * 11)}" y1="${round(243 + Math.sin(rad) * 11)}" x2="${round(70 + Math.cos(rad) * 15)}" y2="${round(243 + Math.sin(rad) * 15)}" stroke="#3a1a08" stroke-width="1.6"/>`;
  }).join("")}
  <line x1="70" y1="243" x2="70" y2="230" stroke="${C.red}" stroke-width="2" stroke-linecap="round" transform="rotate(${needle} 70 243)"/>
  <circle cx="70" cy="243" r="2.5" fill="#3a1a08"/>
  ${rivet(38, 222, 3)}${rivet(102, 222, 3)}${rivet(38, 264, 3)}${rivet(102, 264, 3)}
  <!-- pedestal -->
  <path d="M24 272 H116 L128 300 H12 Z" fill="url(#cyl)"/>
  <rect x="6" y="300" width="128" height="12" rx="4" fill="url(#cyl)"/>
  <rect x="6" y="309" width="128" height="3" fill="#000" opacity="0.4"/>
</svg>`;

write("src/assets/lamp/demo.svg", lamp(C.blue, C.blueCore, { pulse: true, needle: -60 }));
write("src/assets/lamp/your_turn.svg", lamp(C.amber, "#fff1d6", { needle: 0 }));
write("src/assets/lamp/success.svg", lamp(C.teal, "#eafff8", { needle: 90 }));
write("src/assets/lamp/error.svg", lamp(C.red, "#ffe2d6", { needle: -120 }));

// --- Background -------------------------------------------------------------

const bgGear = (cx, cy, r, teeth, dur, reverse = false, opacity = 1) => `
  <g opacity="${opacity}">
    <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="${reverse ? -360 : 360} ${cx} ${cy}" dur="${dur}s" repeatCount="indefinite"/>
    <path d="${gearPath(cx, cy, r, r * 0.86, teeth, r * 0.22)}" fill="url(#gearFill)" fill-rule="evenodd" stroke="#6a3414" stroke-opacity="0.5" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="none" stroke="#000" stroke-opacity="0.45" stroke-width="${r * 0.09}"/>
    ${[0, 72, 144, 216, 288].map((a) => {
      const rad = a * Math.PI / 180;
      return `<circle cx="${round(cx + Math.cos(rad) * r * 0.45)}" cy="${round(cy + Math.sin(rad) * r * 0.45)}" r="${round(r * 0.11)}" fill="#0e0603"/>`;
    }).join("")}
  </g>`;

const blueLight = (cx, cy, r, dur) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#blueHalo)">
    <animate attributeName="opacity" values="0.9;0.55;0.95;0.7;0.9" dur="${dur}s" repeatCount="indefinite"/>
  </circle>
  <circle cx="${cx}" cy="${cy}" r="${round(r * 0.06)}" fill="${C.blueCore}"/>`;

const pipe = (y, h) => `
  <rect x="-10" y="${y}" width="1940" height="${h}" fill="url(#pipe)"/>
  ${[160, 620, 1080, 1540].map((x) => `<rect x="${x}" y="${y - 6}" width="34" height="${h + 12}" rx="4" fill="url(#pipe)" stroke="#000" stroke-opacity="0.4"/>`).join("")}`;

write("public/bg.svg", `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" preserveAspectRatio="xMidYMid slice">
  <defs>${commonDefs}
    <radialGradient id="bgGrad" cx="0.5" cy="0.48" r="0.75">
      <stop offset="0" stop-color="#5a2910"/>
      <stop offset="0.45" stop-color="#2e1407"/>
      <stop offset="1" stop-color="#090302"/>
    </radialGradient>
    <radialGradient id="gearFill" cx="0.4" cy="0.35" r="0.8">
      <stop offset="0" stop-color="#4a2210"/>
      <stop offset="1" stop-color="#1a0a04"/>
    </radialGradient>
    <radialGradient id="blueHalo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${C.blue}" stop-opacity="0.95"/>
      <stop offset="0.35" stop-color="${C.blueDeep}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${C.blueDeep}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pipe" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1206"/>
      <stop offset="0.3" stop-color="#a0582a"/>
      <stop offset="0.5" stop-color="#5a2a10"/>
      <stop offset="1" stop-color="#1a0904"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.85"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>
  <g opacity="0.55">${pipe(150, 40)}${pipe(930, 56)}</g>
  ${bgGear(130, 120, 260, 18, 120)}
  ${bgGear(470, 300, 130, 12, 60, true, 0.85)}
  ${bgGear(1800, 980, 300, 20, 140, true)}
  ${bgGear(1480, 870, 150, 12, 70, false, 0.85)}
  ${bgGear(1760, 140, 120, 10, 55, false, 0.7)}
  ${bgGear(160, 960, 140, 12, 65, true, 0.7)}
  ${blueLight(560, 170, 180, 4.2)}
  ${blueLight(1360, 950, 210, 5.1)}
  ${blueLight(1700, 170, 140, 3.6)}
  ${blueLight(260, 950, 150, 4.7)}
  <rect width="1920" height="1080" fill="#000" filter="url(#grain)" opacity="0.35"/>
  <rect width="1920" height="1080" fill="url(#vignette)"/>
</svg>`);

write("public/favicon.svg", `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>${commonDefs}</defs>
  <path d="${gearPath(32, 32, 30, 24, 10, 0)}" fill="url(#brass)"/>
  <circle cx="32" cy="32" r="15" fill="url(#glass)"/>
  <circle cx="32" cy="32" r="8" fill="${C.blue}" filter="url(#glow)"/>
  <circle cx="32" cy="32" r="3.5" fill="${C.blueCore}"/>
</svg>`);
