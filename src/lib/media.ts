import type { ImageMetadata } from 'astro';
import credits from '../data/media-credits.json';

/**
 * Media lookup (ADR §2). Every processed image lives in src/assets/media as
 * <slot>.jpg (video posters as <slot>-poster.jpg) and is resolved by slot name,
 * so content.ts can reference media without importing files.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/media/*.jpg', { eager: true });

const bySlot = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.jpg$/, ''), mod.default]),
);

export function getMedia(slot: string): ImageMetadata {
  const img = bySlot.get(slot);
  if (!img) throw new Error(`media: no file for slot "${slot}". Run \`npm run media\` or check media-manifest.json.`);
  return img;
}

export const poster = (slot: string): ImageMetadata => getMedia(`${slot}-poster`);

export interface Credit {
  slot: string;
  type: 'photo' | 'video';
  source?: 'client';
  pexelsId?: number;
  pageUrl?: string;
  author?: string;
  authorUrl?: string;
  sourceUrl?: string | null;
  provenance?: string | null;
  file: string;
}

export const mediaCredits = credits as Credit[];

/** Pexels credits, one entry per author, in page order. */
export function stockAuthors(): { author: string; authorUrl: string }[] {
  const seen = new Map<string, string>();
  for (const c of mediaCredits) if (c.pexelsId && c.author && c.authorUrl && !seen.has(c.author)) seen.set(c.author, c.authorUrl);
  return [...seen].map(([author, authorUrl]) => ({ author, authorUrl }));
}
