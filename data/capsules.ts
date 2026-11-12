// Bonexis blok na početnoj: 5 kapsula kao na /bonexis/ (data/bonexis.ts), sa owner agentom.
// "Šta radi" je opis owner agenta iz data/bonexis.ts; EN prijevodi i "Šta dobijate" su ovdje.
import { BONEXIS_AGENTS, CAPSULES } from './bonexis';

export interface Capsule {
  id: string;
  n: number;
  name: string;
  short: string;
  persona: string;
  /** asistent u kapsuli (Sara u kapsuli 4) */
  assistant?: string;
  does: { bs: string; en: string };
  gets: { bs: string; en: string };
}

const EXTRA: Record<number, { short: string; doesEn: string; gets: { bs: string; en: string } }> = {
  1: {
    short: 'Web & SEO',
    doesEn: 'Reviews up to 80 pages and their visuals, analyses and suggests improvements, automatically prepares blogs and SEO optimisation, analyses keywords and organic visibility. All changes go live only after your approval.',
    gets: { bs: 'Jedinstven sistem za poboljšanje sadržaja, izgleda i organske vidljivosti web stranice.', en: 'A single system for improving your website content, visuals and organic visibility.' },
  },
  2: {
    short: 'Leads',
    doesEn: 'Finds and qualifies potential clients, identifies business opportunities and supports sales activities. With Sara, the AI assistant, it can call approved leads and book meetings.',
    gets: { bs: 'Organizovaniji outreach, zakazani sastanci i manje propuštenih prilika.', en: 'More organised outreach, booked meetings and fewer missed opportunities.' },
  },
  3: {
    short: 'Capacity',
    doesEn: 'Smart business capacity planning, task distribution, employee workload analysis and bottleneck prediction. The plan does not change without your confirmation.',
    gets: { bs: 'Bolja raspodjela posla i ranije uočavanje preopterećenja.', en: 'Better distribution of work and earlier warning of overload.' },
  },
  4: {
    short: 'Delivery',
    doesEn: 'Controls agreed vs. delivered work, tracks commitments to clients, detects delays and additional work outside the agreed scope.',
    gets: { bs: 'Veća preglednost projekta i manje sporova oko obima posla.', en: 'Clearer project visibility and fewer disputes about scope.' },
  },
  5: {
    short: 'Quality',
    doesEn: 'Employees upload daily work, AI rates quality against the brief. At month-end the capsule generates a percentage quality report, while HR gives an independent assessment — the director gets both.',
    gets: { bs: 'Dva nezavisna mjesečna izvještaja o kvalitetu rada: AI i HR, za direktora.', en: 'Two independent monthly work quality reports: AI and HR, for the director.' },
  },
};

export const PUBLIC_CAPSULES: Capsule[] = CAPSULES.map(c => {
  const owner = BONEXIS_AGENTS.find(a => a.capsule === c.n && a.role === 'owner')!;
  const assistant = BONEXIS_AGENTS.find(a => a.capsule === c.n && a.role === 'assistant');
  const x = EXTRA[c.n];
  return {
    id: `k${c.n}`,
    n: c.n,
    name: c.title,
    short: x.short,
    persona: owner.persona,
    assistant: assistant?.persona,
    does: { bs: owner.desc, en: x.doesEn },
    gets: x.gets,
  };
});
