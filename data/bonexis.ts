import type { BonexisAgent } from '../types';

export const BONEXIS_AGENTS: BonexisAgent[] = [
  {
    name: 'Visual Audit', title: 'AI Visual Audit & Approval',
    desc: 'Automatski pregleda veliki broj web stranica i vizuala odjednom, pronalazi probleme i predlaže izmjene koje vi odobravate.',
    list: ['Pregled 80+ stranica i vizuala u jednom prolazu', 'Jasna lista problema po prioritetu', 'Nijedna izmjena bez vašeg odobrenja'],
  },
  {
    name: 'Blog & SEO', title: 'AI Blog & SEO Optimizer',
    desc: 'Kreira blogove, optimizuje sadržaj i prati kako vaša web stranica napreduje u organskoj pretrazi.',
    list: ['Analiza ključnih riječi', 'SEO optimizacija sadržaja', 'Praćenje organske vidljivosti'],
  },
  {
    name: 'Leads', title: 'AI Leads',
    desc: 'Pronalazi potencijalne klijente, kvalifikuje ih, prepoznaje poslovne prilike i priprema personaliziran kontakt.',
    list: ['Automatsko pronalaženje klijenata', 'Kvalifikacija i poslovne prilike', 'Personalizirane poruke spremne za slanje'],
  },
  {
    name: 'Capacity Planner', title: 'AI Capacity Planner',
    desc: 'Analizira zaposlenike, zadatke, rokove i opterećenje. Predviđa kada firma neće imati dovoljno kapaciteta i kako bolje rasporediti posao.',
    list: ['Pregled opterećenja tima', 'Rano upozorenje na zastoje', 'Prijedlog boljeg rasporeda posla'],
  },
  {
    name: 'Delivery Control', title: 'AI Delivery Control',
    desc: 'Upoređuje ono što je klijentu obećano ugovorom ili ponudom s onim što je stvarno urađeno.',
    list: ['Otkriva neizvršene obaveze', 'Bilježi poslove izvan dogovora', 'Upozorava na moguća kašnjenja'],
  },
  {
    name: 'AI Sekretarica', title: 'AI Sekretarica',
    desc: 'Javlja se na pozive 0–24 i sama zove potencijalne klijente s vašeg broja telefona. Odgovara na pitanja, zakazuje sastanke i šalje vam sažetak svakog razgovora. Radi zajedno s AI Leads.',
    list: ['Odgovara na dolazne pozive 0–24', 'Zove leadove s vašeg broja', 'Zakazuje termine i šalje sažetak razgovora'],
  },
];
