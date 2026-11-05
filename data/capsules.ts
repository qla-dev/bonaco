// Javna najava Bonexisa (web brief v1.3, sekcija 04): pet kapsula na razini koristi.
// Do januara 2027. samo kratki, odobreni opisi bez tehničkih obećanja; status "U razvoju".
// TODO(Bonaco + QLA): potvrditi konačne opise, MVP opseg i status svake kapsule prije objave.

/** false = na /bonexis/ se prikazuje samo najava; true = i dosadašnji demo (chat, scenariji, 3D tim, dashboard). */
export const BONEXIS_DEMO_PUBLIC = false;

export interface Capsule {
  id: string;
  name: string;
  short: string;
  does: { bs: string; en: string };
  gets: { bs: string; en: string };
}

export const PUBLIC_CAPSULES: Capsule[] = [
  {
    id: 'web-content-seo',
    name: 'AI Web, Content & SEO Manager',
    short: 'Web & SEO',
    does: {
      bs: 'Pomaže u pregledu weba, sadržaja i SEO zadataka, uz prijedloge i korisnička odobrenja.',
      en: 'Helps review your website, content and SEO tasks, with suggestions that you approve.',
    },
    gets: {
      bs: 'Manje ručnog pregleda i jasniji razvoj online prisustva.',
      en: 'Less manual checking and a clearer path for your online presence.',
    },
  },
  {
    id: 'leads',
    name: 'AI Leads',
    short: 'Leads',
    does: {
      bs: 'Podrška pronalaženju potencijalnih klijenata, obradi prilika i kontaktiranju; planira se i AI sekretarica za pozive.',
      en: 'Supports finding potential clients, handling opportunities and outreach; an AI phone assistant is also planned.',
    },
    gets: {
      bs: 'Organizovaniji outreach i manje propuštenih prodajnih prilika.',
      en: 'More organised outreach and fewer missed sales opportunities.',
    },
  },
  {
    id: 'capacity',
    name: 'AI Capacity Planner',
    short: 'Capacity',
    does: {
      bs: 'Pregled zadataka i raspoloživih timskih kapaciteta te pomoć u planiranju opterećenja.',
      en: 'An overview of tasks and available team capacity, with help planning the workload.',
    },
    gets: {
      bs: 'Bolja raspodjela posla i ranije uočavanje preopterećenja.',
      en: 'Better distribution of work and earlier warning of overload.',
    },
  },
  {
    id: 'delivery',
    name: 'AI Delivery Control',
    short: 'Delivery',
    does: {
      bs: 'Pregled toka realizacije, obaveza i rokova isporuke, uz signalizaciju mogućih zastoja.',
      en: 'An overview of delivery progress, commitments and deadlines, flagging possible delays.',
    },
    gets: {
      bs: 'Veća preglednost projekta i pravovremeno reagovanje.',
      en: 'Clearer project visibility and timely reactions.',
    },
  },
  {
    id: 'audit',
    name: 'AI Work Audit',
    short: 'Audit',
    does: {
      bs: 'Pregled predanih materijala prema briefu i kriterijima, uz pregled i konačnu odluku odgovorne osobe.',
      en: 'Reviews submitted work against the brief and criteria; a responsible person reviews and makes the final call.',
    },
    gets: {
      bs: 'Jasniji interni kvalitet i strukturirane povratne informacije.',
      en: 'Clearer internal quality and structured feedback.',
    },
  },
];
