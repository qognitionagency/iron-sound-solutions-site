/**
 * Interface strings that are not marketing copy, plus overrides that track a media
 * change (MARS ruling 2026-10-07: content.ts is being fact-checked by Iris, so new
 * strings land here). Theo/Iris may fold these into content.ts later; keep the keys.
 */
export const uiLabels = {
  hero: {
    /**
     * Literal description of the pinned clip's poster frame (Pexels 39576513, shown mirrored).
     * Replaces content.ts hero.posterAlt, which described the previous clip.
     * seo-spec alt rules 1–2: what is in the frame, never attributed to Iron Sound.
     */
    posterAlt: 'Modern two-storey house with glass balconies beside a pool and palm trees in late-afternoon sun',
    /** Accessible name of the background-video control (aria-pressed = paused). */
    videoPause: 'Pause background video',
  },
  gallery: {
    /** Accessible name of the phone swipe row (a focusable region; distinct from the section heading). */
    railLabel: 'Project photos, scroll sideways',
  },
} as const;
