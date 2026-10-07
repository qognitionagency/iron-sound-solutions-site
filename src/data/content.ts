/**
 * Iron Sound Solutions: concept landing page copy.
 *
 * The single source for every visible string on the page, and for the FAQPage and Review
 * JSON-LD (seo-spec.md §4: generate `mainEntity` and `review` from this file so markup
 * can never drift from visible text).
 *
 * Author: Theo (content), under MARS, 2026-10-07.
 * Status: DRAFT. Not shippable until Ruth (brand-guard) returns SHIP.
 * Basis: context.proposed.md (AI-derived from public sources, NOT client-confirmed),
 *        guardrails.md, brand-voice.md, research-brief.md, seo-spec.md (Nadia),
 *        cro-spec.md (Marcus), art-direction.md (Elena), ADR 0001.
 * Markdown mirror for review: ~/qognition-ops/clients/iron-sound-solutions/deliverables/2026-10-landing/page-copy.md
 *
 * ── BRIEF ────────────────────────────────────────────────────────────────────────────
 * Search intent: a South Florida homeowner, boat owner or designer who just searched
 *   "home automation Fort Lauderdale"-type queries, or was handed a link by a referrer.
 *   They are comparing integrators and want three answers fast: do you do my kind of
 *   job, will you still answer after the install, how do I start. (For the concept:
 *   Josiah, reading his own business on a page built properly.)
 * Citation angle: "Iron Sound Solutions designs and installs home automation, lighting,
 *   AV, networking, cameras and marine audio-video for homes, businesses and boats in
 *   South Florida", plus FAQ 8 (support after install). Nadia owns both strings.
 * Internal links: one page, so anchors. Nav → #services #sectors #process #reviews
 *   #faq #consult. FAQ 3 → #sectors, FAQ 4 → #consult (trade), FAQ 6 → #lighting,
 *   FAQ 8 → #consult. Every contextual CTA → #consult with prefill. Inbound: none, by
 *   design. The concept URL is noindex and must not be linked from any public profile
 *   (seo-spec §6). Outbound: tel, mailto, Instagram, Pexels credit.
 * Owned claim: the house, the pool deck and the boat at the dock, designed, installed
 *   and supported by one team. Residential integrators in the set do not market marine,
 *   and marine shops do not market homes (research-brief, observed 2026-10-07). Say
 *   "one team", never "unique" or "only".
 * ─────────────────────────────────────────────────────────────────────────────────────
 *
 * Conventions
 * - `heading` = the semantic H1/H2/H3. These are Nadia's fixed strings (seo-spec §3).
 *   Do not edit without her.
 * - `display` = the memorable line for the section, rendered as a <p>, styled as large
 *   as Elena wants. The same pattern as the hero tagline above the H1.
 * - `// NEEDS DATA:` marks a fact Josiah must confirm before production. The concept
 *   build may render the string. Every marker is listed again in page-copy.md.
 * - Testimonials and FAQ answers are byte-bound to schema. Do not trim, retype or
 *   "fix" them (guardrails: verbatim; Nadia: FAQ text = schema text).
 * - All anchors are same-page fragments (`#consult`), which need no withBase().
 *   Never write a leading "/" path here (ADR §5).
 */

// ── Shared types ────────────────────────────────────────────────────────────────────

export type ProjectType = "residential" | "commercial" | "marine";

export type ScopeKey =
  // home
  | "audio"
  | "theater"
  | "lighting"
  | "shades"
  | "network"
  | "cameras"
  | "outdoor"
  | "control"
  // business
  | "background_av"
  | "displays"
  | "access"
  // boat
  | "marine_audio"
  | "marine_video"
  | "marine_network"
  | "marine_control"
  // any
  | "unsure";

export type StageKey = "new_build" | "renovation" | "existing" | "refit" | "in_use";

export type RoleKey =
  | "homeowner"
  | "business"
  | "boat_owner"
  | "builder"
  | "architect"
  | "designer"
  | "property_manager";

/** Read by form.ts from data-prefill-* attributes (cro-spec §2, §5). */
export interface Prefill {
  type?: ProjectType;
  /** Keys absent from the chosen type's option list are ignored by form.ts. */
  scope?: readonly ScopeKey[];
  stage?: StageKey;
  role?: RoleKey;
}

export type CtaKind = "primary" | "secondary" | "trade" | "contextual";
export type TrackEvent = "cta_click" | "call_click" | "email_click";

export interface Cta {
  label: string;
  href: string;
  /** data-track */
  track: TrackEvent;
  /** data-track-id (cro-spec §2 table) */
  trackId: string;
  /** data-track-type */
  kind: CtaKind;
  ariaLabel?: string;
  prefill?: Prefill;
}

export interface Option<K extends string = string> {
  key: K;
  label: string;
}

export type MediaSource = "client" | "pexels";

export interface MediaRef {
  /** Elena's slot name (art-direction §5) or the client file name. */
  slot: string;
  source: MediaSource;
  /** "" = decorative (stock illustration next to a heading that carries the meaning). */
  alt: string;
}

// ── Contact (observed on ironsoundsolutions.com/contact, 2026-10-07) ─────────────────

// NEEDS DATA: confirm phone and email are still current, and who answers (561) 670-7712.
export const contact = {
  businessName: "Iron Sound Solutions",
  owner: "Josiah", // context: first name only in client-facing copy
  phoneDisplay: "(561) 670-7712",
  phoneHref: "tel:+15616707712",
  email: "Josiah@ironsoundsolutions.com",
  emailHref: "mailto:Josiah@ironsoundsolutions.com",
  instagramHandle: "@ironsoundsolutions",
  instagramUrl: "https://www.instagram.com/ironsoundsolutions/",
  officialSite: "https://www.ironsoundsolutions.com/",
  officialSiteDisplay: "ironsoundsolutions.com",
  // NEEDS DATA: home base and counties actually served. See serviceArea.
  areaLong: "Palm Beach, Broward and Miami-Dade counties",
} as const;

/** Section ids. Must match seo-spec §3 and llms.txt (§7). */
export const anchors = {
  top: "top",
  brands: "brands",
  services: "services",
  sectors: "sectors",
  lighting: "lighting",
  process: "process",
  trade: "build",
  work: "work",
  reviews: "reviews",
  area: "area",
  faq: "faq",
  consult: "consult",
} as const;

const BOOK = "#consult";
const BOOK_LABEL = "Book a consultation"; // cro-spec §2 option (a): CTAs say Book, the submit says Request.
const CALL_LABEL = `Call ${contact.phoneDisplay}`;

const call = (trackId: string, label: string = CALL_LABEL): Cta => ({
  label,
  href: contact.phoneHref,
  track: "call_click",
  trackId,
  kind: "secondary",
  ariaLabel: `Call Iron Sound Solutions on ${contact.phoneDisplay}`,
});

const book = (trackId: string, label: string = BOOK_LABEL, prefill?: Prefill, kind: CtaKind = "primary"): Cta => ({
  label,
  href: BOOK,
  track: "cta_click",
  trackId,
  kind,
  ...(prefill ? { prefill } : {}),
});

// ── Meta / SEO (seo-spec §3, exact values) ─────────────────────────────────────────

export const meta = {
  lang: "en-US",
  title: "Home Automation & AV in South Florida | Iron Sound Solutions",
  description:
    "Control4 automation, Lutron lighting and shades, audio-video, networking and cameras for South Florida homes, businesses and boats. Wired in and tested.",
  ogTitle: "Iron Sound Solutions: home, business and marine AV in South Florida",
  ogDescription:
    "Control4, Lutron, audio-video, networking and cameras for homes, businesses and boats across Palm Beach, Broward and Miami-Dade.",
  ogType: "website",
  ogSiteName: "Iron Sound Solutions",
  ogImageAlt: "Iron Sound Solutions logo over a South Florida home at dusk (concept)",
  ogLocale: "en_US",
  twitterCard: "summary_large_image",
  slogan: "Built to last, designed to perform.",
  // NEEDS DATA: "Wired in and tested" in the description is a practice claim. Josiah confirms systems are tested before handover.
} as const;

// ── Concept ribbon (guardrails: required disclosure) ───────────────────────────────

export const ribbon = {
  text: "Concept site by Qognition — sample content",
  /** Longer version for title/aria and the footer. */
  disclosure:
    "This is a concept site prepared by Qognition. It is not the official Iron Sound Solutions website, and some content is sample content.",
} as const;

// ── Nav ────────────────────────────────────────────────────────────────────────────

export const nav = {
  skipLink: "Skip to content",
  logoLabel: "Iron Sound Solutions, back to top",
  menuOpen: "Menu",
  menuClose: "Close menu",
  links: [
    { label: "Services", href: `#${anchors.services}` },
    { label: "Home · Business · Boat", href: `#${anchors.sectors}` },
    { label: "Process", href: `#${anchors.process}` },
    { label: "Reviews", href: `#${anchors.reviews}` },
    { label: "FAQ", href: `#${anchors.faq}` },
  ],
  primary: book("nav_book"),
  /** Desktop only, as text (cro-spec §2). */
  phone: call("nav_call", contact.phoneDisplay),
} as const;

// ── Hero ───────────────────────────────────────────────────────────────────────────

export interface Hero {
  /** Their line. Display <p> ABOVE the H1, may be styled largest (seo-spec §3). */
  kicker: string;
  /** The only H1 on the page. */
  heading: string;
  subhead: string;
  primary: Cta;
  secondary: Cta;
  areaLine: string;
  /** Poster <Picture> alt. The video is aria-hidden. */
  posterAlt: string;
}

export const hero: Hero = {
  kicker: "Built to last, designed to perform.",
  heading: "Home automation and AV for South Florida homes, businesses and boats",
  subhead:
    "The living room, the pool deck and the boat at the dock. One team designs each system, installs it cleanly and supports it after handover.",
  primary: book("hero_book"),
  secondary: call("hero_call"),
  // NEEDS DATA: counties served are unconfirmed (see serviceArea).
  areaLine: "Palm Beach, Broward and Miami-Dade",
  // COPY NEEDED after Mira pins the Pexels clip: describe the poster frame literally (seo-spec alt rule 1-2).
  // Draft assumes Elena's brief (exterior, lit pool, blue-hour sky). Never attribute it to Iron Sound.
  posterAlt: "Balcony overlooking a pool, palm trees and open water in golden evening light",
};

// ── Partner strip ──────────────────────────────────────────────────────────────────

export interface Brand {
  name: string;
  system: string;
}

// Plain text, no logo files until dealer status is confirmed (seo-spec §9.2, decision open for Elena/Ruth).
// No "certified", "authorized", "partner", "dealer" anywhere near these names (guardrails).
// NEEDS DATA: Josiah confirms each brand is actively installed: Control4, Lutron, Sonos, Ubiquiti, Illumivue.
export const partners = {
  heading: "Systems we design and install",
  brands: [
    { name: "Control4", system: "Home and business automation" },
    { name: "Lutron", system: "Lighting control and motorized shades" },
    { name: "Sonos", system: "Whole-home audio" },
    { name: "Ubiquiti", system: "Networking and Wi-Fi" },
    { name: "Illumivue", system: "NDAA-compliant camera systems" }, // spelled Illumivue. Never "Illumiview".
  ] satisfies readonly Brand[],
} as const;

// ── Services bento (6) ─────────────────────────────────────────────────────────────

export interface ServiceTile {
  id: string;
  size: "large" | "small";
  /** H3 */
  heading: string;
  /** Opens with the system and what it controls (seo-spec §6 pass 1). */
  lede: string;
  body: string;
  link: Cta;
  media: MediaRef;
}

const tileLink = (id: string, scope: readonly ScopeKey[], what: string): Cta => ({
  label: "Add to my consultation",
  href: BOOK,
  track: "cta_click",
  trackId: `services_tile_${id}`,
  kind: "contextual",
  ariaLabel: `Add ${what} to my consultation request`,
  prefill: { scope },
});

// Tile set follows the operator's six and Elena's six slots (theater and audio together,
// lighting and shades apart). Nadia's outline groups them differently. Raised for her sign-off.
export const services = {
  heading: "Home automation, lighting, audio-video, networking and security",
  display: "Six systems, installed and supported by one team.",
  tiles: [
    {
      id: "audio-video",
      size: "large",
      heading: "Home theater and whole-home audio",
      lede: "Theaters, media rooms and music in every room, out to the pool deck.",
      body: "Speakers go in the ceiling, the wall or the landscape. Sonos runs the music from one app. Outdoor TVs and speakers are weather-rated.",
      link: tileLink("audio-video", ["theater", "audio", "outdoor"], "home theater and audio"),
      media: { slot: "svc-audio-video", source: "pexels", alt: "" },
    },
    {
      id: "automation",
      size: "large",
      heading: "Home automation (Control4)", // NEEDS DATA: Control4 actively installed; how it is sourced and programmed (not in dealer locator)
      lede: "Control4 puts the lighting, shades, music, climate and cameras on one keypad, one touchscreen and one app.",
      body: "Scenes do the routine work. Movie dims the room, lowers the shades and starts the screen. Away turns everything off and leaves the cameras on your phone.",
      link: tileLink("automation", ["control"], "home automation"),
      media: { slot: "svc-automation", source: "pexels", alt: "" },
    },
    {
      id: "lighting",
      size: "small",
      heading: "Lighting control (Lutron)", // NEEDS DATA: Lutron actively installed
      lede: "Lutron dimmers and keypads replace rows of switches with scenes you name.",
      body: "One button sets the kitchen for dinner. Another lights the path to the dock.",
      link: tileLink("lighting", ["lighting"], "lighting control"),
      media: { slot: "svc-lighting", source: "pexels", alt: "" },
    },
    {
      id: "shades",
      size: "small",
      heading: "Motorized shades (Lutron)", // NEEDS DATA: Lutron actively installed. Never imply storm protection.
      lede: "Lutron shades lower before the afternoon sun reaches the room.",
      body: "Run them on a schedule, a keypad or the app. Hardwired shades are easiest to plan before drywall.",
      link: tileLink("shades", ["shades"], "motorized shades"),
      media: { slot: "svc-shades", source: "pexels", alt: "" },
    },
    {
      id: "networking",
      size: "small",
      heading: "Networking and Wi-Fi", // NEEDS DATA: Ubiquiti actively installed. Never "Ubiquiti partner".
      lede: "Ubiquiti networking, cabled where it matters, with Wi-Fi planned room by room, outdoors included.",
      body: "Cameras, screens and keypads all share the network. Fixed devices get a cable. Access points go in the ceiling, out of sight.",
      link: tileLink("networking", ["network"], "networking and Wi-Fi"),
      media: { slot: "svc-networking", source: "pexels", alt: "" },
    },
    {
      id: "security",
      size: "small",
      heading: "Security cameras and access control",
      // NEEDS DATA: Illumivue actively installed; keypad/RFID access control offered (only evidence on the live site is an AI-generated image).
      // No alarm or monitoring language: licensed trade in Florida, no licence number on file.
      lede: "NDAA-compliant camera systems (Illumivue), with keypad and RFID entry for gates and doors.",
      body: "We plan what each camera covers, where the footage is kept and who can see it from their phone.",
      link: tileLink("security", ["cameras"], "security cameras"),
      media: { slot: "svc-security", source: "pexels", alt: "" },
    },
  ] satisfies readonly ServiceTile[],
  cta: book("services_book"),
} as const;

// ── Environment switcher (Home / Business / Boat) ──────────────────────────────────

export interface SectorPanel {
  id: ProjectType;
  tabLabel: string;
  /** H3 inside the panel (seo-spec §3) */
  heading: string;
  /** Memorable line, <p> */
  headline: string;
  /** One sentence naming what is installed there (seo-spec §3). */
  opener: string;
  bullets: readonly [string, string, string];
  /** Exact contiguous excerpt of a verbatim testimonial. See RUTH note. */
  proof?: { testimonialId: TestimonialId; excerpt: string };
  cta: Cta;
  secondary: Cta;
  media: MediaRef;
  /** Optional line, render only when non-null. */
  note: string | null;
}

export const sectors = {
  heading: "Residential, commercial and marine systems",
  display: "On land or on the water, the same clean install.",
  tablistLabel: "Choose where the system goes",
  panels: [
    {
      id: "residential",
      tabLabel: "Home",
      heading: "Homes",
      headline: "The whole house, from one keypad.",
      opener:
        "In homes we install theaters, whole-home audio, Lutron lighting and shades, Ubiquiti Wi-Fi and cameras, all run from Control4.",
      bullets: [
        // NEEDS DATA: residential pre-wire offered? The live site lists "new builds, renovations" under commercial only.
        "Pre-wire for new builds and renovations, or a careful retrofit into finished rooms.",
        "Outdoor audio, TVs and lighting for the patio and the pool deck.",
        "A walk-through at handover, and support after it.",
      ],
      // RUTH (2026-10-07): an excerpt IS an edit under guardrails "exactly as published ... No edits". Full quote only.
      // Mira: render this as the full quote, or drop the proof block in the component. Never trim it.
      proof: {
        testimonialId: "michael-c",
        excerpt:
          "Iron Sound Solutions delivered exactly what they promised. The install was clean, the system works flawlessly, and the attention to detail was impressive. Highly recommend for anyone looking for reliable, high-quality AV work.",
      },
      cta: book("env_residential_book", "Book a home consultation", { type: "residential" }, "contextual"),
      secondary: call("env_call"),
      media: { slot: "env-residential", source: "pexels", alt: "" },
      note: null,
    },
    {
      id: "commercial",
      tabLabel: "Business",
      heading: "Businesses",
      headline: "One panel runs the room.",
      // NEEDS DATA: commercial client types and share of work. No commercial proof exists (cro-spec objection table, EMPTY).
      opener:
        "In businesses we install conference room AV, background music, displays and video walls, cameras and access control.",
      bullets: [
        "Conference rooms and displays run from one control panel.",
        "Background music by zone, set from a panel or a phone.",
        "Camera coverage and door entry planned around who needs to see and open what.",
      ],
      cta: book("env_commercial_book", "Book a business consultation", { type: "commercial" }, "contextual"),
      secondary: call("env_call"),
      // Do NOT use the three /services commercial images: their filenames begin "ChatGPT Image Jan 21, 2026".
      media: { slot: "env-commercial", source: "pexels", alt: "" },
      note: null,
    },
    {
      id: "marine",
      tabLabel: "Boat",
      heading: "Boats",
      headline: "Built for the boat, not borrowed from the house.",
      // Client claim stops at the live site's words: "marine-rated components and clean installation practices".
      // Banned: yacht (in headings), superyacht, offshore, saltwater-rated, vibration-resistant.
      // NEEDS DATA: vessel types and lengths, marine brands installed, marine job count.
      opener:
        "On boats we install marine audio, displays, onboard networking and integrated control, built using marine-rated components and clean installation practices.",
      bullets: [
        "Marine audio and displays for the cockpit, the cabin and the deck.",
        "Onboard networking and integrated control, designed around how you use the boat.",
        "Wiring routed, secured and left tidy.",
      ],
      cta: book("env_marine_book", "Book a boat consultation", { type: "marine" }, "contextual"),
      secondary: call("env_call"),
      // NEEDS DATA: Josiah confirms IMG_4286 is his install, and gives permission plus the original file.
      media: {
        slot: "env-marine-client",
        source: "client",
        alt: "Speaker set into the cockpit side of a boat, above a grey non-skid deck",
      },
      // NEEDS DATA: is Josiah attending or exhibiting at FLIBS (28 Oct to 1 Nov 2026)? If yes, set:
      // "See us at the Fort Lauderdale International Boat Show, 28 October to 1 November."
      note: null,
    },
  ] satisfies readonly SectorPanel[],
} as const;

// ── Day → dusk lighting ────────────────────────────────────────────────────────────

// Elena builds Dusk as a CSS layer over ONE daylight photo (art-direction §5.4), so the
// shades do not visibly move. Captions describe only what changes in the frame. The body
// copy describes what the scene does.
export const lighting = {
  heading: "Lighting control and motorized shades, from day to dusk",
  display: "Set sunset once.",
  body: "Lutron lighting and motorized shades run on scenes you name. At sunset, the dusk scene lowers the shades and brings the lamps up warm and low. It runs on a schedule, or on one button by the door.",
  controlLabel: "Lighting scene",
  states: {
    day: {
      label: "Day",
      caption: "Day. Daylight does the work. Lamps off.",
      // Verify against the pinned frame (seo-spec alt rule 5).
      alt: "Living room in daylight with large windows and the lamps off",
    },
    dusk: {
      label: "Dusk",
      caption: "Dusk. Lamps up, warm and low. One scene, on a schedule.",
      alt: "The same living room at dusk with warm lamps on (illustration)",
    },
  },
  /** Visible label on the image (guardrails: stock is never captioned as Iron Sound work). */
  illustrationNote: "Illustration. Stock photography, not an Iron Sound project.",
  /** In the DOM from load, revealed by JS after the first toggle (cro-spec §4a). */
  cta: book("lighting_book", "Plan lighting for your home", { type: "residential", scope: ["lighting"] }, "contextual"),
} as const;

// ── Process ────────────────────────────────────────────────────────────────────────

export interface ProcessStep {
  n: 1 | 2 | 3 | 4;
  /** Stepper label: Consult → Design → Install → Support */
  short: string;
  /** H3, the live site's own step names (seo-spec §3) */
  heading: string;
  body: string;
}

// Named `processSteps`, not `process`, so it never shadows Node's global in shared tooling.
export const processSteps = {
  heading: "How a project runs: consultation, design, installation, support",
  display: "Four steps, and no surprises.", // "no surprises" is the live /services wording
  steps: [
    {
      n: 1,
      short: "Consult",
      heading: "Consultation",
      // NEEDS DATA: consultation format (on-site, phone, video), whether it is free, typical length. Do not write "free" until confirmed.
      body: "Start with how you use the space and what you want it to do. We ask the questions up front, so nothing gets guessed later.",
    },
    {
      n: 2,
      short: "Design",
      heading: "Custom design",
      body: "A system designed for your space, with clear equipment recommendations and transparent pricing. You see the equipment list and the price before the work starts.",
    },
    {
      n: 3,
      short: "Install",
      heading: "Professional installation",
      // NEEDS DATA: Josiah confirms every system is tested before handover (brand-voice sample, not observed).
      body: "Clean wiring, hidden where it should be. Each system is tested before we hand it over.",
    },
    {
      n: 4,
      short: "Support",
      heading: "Training and ongoing support",
      // NEEDS DATA: support terms, service plans, call-out fees, response window. Never "24/7".
      body: `A walk-through until the system feels like yours. After that, ongoing support, upgrades and troubleshooting, one call away at ${contact.phoneDisplay}.`,
    },
  ] satisfies readonly ProcessStep[],
  /** Caleb's quote sits beside step 4 (cro-spec §2). Render the full text from `testimonials`. */
  step4TestimonialId: "caleb-s" as TestimonialId,
  primary: book("process_book"),
  secondary: call("process_call"),
} as const;

// ── Trade band ─────────────────────────────────────────────────────────────────────

// Proof cell is EMPTY (cro-spec objection 6), so the copy states what pre-wire needs and makes no claims.
// NEEDS DATA: does Iron Sound get builder/designer work today, and from whom? Pre-wire / plan-review process?
// Never "low-voltage contractor" (licensed trade).
export const trade = {
  heading: "Working on a build? Bring us in early.",
  body: "Speakers, shades, access points and keypads all need cable before the drywall goes up. The earlier we see the plans, the fewer walls get opened later.",
  audience: "For architects, builders and interior designers.",
  cta: {
    label: "Talk to us about the build",
    href: BOOK,
    track: "cta_click",
    trackId: "trade_talk",
    kind: "trade",
    prefill: { stage: "new_build", role: "builder" },
  } satisfies Cta,
  secondary: call("trade_call"),
} as const;

// ── Projects (gallery) ─────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  /** H3: system + room. City only if confirmed. */
  heading: string;
  caption: string;
  alt: string;
  source: MediaSource;
  /** Original file name on ironsoundsolutions.com (Squarespace CDN), viewed 2026-10-07. */
  file: string;
  credit: string;
}

// All six are Iron Sound's OWN photos from their live site (source: "client"). Zero stock.
// Captions describe only what is in the frame. None says "installed by Iron Sound" until confirmed.
// Excluded on purpose: the homepage house photo (an Unsplash file, stock) and the three /services
// commercial images (filenames "ChatGPT Image Jan 21, 2026", AI-generated).
// NEEDS DATA: Josiah confirms each photo is his own install, gives permission and supplies originals.
const PROJECT_PHOTOS_CONFIRMED = false;

export const projects = {
  // seo-spec §3: "Recent work" only when every image is confirmed as Iron Sound's.
  heading: PROJECT_PHOTOS_CONFIRMED ? "Recent work" : "Rooms we design for",
  display: "Work you mostly won't see.",
  intro: "You see the screen, the shade and the light. The cable stays in the wall.",
  items: [
    {
      id: "pendants",
      heading: "Pendant cluster, double-height living room",
      caption: "Wire-sphere pendants hung at staggered heights over a high-rise living room, glass on three sides.",
      alt: "Cluster of wire-sphere pendant lights in a double-height high-rise living room with floor-to-ceiling windows over the water",
      source: "client",
      file: "IMG_6538.jpg", // Elena: crop the bottom quarter (bags and a drink can in the foreground)
      credit: "Photo: Iron Sound Solutions",
    },
    {
      id: "theater",
      heading: "Home theater, wood-panelled",
      caption: "Ceiling-mounted projector, curtained screen and leather recliners in a wood-panelled room.",
      alt: "Wood-panelled home theater with a ceiling-mounted projector, a screen framed by curtains and leather recliners",
      source: "client",
      file: "IMG_0614.jpeg",
      credit: "Photo: Iron Sound Solutions",
    },
    {
      id: "shades",
      heading: "Roller shades, high-rise over the ocean",
      // NEEDS DATA: are these motorized, and Lutron? Do not name a system until confirmed.
      caption: "Roller shades across a wall of glass, cutting the glare and keeping the view.",
      alt: "Sheer roller shades lowered across floor-to-ceiling windows overlooking the ocean",
      source: "client",
      file: "IMG_7496.jpg",
      credit: "Photo: Iron Sound Solutions",
    },
    {
      id: "outdoor-tv",
      heading: "Outdoor TV, covered patio",
      // Location unknown (background is open pasture). Do not caption it as South Florida.
      caption: "TV mounted on a stone chimney above the mantel, tilted down toward the seating.",
      alt: "Flat-screen TV mounted on a stone fireplace above a wooden mantel on a covered patio",
      source: "client",
      file: "IMG_1496.jpg",
      credit: "Photo: Iron Sound Solutions",
    },
    {
      id: "camera",
      heading: "Exterior camera, commercial building",
      // NEEDS DATA: camera brand. Do not say Illumivue unless confirmed for this job.
      caption: "Dome camera on a junction box, with the cable run in flexible conduit.",
      alt: "Dome security camera mounted on a junction box on a metal building, cable in grey flexible conduit",
      source: "client",
      file: "IMG_0668.JPG",
      credit: "Photo: Iron Sound Solutions",
    },
    {
      id: "boat-deck",
      heading: "Cockpit speaker, boat",
      // Same photo as the Boat panel. If Elena wants no repeat, drop this item (5 tiles) rather than add stock.
      caption: "Speaker set flush into the cockpit side, above a non-skid deck.",
      alt: "Speaker set into the cockpit side of a boat, above a grey non-skid deck, water alongside",
      source: "client",
      file: "IMG_4286.PNG",
      credit: "Photo: Iron Sound Solutions",
    },
  ] satisfies readonly Project[],
  cta: book("gallery_book"),
} as const;

// ── Testimonials (VERBATIM) ────────────────────────────────────────────────────────

export type TestimonialId = "ed-desiree-v" | "michael-c" | "caleb-s";

export interface Testimonial {
  id: TestimonialId;
  /** Byte-exact from ironsoundsolutions.com, 2026-10-07. "down packed" is sic. Do not edit. */
  quote: string;
  /** Exactly as displayed on their site. No invented surnames. */
  author: string;
  /** Our section label, not part of the quote. RUTH: veto if you read it as an edit. */
  moment: string;
}

// NEEDS DATA: the authors' permission to be quoted on a new site; testimonial dates (no datePublished in schema).
// UNVERIFIED: byte-level apostrophe in "today's" (straight vs curly). Text below matches seo-spec §4 JSON-LD.
// No photos, no star ratings, no AggregateRating (seo-spec §4).
export const testimonials = {
  heading: "What clients say after the install",
  display: "Before the job, during it, and after.",
  items: [
    {
      id: "ed-desiree-v",
      quote:
        "Phenomenal customer service and communicates so well even before accepting a job. In today's day and age communication is key and Josiah clearly has that down packed. Very fair pricing and amazing work.",
      author: "Ed & Desiree, V",
      // RUTH (2026-10-07): moment labels vetoed. They reframe the quote. Mira: render nothing when empty.
      moment: "",
    },
    {
      id: "michael-c",
      quote:
        "Iron Sound Solutions delivered exactly what they promised. The install was clean, the system works flawlessly, and the attention to detail was impressive. Highly recommend for anyone looking for reliable, high-quality AV work.",
      author: "Michael, C",
      moment: "",
    },
    {
      id: "caleb-s",
      quote:
        "What truly sets Josiah apart is his commitment to quality and client satisfaction. He and his team were punctual, respectful of our home, and meticulous in their installation. Post-installation, the support has been just as excellent — responsive, reliable, and proactive.",
      author: "Caleb, S",
      moment: "",
    },
  ] satisfies readonly Testimonial[],
  cta: book("testimonials_book"),
} as const;

// ── Service area ───────────────────────────────────────────────────────────────────

// NEEDS DATA: geography is inconsistent on the live site (observed 2026-10-07): page titles say
// "Broward County", meta descriptions say "Miami-Dade County and Palm Beach County", the phone is a
// 561 (Palm Beach) number, no street address anywhere, and /home-page schema says Broward / Florida.
// "Palm Beach, Broward and Miami-Dade" is the concept's working value, NOT confirmed. Josiah names
// his home base, the counties he serves and whether this is a service-area business (no public address).
export const serviceArea = {
  heading: "Service area: Palm Beach, Broward and Miami-Dade counties",
  display: "Three counties. One number to call.",
  body: "We work in homes, businesses and on boats across Palm Beach, Broward and Miami-Dade counties, including Fort Lauderdale, Boca Raton, Palm Beach and Miami.",
  counties: ["Palm Beach County", "Broward County", "Miami-Dade County"],
  // NEEDS DATA: confirm cities. Do not add more without real local jobs (seo-spec §2: no doorway pages).
  cities: ["Fort Lauderdale", "Boca Raton", "Palm Beach", "Miami"],
  mapLabel: "Map of South Florida showing Palm Beach, Broward and Miami-Dade counties",
  ask: {
    label: "Not sure we cover you? Ask us",
    href: BOOK,
    track: "cta_click",
    trackId: "area_ask",
    kind: "contextual",
  } satisfies Cta,
  secondary: call("area_call"),
} as const;

// ── FAQ (Nadia's 8, VERBATIM; text = FAQPage schema text) ──────────────────────────

export interface FaqItem {
  /** faq_open `faq_id` */
  id: string;
  /** H3 */
  question: string;
  /** Renders in the <p> after the H3. Bound to schema. Do not edit without Nadia. */
  answer: string;
  /** Rendered after the answer, outside the schema text. */
  link?: Cta;
}

export const faq = {
  heading: "Questions homeowners and boat owners ask",
  display: "Straight answers, before the first call.",
  items: [
    {
      id: "control4-vs-savant",
      // NEEDS DATA: Josiah confirms Control4 is actively installed (last sentence).
      question: "Control4 or Savant: which home automation system is right for my home?",
      answer:
        "Both are whole-home control platforms that a professional integrator designs, installs and programs. The differences that matter day to day are the interface your household will use and which devices each one drives well. The bigger question is who will program and support the system after the install. Iron Sound designs and installs Control4.",
    },
    {
      id: "automation-cost",
      // NEEDS DATA: typical price bands by job type. Real bands would make this the most citable answer.
      question: "How much does whole-home automation cost?",
      answer:
        "There is no honest flat price, because the cost follows the scope. The main drivers are how many rooms you automate, which systems you include (lighting, shades, audio, video, cameras, network), whether walls are still open for pre-wire, and how many keypads and touchscreens you want. Iron Sound gives clear equipment recommendations and transparent pricing after a consultation.",
    },
    {
      id: "marine-saltwater",
      question: "Can you install audio and video on a boat that runs in saltwater?",
      answer:
        "Yes. Salt air, spray, sun and constant motion wear out household speakers, screens and connectors quickly, so a boat needs equipment made for the marine environment and wiring that is routed and secured with care. Iron Sound builds marine systems using marine-rated components and clean installation practices, covering audio, displays, onboard networking and integrated control.",
      link: {
        label: "See what we install on boats",
        href: `#${anchors.sectors}`,
        track: "cta_click",
        trackId: "faq_sectors",
        kind: "contextual",
      },
    },
    {
      id: "prewire-timing",
      // NEEDS DATA: residential pre-wire offered? builder/designer relationships? (answer makes no Iron Sound claim on purpose)
      question: "When should smart home wiring go in during new construction or a remodel?",
      answer:
        "Plan it before drywall. The best moment is the rough-in stage, after framing and before the walls close, when cable for speakers, TVs, Wi-Fi access points, cameras, keypads and motorized shades can run straight to where it is needed. Wiring finished walls later is slower and more disruptive. Bring your integrator in while the plans can still change.",
      link: {
        label: "Working on a build? Bring us in early",
        href: BOOK,
        track: "cta_click",
        trackId: "faq_trade",
        kind: "trade",
        prefill: { stage: "new_build", role: "builder" },
      },
    },
    {
      id: "hurricane-surge",
      // NEEDS DATA: does Iron Sound specify surge protection / UPS and offer pre-storm checks? (educational answer only)
      question: "How do I protect smart home equipment from hurricanes and power surges?",
      answer:
        "Start with the power. Surge protection and battery backup on the equipment rack and network reduce the chance that a surge or brownout damages controllers, and let the system shut down cleanly. Outdoor TVs and speakers should be weather-rated. Before storm season, ask your integrator what restarts on its own when power returns and what needs a visit.",
    },
    {
      id: "lutron-shades",
      // NEEDS DATA: Josiah confirms Lutron is actively installed. Must not imply storm protection.
      question: "What do Lutron motorized shades do in a South Florida home?",
      answer:
        "They open and close on a schedule, a keypad, the Lutron app or a whole-home control system, so afternoon sun is blocked before a room heats up. Battery-powered models suit finished homes. Hardwired models need power at the top of the window, which is easiest to run before drywall. Iron Sound designs and installs Lutron lighting and shades.",
      link: {
        label: "See lighting and shades from day to dusk",
        href: `#${anchors.lighting}`,
        track: "cta_click",
        trackId: "faq_lighting",
        kind: "contextual",
      },
    },
    {
      id: "smart-home-network",
      question: "What kind of network does a smart home need?",
      answer:
        "A wired backbone with Wi-Fi that reaches every room and the outdoor spaces. Cameras, streaming, control systems and phones all share one network, so weak Wi-Fi shows up as a frozen camera feed or a slow keypad. Ceiling-mounted access points and Ethernet to fixed devices keep it stable. Iron Sound designs and installs Ubiquiti networking for homes and businesses.",
    },
    {
      id: "after-install",
      question: "What happens after the installation is finished?",
      answer:
        "Every Iron Sound project finishes with a walk-through, so you know how to use the system and are comfortable with it. After that, Iron Sound offers ongoing support, upgrades and troubleshooting, and you reach the team at (561) 670-7712.",
      link: {
        label: "Request a consultation",
        href: BOOK,
        track: "cta_click",
        trackId: "faq_consult",
        kind: "contextual",
      },
    },
  ] satisfies readonly FaqItem[],
  primary: book("faq_book"),
  secondary: call("faq_call"),
} as const;

// ── Consultation form (cro-spec §3) ────────────────────────────────────────────────

export type StepKey = "type" | "scope" | "stage" | "budget" | "timeline" | "contact";

export const form = {
  heading: "Request a consultation", // H2 (seo-spec §3); step labels are <legend>s, not headings
  display: "Tell us about the project.",
  intro:
    "Six short steps, most of them one tap. Your answers mean the first call starts with your project, not a questionnaire.",
  /** Visible progress text. Replace {current} and {total}. */
  progress: "Step {current} of {total}",
  /** Polite aria-live announcement on step change. */
  progressLive: "Step {current} of {total}: {step}",
  back: "Back",
  stepNames: {
    type: "Project type",
    scope: "What's included",
    stage: "Project stage",
    budget: "Budget",
    timeline: "Timeline",
    contact: "Contact details",
  } satisfies Record<StepKey, string>,

  // Step 1
  type: {
    legend: "What are we working on?",
    options: [
      { key: "residential", label: "Home" },
      { key: "commercial", label: "Business" },
      { key: "marine", label: "Boat" },
    ] satisfies readonly Option<ProjectType>[],
    error: "Choose home, business or boat so we can ask the right questions.",
    next: "Next: what's included",
  },

  // Step 2. Lists mapped from /services (observed 2026-10-07).
  // NEEDS DATA: Josiah confirms the lists, especially access control and commercial lighting.
  scope: {
    legend: "What do you want in it?",
    helper: "Pick all that apply. Not sure is a fine answer.",
    options: {
      residential: [
        { key: "audio", label: "Whole-home audio" },
        { key: "theater", label: "Home theater or media room" },
        { key: "lighting", label: "Lighting control" },
        { key: "shades", label: "Motorized shades" },
        { key: "network", label: "Wi-Fi and networking" },
        { key: "cameras", label: "Cameras and security" },
        { key: "outdoor", label: "Outdoor and pool-deck entertainment" },
        { key: "control", label: "Whole-home control" },
        { key: "unsure", label: "Not sure yet, help me plan" },
      ],
      commercial: [
        { key: "background_av", label: "Background music and AV" },
        { key: "displays", label: "Displays and conference rooms" },
        { key: "cameras", label: "Cameras and surveillance" },
        { key: "access", label: "Door entry and access control" },
        { key: "network", label: "Networking" },
        { key: "lighting", label: "Lighting control" },
        { key: "unsure", label: "Not sure yet" },
      ],
      marine: [
        { key: "marine_audio", label: "Marine audio" },
        { key: "marine_video", label: "Displays and video" },
        { key: "marine_network", label: "Onboard networking" },
        { key: "marine_control", label: "Integrated control" },
        { key: "unsure", label: "Not sure yet" },
      ],
    } satisfies Record<ProjectType, readonly Option<ScopeKey>[]>,
    error: "Pick at least one, or choose Not sure yet.",
    next: "Next: project stage",
  },

  // Step 3
  stage: {
    land: {
      legend: "Where is the project now?",
      options: [
        { key: "new_build", label: "New build" },
        { key: "renovation", label: "Renovation" },
        { key: "existing", label: "Existing space, adding or upgrading" },
      ] satisfies readonly Option<StageKey>[],
      teamLegend: "Is an architect, builder or designer involved?",
      teamOptions: [
        { key: "yes", label: "Yes" },
        { key: "not_yet", label: "Not yet" },
        { key: "i_am", label: "I am the builder or designer" }, // sets role=trade
      ] satisfies readonly Option[],
    },
    boat: {
      legend: "Tell us about the boat.",
      stageLabel: "Stage",
      options: [
        { key: "new_build", label: "New build" },
        { key: "refit", label: "Refit" },
        { key: "in_use", label: "In use, adding or upgrading" },
      ] satisfies readonly Option<StageKey>[],
      lengthLabel: "Length",
      // NEEDS DATA: which lengths Josiah takes on. Change the top band rather than invite leads he will turn down.
      lengthOptions: [
        { key: "under_30", label: "Under 30 ft" },
        { key: "30_45", label: "30–45 ft" },
        { key: "45_65", label: "45–65 ft" },
        { key: "65_plus", label: "65 ft and over" },
      ] satisfies readonly Option[],
      typeLabel: "Type (optional)",
      typeOptions: [
        { key: "center_console", label: "Center console" },
        { key: "express", label: "Express or cruiser" },
        { key: "sportfish", label: "Sportfish" },
        { key: "motor_yacht", label: "Motor yacht" },
        { key: "sailboat", label: "Sailboat" },
        { key: "other", label: "Other" },
      ] satisfies readonly Option[],
    },
    error: "Choose the option closest to where things are.",
    next: "Next: budget",
  },

  // Step 4 (optional). No dollar figure anywhere until Josiah supplies the bands.
  budget: {
    legend: "Do you have a budget range in mind?",
    helper: "Optional. It helps us come to the first conversation prepared.",
    bands: [
      // NEEDS DATA: band values set by Iron Sound, possibly different per sector.
      { key: "a", label: "Range A", marker: "Range set with Iron Sound" },
      { key: "b", label: "Range B", marker: "Range set with Iron Sound" },
      { key: "c", label: "Range C", marker: "Range set with Iron Sound" },
      { key: "d", label: "Range D", marker: "Range set with Iron Sound" },
    ],
    guidance: "I'd like guidance on budget",
    notSay: "Prefer not to say",
    // RUTH: cro-spec suggests Ed & Desiree beside this step. If shown, render their FULL quote from `testimonials`, never an excerpt.
    next: "Next: timeline",
  },

  // Step 5
  timeline: {
    legend: "When would you like this done?",
    options: [
      { key: "asap", label: "As soon as possible" },
      { key: "3m", label: "Within 3 months" },
      { key: "3_6m", label: "3 to 6 months" },
      { key: "6_12m", label: "6 to 12 months" },
      { key: "build_schedule", label: "Tied to a build schedule" },
      { key: "exploring", label: "Just exploring for now" },
    ] satisfies readonly Option[],
    error: "Choose a timeframe. Just exploring is fine.",
    next: "Next: contact details",
  },

  // Step 6
  contact: {
    legend: "How do we reach you?",
    name: { label: "Name", error: "Add your name so we know who to ask for." },
    email: { label: "Email", error: "That email doesn't look complete. Check for a missing @ or dot." },
    phone: {
      label: "Phone",
      hint: "Optional, but it's the fastest way to talk.",
      error: "Use a 10-digit number, like 561 555 0123.",
    },
    contactPref: {
      legend: "Best way to reach you",
      options: [
        { key: "call", label: "Call" },
        { key: "text", label: "Text" },
        { key: "email", label: "Email" },
      ] satisfies readonly Option[],
      error: "Choose how you'd like us to reply.",
    },
    // Shown only when Text is chosen. Unchecked by default. Imogen and Ruth sign off this wording (TCPA).
    smsConsent: {
      label:
        "I agree to receive text messages from Iron Sound Solutions about this project at the number above. Message frequency varies. Message and data rates may apply. Reply STOP to opt out. Consent is not a condition of purchase.",
      error: "Tick the box to allow texts, or choose call or email.",
    },
    location: {
      labelLand: "City or ZIP",
      labelBoat: "Where is the boat kept? (city or marina)",
      error: "Tell us roughly where, so we can check we cover it.",
    },
    role: {
      label: "I'm the…",
      options: [
        { key: "homeowner", label: "Homeowner" },
        { key: "business", label: "Business owner or manager" },
        { key: "boat_owner", label: "Boat owner or captain" },
        { key: "builder", label: "Builder" },
        { key: "architect", label: "Architect" },
        { key: "designer", label: "Interior designer" },
        { key: "property_manager", label: "Property manager" },
      ] satisfies readonly Option<RoleKey>[],
    },
    notes: {
      label: "Anything else?",
      hint: "Rooms, the boat, the timeline, what annoys you about the current setup.",
      counter: "{used} of 1,000 characters",
      error: "Keep it under 1,000 characters. We'll cover the rest on the call.",
    },
    // Separate, unchecked. Only opted-in contacts get Imogen's nurture (guardrails).
    emailOptIn: { label: "Email me a short follow-up series on planning the project. Unsubscribe any time." },
    honeypot: { label: "Leave this field empty" },
  },

  submit: "Request my consultation",
  submitting: "Sending…",
  callAlt: { prefix: "Prefer to talk?", cta: call("form_call") },
  // NEEDS DATA: form provider name once Luke picks one. Never "we never share your data" (guardrails).
  dataUse:
    "Your details go to Iron Sound Solutions so we can reply about this project. This form is processed by our form provider.",

  /** Replaces the form in place. Focus moves to the heading. */
  success: {
    heading: "Thanks, {firstName}. We have your project details.",
    recapLabels: { type: "Project", scope: "Includes", stage: "Stage", timeline: "Timeline" },
    // NEEDS DATA: realistic response window, and whether Josiah personally replies. No time promise until confirmed.
    next: "Josiah will be in touch to set up the consultation.",
    callLine: `Can't wait? Call ${contact.phoneDisplay}.`,
  },
  error: {
    heading: "That didn't send.",
    body: "Your answers are still here.",
    retry: "Try again",
    fallback: `Or email ${contact.email}, or call ${contact.phoneDisplay}.`,
    /** mailto subject, project type only, no PII. */
    mailtoSubject: "Consultation request: {projectType}",
  },
  /** ADR §6, exact. Shown with the success layout when PUBLIC_FORM_ENDPOINT is unset. */
  demoNotice: "Concept site: this form is not connected yet.",
} as const;

// ── Mobile sticky bar (<768px) ─────────────────────────────────────────────────────

export const stickyBar = {
  label: "Quick contact",
  book: book("mobilebar_book", "Book"),
  call: call("mobilebar_call", "Call"),
  bookAria: "Book a consultation",
} as const;

// ── Footer ─────────────────────────────────────────────────────────────────────────

export const footer = {
  tagline: "Built to last, designed to perform.",
  // seo-spec §3 NAP, identical to schema. NEEDS DATA: service area (see serviceArea).
  nap: {
    name: contact.businessName,
    phone: call("footer_call", contact.phoneDisplay),
    email: {
      label: contact.email,
      href: contact.emailHref,
      track: "email_click",
      trackId: "footer_email",
      kind: "secondary",
    } satisfies Cta,
    area: "Serving Palm Beach, Broward and Miami-Dade counties",
    instagram: { label: `Instagram ${contact.instagramHandle}`, href: contact.instagramUrl },
  },
  links: nav.links,
  // No licence, no "licensed & insured", no founding year, no © legal name.
  // NEEDS DATA: Florida licence type and number; legal business name (Sunbiz).
  trademarks:
    "Control4, Lutron, Sonos, Ubiquiti and Illumivue are trademarks of their respective owners. Naming them here describes the systems we install.",
  credits: {
    clientPhotos: "Project photos: Iron Sound Solutions.",
    pexels: { label: "Photos and video from Pexels", href: "https://www.pexels.com" }, // API term: visible link
    /** Prefix for per-author credits rendered from media-credits.json. */
    authorsPrefix: "Stock photography by",
  },
  concept: `${ribbon.disclosure} The official site is ${contact.officialSiteDisplay}.`,
  backToTop: "Back to top",
} as const;
