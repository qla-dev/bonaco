import type { Testimonial } from '../types';

// Preuzeto sa postojeće početne stranice (REA export).
// TODO(Bonaco): potvrditi saglasnost klijenata za objavu izjava.
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'sarajevska-pivnica',
    company: 'Sarajevska Pivnica',
    photo: '/img/testimonials/sarajevska-pivnica.webp',
    text: 'Bonaco Media je odigrala značajnu ulogu u uspjehu naše Google Ads kampanje. U roku od samo mjesec dana, naš oglas je dosegao preko 2 miliona ljudi, što je značajno doprinijelo povećanju svijesti o našoj kampanji.',
  },
  {
    id: 'beautyco',
    company: 'BeautyCO',
    photo: '/img/testimonials/beautyco.webp',
    text: 'Novi web dizajn koji su razvili za našu maloprodajnu trgovinu ne samo da izgleda fantastično, već je i izuzetno funkcionalan. Naša online prisutnost nikada nije bila jača zahvaljujući njihovoj stručnosti u vođenju društvenih mreža.',
  },
  {
    id: 'rooms',
    company: 'ROOMS.hr',
    photo: '/img/testimonials/rooms.webp',
    text: 'Kao start-up, trebali smo partnera koji razumije naše ciljeve. Njihova stručnost u grafičkom dizajnu i digitalnom marketingu pomogla nam je da izgradimo prepoznatljiv brend i značajno povećamo bazu korisnika.',
  },
  {
    id: 'wine-shop',
    company: 'Wine Shop Sarajevo Only VIP',
    photo: '/img/testimonials/wine-shop.webp',
    text: 'Njihovo vođenje naših društvenih mreža donijelo je više kupaca u našoj prodavnici vina nego ikada prije. Tim je profesionalan, pouzdan i uvijek ide korak dalje.',
  },
];
