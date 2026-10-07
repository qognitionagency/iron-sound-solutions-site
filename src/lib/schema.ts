/**
 * JSON-LD @graph (seo-spec.md §4). The business node describes the real business,
 * so its @id/url use the real domain. FAQPage mainEntity and the review array are
 * generated from content.ts so markup can never drift from the visible text.
 * No AggregateRating, priceRange, openingHours, foundingDate or geo: no source.
 */
import { contact, faq, meta, testimonials } from '../data/content';
import { absoluteUrl } from './url';

const BIZ = 'https://www.ironsoundsolutions.com/#business';

// Nadia's service catalogue, verbatim from seo-spec §4 (schema data, not visible copy).
const SERVICES: [string, string, string, string][] = [
  ['svc-automation', 'Home automation', 'Home automation installation', 'Unified control of lighting, motorized shades, audio, climate and security from a single interface, built on Control4.'],
  ['svc-lighting', 'Lighting control', 'Lighting control installation', 'Lutron lighting control with scenes and schedules for homes and businesses.'],
  ['svc-shades', 'Motorized shades', 'Motorized shade installation', 'Lutron motorized shades and window treatments for light control and privacy.'],
  ['svc-theater', 'Home theater and media rooms', 'Home theater installation', 'Custom home theaters and media rooms with surround sound, projection or displays, and integrated lighting.'],
  ['svc-audio', 'Whole-home and outdoor audio', 'Whole-home audio installation', 'Whole-home audio including Sonos, plus weather-rated TVs, speakers and lighting for patios, pools and outdoor living spaces.'],
  ['svc-network', 'Networking and Wi-Fi', 'Home and business network installation', 'Ubiquiti networking and Wi-Fi designed to carry cameras, streaming and control systems.'],
  ['svc-security', 'Security cameras and access control', 'Security camera installation', 'NDAA-compliant camera systems (Illumivue) and keypad or RFID access control for homes and businesses.'],
  ['svc-commercial', 'Commercial audio-video and control', 'Commercial AV installation', 'Conference rooms, distributed audio, video walls, displays and centralized control for businesses.'],
  ['svc-marine', 'Marine audio, video and onboard networking', 'Marine audio and video installation', 'Marine audio, displays, onboard networking and integrated control for boats, built using marine-rated components and clean installation practices.'],
  ['svc-support', 'Training and ongoing support', 'Smart home system support', 'A walk-through at handover, then ongoing support, upgrades and troubleshooting.'],
];

export function buildGraph(site: URL | undefined) {
  const home = absoluteUrl(site, '');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HomeAndConstructionBusiness',
        '@id': BIZ,
        name: contact.businessName,
        url: contact.officialSite,
        description:
          'Iron Sound Solutions designs and installs home automation, lighting control and motorized shades, home theater and whole-home audio, networking, security cameras and marine audio-video for homes, businesses and boats in South Florida.',
        slogan: meta.slogan,
        telephone: '+1-561-670-7712',
        email: contact.email,
        logo: absoluteUrl(site, 'brand/logo.png'),
        image: absoluteUrl(site, 'brand/og.png'),
        address: { '@type': 'PostalAddress', addressRegion: 'FL', addressCountry: 'US' },
        areaServed: ['Palm Beach County, Florida', 'Broward County, Florida', 'Miami-Dade County, Florida'].map((name) => ({ '@type': 'AdministrativeArea', name })),
        sameAs: [contact.instagramUrl],
        knowsAbout: ['Home automation', 'Lighting control', 'Motorized shades', 'Home theater', 'Whole-home audio', 'Home networking', 'Security cameras', 'Marine audio and video', 'Control4', 'Lutron', 'Sonos', 'Ubiquiti', 'Illumivue'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Systems we design and install',
          itemListElement: SERVICES.map(([id, name, serviceType, description]) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', '@id': `https://www.ironsoundsolutions.com/#${id}`, name, serviceType, description, provider: { '@id': BIZ } },
          })),
        },
        review: testimonials.items.map((t) => ({ '@type': 'Review', author: { '@type': 'Person', name: t.author }, reviewBody: t.quote })),
      },
      { '@type': 'WebSite', '@id': `${home}#website`, url: home, name: contact.businessName, inLanguage: meta.lang, publisher: { '@id': BIZ } },
      {
        '@type': 'FAQPage',
        '@id': `${home}#faq`,
        url: home,
        inLanguage: meta.lang,
        isPartOf: { '@id': `${home}#website` },
        about: { '@id': BIZ },
        mainEntity: faq.items.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
      },
    ],
  };
}
