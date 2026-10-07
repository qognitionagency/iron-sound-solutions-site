import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/url';

/**
 * Operator ruling (2026-10-07): never `Disallow: /` for everyone. The meta
 * noindex is the search-engine control, and crawlers must be allowed to fetch the
 * page to see it (seo-spec §1). In concept mode the AI crawlers MARS listed
 * (2026-10-07, ADR §5 as amended) are kept off a page carrying a real
 * business's name. The Sitemap line is always emitted (MARS ruling).
 */
const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];

export const GET: APIRoute = ({ site }) => {
  const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
  const lines = [
    ...(indexable ? [] : AI_CRAWLERS.flatMap((ua) => [`User-agent: ${ua}`, 'Disallow: /', ''])),
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${absoluteUrl(site, 'sitemap.xml')}`,
  ];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
