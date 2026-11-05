// Bonexis blok na početnoj: istih 7 kapsula kao na /bonexis/ (data/bonexis.ts), sa owner agentom.
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
    short: 'Social',
    doesEn: 'Researches what is current in your niche, prepares posts the way you want them, lets you know when content is ready and, after your approval, schedules and publishes to social media and the blog.',
    gets: { bs: 'Redovne, relevantne objave bez svakodnevnog ručnog planiranja.', en: 'Regular, relevant posts without daily manual planning.' },
  },
  2: {
    short: 'SEO',
    doesEn: 'Reviews selected pages of your site, shows what it actually read and finds technical and content SEO gaps with a suggested fix.',
    gets: { bs: 'Jasna lista SEO ispravki po prioritetu, s dokazom za svaki nalaz.', en: 'A clear, prioritised list of SEO fixes with evidence for every finding.' },
  },
  3: {
    short: 'Blog',
    doesEn: 'Turns an approved topic into a draft article with SEO fields, sources and a visual. You edit and approve, and it publishes to the blog only once you confirm.',
    gets: { bs: 'Više kvalitetnih članaka uz manje vremena za pisanje.', en: 'More quality articles with less time spent writing.' },
  },
  4: {
    short: 'Leads',
    doesEn: 'Finds relevant companies with a verifiable reason to get in touch, rates their priority and prepares the outreach. With Sara, the AI assistant, it can call approved leads and book meetings.',
    gets: { bs: 'Organizovaniji outreach, zakazani sastanci i manje propuštenih prilika.', en: 'More organised outreach, booked meetings and fewer missed opportunities.' },
  },
  5: {
    short: 'Capacity',
    doesEn: 'Tells you whether you can take on new work: it simulates workload by person, skill and week and suggests a redistribution. The plan does not change without your confirmation.',
    gets: { bs: 'Bolja raspodjela posla i ranije uočavanje preopterećenja.', en: 'Better distribution of work and earlier warning of overload.' },
  },
  6: {
    short: 'Delivery',
    doesEn: 'Turns an approved quote into clear commitments and links them to proof of delivery. It separates done, delivered and accepted by the client.',
    gets: { bs: 'Veća preglednost projekta i manje sporova oko obima posla.', en: 'Clearer project visibility and fewer disputes about scope.' },
  },
  7: {
    short: 'Audit',
    doesEn: 'Team members submit daily work with evidence, Ada checks it against the brief and criteria, and the team lead decides whether to accept it or ask for changes.',
    gets: { bs: 'Jasniji interni kvalitet i strukturirane povratne informacije.', en: 'Clearer internal quality and structured feedback.' },
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
