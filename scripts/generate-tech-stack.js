#!/usr/bin/env node
/**
 * Regenerates profile/tech-stack.svg from scripts/config.json.
 * Usage: node scripts/generate-tech-stack.js
 *
 * Edit config.json to add/remove/reorder technologies or categories —
 * chip widths and row layout are computed automatically, so nothing in
 * the SVG needs to be hand-positioned again.
 */
const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "config.json");
const OUT_PATH = path.join(__dirname, "..", "profile", "tech-stack.svg");

const CHAR_W = 7.2;      // approx monospace advance width at 13.5px
const CHIP_PAD = 26;     // horizontal padding inside a chip
const CHIP_GAP = 10;     // gap between chips
const ROW_H = 70;        // vertical space per category row
const ROW_START_Y = 98;  // first label baseline
const PANEL_W = 900;

function chipWidth(label) {
  return Math.round(label.length * CHAR_W + CHIP_PAD);
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildRow(category, rowIndex, delay) {
  const labelY = ROW_START_Y + rowIndex * ROW_H;
  const chipsY = labelY + 12;

  let x = 0;
  const chips = category.items
    .map((item) => {
      const label = escapeXml(item);
      const w = chipWidth(item);
      const chip = `
      <rect class="chip" x="${x}" width="${w}" height="30" rx="8"/><text x="${x + w / 2}" y="20" text-anchor="middle" class="chip-txt">${label}</text>`;
      x += w + CHIP_GAP;
      return chip;
    })
    .join("");

  return `
  <g class="fade" style="animation: fadeIn .25s ease ${delay}s forwards">
    <text x="52" y="${labelY}" class="lbl">${escapeXml(category.label)}</text>
    <g transform="translate(52,${chipsY})">${chips}
    </g>
  </g>`;
}

function main() {
  const { categories } = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  const rows = categories.map((c, i) => buildRow(c, i, (0.05 + i * 0.11).toFixed(2))).join("\n");
  const panelH = ROW_START_Y + categories.length * ROW_H + 60;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PANEL_W} ${panelH}" width="${PANEL_W}" height="${panelH}"
     font-family="ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace" role="img"
     aria-label="Tech stack">
  <defs>
    <linearGradient id="flow2" gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="840" y2="0">
      <stop offset="0" stop-color="#00D26A"/>
      <stop offset="1" stop-color="#6EE7B7"/>
    </linearGradient>
    <linearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00D26A"/>
      <stop offset="1" stop-color="#6EE7B7"/>
    </linearGradient>
    <symbol id="core" viewBox="-60 -60 120 120">
      <polygon points="0,-54 46.8,-27 46.8,27 0,54 -46.8,27 -46.8,-27" fill="none" stroke="url(#coreGrad)" stroke-width="6"/>
      <circle cx="0" cy="0" r="16" fill="#00D26A"/>
    </symbol>
  </defs>
  <style>
    text { font-size: 13.5px; }
    .dim { fill: #9CA3AF; }
    .lbl { fill: #00D26A; font-size: 11.5px; letter-spacing: 2px; }
    .chip-txt { fill: #F5F5F5; }
    .fade { opacity: 0; }
    @keyframes fadeIn { to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .fade { animation: none !important; opacity: 1 !important; } }
    .chip { fill: #111111; stroke: #222222; }
  </style>

  <rect x="20" y="16" width="${PANEL_W - 40}" height="${panelH - 32}" rx="16" fill="#090909" stroke="#222222"/>
  <path d="M20 30 A16 16 0 0 1 34 16 H${PANEL_W - 54} A16 16 0 0 1 ${PANEL_W - 40} 30 V58 H20 Z" fill="#111111"/>
  <line x1="20" y1="58" x2="${PANEL_W - 40}" y2="58" stroke="#222222"/>
  <circle cx="46" cy="37" r="6" fill="#2a2a2a"/>
  <circle cx="66" cy="37" r="6" fill="#2a2a2a"/>
  <circle cx="86" cy="37" r="6" fill="#2a2a2a"/>
  <use href="#core" x="${PANEL_W - 60}" y="29" width="16" height="16"/>
  <text x="${PANEL_W / 2}" y="42" text-anchor="middle" class="dim" font-size="12.5">tech_stack.map()</text>
${rows}

  <rect x="52" y="${panelH - 58}" width="${PANEL_W - 104}" height="2" fill="url(#flow2)" opacity="0.6"/>
</svg>
`;

  fs.writeFileSync(OUT_PATH, svg);
  console.log(`Wrote ${OUT_PATH} (${categories.length} categories)`);
}

main();
