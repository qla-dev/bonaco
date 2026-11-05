// BonEvents: event usluge, vrste događaja, proces i reference (web brief v1.3, sekcija 05, prošireno).
// TODO(Bonaco): JOVS fotografije i tačan opis angažmana; potvrditi obim učešća na Summer Loungeu.

export type EventIcon = 'calendar' | 'clapper' | 'megaphone' | 'users' | 'camera' | 'palette' | 'briefcase' | 'rocket' | 'mic' | 'sun' | 'store' | 'party' | 'clipboard' | 'lightbulb' | 'wrench' | 'chart';

export const EVENT_SERVICES: { id: string; icon: EventIcon; bs: { title: string; text: string }; en: { title: string; text: string } }[] = [
  {
    id: 'planiranje', icon: 'calendar',
    bs: { title: 'Planiranje i organizacija', text: 'Koncept, plan, budžet, dobavljači i koordinacija na dan događaja, od ideje do zadnjeg gosta.' },
    en: { title: 'Planning and organisation', text: 'Concept, plan, budget, suppliers and on-the-day coordination, from the idea to the last guest.' },
  },
  {
    id: 'produkcija', icon: 'clapper',
    bs: { title: 'Produkcija događaja', text: 'Tehnička i kreativna realizacija: bina, rasvjeta, zvuk, program i nastupi.' },
    en: { title: 'Event production', text: 'Technical and creative delivery: stage, lighting, sound, programme and performances.' },
  },
  {
    id: 'promocija', icon: 'megaphone',
    bs: { title: 'Promocija i sadržaj', text: 'Najave, kampanje na mrežama i sadržaj prije, tokom i nakon događaja.' },
    en: { title: 'Promotion and content', text: 'Announcements, social campaigns and content before, during and after the event.' },
  },
  {
    id: 'hostese', icon: 'users',
    bs: { title: 'Hostese i osoblje', text: 'Profesionalne hostese, doček gostiju, registracija i podrška programu.' },
    en: { title: 'Hosts and staff', text: 'Professional hosts, guest welcome, registration and programme support.' },
  },
  {
    id: 'foto-video', icon: 'camera',
    bs: { title: 'Foto i video', text: 'Fotografisanje i snimanje događaja, aftermovie i kratki formati za mreže.' },
    en: { title: 'Photo and video', text: 'Event photography and filming, aftermovies and short formats for social media.' },
  },
  {
    id: 'brendiranje', icon: 'palette',
    bs: { title: 'Brendiranje i scenografija', text: 'Vizuelni identitet događaja, brendiranje prostora, štandovi i materijali.' },
    en: { title: 'Branding and staging', text: 'Event visual identity, venue branding, stands and printed materials.' },
  },
];

export const EVENT_TYPES: { icon: EventIcon; bs: string; en: string }[] = [
  { icon: 'briefcase', bs: 'Korporativni događaji', en: 'Corporate events' },
  { icon: 'rocket', bs: 'Lansiranja proizvoda', en: 'Product launches' },
  { icon: 'mic', bs: 'Konferencije i paneli', en: 'Conferences and panels' },
  { icon: 'sun', bs: 'Ljetne sezone i festivali', en: 'Summer seasons and festivals' },
  { icon: 'store', bs: 'Promocije u prodaji', en: 'In-store promotions' },
  { icon: 'party', bs: 'Proslave i team building', en: 'Celebrations and team building' },
];

export const EVENT_PROCESS: { icon: EventIcon; bs: { title: string; text: string }; en: { title: string; text: string } }[] = [
  { icon: 'clipboard', bs: { title: 'Brief', text: 'Cilj, publika, datum, budžet i očekivanja.' }, en: { title: 'Brief', text: 'Goal, audience, date, budget and expectations.' } },
  { icon: 'lightbulb', bs: { title: 'Koncept', text: 'Ideja, program, vizuelni identitet i plan.' }, en: { title: 'Concept', text: 'Idea, programme, visual identity and plan.' } },
  { icon: 'wrench', bs: { title: 'Produkcija', text: 'Dobavljači, tehnika, promocija i proba.' }, en: { title: 'Production', text: 'Suppliers, tech, promotion and rehearsal.' } },
  { icon: 'chart', bs: { title: 'Realizacija i izvještaj', text: 'Vođenje na dan događaja, foto/video i rezime.' }, en: { title: 'Delivery and report', text: 'Running the day, photo/video and a wrap-up.' } },
];

export const EVENT_REFERENCES = [
  {
    id: 'jovs',
    name: 'JOVS',
    image: null as string | null,
    bs: { scope: 'Puna organizacija', text: 'Kompletna organizacija događaja, od planiranja i produkcije do promocije.' },
    en: { scope: 'Full organisation', text: 'Complete event organisation, from planning and production to promotion.' },
    project: null as string | null,
  },
  {
    id: 'summer-lounge',
    name: 'Summer Lounge',
    image: '/img/projects/summer-lounge/IMG_8209-800.webp',
    bs: { scope: 'Djelimično učešće', text: 'Učešće u dijelu organizacije sezone na Platou Skenderija: najave nastupa, društvene mreže i fotografisanje evenata.' },
    en: { scope: 'Partial involvement', text: 'Part of the season organisation at Plato Skenderija: performance announcements, social media and event photography.' },
    project: 'summer-lounge',
  },
];

/** Glavni kadar sekcije i galerija (stvarni event materijali). */
export const EVENT_HERO_IMAGE = '/img/projects/summer-lounge/IMG_2776.webp';
