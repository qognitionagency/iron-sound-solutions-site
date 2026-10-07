// postbuild guard (ADR §4): fail the build if the Pexels key name or value
// appears anywhere in dist/. Prints file names only, never matched content.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const needles = ['PEXELS'];
const key = process.env.PEXELS_API_KEY;
if (key && key.length > 8) needles.push(key);

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(html|js|mjs|css|txt|xml|json|map|svg)$/.test(name)) {
      const text = readFileSync(p, 'utf8');
      if (needles.some((n) => text.includes(n))) hits.push(p.replace(root, 'dist/'));
    }
  }
}
walk(root);
if (hits.length) {
  console.error(`check-dist: forbidden string found in ${hits.length} file(s):\n  ${hits.join('\n  ')}`);
  process.exit(1);
}
console.log('check-dist: no PEXELS string in dist/');
