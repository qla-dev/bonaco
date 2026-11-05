import type { BonexisAgent } from '../types';

// Na osnovu internog plana BONEXIS v3.0; kapsula sadržaja je podijeljena na Social Media, SEO Audit i Blog (odluka 05.11.2026).
// Bonaco Media nudi Bonexis drugim firmama; Bonexis je u razvoju s QLA.dev.
// Primjeri ispod su ilustrativni scenariji, ne rezultati stvarnih klijenata.

/** Ben je "mozak" Bonexisa: razumije problem i usmjerava posao pravoj kapsuli. */
export const BEN = { name: 'Ben AI' };

export const BONEXIS_TAGLINE = 'Jedna platforma. Sedam AI kapsula.';

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
    persona: 'Lana', capsule: 1, role: 'owner', name: 'Social Media', title: 'AI Social Media Manager',
    desc: 'Istražuje šta je aktuelno u vašoj niši, priprema objave prema vašim željama, javlja vam se kad je sadržaj spreman i nakon vašeg odobrenja zakazuje i objavljuje na mreže i blog.',
    list: [
      'Istraživanje interneta: relevantne teme i trendovi u odabranoj niši',
      'Obrada sadržaja prema vašim željama i trenutnoj situaciji u niši',
      'Obavijest na vaš privatni cloud ili račun kad je sadržaj spreman',
      'Prihvatanje, uređivanje i odobravanje prije objave',
      'Zakazivanje i objava na društvene mreže i blog',
    ],
    thought: 'Istražujem šta je danas aktuelno u vašoj niši…',
    scenario: {
      title: 'Od istraživanja niše do zakazanih objava',
      desc: 'Lana istraži relevantne teme, pripremi sadržaj, pošalje vam obavijest i tek nakon vašeg odobrenja i izmjena zakaže objave na mreže i blog.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Pripremi objave za sljedeću sedmicu o ljetnoj sezoni.' },
        { from: 'agent', text: 'Istražila sam nišu: ove sedmice se najviše govori o otvaranju bazena i ljetnim festivalima. Pripremila sam 5 objava i 2 reelsa i poslala vam obavijest.' },
        { from: 'client', text: 'Promijeni naslov druge objave i zakaži sve.' },
        { from: 'agent', text: 'Naslov je izmijenjen. Objave su zakazane od ponedjeljka do petka u 18:00, a jedna ide i na blog.' },
      ],
      result: {
        title: 'Plan objava',
        rows: [
          { label: 'Istražene teme', value: '12', tone: 'info' },
          { label: 'Pripremljeno', value: '5 objava i 2 reelsa', tone: 'ok' },
          { label: 'Izmijenjeno prije objave', value: '1', tone: 'warn' },
          { label: 'Zakazano', value: '7 objava', tone: 'ok' },
        ],
        status: 'Objava tek nakon vašeg odobrenja',
      },
    },
  },
  {
    persona: 'Selma', capsule: 2, role: 'owner', name: 'SEO Audit', title: 'AI SEO Auditor',
    desc: 'Pregleda odabrane stranice sajta, pokaže šta je stvarno pročitala i pronađe tehničke i sadržajne SEO nedostatke s prijedlogom ispravke.',
    list: ['Pregled odabranih URL-ova, npr. do 80 stranica', 'Svaki nalaz ima stranicu i dokaz', 'Bez obećavanja pozicija na Googleu'],
    thought: 'Čitam 80 stranica i tražim nedostatke…',
    scenario: {
      title: 'SEO pregled sajta s dokazom za svaki nalaz',
      desc: 'Selma pročita odabrane stranice, pokaže šta je stvarno pročitala i šta nije mogla, pa predloži ispravke po prioritetu. Teme koje nedostaju šalje Edinu.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Pregledaj 80 stranica našeg sajta.' },
        { from: 'agent', text: 'Pročitala sam 78 od 80 stranica; dvije su blokirane. Na 6 nedostaje meta opis, a 3 teme koje kupci traže nemate obrađene.' },
        { from: 'client', text: 'Šta prvo da popravimo?' },
        { from: 'agent', text: 'Prvo meta opise, ispravke su spremne za odobrenje. Tri teme sam poslala Edinu za blog.' },
      ],
      result: {
        title: 'SEO audit',
        rows: [
          { label: 'Pročitano stranica', value: '78 / 80', tone: 'ok' },
          { label: 'Blokiran pristup', value: '2 stranice', tone: 'warn' },
          { label: 'Bez meta opisa', value: '6 stranica', tone: 'bad' },
          { label: 'Teme za blog', value: '3, poslano Edinu', tone: 'info' },
        ],
        status: 'Ispravke čekaju vaše odobrenje',
      },
    },
  },
  {
    persona: 'Edin', capsule: 3, role: 'owner', name: 'Blog', title: 'AI Blog Writer',
    desc: 'Od odobrene teme pravi nacrt članka sa SEO poljima, izvorima i vizualom. Vi uređujete i odobravate, a on objavljuje na blog tek kad potvrdite.',
    list: ['Nacrt članka sa strukturom, naslovom i opisom', 'Izvori i označene tvrdnje koje treba potvrditi', 'Objava na blog tek nakon odobrenja'],
    thought: 'Pišem nacrt članka o temi koju je našla Selma…',
    scenario: {
      title: 'Od teme do objavljenog članka',
      desc: 'Edin napiše nacrt, označi tvrdnje koje treba provjeriti, primi vaše izmjene i zakaže objavu, a Lana članak podijeli na mrežama.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Napiši članak o cijeni vođenja društvenih mreža.' },
        { from: 'agent', text: 'Nacrt je spreman: oko 1.200 riječi, naslov, meta opis i jedan vizual. Označio sam dvije tvrdnje koje treba potvrditi.' },
        { from: 'client', text: 'Skrati uvod i objavi u utorak.' },
        { from: 'agent', text: 'Uvod je skraćen, a članak zakazan za utorak u 9:00. Lana će ga podijeliti na mrežama.' },
      ],
      result: {
        title: 'Članak',
        rows: [
          { label: 'Dužina', value: 'oko 1.200 riječi', tone: 'info' },
          { label: 'SEO polja i vizual', value: 'spremni', tone: 'ok' },
          { label: 'Tvrdnje za provjeru', value: '2', tone: 'warn' },
          { label: 'Objava', value: 'utorak, 9:00', tone: 'ok' },
        ],
        status: 'Zakazano nakon vašeg odobrenja',
      },
    },
  },
  {
    persona: 'Lejla', capsule: 4, role: 'owner', name: 'Leads', title: 'AI Leads',
    desc: 'Pronalazi relevantne firme uz provjerljiv razlog za kontakt, procjenjuje prioritet i priprema kontakt. Ne izmišlja kontakte ni namjeru kupovine.',
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
    persona: 'Sara', capsule: 4, role: 'assistant', name: 'AI Sekretarica', title: 'AI sekretarica',
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
    persona: 'Kenan', capsule: 5, role: 'owner', name: 'Capacity Planner', title: 'AI Capacity Planner',
    desc: 'Odgovara možete li preuzeti novi posao: simulira opterećenje po ljudima, vještinama i sedmicama i predlaže preraspodjelu. Plan se ne mijenja bez vaše potvrde.',
    list: ['Pregled opterećenja po sedmici i mjesecu', 'Scenarij „novi projekat“ prije nego kažete da', 'Isti ulazi uvijek daju isti izračun'],
    thought: 'Računam kapacitet za treću sedmicu…',
    scenario: {
      title: 'Prije nego kažete „da“ novom klijentu',
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
    persona: 'Dino', capsule: 6, role: 'owner', name: 'Delivery Control', title: 'AI Delivery Control',
    desc: 'Pretvara odobrenu ponudu u jasne obaveze i povezuje ih s dokazima isporuke. Razlikuje urađeno, dostavljeno i prihvaćeno od klijenta.',
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
    persona: 'Ada', capsule: 7, role: 'owner', name: 'Work Audit', title: 'AI Work Audit',
    desc: 'Zaposlenici predaju dnevni rad s dokazom, Ada provjerava usklađenost s briefom i kriterijima, a voditelj odlučuje o prihvatu ili doradi.',
    list: ['Dnevna predaja za oko tri minute', 'Provjera prema briefu i rubrici, uz tačno mjesto nalaza', 'Mjesečni pregled za direktora, bez tajnog praćenja'],
    thought: 'Pregledam današnje predaje tima…',
    scenario: {
      title: 'Dnevna predaja i revizija rada',
      desc: 'Ada provjeri predani rad prema briefu i rubrici. Nečitljiv dokument nije nula nego „nije moguće procijeniti“, a konačnu odluku donosi voditelj.',
      clientLabel: 'Voditelj',
      messages: [
        { from: 'client', text: 'Kako izgleda današnja predaja tima?' },
        { from: 'agent', text: 'Predato je 7 zadataka. 5 je usklađeno s briefom, na jednom vizualu nedostaje logo, a jedan dokument nije čitljiv, pa ga ne ocjenjujem.' },
        { from: 'client', text: 'Vrati vizual na doradu.' },
        { from: 'agent', text: 'Vraćeno s tačnim mjestom nalaza. Prihvat i dalje potvrđujete vi, a mjesečni pregled spremam za direktora.' },
      ],
      result: {
        title: 'Današnje predaje',
        rows: [
          { label: 'Predato zadataka', value: '7', tone: 'info' },
          { label: 'Usklađeno s briefom', value: '5', tone: 'ok' },
          { label: 'Dorada: nedostaje logo', value: '1', tone: 'bad' },
          { label: 'Nije moguće procijeniti', value: '1', tone: 'warn' },
        ],
        status: 'Čeka ljudsku provjeru',
      },
    },
  },
];

export const CAPSULES = [
  { n: 1, title: 'AI Social Media Manager' },
  { n: 2, title: 'AI SEO Auditor' },
  { n: 3, title: 'AI Blog Writer' },
  { n: 4, title: 'AI Leads + AI sekretarica' },
  { n: 5, title: 'AI Capacity Planner' },
  { n: 6, title: 'AI Delivery Control' },
  { n: 7, title: 'AI Work Audit' },
];

/** Kratka oznaka uloge agenta, npr. "Owner kapsule 1" ili "AI sekretarica, kapsula 2". */
export const roleLabel = (a: { role: 'owner' | 'assistant'; capsule: number; title: string }) =>
  a.role === 'owner' ? `Owner kapsule ${a.capsule}` : `${a.title}, kapsula ${a.capsule}`;
