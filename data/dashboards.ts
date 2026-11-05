// Demo podaci za Bonexis dashboard (izmišljena firma, nisu rezultati stvarnih klijenata).
// Ključ = persona owner agenta kapsule.

export type Tone = 'ok' | 'warn' | 'bad' | 'info';
export interface DashItem { id: string; title: string; meta: string; status: string; tone: Tone }
export interface Dash {
  kpis: { label: string; value: string; tone?: Tone }[];
  queueTitle: string;
  queue: DashItem[];
  panelTitle: string;
  panel:
    | { type: 'week'; days: { day: string; posts: { time: string; title: string; channel: string; tone: Tone }[] }[] }
    | { type: 'bars'; items: { label: string; value: number; note?: string }[] }
    | { type: 'list'; items: { label: string; value: string; tone: Tone }[] }
    | { type: 'pipeline'; cols: { name: string; count: number }[] };
}

export const DEMO_COMPANY = 'Demo firma d.o.o.';

export const DASHBOARDS: Record<string, Dash> = {
  Lana: {
    kpis: [
      { label: 'Istražene teme u niši', value: '12' },
      { label: 'Čeka vaše odobrenje', value: '4', tone: 'warn' },
      { label: 'Zakazano ove sedmice', value: '7', tone: 'ok' },
      { label: 'Objavljeno ovaj mjesec', value: '18' },
    ],
    queueTitle: 'Objave za odobrenje',
    queue: [
      { id: 'l1', title: 'Reels: otvaranje ljetne terase', meta: 'Instagram, TikTok · prijedlog za pon 18:00', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 'l2', title: 'Karusel: 5 savjeta za ljetnu sezonu', meta: 'Instagram, Facebook · uto 18:00', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 'l3', title: 'Najava eventa u petak', meta: 'Facebook, Instagram priče · sri 12:00', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 'l4', title: 'Blog: cijena vođenja mreža (od Edina)', meta: 'Blog + LinkedIn · uto 9:00', status: 'Čeka odobrenje', tone: 'warn' },
    ],
    panelTitle: 'Plan objava, ova sedmica',
    panel: {
      type: 'week',
      days: [
        { day: 'Pon', posts: [{ time: '18:00', title: 'Reels terasa', channel: 'IG', tone: 'warn' }] },
        { day: 'Uto', posts: [{ time: '9:00', title: 'Blog članak', channel: 'Blog', tone: 'warn' }, { time: '18:00', title: 'Karusel', channel: 'IG', tone: 'warn' }] },
        { day: 'Sri', posts: [{ time: '12:00', title: 'Najava eventa', channel: 'FB', tone: 'warn' }] },
        { day: 'Čet', posts: [{ time: '18:00', title: 'Iza kulisa', channel: 'TT', tone: 'ok' }] },
        { day: 'Pet', posts: [{ time: '17:00', title: 'Event uživo', channel: 'IG', tone: 'ok' }] },
      ],
    },
  },
  Selma: {
    kpis: [
      { label: 'Pročitano stranica', value: '78 / 80', tone: 'ok' },
      { label: 'Blokiran pristup', value: '2', tone: 'warn' },
      { label: 'Nalazi za ispravku', value: '11', tone: 'bad' },
      { label: 'Teme poslane Edinu', value: '3' },
    ],
    queueTitle: 'Ispravke za odobrenje',
    queue: [
      { id: 's1', title: 'Dodati meta opis na 6 stranica', meta: '/usluge/, /kontakt/ i još 4 · dokaz: prazno polje', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 's2', title: 'Dva H1 naslova na početnoj', meta: '/ · prijedlog: jedan H1', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 's3', title: 'Slike bez alt teksta (7)', meta: '/portfolio/ · predloženi opisi', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 's4', title: '2 stranice nedostupne za čitanje', meta: 'provjerite pristup ili ih isključite iz pregleda', status: 'Nije moguće pročitati', tone: 'bad' },
    ],
    panelTitle: 'Nalazi po vrsti',
    panel: { type: 'bars', items: [{ label: 'Meta opisi', value: 6 }, { label: 'Alt tekst', value: 7 }, { label: 'Naslovi', value: 2 }, { label: 'Interni linkovi', value: 4 }, { label: 'Spori resursi', value: 3 }] },
  },
  Edin: {
    kpis: [
      { label: 'Nacrti u radu', value: '3' },
      { label: 'Čeka vaše odobrenje', value: '2', tone: 'warn' },
      { label: 'Tvrdnje za provjeru', value: '4', tone: 'warn' },
      { label: 'Objavljeno ovaj mjesec', value: '5', tone: 'ok' },
    ],
    queueTitle: 'Članci',
    queue: [
      { id: 'e1', title: 'Koliko košta vođenje društvenih mreža?', meta: 'oko 1.200 riječi · 2 tvrdnje za provjeru · vizual spreman', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 'e2', title: 'Kako pripremiti brend za ljetnu sezonu', meta: 'oko 900 riječi · tema od Selme', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 'e3', title: 'Šta je lokalni SEO', meta: 'nacrt 60% · Edin piše', status: 'U pisanju', tone: 'info' },
    ],
    panelTitle: 'Status sadržaja',
    panel: { type: 'pipeline', cols: [{ name: 'Teme', count: 6 }, { name: 'Nacrt', count: 3 }, { name: 'Odobrenje', count: 2 }, { name: 'Zakazano', count: 1 }, { name: 'Objavljeno', count: 5 }] },
  },
  Lejla: {
    kpis: [
      { label: 'Firme s izvorom', value: '24' },
      { label: 'Visoko usklađene', value: '8', tone: 'ok' },
      { label: 'Neprovjeren kontakt', value: '3', tone: 'warn' },
      { label: 'Sastanci (Sara)', value: '2', tone: 'ok' },
    ],
    queueTitle: 'Leadovi za odobrenje poziva',
    queue: [
      { id: 'd1', title: 'Hotel u Sarajevu (novi objekat)', meta: 'izvor: lokalni portal, provjereno danas · usklađenost visoka', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 'd2', title: 'Klinika, nova poslovnica', meta: 'izvor: web stranica firme · kontakt provjeren', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 'd3', title: 'Restoran, rebranding', meta: 'kontakt nije provjeren · Sara ne zove dok ne potvrdite', status: 'Neprovjeren kontakt', tone: 'bad' },
    ],
    panelTitle: 'Prodajni tok',
    panel: { type: 'pipeline', cols: [{ name: 'Novi', count: 24 }, { name: 'Provjeren', count: 11 }, { name: 'Kontaktiran', count: 5 }, { name: 'Sastanak', count: 2 }, { name: 'Dobijen', count: 1 }] },
  },
  Kenan: {
    kpis: [
      { label: 'Planabilni sati, 3. sedmica', value: '86 h' },
      { label: 'Planirani posao', value: '91 h', tone: 'warn' },
      { label: 'Preopterećeno', value: '1 osoba', tone: 'bad' },
      { label: 'Scenariji na čekanju', value: '1' },
    ],
    queueTitle: 'Prijedlozi preraspodjele',
    queue: [
      { id: 'k1', title: 'Izrada banera: Emir → Ana', meta: 'Ana ima vještinu i 8 h slobodno · rješava manjak od 4,4 h', status: 'Čeka odobrenje', tone: 'warn' },
      { id: 'k2', title: 'Scenarij: novi klijent od 18. u mjesecu', meta: 'moguće uz gornju preraspodjelu', status: 'Simulacija', tone: 'info' },
    ],
    panelTitle: 'Opterećenje po osobi',
    panel: { type: 'bars', items: [{ label: 'Emir', value: 120, note: 'nedostaje 4,4 h' }, { label: 'Ana', value: 70 }, { label: 'Mia', value: 55 }, { label: 'Tarik', value: 82 }] },
  },
  Dino: {
    kpis: [
      { label: 'Aktivne obaveze', value: '14' },
      { label: 'Dostavljeno', value: '10', tone: 'ok' },
      { label: 'Kasni', value: '1', tone: 'bad' },
      { label: 'Izvan obima', value: '1', tone: 'warn' },
    ],
    queueTitle: 'Za vašu odluku',
    queue: [
      { id: 'n1', title: 'Prezentacija nije u ponudi', meta: 'klijent: Demo hotel · predaja postoji', status: 'Kandidat za izmjenu obima', tone: 'warn' },
      { id: 'n2', title: 'Drugi kratki video nije poslan', meta: 'interno prihvaćen, čeka dostavu', status: 'Kasni', tone: 'bad' },
      { id: 'n3', title: 'Mjesečni izvještaj', meta: 'nacrt postoji, nema dokaza slanja', status: 'Čeka slanje', tone: 'info' },
    ],
    panelTitle: 'Dogovoreno i dostavljeno',
    panel: { type: 'list', items: [{ label: 'Statične objave', value: '8 / 8', tone: 'ok' }, { label: 'Kratki video', value: '1 / 2', tone: 'warn' }, { label: 'Izvještaj', value: '0 / 1', tone: 'info' }, { label: 'Prihvat klijenta', value: 'čeka', tone: 'info' }] },
  },
  Ada: {
    kpis: [
      { label: 'Predaje danas', value: '7' },
      { label: 'Usklađeno s briefom', value: '5', tone: 'ok' },
      { label: 'Dorada', value: '1', tone: 'bad' },
      { label: 'Nije moguće procijeniti', value: '1', tone: 'warn' },
    ],
    queueTitle: 'Predaje za ljudsku provjeru',
    queue: [
      { id: 'a1', title: 'Vizual za Instagram', meta: 'nalaz: nedostaje logo (donji desni ugao)', status: 'Preporuka: dorada', tone: 'bad' },
      { id: 'a2', title: 'Ponuda PDF', meta: 'dokument nije čitljiv, nije ocijenjen', status: 'Nije moguće procijeniti', tone: 'warn' },
      { id: 'a3', title: 'Blog nacrt', meta: 'svi kriteriji rubrike ispunjeni', status: 'Preporuka: prihvat', tone: 'ok' },
    ],
    panelTitle: 'Mjesečni pregled (zbirno)',
    panel: { type: 'list', items: [{ label: 'Prihvaćeno iz prve', value: '80%', tone: 'ok' }, { label: 'Predaje u roku', value: '27 / 30', tone: 'ok' }, { label: 'Dorade zbog greške', value: '3', tone: 'warn' }, { label: 'Bez ocjene (nečitljivo)', value: '2', tone: 'info' }] },
  },
};
