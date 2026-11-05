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

// Glavni meni (BS putanje; EN se dobija preko localize()). Vijesti su u footeru.
export const NAV = [
  { to: '/nase-usluge/', bs: 'Marketing', en: 'Marketing' },
  { to: '/bonexis/', bs: 'Bonexis', en: 'Bonexis' },
  { to: '/bonevents/', bs: 'BonEvents', en: 'BonEvents' },
  { to: '/portfolio/', bs: 'Radovi', en: 'Work' },
  { to: '/o-nama/', bs: 'O nama', en: 'About' },
  { to: '/kontakt/', bs: 'Kontakt', en: 'Contact' },
];

/** Showreel i video projekti (YouTube, učitava se tek na klik). */
export const VIDEOS = {
  showreel: '4f_v6TWBphc',
  extra: ['KAqJXO1ycBQ', 'XP9utSxdnKg'],
};

// Dva videa iz briefa (produkcija: Bonaco dizajnerski tim). Dok fajlovi ne stignu, null:
// hero prikazuje kružnu animaciju u CSS-u, a marketing video showreel s YouTubea.
// Fajlove staviti u public/video/ i upisati putanje ovdje.
export const HERO_VIDEO: { desktop: string | null; mobile: string | null; poster: string | null; posterMobile: string | null } = {
  // TODO(Bonaco): Video 2 – artistički hero, 8–12 s, tiha petlja (MP4/H.264, ~4–5 MB desktop, ~2 MB mobile)
  desktop: null, // npr. '/video/hero-16x9.mp4'
  mobile: null, // npr. '/video/hero-9x16.mp4'
  poster: null, // npr. '/video/hero-poster.webp'
  posterMobile: null,
};

export const MARKETING_VIDEO: { bs: string | null; en: string | null; captionsBs: string | null; captionsEn: string | null; poster: string | null } = {
  // TODO(Bonaco): Video 1 – informativni marketing, 20–22 s, BS i EN verzija + titlovi (.vtt)
  bs: null,
  en: null,
  captionsBs: null,
  captionsEn: null,
  poster: null,
};
