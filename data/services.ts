import type { Service } from '../types';

// Tekstovi preuzeti sa postojeće stranice "Naše usluge" (REA export), uz ispravke.
export const SERVICES: Service[] = [
  {
    slug: 'drustvene-mreze',
    title: 'Vođenje društvenih mreža',
    short: 'Strategija, sadržaj i vođenje profila koji privlače i angažuju vašu publiku.',
    text: 'Kreiramo personalizirane strategije za društvene mreže koje privlače i angažuju vašu publiku. Pored vođenja vaših profila, nudimo i grafički dizajn te kreiranje web stranica kako bi vaš online nastup bio kompletan i profesionalan.',
  },
  {
    slug: 'seo',
    title: 'SEO optimizacija',
    short: 'Bolja vidljivost na Googleu i organski rezultati koji traju.',
    text: 'Poboljšavamo vašu vidljivost na pretraživačima pomoću SEO tehnika koje donose organske rezultate. Usluga uključuje i web stranice optimizirane za SEO, uz dizajn koji je istovremeno privlačan i funkcionalan.',
  },
  {
    slug: 'web-dizajn',
    title: 'Web dizajn',
    short: 'Moderne, brze web stranice prilagođene vašem brendu i svim uređajima.',
    text: 'Kreiramo moderne i funkcionalne web stranice koje odražavaju vaš brend i olakšavaju korisničko iskustvo. Svaka stranica je prilagođena vašim poslovnim ciljevima i optimizirana za sve uređaje.',
  },
  {
    slug: 'graficki-dizajn',
    title: 'Grafički dizajn',
    short: 'Logotipi, promotivni materijali i vizuali koji ostavljaju dojam.',
    text: 'Pružamo kreativna grafička rješenja koja pričaju vašu priču na vizualno upečatljiv način. Bilo da se radi o logotipu, promotivnim materijalima ili dizajnu za društvene mreže, stvaramo dizajn koji ostavlja dojam.',
  },
  {
    slug: 'event-management',
    title: 'Event management',
    short: 'Planiranje i koordinacija događaja, hostese, foto i video.',
    text: 'Organizujemo događaje koji ostavljaju snažan dojam. Usluga uključuje planiranje i koordinaciju, angažovanje profesionalnih hostesa te fotografisanje i snimanje. Brinemo da svaki detalj bude savršen, bilo da se radi o poslovnim ili promotivnim događajima.',
  },
  {
    slug: 'foto-video',
    title: 'Fotografisanje i snimanje',
    short: 'Korporativna fotografija, eventi, proizvodi i video za mreže.',
    text: 'Nudimo profesionalno fotografisanje i snimanje prilagođeno vašim ciljevima: korporativna fotografija, snimanje evenata i proizvoda te video produkcija za društvene mreže. Naš tim se brine da svaki kadar prenese pravu priču.',
  },
];

export const STEPS = [
  { title: 'Javite nam se', text: 'Pošaljite upit putem stranice ili na e-mail i opišite šta vam treba. Javljamo se brzo da dogovorimo detalje.' },
  { title: 'Kreiramo strategiju', text: 'Na osnovu vaših ciljeva razvijamo strategiju i plan rada prilagođen vašem brendu.' },
  { title: 'Realizacija i rezultati', text: 'Kad odobrite strategiju, krećemo s radom, redovno vas informišemo o napretku i optimizujemo kampanje.' },
];
