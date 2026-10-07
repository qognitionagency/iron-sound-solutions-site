import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/url';

/** One-page site: one URL. Generated even in noindex mode so the craft is visible (ADR §5). */
export const GET: APIRoute = ({ site }) => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${absoluteUrl(site, '')}</loc></url>
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
