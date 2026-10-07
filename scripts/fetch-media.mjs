#!/usr/bin/env node
// Media fetcher (ADR 0001 §4). Node built-ins + global fetch only.
// Never imported by src/. Never prints the API key.
//
//   npm run media                      fetch every manifest entry (skips existing files)
//   npm run media -- --force           re-download everything
//   npm run media -- --only hero,band-pool
//   npm run media -- --candidates "query" [--video] [--n 12] [--orientation landscape]
//        downloads small previews to media-raw/candidates/<query>/ so a human can
//        look before pinning an id. media-raw/ is gitignored.
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA_DIR = join(root, 'src/assets/media');
const VIDEO_DIR = join(root, 'public/media');
const RAW_DIR = join(root, 'media-raw');
const CREDITS = join(root, 'src/data/media-credits.json');
const MANIFEST = join(root, 'media-manifest.json');

const MAX_VIDEO_EDGE = 1920;
const MAX_VIDEO_BYTES = 6 * 1024 * 1024;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const KEY = process.env.PEXELS_API_KEY;

function needKey() {
  if (!KEY) {
    console.error('fetch-media: PEXELS_API_KEY is not set. Add it to .env (gitignored) and run `npm run media`.');
    process.exit(1);
  }
}

async function api(path) {
  const res = await fetch(`https://api.pexels.com${path}`, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status} on ${path.split('?')[0]}`);
  const left = res.headers.get('x-ratelimit-remaining');
  if (left && Number(left) < 20) console.warn(`  rate limit: ${left} requests left this hour`);
  return res.json();
}

async function download(url, dest, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`download ${res.status} for ${dest}`);
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
  return buf.length;
}

async function sizeOf(file) {
  if (typeof file.size === 'number') return file.size;
  const res = await fetch(file.link, { method: 'HEAD' });
  const len = res.headers.get('content-length');
  return len ? Number(len) : Infinity;
}

async function pickVideoFile(video, slot) {
  const mp4s = (video.video_files || [])
    .filter((f) => f.file_type === 'video/mp4' && f.width && f.height)
    .map((f) => ({ ...f, edge: Math.max(f.width, f.height) }))
    .filter((f) => f.edge <= MAX_VIDEO_EDGE)
    .sort((a, b) => b.edge - a.edge);
  for (const f of mp4s) {
    const bytes = await sizeOf(f);
    if (bytes <= MAX_VIDEO_BYTES) return { ...f, bytes };
  }
  console.error(`fetch-media: no mp4 rendition <= ${MAX_VIDEO_EDGE}px and <= 6 MB for slot "${slot}" (video ${video.id}).`);
  process.exit(2);
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function resolvePhoto(entry) {
  if (entry.id) return api(`/v1/photos/${entry.id}`);
  const q = new URLSearchParams({ query: entry.query, per_page: '1', size: 'large', orientation: entry.orientation || 'landscape' });
  const r = await api(`/v1/search?${q}`);
  if (!r.photos?.length) throw new Error(`no photo results for slot "${entry.slot}"`);
  console.log(`  ${entry.slot}: resolved id ${r.photos[0].id}. Pin it in media-manifest.json.`);
  return r.photos[0];
}

async function resolveVideo(entry) {
  if (entry.id) return api(`/videos/videos/${entry.id}`);
  const q = new URLSearchParams({ query: entry.query, per_page: '1', size: 'large', orientation: entry.orientation || 'landscape' });
  const r = await api(`/videos/search?${q}`);
  if (!r.videos?.length) throw new Error(`no video results for slot "${entry.slot}"`);
  console.log(`  ${entry.slot}: resolved id ${r.videos[0].id}. Pin it in media-manifest.json.`);
  return r.videos[0];
}

async function candidates() {
  needKey();
  const query = opt('--candidates');
  const isVideo = flag('--video');
  const n = opt('--n', '12');
  const orientation = opt('--orientation', 'landscape');
  const page = opt('--page', '1');
  const q = new URLSearchParams({ query, per_page: n, page, size: 'large', orientation });
  const dir = join(RAW_DIR, 'candidates', `${isVideo ? 'v-' : 'p-'}${query.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);
  mkdirSync(dir, { recursive: true });
  if (isVideo) {
    const r = await api(`/videos/search?${q}`);
    for (const v of r.videos || []) {
      const best = (v.video_files || []).filter((f) => f.file_type === 'video/mp4').sort((a, b) => b.width - a.width)[0];
      await download(v.image, join(dir, `${v.id}.jpg`));
      console.log(`${v.id}\t${v.duration}s\tsrc ${best?.width}x${best?.height}\t${v.user?.name}\t${v.url}`);
    }
  } else {
    const r = await api(`/v1/search?${q}`);
    for (const p of r.photos || []) {
      await download(p.src.large, join(dir, `${p.id}.jpg`));
      console.log(`${p.id}\t${p.width}x${p.height}\t${p.photographer}\t${p.alt?.slice(0, 70) ?? ''}`);
    }
  }
  console.log(`previews: ${dir}`);
}

async function run() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const only = opt('--only') ? opt('--only').split(',') : null;
  const force = flag('--force');
  const prior = existsSync(CREDITS) ? JSON.parse(readFileSync(CREDITS, 'utf8')) : [];
  const credits = new Map(prior.map((c) => [c.slot, c]));
  let failures = 0;

  for (const entry of manifest.media) {
    if (only && !only.includes(entry.slot)) continue;
    try {
      if (entry.source === 'client') {
        const dest = join(MEDIA_DIR, entry.file);
        if (!existsSync(dest) || force) {
          if (!entry.url) throw new Error(`client slot "${entry.slot}" has no url; copy ${entry.file} in by hand`);
          const bytes = await download(entry.url, dest, { Accept: 'image/jpeg' });
          console.log(`  ${entry.slot}: client photo ${kb(bytes)}`);
        } else console.log(`  ${entry.slot}: exists, skipped`);
        credits.set(entry.slot, {
          slot: entry.slot, type: 'photo', source: 'client', sourceUrl: entry.url ?? null,
          provenance: entry.provenance ?? null, file: `src/assets/media/${entry.file}`,
        });
        continue;
      }

      needKey();
      if (entry.type === 'photo') {
        const dest = join(MEDIA_DIR, `${entry.slot}.jpg`);
        const photo = await resolvePhoto(entry);
        if (!existsSync(dest) || force) {
          const bytes = await download(`${photo.src.original}?auto=compress&cs=tinysrgb&w=2560`, dest);
          console.log(`  ${entry.slot}: photo ${photo.id} ${kb(bytes)}`);
          if (flag('--raw')) await download(photo.src.original, join(RAW_DIR, `${entry.slot}-${photo.id}-original.jpg`));
        } else console.log(`  ${entry.slot}: exists, skipped`);
        credits.set(entry.slot, {
          slot: entry.slot, type: 'photo', pexelsId: photo.id, pageUrl: photo.url,
          author: photo.photographer, authorUrl: photo.photographer_url, file: `src/assets/media/${entry.slot}.jpg`,
        });
      } else if (entry.type === 'video') {
        const dest = join(VIDEO_DIR, `${entry.slot}.mp4`);
        const poster = join(MEDIA_DIR, `${entry.slot}-poster.jpg`);
        const video = await resolveVideo(entry);
        if (!existsSync(dest) || force) {
          const file = await pickVideoFile(video, entry.slot);
          const bytes = await download(file.link, dest);
          console.log(`  ${entry.slot}: video ${video.id} ${file.width}x${file.height} ${kb(bytes)}`);
        } else console.log(`  ${entry.slot}: exists, skipped`);
        if (!existsSync(poster) || force) {
          // video.image defaults to a 1200x630 OG crop. Ask for a 16:9 frame that
          // matches the video so the poster -> video swap does not jump.
          const u = new URL(video.image);
          u.search = '?auto=compress&cs=tinysrgb&fit=crop&w=2560&h=1440';
          await download(u.href, poster);
        }
        credits.set(entry.slot, {
          slot: entry.slot, type: 'video', pexelsId: video.id, pageUrl: video.url,
          author: video.user?.name, authorUrl: video.user?.url, file: `public/media/${entry.slot}.mp4`,
        });
      }
    } catch (err) {
      failures++;
      console.error(`fetch-media: ${entry.slot}: ${err.message}`);
    }
  }

  const ordered = manifest.media.map((e) => credits.get(e.slot)).filter(Boolean);
  mkdirSync(dirname(CREDITS), { recursive: true });
  writeFileSync(CREDITS, `${JSON.stringify(ordered, null, 2)}\n`);

  const total = [MEDIA_DIR, VIDEO_DIR].flatMap((d) =>
    manifest.media.flatMap((e) => [join(d, `${e.slot}.jpg`), join(d, `${e.slot}.mp4`), join(d, `${e.slot}-poster.jpg`), e.file ? join(d, e.file) : null])
  ).filter((p) => p && existsSync(p)).reduce((s, p) => s + statSync(p).size, 0);
  console.log(`credits: ${ordered.length} entries. Committed media: ${(total / 1048576).toFixed(1)} MB (budget 60 MB).`);
  if (failures) process.exit(1);
}

(opt('--candidates') ? candidates() : run()).catch((err) => {
  console.error(`fetch-media: ${err.message}`);
  process.exit(1);
});
