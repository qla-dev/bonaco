import type { BonexisAgent } from '../types';

/** Ben AI je Bonexis chat: razumije problem i spaja vas s pravim agentom. */
export const BEN = { name: 'Ben AI' };

// Svaki agent ima ime koje počinje slovom svog modula (Vida = Visual, Selma = SEO, Lejla = Leads ...).
export const BONEXIS_AGENTS: BonexisAgent[] = [
  {
    persona: 'Vida', name: 'Visual Audit', title: 'AI Visual Audit & Approval',
    desc: 'Automatski pregleda veliki broj web stranica i vizuala odjednom, pronalazi probleme i predlaže izmjene koje vi odobravate.',
    list: ['Pregled 80+ stranica i vizuala u jednom prolazu', 'Jasna lista problema po prioritetu', 'Nijedna izmjena bez vašeg odobrenja'],
    scenario: {
      title: 'Od 80 stranica do liste izmjena za odobrenje',
      desc: 'Vida pregleda sve stranice kampanje, pronađe greške i pripremi izmjene. Ništa ne ide uživo dok vi ne kliknete Odobri.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Provjeri svih 80 landing stranica za ljetnu kampanju.' },
        { from: 'agent', text: 'Pregledala sam 80 stranica. Na 6 sam našla probleme: 3 pogrešne cijene, 2 mutne slike i stari logo. Da pripremim izmjene?' },
        { from: 'client', text: 'Da, pokaži mi izmjene.' },
        { from: 'agent', text: 'Evo prijedloga za svaku stranicu. Nijedna izmjena ne ide uživo dok je ne odobrite.' },
      ],
      result: {
        title: 'Izvještaj audita',
        rows: [
          { label: 'Pregledano', value: '80 / 80', tone: 'ok' },
          { label: 'Pogrešna cijena', value: '3 stranice', tone: 'bad' },
          { label: 'Mutna slika', value: '2 stranice', tone: 'warn' },
          { label: 'Stari logo', value: '1 stranica', tone: 'warn' },
        ],
        status: '6 izmjena čeka vaše odobrenje',
      },
    },
  },
  {
    persona: 'Selma', name: 'Blog & SEO', title: 'AI Blog & SEO Optimizer',
    desc: 'Kreira blogove, optimizuje sadržaj i prati kako vaša web stranica napreduje u organskoj pretrazi.',
    list: ['Analiza ključnih riječi', 'SEO optimizacija sadržaja', 'Praćenje organske vidljivosti'],
    scenario: {
      title: 'Od pitanja kupca do članka koji se rangira',
      desc: 'Selma pronađe šta vaši kupci stvarno traže, napiše članak koji odgovara na to i svake sedmice prati poziciju na Googleu.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Želim više posjeta s Googlea za vođenje društvenih mreža.' },
        { from: 'agent', text: 'Ljudi u Sarajevu najčešće traže „cijena vođenja društvenih mreža“. Predlažem članak koji odgovara baš na to pitanje.' },
        { from: 'client', text: 'Napiši ga.' },
        { from: 'agent', text: 'Članak je spreman, s naslovom, podnaslovima i meta opisom. Pratit ću poziciju i javljati vam svake sedmice.' },
      ],
      result: {
        title: 'Plan sadržaja',
        rows: [
          { label: 'Ključna riječ', value: 'cijena vođenja društvenih mreža', tone: 'info' },
          { label: 'Članak', value: 'spreman za objavu', tone: 'ok' },
          { label: 'Meta opis i naslov', value: 'optimizovani', tone: 'ok' },
          { label: 'Praćenje pozicije', value: 'svake sedmice', tone: 'info' },
        ],
        status: 'Članak čeka objavu',
      },
    },
  },
  {
    persona: 'Lejla', name: 'Leads', title: 'AI Leads',
    desc: 'Pronalazi potencijalne klijente, kvalifikuje ih, prepoznaje poslovne prilike i priprema personaliziran kontakt.',
    list: ['Automatsko pronalaženje klijenata', 'Kvalifikacija i poslovne prilike', 'Personalizirane poruke spremne za slanje'],
    scenario: {
      title: 'Od „trebam klijente“ do spremnih poruka',
      desc: 'Lejla pronađe firme koje odgovaraju vašem profilu, procijeni koliko su dobra prilika i pripremi prvu poruku za svaku.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Trebam nove klijente iz hotelijerstva.' },
        { from: 'agent', text: 'Pronašla sam 24 hotela koji otvaraju nove objekte ili mijenjaju brend. Njih 8 se posebno dobro uklapa u vašu ponudu.' },
        { from: 'client', text: 'Pripremi im poruke.' },
        { from: 'agent', text: 'Pripremila sam 8 personaliziranih poruka. Da ih Sara nazove i zakaže sastanke?' },
      ],
      result: {
        title: 'Lista leadova',
        rows: [
          { label: 'Pronađeno firmi', value: '24', tone: 'info' },
          { label: 'Odlično uklapanje', value: '8', tone: 'ok' },
          { label: 'Personalizirane poruke', value: '8 spremno', tone: 'ok' },
          { label: 'Sljedeći korak', value: 'poziv preko Sare', tone: 'info' },
        ],
        status: 'Spremno za prvi kontakt',
      },
    },
  },
  {
    persona: 'Kenan', name: 'Capacity Planner', title: 'AI Capacity Planner',
    desc: 'Analizira zaposlenike, zadatke, rokove i opterećenje. Predviđa kada firma neće imati dovoljno kapaciteta i kako bolje rasporediti posao.',
    list: ['Pregled opterećenja tima', 'Rano upozorenje na zastoje', 'Prijedlog boljeg rasporeda posla'],
    scenario: {
      title: 'Prije nego kažete „da“ novom klijentu',
      desc: 'Kenan vidi zadatke i rokove cijelog tima, upozori gdje će zapeti i predloži raspored koji to rješava.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Možemo li ovaj mjesec uzeti još jednog klijenta?' },
        { from: 'agent', text: 'U trećoj sedmici Emir je na 140% zbog tri kampanje koje se poklapaju. Bez promjene novi klijent bi kasnio.' },
        { from: 'client', text: 'Šta predlažeš?' },
        { from: 'agent', text: 'Prebacite izradu banera na Anu i pomjerite jedan rok za dva dana. Tada imate prostora za novog klijenta.' },
      ],
      result: {
        title: 'Opterećenje tima, 3. sedmica',
        rows: [
          { label: 'Emir', value: '140%', tone: 'bad' },
          { label: 'Ana', value: '70%', tone: 'ok' },
          { label: 'Mia', value: '55%', tone: 'ok' },
          { label: 'Nakon preraspodjele', value: 'svi ispod 100%', tone: 'ok' },
        ],
        status: 'Novi klijent moguć uz jednu izmjenu',
      },
    },
  },
  {
    persona: 'Dino', name: 'Delivery Control', title: 'AI Delivery Control',
    desc: 'Upoređuje ono što je klijentu obećano ugovorom ili ponudom s onim što je stvarno urađeno.',
    list: ['Otkriva neizvršene obaveze', 'Bilježi poslove izvan dogovora', 'Upozorava na moguća kašnjenja'],
    scenario: {
      title: 'Obećano naspram urađenog, bez Excel tabela',
      desc: 'Dino uporedi ponudu ili ugovor s onim što je tim stvarno isporučio, javi šta kasni i šta je urađeno preko dogovora.',
      clientLabel: 'Vi',
      messages: [
        { from: 'client', text: 'Jesmo li Hotelu Sarajevo ovaj mjesec isporučili sve iz ponude?' },
        { from: 'agent', text: 'Ponuda je 12 objava i 4 reelsa. Urađeno je 12 objava i 2 reelsa, a dva reelsa kasne 3 dana.' },
        { from: 'client', text: 'Još nešto?' },
        { from: 'agent', text: 'Tim je uradio i SEO izvještaj koji nije u ponudi. Možete ga dodati na fakturu kao dodatni posao.' },
      ],
      result: {
        title: 'Dogovoreno i urađeno',
        rows: [
          { label: 'Objave', value: '12 / 12', tone: 'ok' },
          { label: 'Reelsi', value: '2 / 4, kasni 3 dana', tone: 'bad' },
          { label: 'SEO izvještaj', value: 'van ponude', tone: 'warn' },
        ],
        status: '1 obaveza kasni, 1 posao za naplatu',
      },
    },
  },
  {
    persona: 'Sara', name: 'AI Sekretarica', title: 'AI Sekretarica',
    desc: 'Javlja se na pozive 0–24 i sama zove potencijalne klijente s vašeg broja telefona. Odgovara na pitanja, zakazuje sastanke i šalje vam sažetak svakog razgovora. Radi zajedno s Lejlom iz AI Leads.',
    list: ['Odgovara na dolazne pozive 0–24', 'Zove leadove s vašeg broja', 'Zakazuje termine i šalje sažetak razgovora'],
    scenario: {
      title: 'Poziv koji se završi zakazanim sastankom',
      desc: 'Sara nazove lead koji je pronašla Lejla, odgovori na pitanja, zakaže termin i pošalje vam sažetak razgovora.',
      clientLabel: 'Klijent',
      messages: [
        { from: 'agent', text: 'Dobar dan, ovdje Sara iz Bonaco Media. Zovem jer ste se raspitivali o vođenju društvenih mreža.' },
        { from: 'client', text: 'Da, koliko to otprilike košta?' },
        { from: 'agent', text: 'Zavisi od broja objava i mreža. Najbolje je kratko porazgovarati s našim timom. Odgovara li vam utorak u 10?' },
        { from: 'client', text: 'Može, utorak u 10.' },
        { from: 'agent', text: 'Zakazano. Poslat ću vam potvrdu na email. Ugodan dan!' },
      ],
      result: {
        title: 'Sažetak poziva',
        rows: [
          { label: 'Klijent', value: 'Hotel Sarajevo', tone: 'info' },
          { label: 'Interes', value: 'vođenje društvenih mreža', tone: 'info' },
          { label: 'Termin', value: 'utorak, 10:00', tone: 'ok' },
        ],
        status: 'Sažetak poslan na vaš email',
      },
    },
  },
];
