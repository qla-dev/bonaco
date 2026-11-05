import type { Service } from '../types';

// Marketing (full-service) usluge. Tekstovi postojećih usluga preuzeti sa stare stranice "Naše usluge"
// (REA export), uz ispravke. "Strategija i kampanje" i "OOH / DOOH" dodani prema web briefu v1.3.
// Event management je prešao pod BonEvents (data/bonevents.ts).
export const SERVICES: Service[] = [
  {
    slug: 'strategija-kampanje',
    title: 'Strategija i kampanje',
    short: 'Koncept, plan i vođenje kampanja s jasnim ciljem i porukom.',
    text: 'Polazimo od ciljeva vašeg brenda: definišemo publiku, poruku i kanale, a zatim osmišljavamo i vodimo kampanje od prve ideje do izvještaja. Strategija povezuje sve ostale usluge u jednu cjelinu.',
    en: {
      title: 'Strategy and campaigns',
      short: 'Concept, plan and campaign management with a clear goal and message.',
      text: 'We start from your brand goals: we define the audience, the message and the channels, then design and run campaigns from the first idea to the report. Strategy ties all our other services together.',
    },
  },
  {
    slug: 'drustvene-mreze',
    title: 'Vođenje društvenih mreža',
    short: 'Strategija, sadržaj i vođenje profila koji privlače i angažuju vašu publiku.',
    text: 'Kreiramo personalizirane strategije za društvene mreže koje privlače i angažuju vašu publiku. Pored vođenja vaših profila, nudimo i grafički dizajn te kreiranje web stranica kako bi vaš online nastup bio kompletan i profesionalan.',
    en: {
      title: 'Social media management',
      short: 'Strategy, content and profile management that attract and engage your audience.',
      text: 'We create tailored social media strategies that attract and engage your audience. Beyond managing your profiles, we also provide graphic design and websites so your online presence is complete and professional.',
    },
  },
  {
    slug: 'graficki-dizajn',
    title: 'Grafički dizajn i branding',
    short: 'Logotipi, vizuelni identitet, promotivni materijali i merchandise.',
    text: 'Pružamo kreativna grafička rješenja koja pričaju vašu priču na vizualno upečatljiv način. Bilo da se radi o logotipu, vizuelnom identitetu, promotivnim materijalima ili dizajnu za društvene mreže, stvaramo dizajn koji ostavlja dojam.',
    en: {
      title: 'Graphic design and branding',
      short: 'Logos, visual identity, promotional materials and merchandise.',
      text: 'We create graphic solutions that tell your story in a visually striking way. Whether it is a logo, a visual identity, promotional materials or social media design, we make design that leaves an impression.',
    },
  },
  {
    slug: 'foto-video',
    title: 'Foto i videoprodukcija',
    short: 'Korporativna fotografija, proizvodi, eventi i video za mreže.',
    text: 'Nudimo profesionalno fotografisanje i snimanje prilagođeno vašim ciljevima: korporativna fotografija, snimanje evenata i proizvoda te video produkcija za društvene mreže. Naš tim se brine da svaki kadar prenese pravu priču.',
    en: {
      title: 'Photo and video production',
      short: 'Corporate photography, products, events and video for social media.',
      text: 'We offer professional photo and video production tailored to your goals: corporate photography, event and product shoots, and video production for social media. Our team makes sure every frame tells the right story.',
    },
  },
  {
    slug: 'web-dizajn',
    title: 'Web dizajn',
    short: 'Moderne, brze web stranice prilagođene vašem brendu i svim uređajima.',
    text: 'Kreiramo moderne i funkcionalne web stranice koje odražavaju vaš brend i olakšavaju korisničko iskustvo. Svaka stranica je prilagođena vašim poslovnim ciljevima i optimizirana za sve uređaje.',
    en: {
      title: 'Web design',
      short: 'Modern, fast websites tailored to your brand and every device.',
      text: 'We build modern, functional websites that reflect your brand and make the user experience easy. Every site is tailored to your business goals and optimised for all devices.',
    },
  },
  {
    slug: 'seo',
    title: 'SEO optimizacija',
    short: 'Bolja vidljivost na Googleu i organski rezultati koji traju.',
    text: 'Poboljšavamo vašu vidljivost na pretraživačima pomoću SEO tehnika koje donose organske rezultate. Usluga uključuje i web stranice optimizirane za SEO, uz dizajn koji je istovremeno privlačan i funkcionalan.',
    en: {
      title: 'SEO',
      short: 'Better visibility on Google and organic results that last.',
      text: 'We improve your search engine visibility with SEO techniques that deliver organic results. The service also covers SEO-optimised websites with design that is both attractive and functional.',
    },
  },
  {
    slug: 'ooh-dooh',
    title: 'OOH / DOOH oglašavanje',
    short: 'Bilbordi, LED ekrani i prostorno oglašavanje koje se vidi.',
    text: 'Pripremamo kampanje za vanjsko i digitalno vanjsko oglašavanje: od kreativnog rješenja i prilagodbe formata do pripreme za bilborde, LED ekrane i druge prostorne površine.',
    en: {
      title: 'OOH / DOOH advertising',
      short: 'Billboards, LED screens and out-of-home advertising that gets noticed.',
      text: 'We prepare out-of-home and digital out-of-home campaigns: from the creative idea and format adaptation to production files for billboards, LED screens and other spaces.',
    },
  },
];

export const STEPS = [
  {
    title: 'Javite nam se', text: 'Pošaljite upit putem stranice ili na e-mail i opišite šta vam treba. Javljamo se brzo da dogovorimo detalje.',
    en: { title: 'Get in touch', text: 'Send an inquiry through the site or by email and tell us what you need. We reply quickly to agree on the details.' },
  },
  {
    title: 'Kreiramo strategiju', text: 'Na osnovu vaših ciljeva razvijamo strategiju i plan rada prilagođen vašem brendu.',
    en: { title: 'We build the strategy', text: 'Based on your goals we develop a strategy and a work plan tailored to your brand.' },
  },
  {
    title: 'Realizacija i rezultati', text: 'Kad odobrite strategiju, krećemo s radom, redovno vas informišemo o napretku i optimizujemo kampanje.',
    en: { title: 'Execution and results', text: 'Once you approve the strategy we get to work, keep you updated on progress and optimise the campaigns.' },
  },
];
