/**
 * withBase(path): the only way to build a public/ or in-page URL (ADR §5).
 * Joins import.meta.env.BASE_URL with `path` without doubling slashes.
 * A hard-coded leading "/" anywhere else is a bug.
 */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL || '/';
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const b = base.endsWith('/') ? base : `${base}/`;
  const p = path.replace(/^\/+/, '');
  return `${b}${p}`;
}

/** Absolute URL for canonical, OG and JSON-LD. `site` is Astro.site. */
export function absoluteUrl(site: URL | undefined, path = ''): string {
  const origin = site ? site.origin : 'http://localhost:4321';
  return new URL(withBase(path), origin).href;
}

/**
 * The value only if it is an absolute https:// URL, else undefined. Used for the booking
 * form's `action` (the no-JS POST), matching form.ts's live/demo rule: never post contact
 * details to a cleartext or relative endpoint.
 */
export function httpsOnly(value: string | undefined): string | undefined {
  const v = (value ?? '').trim();
  return /^https:\/\/[^/\s]/i.test(v) ? v : undefined;
}
