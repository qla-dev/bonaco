// Posle vite builda: za svaku rutu napravi dist/<ruta>/index.html sa tačnim title/description/OG tagovima,
// tako da Google, Facebook, WhatsApp... vide pravi pregled stranice bez izvršavanja JavaScripta.
// Podaci se čitaju iz istih TS fajlova koje koristi aplikacija (bundlovano preko esbuilda).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://bonacomedia.com';
const NAME = 'Bonaco Media';

const entry = path.join(ROOT, 'scripts/.prerender-data.ts');
fs.writeFileSync(entry, `
export { PROJECTS } from '../data/projects';
export { POSTS } from '../data/posts.generated';
`);
const out = path.join(ROOT, 'scripts/.prerender-data.mjs');
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const { PROJECTS, POSTS } = await import(pathToFileURL(out).href + `?t=${Date.now()}`);
fs.rmSync(entry); fs.rmSync(out);

const BS_DESC = 'Bonaco Media je full-service marketinška agencija iz Sarajeva: strategija i kampanje, društvene mreže, dizajn i branding, foto i video, web i SEO, OOH. Uz Bonexis AI rješenja i BonEvents.';
const EN_DESC = 'Bonaco Media is a full-service marketing agency from Sarajevo: strategy and campaigns, social media, design and branding, photo and video, web and SEO, OOH. Plus Bonexis AI solutions and BonEvents.';

// Parovi stranica: [bs, en] (isto kao lib/i18n.ts). alt = putanja na drugom jeziku za hreflang.
const pair = (bs, en) => [{ ...bs, lang: 'bs', alt: en.path }, { ...en, lang: 'en', alt: bs.path }];
const routes = [
  ...pair(
    { path: '/', title: `${NAME} – full-service marketinška agencija, Sarajevo`, description: BS_DESC },
    { path: '/en/', title: `${NAME} – full-service marketing agency, Sarajevo`, description: EN_DESC }),
  ...pair(
    { path: '/nase-usluge/', title: `Marketing | ${NAME}`, description: 'Strategija i kampanje, društvene mreže, grafički dizajn i branding, foto i video, web dizajn, SEO i OOH/DOOH oglašavanje. Full-service marketing za vaš brend.' },
    { path: '/en/marketing/', title: `Marketing | ${NAME}`, description: 'Strategy and campaigns, social media, graphic design and branding, photo and video, web design, SEO and OOH/DOOH advertising. Full-service marketing for your brand.' }),
  ...pair(
    { path: '/bonexis/', title: `Bonexis – AI rješenja za vaš tim (uskoro) | ${NAME}`, description: 'Bonexis by Bonaco × qla.dev: pet AI kapsula za web, sadržaj i SEO, leadove, planiranje kapaciteta, kontrolu isporuke i reviziju rada. U razvoju, predstavljanje januar 2027.' },
    { path: '/en/bonexis/', title: `Bonexis – AI solutions for your team (coming soon) | ${NAME}`, description: 'Bonexis by Bonaco × qla.dev: five AI capsules for web, content and SEO, leads, capacity planning, delivery control and work audit. In development, launching January 2027.' }),
  ...pair(
    { path: '/bonevents/', title: `BonEvents – organizacija i produkcija događaja | ${NAME}`, description: 'BonEvents planira, producira i promoviše događaje za brendove: organizacija, produkcija, hostese, foto i video. Reference: JOVS i Summer Lounge.' },
    { path: '/en/bonevents/', title: `BonEvents – event planning and production | ${NAME}`, description: 'BonEvents plans, produces and promotes events for brands: organisation, production, hosts, photo and video. References: JOVS and Summer Lounge.' }),
  ...pair(
    { path: '/portfolio/', title: `Radovi | ${NAME}`, description: 'Odabrani radovi Bonaco Media: društvene mreže, web stranice, grafički dizajn, fotografija, video i eventi.' },
    { path: '/en/work/', title: `Work | ${NAME}`, description: 'Selected work by Bonaco Media: social media, websites, graphic design, photography, video and events.' }),
  ...pair(
    { path: '/o-nama/', title: `O nama | ${NAME}`, description: 'Bonaco Media je full-service marketinška agencija iz Sarajeva, osnovana 2021. Uz marketing razvijamo Bonexis AI rješenja i BonEvents organizaciju događaja.' },
    { path: '/en/about/', title: `About us | ${NAME}`, description: 'Bonaco Media is a full-service marketing agency from Sarajevo, founded in 2021. Alongside marketing we build Bonexis AI solutions and run BonEvents.' }),
  ...pair(
    { path: '/kontakt/', title: `Kontakt | ${NAME}`, description: 'Kontaktirajte Bonaco Media: Hiseta br. 11, Sarajevo, +387 33 258 900, bonacomedia@gmail.com. Upit za marketing, BonEvents ili Bonexis.' },
    { path: '/en/contact/', title: `Contact | ${NAME}`, description: 'Contact Bonaco Media: Hiseta br. 11, Sarajevo, +387 33 258 900, bonacomedia@gmail.com. Inquiries for marketing, BonEvents or Bonexis.' }),
  ...pair(
    { path: '/politika-privatnosti/', title: `Politika privatnosti | ${NAME}`, description: 'Kako Bonaco Media prikuplja i koristi lične podatke posjetilaca web stranice.' },
    { path: '/en/privacy-policy/', title: `Privacy policy | ${NAME}`, description: 'How Bonaco Media collects and uses the personal data of website visitors.' }),
  ...PROJECTS.flatMap(p => pair(
    { path: `/portfolio/${p.slug}/`, title: `${p.client} – ${p.title} | ${NAME}`, description: p.summary, image: p.cover },
    { path: `/en/work/${p.slug}/`, title: `${p.client} – ${p.en?.title ?? p.title} | ${NAME}`, description: p.en?.summary ?? p.summary, image: p.cover })),
  { path: '/vijesti/', lang: 'bs', title: `Vijesti | ${NAME}`, description: 'Novosti, savjeti i trendovi iz digitalnog marketinga: društvene mreže, SEO, dizajn i nove tehnologije.' },
  ...POSTS.map(p => ({ path: `/${p.slug}/`, lang: 'bs', title: `${p.title} | ${NAME}`, description: p.description, image: p.cover, type: 'article' })),
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const START = '<!-- meta:start', END = '<!-- meta:end -->';
if (!template.includes(START) || !template.includes(END)) throw new Error('index.html nema meta:start/meta:end blok');

for (const r of routes) {
  const url = SITE + r.path;
  const img = r.image ? (r.image.startsWith('http') ? r.image : SITE + r.image) : `${SITE}/og-default.jpg`;
  const block = [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${r.type ?? 'website'}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:locale" content="${r.lang === 'en' ? 'en_US' : 'bs_BA'}" />`,
    ...(r.alt ? [
      `<link rel="alternate" hreflang="${r.lang}" href="${url}" />`,
      `<link rel="alternate" hreflang="${r.lang === 'en' ? 'bs' : 'en'}" href="${SITE + r.alt}" />`,
      `<link rel="alternate" hreflang="x-default" href="${SITE + (r.lang === 'en' ? r.alt : r.path)}" />`,
    ] : []),
  ].join('\n    ');
  let html = template.slice(0, template.indexOf(START)) + block + template.slice(template.indexOf(END) + END.length);
  if (r.lang === 'en') html = html.replace('<html lang="bs">', '<html lang="en">');
  const file = path.join(DIST, r.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// dist/.htaccess: radi i kad je dist servirán ispod podputanje (qla.dev/bonaco) i na rootu.
// Folder bez kose crte dobija je ovdje (sa base), prije nego mod_dir doda internu dist/ putanju.
const BASE = process.argv[2] || '/';
fs.writeFileSync(path.join(DIST, '.htaccess'), `Options -Indexes
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^(.*[^/])$ ${BASE}$1/ [R=301,L]
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  # Klijentske rute aplikacije
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`);

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map(r => `  <url><loc>${SITE}${r.path}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`);
console.log(`Prerenderovano ${routes.length} ruta + sitemap.xml`);
