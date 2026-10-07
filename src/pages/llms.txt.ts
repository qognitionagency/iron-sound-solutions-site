import type { APIRoute } from 'astro';
import { contact, faq, form, lighting, meta, partners, processSteps, ribbon, sectors, serviceArea, services, testimonials } from '../data/content';
import { absoluteUrl } from '../lib/url';

/**
 * llms.txt (seo-spec §7), assembled from content.ts so it can never drift from
 * the page. In concept mode the disclosure leads. Anchors match the section ids.
 */
export const GET: APIRoute = ({ site }) => {
  const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
  const u = (hash: string) => absoluteUrl(site, '') + hash;
  const brandLine = partners.brands.map((b) => `${b.name} (${b.system.replace(/^[A-Z](?![A-Z])/, (c) => c.toLowerCase())})`).join(', ');
  const lines = [
    `# ${contact.businessName}`,
    '',
    ...(indexable ? [] : [`> ${ribbon.disclosure} The official site is ${contact.officialSite}.`, '']),
    `> ${meta.description} ${contact.areaLong}. Phone ${contact.phoneDisplay}. Email ${contact.email}.`,
    '',
    `${partners.heading}: ${brandLine}.`,
    '',
    ...sectors.panels.map((p) => `- ${p.heading}: ${p.opener}`),
    '',
    '## Services',
    `- [${services.heading}](${u('#services')})`,
    `- [${sectors.heading}](${u('#sectors')})`,
    `- [${lighting.heading}](${u('#lighting')})`,
    '',
    '## How a project runs',
    `- [${processSteps.heading}](${u('#process')}): ${processSteps.steps.map((s) => s.heading).join(', ')}`,
    '',
    '## Answers',
    `- [${faq.heading}](${u('#faq')})`,
    ...faq.items.map((q) => `  - ${q.question}`),
    '',
    '## Contact',
    `- [${form.heading}](${u('#consult')}): phone ${contact.phoneDisplay}`,
    `- [${serviceArea.heading}](${u('#area')})`,
    '',
    '## Optional',
    `- [${testimonials.heading}](${u('#reviews')})`,
    `- [Instagram ${contact.instagramHandle}](${contact.instagramUrl})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
