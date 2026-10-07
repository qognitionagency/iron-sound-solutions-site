// withBase()/absoluteUrl() under both deploy bases (ADR 0001 §5): Vercel (/) and the
// GitHub Pages project site (/iron-sound-solutions-site/). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';

const OUT = new URL('./.out/', import.meta.url);
const root = await import(new URL('url-root.mjs', OUT).href);
const pages = await import(new URL('url-pages.mjs', OUT).href);

test('public/ paths carry the base: / on Vercel, /iron-sound-solutions-site/ on Pages', () => {
  assert.equal(root.withBase('brand/favicon.svg'), '/brand/favicon.svg');
  assert.equal(root.withBase('/brand/favicon.svg'), '/brand/favicon.svg');
  assert.equal(pages.withBase('brand/favicon.svg'), '/iron-sound-solutions-site/brand/favicon.svg');
  assert.equal(pages.withBase('/media/hero.mp4'), '/iron-sound-solutions-site/media/hero.mp4');
  assert.equal(root.withBase(''), '/');
  assert.equal(pages.withBase(''), '/iron-sound-solutions-site/');
});

test('external, tel: and mailto: URLs pass through untouched', () => {
  for (const u of ['https://www.pexels.com', 'http://example.test/x', 'tel:+15616707712', 'mailto:a@b.example']) {
    assert.equal(root.withBase(u), u);
    assert.equal(pages.withBase(u), u);
  }
});

// A path in front of the fragment ("/#consult") turns a CTA into a cross-document navigation
// whenever the page URL carries a query (?utm_source=ig): the browser reloads and drops the
// CTA prefill. A bare fragment is base-independent and always a same-document scroll.
test('in-page anchors stay bare fragments under both bases', () => {
  for (const mod of [root, pages]) assert.equal(mod.withBase('#consult'), '#consult');
  for (const [mod, page] of [[root, 'https://x.vercel.app/?utm_source=ig'], [pages, 'https://o.github.io/iron-sound-solutions-site/?utm_source=ig']]) {
    const target = new URL(mod.withBase('#consult'), page);
    const here = new URL(page);
    assert.equal(target.pathname + target.search, here.pathname + here.search);
  }
});

test('absoluteUrl() builds base-qualified URLs for canonical, OG, JSON-LD, sitemap, llms.txt', () => {
  const vercel = new URL('https://x.vercel.app');
  const gh = new URL('https://o.github.io');
  assert.equal(root.absoluteUrl(vercel, ''), 'https://x.vercel.app/');
  assert.equal(root.absoluteUrl(vercel, 'brand/og.png'), 'https://x.vercel.app/brand/og.png');
  assert.equal(pages.absoluteUrl(gh, ''), 'https://o.github.io/iron-sound-solutions-site/');
  assert.equal(pages.absoluteUrl(gh, 'sitemap.xml'), 'https://o.github.io/iron-sound-solutions-site/sitemap.xml');
});

// Booking form `action` (no-JS fallback POST) is set only for an https:// endpoint, so a
// misconfigured http:// or relative value can never receive contact details in cleartext.
// Same rule form.ts applies to the JS path (demo mode).
test('httpsOnly() keeps only https:// endpoints for the form action', () => {
  assert.equal(root.httpsOnly('https://api.web3forms.com/submit'), 'https://api.web3forms.com/submit');
  assert.equal(root.httpsOnly('  HTTPS://x.example/f  '), 'HTTPS://x.example/f');
  for (const bad of [undefined, '', '   ', 'http://x.example/f', '//x.example/f', '/api/form', 'javascript:alert(1)', 'https:/x']) {
    assert.equal(root.httpsOnly(bad), undefined, String(bad));
  }
});
