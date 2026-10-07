// Renders the Dusk state of the signature room from the Day photo (art-direction §5.4,
// MARS refinement 2026-10-07). Dev-time only, never imported by src/. Output is committed:
//   src/assets/media/signature-room-dusk.jpg   (astro:assets serves AVIF/WebP)
// Run: node scripts/render-dusk.mjs   (needs sharp, Astro's image dependency)
//
// Recipe, in order:
//  1. Interior graded down and cool (brightness, saturation, a blue-leaning channel mix).
//  2. Glass: pixels inside the windows rect that read as sky/sea are re-lit as blue hour:
//     a vertical gradient (deep harbor → dusk violet → warm horizon) modulated by the
//     original luminance so cloud and wave texture survive. Mullions keep the interior grade.
//  3. Practical light: every fixture in signature-room-lights.json gets a hot core and a
//     wide warm bloom (screen); the sunken-lounge rim gets a blurred warm cove line;
//     the polished floor gets soft warm reflections under the pendants.
//  4. A gentle vignette.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const SRC = 'src/assets/media/signature-room.jpg';
const OUT = 'src/assets/media/signature-room-dusk.jpg';
const scene = JSON.parse(readFileSync('src/data/signature-room-lights.json', 'utf8'));

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (p) => Math.round((p / 100) * W);
const py = (p) => Math.round((p / 100) * H);

// Sky gradient stops (top → bottom of the glazing), RGB.
const SKY = [
  [0.0, [26, 36, 66]],
  [0.35, [52, 62, 112]],
  [0.62, [118, 116, 186]],
  [0.74, [214, 160, 150]], // warm band just above the horizon
  [0.8, [70, 74, 120]], // sea, darker than sky
  [1.0, [34, 42, 74]],
];
const skyAt = (t) => {
  for (let i = 1; i < SKY.length; i++) {
    if (t <= SKY[i][0]) {
      const [t0, c0] = SKY[i - 1];
      const [t1, c1] = SKY[i];
      const k = (t - t0) / (t1 - t0);
      return c0.map((v, j) => v + (c1[j] - v) * k);
    }
  }
  return SKY[SKY.length - 1][1];
};

const win = { x0: px(scene.windows.x), y0: py(scene.windows.y), x1: px(scene.windows.x + scene.windows.w), y1: py(scene.windows.y + scene.windows.h) };
// The horizon in this frame sits at ~50% of the image height; map the glazing so the warm band lands there.
const HORIZON = 0.5;

const out = Buffer.alloc(data.length);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const inWin = x >= win.x0 && x < win.x1 && y >= win.y0 && y < win.y1;
    const glass = inWin && b > r + 28 && b > 120; // sky / sea through the glass
    if (glass) {
      const t = Math.min(1, (y / H) / (HORIZON / 0.77));
      const [sr, sg, sb] = skyAt(t);
      const tex = 0.72 + 0.5 * (lum - 0.6); // keep cloud / wave texture
      out[i] = Math.max(0, Math.min(255, sr * tex));
      out[i + 1] = Math.max(0, Math.min(255, sg * tex));
      out[i + 2] = Math.max(0, Math.min(255, sb * tex));
    } else {
      // Interior: down and cool. Shadows lifted a touch so it reads as dusk, not night.
      const k = 0.36 + 0.1 * lum;
      out[i] = Math.min(255, (r * 0.86 + 6) * k);
      out[i + 1] = Math.min(255, (g * 0.9 + 8) * k);
      out[i + 2] = Math.min(255, (b * 1.04 + 16) * k);
    }
  }
}

// Practical light overlay (screen).
const lamp = '255,196,128';
const lampHot = '255,238,210';
const dusk = '142,155,255';
const blooms = scene.lights
  .map((l) => {
    const cx = px(l.x), cy = py(l.y);
    if (l.kind === 'lamp') {
      const R = px(l.r) * 2.2;
      return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#bloom)"/>
              <circle cx="${cx}" cy="${cy}" r="${px(l.r) * 0.32}" fill="url(#core)"/>`;
    }
    if (l.kind === 'pool') return `<ellipse cx="${cx}" cy="${cy}" rx="${px(l.r) * 1.2}" ry="${py(2.2)}" fill="url(#pool)"/>`;
    return '';
  })
  .join('\n');
// Floor reflections under the pendant cluster and the dining pendants (polished marble).
const reflections = scene.lights
  .filter((l) => l.kind === 'lamp')
  .map((l) => `<ellipse cx="${px(l.x)}" cy="${py(Math.min(96, 100 - l.y * 0.18 - 6))}" rx="${px(1.6)}" ry="${py(7)}" fill="url(#refl)"/>`)
  .join('\n');
// Cove: warm line along the timber rim of the sunken lounge (back edge and front diagonal).
const cove = `
  <polyline points="${px(9)},${py(64.5)} ${px(28)},${py(62.5)} ${px(50)},${py(59.5)} ${px(73)},${py(62.5)}" fill="none" stroke="rgb(${lamp})" stroke-width="${py(1.6)}" stroke-linecap="round" filter="url(#soft)" opacity="1"/>
  <polyline points="${px(23)},${py(99)} ${px(48)},${py(81)} ${px(73)},${py(63.5)}" fill="none" stroke="rgb(${lamp})" stroke-width="${py(1.4)}" stroke-linecap="round" filter="url(#soft)" opacity="1"/>`;

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bloom"><stop offset="0" stop-color="rgb(${lamp})" stop-opacity="0.85"/><stop offset="0.25" stop-color="rgb(${lamp})" stop-opacity="0.38"/><stop offset="0.6" stop-color="rgb(${lamp})" stop-opacity="0.1"/><stop offset="1" stop-color="rgb(${lamp})" stop-opacity="0"/></radialGradient>
    <radialGradient id="core"><stop offset="0" stop-color="rgb(${lampHot})" stop-opacity="1"/><stop offset="0.55" stop-color="rgb(${lamp})" stop-opacity="0.75"/><stop offset="1" stop-color="rgb(${lamp})" stop-opacity="0"/></radialGradient>
    <radialGradient id="pool"><stop offset="0" stop-color="rgb(${dusk})" stop-opacity="0.75"/><stop offset="1" stop-color="rgb(${dusk})" stop-opacity="0"/></radialGradient>
    <radialGradient id="refl"><stop offset="0" stop-color="rgb(${lamp})" stop-opacity="0.38"/><stop offset="1" stop-color="rgb(${lamp})" stop-opacity="0"/></radialGradient>
    <radialGradient id="room" cx="0.47" cy="0.3" r="0.6"><stop offset="0" stop-color="rgb(${lamp})" stop-opacity="0.34"/><stop offset="0.5" stop-color="rgb(${lamp})" stop-opacity="0.12"/><stop offset="1" stop-color="rgb(${lamp})" stop-opacity="0"/></radialGradient>
    <radialGradient id="spill"><stop offset="0" stop-color="rgb(${lamp})" stop-opacity="0.5"/><stop offset="1" stop-color="rgb(${lamp})" stop-opacity="0"/></radialGradient>
    <filter id="wide" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${py(3.5)}"/></filter>
    <filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="${py(1.4)}"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#room)"/>
  <!-- Dining room beyond the opening: lit warm by its own pendants and downlights. -->
  <rect x="${px(52)}" y="${py(36)}" width="${px(22)}" height="${py(24)}" fill="rgb(${lamp})" opacity="0.38" filter="url(#wide)"/>
  <!-- Lamp light falling on the sofa, the white wall and the ceiling slope. -->
  <ellipse cx="${px(46)}" cy="${py(66)}" rx="${px(20)}" ry="${py(9)}" fill="url(#spill)"/>
  <ellipse cx="${px(57)}" cy="${py(22)}" rx="${px(10)}" ry="${py(20)}" fill="url(#spill)" opacity="0.7"/>
  ${reflections}
  ${cove}
  ${blooms}
</svg>`);

const vignette = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="v" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0b1222" stop-opacity="0.45"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#v)"/></svg>`);

await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .composite([
    { input: svg, blend: 'screen' },
    { input: vignette, blend: 'over' },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(OUT);
console.log(`dusk: wrote ${OUT} (${W}x${H})`);
