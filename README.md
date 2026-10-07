# Iron Sound Solutions — concept site

A one-page concept site Qognition built for **Iron Sound Solutions** (Josiah; home technology in South Florida: residential, commercial and marine) ahead of the 9 Oct 2026 discovery call. It is a pitch, not the client's live site. The official site is [ironsoundsolutions.com](https://ironsoundsolutions.com). A ribbon on the page marks it as a concept, and the page is `noindex`.

**Theme:** "Coastal Iron". It keeps Iron Sound's own palette: blue `#084D8C`, harbor navy, charcoal and warm stone. To that it adds a dusk glow and brass hairlines. Type is Archivo, expanded and subset, with Space Grotesk. Light only.

## What's on the page

- **Hero video.** Their tagline, *Built to last, designed to perform.*
- **"Systems we design and install" strip.** Control4, Lutron, Sonos, Ubiquiti, Illumivue. No dealer claims.
- **Services bento.** Six services.
- **Day → Dusk lighting scene.** Works as a toggle and on scroll.
- **Home / Business / Boat switcher.** Marine is the differentiator.
- **Process.** Consult → Design → Install → Support.
- **Trade CTA.** For architects and builders.
- **Project gallery.** Iron Sound's own photos.
- **Testimonials.** The three published ones, word for word.
- **Service area.** An SVG map of Palm Beach, Broward and Miami-Dade.
- **FAQ.** Includes FAQPage JSON-LD.
- **Consultation form.** Six steps.
- **Sticky Book/Call bar** on mobile.
- **Motion.** GSAP ScrollTrigger and Lenis. All of it is off under `prefers-reduced-motion`.

## Stack

Astro 5 (static), Tailwind v4, GSAP and Lenis, and Fontsource. Photos and video come from Pexels, downloaded and committed by `npm run media`. The key lives only in a local `.env`, which is gitignored. See [`docs/adr/0001-stack-and-structure.md`](docs/adr/0001-stack-and-structure.md).

```bash
npm install
npm run dev
npm test           # form module + url tests (also run on prebuild)
npm run build      # postbuild: dist suite, no Pexels key in dist, CSP hashes current
```

All copy lives in `src/data/content.ts`. Every unconfirmed value is tagged `// NEEDS DATA`.

## Deploy

**Hosting is Vercel.** The repo is private, and GitHub Pages isn't on the plan. Build env: `BASE_PATH=/`, `SITE_URL=https://<vercel domain>`. Security headers and CSP are in `vercel.json`.

- **Pages fallback.** `.github/workflows/deploy.yml` is manual-only.
- **Going live with a form endpoint.** Set `PUBLIC_FORM_ENDPOINT`, then run `node scripts/csp-hashes.mjs --write`. That adds the endpoint origin to the CSP. Skip it and the build fails, rather than shipping a form that silently blocks leads.
- **Analytics.** Demo-mode submits send `form_submit` with `mode: "demo"`. Any GTM conversion must filter on `mode = live`.
- **Runbook.** Rollback, re-fetching media and making the site indexable are in [`docs/runbook.md`](docs/runbook.md). To make it indexable, also remove `X-Robots-Tag` from `vercel.json`.

## Before this becomes Iron Sound's real site

Confirm these with Josiah:
- which brands he actively installs, and his dealer status for each
- home base and the counties he serves
- marine scope
- the consultation format, and support terms
- budget ranges
- photo provenance, and written permission for the testimonials and photos
- Florida licence number and legal name

Until those are confirmed, the page must not say "certified dealer", give years in business, or claim "24/7" or "100% satisfaction".

Photos and video: [Pexels](https://www.pexels.com) plus Iron Sound's own project photos. Credits are in `src/data/media-credits.json` and the footer.

Concept and build by Qognition Agency.
