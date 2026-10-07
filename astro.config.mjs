// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// ADR 0001 §5: site and base come from the environment so one build works on
// GitHub Pages (/<repo>/) and on a root host. Nothing here reads PEXELS_API_KEY.
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
  vite: {
    // Cast: @tailwindcss/vite is typed against a newer Vite than Astro 5 bundles (types only; runtime is fine).
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
