// BonEvents: event usluge i reference (web brief v1.3, sekcija 05).
// TODO(Bonaco): JOVS fotografije i tačan opis angažmana; potvrditi obim učešća na Summer Loungeu.

export const EVENT_SERVICES = [
  {
    id: 'planiranje',
    bs: { title: 'Planiranje i organizacija', text: 'Priprema i vođenje događaja od ideje do zadnjeg gosta: koncept, plan, dobavljači, koordinacija na dan događaja i profesionalne hostese.' },
    en: { title: 'Planning and organisation', text: 'Preparing and running events from the idea to the last guest: concept, plan, suppliers, on-the-day coordination and professional hosts.' },
  },
  {
    id: 'produkcija',
    bs: { title: 'Produkcija događaja', text: 'Tehnička i kreativna realizacija: scenografija, brendiranje prostora, program i nastupi, uz primjere iz stvarnih angažmana.' },
    en: { title: 'Event production', text: 'Technical and creative delivery: staging, venue branding, programme and performances, backed by real projects.' },
  },
  {
    id: 'promocija',
    bs: { title: 'Promocija i sadržaj', text: 'Digitalna promocija prije, tokom i nakon događaja te foto i video materijali koji ostaju brendu.' },
    en: { title: 'Promotion and content', text: 'Digital promotion before, during and after the event, plus photo and video material your brand keeps.' },
  },
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
