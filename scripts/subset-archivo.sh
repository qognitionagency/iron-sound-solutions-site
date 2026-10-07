#!/usr/bin/env bash
# Builds src/assets/fonts/archivo-display-subset.woff2 from @fontsource-variable/archivo (latin, wdth).
# Dev-time only; the output is committed. Needs: pip3 install --user fonttools brotli
#
# Why: the full latin wdth file is ~88 KB and sat on the LCP path. Archivo is only ever
# rendered at font-stretch var(--font-display-stretch) = 118% and weights 720/780
# (--font-weight-heading / --font-weight-display), so the wdth axis is pinned at 118 and
# wght is limited to 700..800. Result ~20 KB.
# If Elena changes --font-display-stretch or the display/heading weights, re-run this with
# the new values (WDTH / WGHT below) and update the @font-face in src/styles/global.css.
# Characters outside UNICODES fall back per glyph to the next family in --font-display.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2
OUT=src/assets/fonts/archivo-display-subset.woff2
WDTH=118
WGHT=700:800
# Basic Latin, Latin-1, en/em dash, curly quotes, bullet, ellipsis, right arrow.
UNICODES="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2192"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
python3 -m fontTools.subset "$SRC" --unicodes="$UNICODES" --layout-features='*' --output-file="$TMP/subset.ttf"
python3 -m fontTools.varLib.instancer "$TMP/subset.ttf" "wdth=$WDTH" "wght=$WGHT" -o "$TMP/instanced.ttf"
mkdir -p "$(dirname "$OUT")"
python3 -m fontTools.ttLib.woff2 compress -o "$OUT" "$TMP/instanced.ttf"

# Fail if any character in content.ts falls outside the subset (it would render in the fallback face).
node -e '
const s = require("fs").readFileSync("src/data/content.ts", "utf8");
const ok = (c) => { const n = c.codePointAt(0); return n < 0x7f || (n >= 0xa0 && n <= 0xff) || [0x2013,0x2014,0x2018,0x2019,0x201a,0x201b,0x201c,0x201d,0x2022,0x2026,0x2192].includes(n) || n === 0x2500 || n === 0x0a; };
const miss = [...new Set([...s].filter((c) => !ok(c)))];
if (miss.length) { console.error("subset-archivo: content.ts uses characters outside the subset: " + miss.map((c) => "U+" + c.codePointAt(0).toString(16)).join(" ")); process.exit(1); }
'
echo "subset-archivo: wrote $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes)"
