// Osnovni podaci o firmi. Sve kontakt informacije na sajtu dolaze odavde.

export const SITE = {
  url: 'https://bonacomedia.com',
  name: 'Bonaco Media',
  legalName: 'Bonaco Media d.o.o.',
  founded: 2021,
  email: 'bonacomedia@gmail.com',
  phone: '+387 33 258 900',
  phoneHref: 'tel:+38733258900',
  address: { street: 'Hiseta br. 11', city: 'Sarajevo', zip: '71000', country: 'Bosna i Hercegovina' },
  mapsUrl: 'https://maps.app.goo.gl/8dWRcFLSc5FVCYDg7',
  mapsEmbed: 'https://www.google.com/maps?q=Hiseta+11,+71000+Sarajevo&output=embed',
  // TODO(Bonaco): dopuniti ID/PDV broj ako želite da se prikazuju u footeru.
  companyIds: [] as { label: string; value: string }[],
};

export const SOCIAL = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/bonacomedia/' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/BonacoMedia/' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://ba.linkedin.com/company/bonaco-media' },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@bonaco.media' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@BonacoMedia/videos' },
] as const;

export const STATS = {
  clients: '100+',
  years: '5+',
};

// TODO(Bonaco): upisati trenutnu Google ocjenu i broj recenzija. Dok je rating null, prikazuje se samo link.
export const GOOGLE_REVIEWS: { rating: number | null; count: number | null; url: string } = {
  rating: null,
  count: null,
  url: 'https://maps.app.goo.gl/8dWRcFLSc5FVCYDg7',
};

export const NAV = [
  { to: '/', label: 'Početna' },
  { to: '/nase-usluge/', label: 'Usluge' },
  { to: '/bonexis/', label: 'Bonexis' },
  { to: '/portfolio/', label: 'Portfolio' },
  { to: '/vijesti/', label: 'Vijesti' },
];

/** Showreel i video projekti (YouTube, učitava se tek na klik). */
export const VIDEOS = {
  showreel: '4f_v6TWBphc',
  extra: ['KAqJXO1ycBQ', 'XP9utSxdnKg'],
};
