// One-off raster exports from Elena's SVGs (art-direction.md §5.7, §7).
// Dev-time only; never imported by src/. Run: node scripts/make-brand-raster.mjs
// Needs sharp (Astro's image dependency) and src/assets/media/hero-poster.jpg.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const brand = (f) => readFileSync(new URL(`../public/brand/${f}`, import.meta.url));
const STONE = '#F7F6F2';
const HARBOR = '#25344F';
const BRASS = '#B08D57';

// Apple touch icon: 180x180, sRGB, no alpha (iOS masks the corners).
await sharp(brand('apple-touch-icon.svg'), { density: 300 }).resize(180, 180).flatten({ background: '#084D8C' }).png().toFile('public/apple-touch-icon.png');
// Legacy favicon.
await sharp(brand('favicon.svg'), { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');
// Schema logo (seo-spec §4 `logo`): horizontal lockup at 2x, on stone so it is legible anywhere.
await sharp(brand('logo-horizontal.svg'), { density: 300 }).resize({ width: 1082 }).flatten({ background: STONE }).extend({ top: 40, bottom: 40, left: 40, right: 40, background: STONE }).png().toFile('public/brand/logo.png');

// OG image 1200x630: stone field, logo 560 wide centred at 40% height, hero strip 1200x260 below,
// and a "Concept" tag so a pasted link never reads as Iron Sound's official site (seo-spec §3).
const logo = await sharp(brand('logo-horizontal.svg'), { density: 300 }).resize({ width: 560 }).png().toBuffer();
const { height: lh } = await sharp(logo).metadata();
const strip = await sharp('src/assets/media/hero-poster.jpg').resize(1200, 260, { fit: 'cover', position: 'centre' }).toBuffer();
const tag = Buffer.from(`<svg width="1200" height="370" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="369" width="1200" height="1" fill="${BRASS}"/>
  <rect x="1012" y="32" width="156" height="36" rx="2" fill="none" stroke="${HARBOR}" stroke-opacity="0.4"/>
  <text x="1090" y="56" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-size="15" letter-spacing="3.5" fill="${HARBOR}">CONCEPT</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: STONE } })
  .composite([
    { input: tag, top: 0, left: 0 },
    { input: logo, top: Math.round(630 * 0.4 - lh / 2) - 40, left: 320 },
    { input: strip, top: 370, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/brand/og.png');
console.log('brand rasters written');
