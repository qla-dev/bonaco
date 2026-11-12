import type { BonexisAgent } from '../types';

// Na osnovu internog plana BONEXIS v4.0; kapsule 1–3 (Social, SEO, Blog) spojene u jednu integrisanu kapsulu (odluka 11.2026).
// Nova kapsula 5: AI Work Quality Review za direktora. Ukupno 5 kapsula.
// Bonaco Media nudi Bonexis drugim firmama; Bonexis je u razvoju s qla.dev.
// Primjeri ispod su ilustrativni scenariji, ne rezultati stvarnih klijenata.

/** Ben je "mozak" Bonexisa: razumije problem i usmjerava posao pravoj kapsuli. */
export const BEN = { name: 'Ben AI' };

export const BONEXIS_TAGLINE = 'Jedna platforma. Pet AI kapsula.';

/** Zajednički CORE (nije posebna kapsula). */
export const CORE_FEATURES = [
  'Firma, tim i uloge s dozvolama',
  'Klijenti, projekti i zadaci (lista i Kanban)',
  'Dokazi rada, verzije i odobravanja',
  'Operativni pregled: danas, rokovi, šta čeka vas',
];

/** Načela iz plana koja komuniciramo na sajtu. */
export const PRINCIPLES = [
  { title: 'AI predlaže, vi odlučujete', text: 'Nijedna objava, poziv ili izmjena plana ne ide bez odobrenja ovlaštene osobe.' },
  { title: 'Svaki nalaz ima izvor', text: 'Svaki važan nalaz vodi do konkretnog dokumenta, osobe i sljedećeg koraka.' },
  { title: 'Bez tajnog praćenja', text: 'Nema snimanja ekrana, tastature ni kamere. Ocjenjuje se samo predati rad prema briefu.' },
  { title: 'Kapsule po izboru', text: 'Firma aktivira jednu kapsulu ili kombinaciju, bez obaveze kupovine svih.' },
];

// Svaka kapsula ima owner agenta (admin kapsule); Sara je AI sekretarica unutar kapsule 2.
// Redoslijed = redoslijed radnih mjesta i ekrana u 3D kancelariji.
export const BONEXIS_AGENTS: BonexisAgent[] = [
  {
    persona: 'Lana', capsule: 1, role: 'owner', name: 'Web, Content & SEO', title: 'AI Web, Content & SEO Manager',
    desc: 'Objedinjuje pregled do 80 web stranica i vizuala, analizu i prijedloge poboljšanja, automatsku pripremu blogova i SEO optimizaciju, analizu ključnih riječi i organske vidljivosti. Sve izmjene idu tek nakon vašeg odobrenja.',
    list: [
      'AI pregled do 80 web stranica i njihovih vizuala',
      'Analiza i prijedlozi poboljšanja vizuala',
      'Automatska priprema blogova i SEO optimizacija',
      'Analiza ključnih riječi i organske vidljivosti',
      'Korisničko odobravanje prije objavljivanja',
    ],
    thought: 'Pregledam 80 stranica sajta i analiziram vizuale…',
    scenario: {
      title: 'Od pregleda sajta do optimiziranog sadržaja',
      desc: 'Lana pregleda web stranice, analizira vizuale i SEO, pripremi blogove i predloži poboljšanja. Sve čeka vaše odobrenje prije objave.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Pregledaj naš sajt i predloži poboljšanja.' },
        { from: 'agent', text: 'Pročitala sam 78 od 80 stranica. Na 6 nedostaje meta opis, vizuali na 4 stranice su ispod standarda, i pripremila sam 3 blog članka za teme koje kupci traže.' },
        { from: 'client', text: 'Šta prvo?' },
        { from: 'agent', text: 'Meta opisi su spremni za odobrenje, vizuali su predloženi za zamjenu, a prvi blog ide u utorak ako potvrdite.' },
      ],
      result: {
        title: 'Web & SEO pregled',
        rows: [
          { label: 'Pročitano stranica', value: '78 / 80', tone: 'ok' },
          { label: 'SEO ispravke', value: '6 meta opisa', tone: 'warn' },
          { label: 'Vizuali za poboljšanje', value: '4 stranice', tone: 'warn' },
          { label: 'Blogovi pripremljeni', value: '3 članka', tone: 'ok' },
        ],
        status: 'Sve čeka vaše odobrenje',
      },
    },
  },
  {
    persona: 'Lejla', capsule: 2, role: 'owner', name: 'Leads', title: 'AI Leads',
    desc: 'Pronalazi i kvalificira potencijalne klijente, prepoznaje poslovne prilike i podržava prodajne aktivnosti. Ne izmišlja kontakte ni namjeru kupovine.',
    list: ['Profil idealnog kupca i odobreni izvori', 'Svaki lead ima izvor i datum provjere', 'Plan kontakta i predaja Sari za pozive'],
    thought: 'Provjeravam izvore za 24 nove firme…',
    scenario: {
      title: 'Od profila kupca do provjerenih leadova',
      desc: 'Lejla pronađe firme sa stvarnim signalom (nova poslovnica, projekat, tender), ukloni duplikate i postojeće klijente i označi šta još nije provjereno.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Trebam nove klijente iz hotelijerstva u Sarajevu.' },
        { from: 'agent', text: 'Pronašla sam 24 firme s provjerljivim signalom, npr. otvaranje novog objekta. Svaka ima izvor i datum provjere.' },
        { from: 'client', text: 'Koje su najbolje?' },
        { from: 'agent', text: 'Njih 8 se najbolje uklapa u vaš profil. Za 3 kontakt nije provjeren i tako sam ih označila. Da Sara pripremi pozive?' },
      ],
      result: {
        title: 'Lista leadova',
        rows: [
          { label: 'Firme s izvorom', value: '24', tone: 'info' },
          { label: 'Visoko usklađene', value: '8', tone: 'ok' },
          { label: 'Neprovjeren kontakt', value: '3', tone: 'warn' },
          { label: 'Postojeći klijenti', value: 'isključeni', tone: 'ok' },
        ],
        status: 'Čeka vaše odobrenje za pozive',
      },
    },
  },
  {
    persona: 'Sara', capsule: 2, role: 'assistant', name: 'AI Sekretarica', title: 'AI sekretarica',
    desc: 'Dio kapsule AI Leads. Uz vaše odobrenje zove potencijalne klijente, jasno se predstavlja kao AI asistentica, kvalifikuje interes i zakazuje sastanke.',
    list: ['Poziva samo odobrene kontakte i poštuje listu zabrane', 'Koristi samo odobrenu skriptu, bez izmišljanja cijena', 'Ishod i sažetak razgovora na kartici leada'],
    thought: 'Pripremam odobrenu skriptu za poziv…',
    scenario: {
      title: 'Poziv koji se završi zakazanim sastankom',
      desc: 'Sara zove lead koji ste odobrili, predstavi se kao AI asistentica, kvalifikuje interes i predloži slobodan termin iz vašeg kalendara.',
      clientLabel: 'Klijent',
      messages: [
        { from: 'agent', text: 'Dobar dan, ovdje Sara, AI asistentica firme. Zovem u vezi vašeg upita za vođenje društvenih mreža. Odgovara li vam kratak razgovor?' },
        { from: 'client', text: 'Može. Koliko to košta?' },
        { from: 'agent', text: 'Cijena zavisi od obima, pa je najbolje da je dogovorite s timom. Imam slobodan termin u utorak u 10:00. Odgovara li vam?' },
        { from: 'client', text: 'Odgovara.' },
        { from: 'agent', text: 'Zakazano. Potvrdu ćete dobiti na email. Hvala i ugodan dan!' },
      ],
      result: {
        title: 'Ishod poziva',
        rows: [
          { label: 'Ishod', value: 'sastanak zakazan', tone: 'ok' },
          { label: 'Interes', value: 'vođenje društvenih mreža', tone: 'info' },
          { label: 'Termin', value: 'utorak, 10:00', tone: 'ok' },
        ],
        status: 'Sažetak upisan na karticu leada',
      },
    },
  },
  {
    persona: 'Kenan', capsule: 3, role: 'owner', name: 'Capacity Planner', title: 'AI Capacity Planner',
    desc: 'Pametno planiranje poslovnih kapaciteta, raspodjela zadataka, analiza opterećenja zaposlenika i predviđanje zastoja. Plan se ne mijenja bez vaše potvrde.',
    list: ['Pregled opterećenja po sedmici i mjesecu', 'Scenarij „novi projekat” prije nego kažete da', 'Isti ulazi uvijek daju isti izračun'],
    thought: 'Računam kapacitet za treću sedmicu…',
    scenario: {
      title: 'Prije nego kažete „da” novom klijentu',
      desc: 'Kenan iz planiranih sati, odsustava i rokova izračuna gdje će zapeti i ponudi opcije. Ništa ne mijenja dok vi ne potvrdite.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Možemo li ovaj mjesec preuzeti još jednog klijenta?' },
        { from: 'agent', text: 'U trećoj sedmici Emir ima 26 h planiranog posla na 21,6 h raspoloživog vremena. Nedostaje 4,4 h.' },
        { from: 'client', text: 'Šta predlažeš?' },
        { from: 'agent', text: 'Izradu banera može preuzeti Ana, koja ima vještinu i slobodne sate, ili pomjerite jedan rok za dva dana. Odluka je vaša.' },
      ],
      result: {
        title: 'Opterećenje, 3. sedmica',
        rows: [
          { label: 'Emir', value: '120%, nedostaje 4,4 h', tone: 'bad' },
          { label: 'Ana', value: '70%', tone: 'ok' },
          { label: 'Mia', value: '55%', tone: 'ok' },
          { label: 'Novi klijent', value: 'moguć uz preraspodjelu', tone: 'info' },
        ],
        status: 'Simulacija, plan se ne mijenja bez potvrde',
      },
    },
  },
  {
    persona: 'Dino', capsule: 4, role: 'owner', name: 'Delivery Control', title: 'AI Delivery Control',
    desc: 'Kontrola dogovorenog i izvršenog posla, praćenje obaveza prema klijentima, otkrivanje kašnjenja i dodatnog rada izvan dogovorenog obima.',
    list: ['Obaveze iz ponude, ugovora ili radnog naloga', 'Dokaz isporuke za svaku obavezu', 'Rad izvan obima označen za vašu odluku'],
    thought: 'Upoređujem ponudu s isporukom…',
    scenario: {
      title: 'Dogovoreno naspram isporučenog',
      desc: 'Dino uporedi potvrđeni dogovor s dokazima: šta je urađeno, šta je poslano, šta je klijent prihvatio i šta je izvan obima.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Šta smo ovaj mjesec isporučili klijentu prema ponudi?' },
        { from: 'agent', text: 'Ponuda: 8 objava i 2 kratka videa. Objavljeno je 8 objava; jedan video je objavljen, a drugi interno prihvaćen, ali još nije poslan.' },
        { from: 'client', text: 'A prezentacija koju smo radili?' },
        { from: 'agent', text: 'Nije u odobrenom obimu. Označio sam je kao mogući dodatni rad; vi odlučujete ide li u izmjenu dogovora.' },
      ],
      result: {
        title: 'Dogovoreno i isporučeno',
        rows: [
          { label: 'Statične objave', value: '8 / 8 objavljeno', tone: 'ok' },
          { label: 'Kratki video', value: '1 / 2 objavljen', tone: 'warn' },
          { label: 'Prezentacija', value: 'izvan obima', tone: 'warn' },
          { label: 'Prihvat klijenta', value: 'čeka potvrdu', tone: 'info' },
        ],
        status: '1 obaveza otvorena, 1 kandidat za izmjenu obima',
      },
    },
  },
  {
    persona: 'Ada', capsule: 5, role: 'owner', name: 'Work Quality Review', title: 'AI Work Quality Review',
    desc: 'Radnici uploadaju šta su uradili za taj dan, AI ocjeni kvalitet rada na osnovu briefa i kriterija. Na kraju mjeseca kapsula daje procentualni report kvaliteta rada svakog zaposlenog, a HR interno daje svoj izvještaj — dva nezavisna izvještaja za direktora.',
    list: ['Dnevni upload rada s dokazom za oko tri minute', 'AI ocjena kvaliteta prema briefu i rubrici', 'Mjesečni procentualni report kvaliteta za direktora', 'HR daje nezavisan interni izvještaj za isti period', 'Direktor dobija dva izvještaja: AI i HR'],
    thought: 'Pregledam današnje predaje i ocjenjujem kvalitet…',
    scenario: {
      title: 'Dnevna ocjena i mjesečni izvještaj',
      desc: 'Ada pregleda predani rad, ocijeni kvalitet prema briefu i na kraju mjeseca generiše izvještaj za direktora. HR zasebno daje svoj izvještaj — direktor upoređuje oba.',
      clientLabel: 'Direktor',
      messages: [
        { from: 'client', text: 'Kako izgleda današnja predaja tima?' },
        { from: 'agent', text: 'Predato je 7 zadataka. Kvalitet: 5 odlično (90%+), 1 potrebna dorada (vizual bez loga, 60%), 1 nečitljiv dokument — ne ocjenjujem ga.' },
        { from: 'client', text: 'Daj mi mjesečni izvještaj za Emira.' },
        { from: 'agent', text: 'Emir, novembar: prosječan kvalitet 87%. 18 od 21 zadatka ocijenjeno odlično, 2 dorade, 1 nije moguće procijeniti. HR izvještaj za isti period čeka unos od HR tima.' },
      ],
      result: {
        title: 'Mjesečni izvještaj — Emir',
        rows: [
          { label: 'Prosječan kvalitet (AI)', value: '87%', tone: 'ok' },
          { label: 'Odlično', value: '18 zadataka', tone: 'ok' },
          { label: 'Dorade', value: '2 zadatka', tone: 'warn' },
          { label: 'HR izvještaj', value: 'čeka unos', tone: 'info' },
        ],
        status: 'Direktor dobija oba izvještaja za usporedbu',
      },
    },
  },
];

export const CAPSULES = [
  { n: 1, title: 'AI Web, Content & SEO Manager' },
  { n: 2, title: 'AI Leads + AI sekretarica' },
  { n: 3, title: 'AI Capacity Planner' },
  { n: 4, title: 'AI Delivery Control' },
  { n: 5, title: 'AI Work Quality Review' },
];

/** Kratka oznaka uloge agenta, npr. "Owner kapsule 1" ili "AI sekretarica, kapsula 2". */
export const roleLabel = (a: { role: 'owner' | 'assistant'; capsule: number; title: string }) =>
  a.role === 'owner' ? `Owner kapsule ${a.capsule}` : `${a.title}, kapsula ${a.capsule}`;
