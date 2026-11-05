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

const routes = [
  { path: '/', title: `${NAME} – digitalna marketinška agencija, Sarajevo`, description: 'Bonaco Media je agencija za digitalni marketing iz Sarajeva: društvene mreže, SEO, web i grafički dizajn, event management, foto i video te Bonexis AI alati.' },
  { path: '/nase-usluge/', title: `Usluge | ${NAME}`, description: 'Vođenje društvenih mreža, SEO optimizacija, web i grafički dizajn, event management te fotografisanje i snimanje. Personalizirana strategija za vaš brend.' },
  { path: '/bonexis/', title: `Bonexis – AI agenti za vaš biznis | ${NAME}`, description: 'Bonexis: šest AI agenata za audit vizuala, blog i SEO, pronalaženje klijenata, planiranje kapaciteta, kontrolu isporuke i AI sekretaricu koja prima i obavlja pozive.' },
  { path: '/portfolio/', title: `Portfolio | ${NAME}`, description: 'Odabrani projekti Bonaco Media: društvene mreže, web stranice, grafički dizajn, fotografija, video i eventi.' },
  { path: '/vijesti/', title: `Vijesti | ${NAME}`, description: 'Novosti, savjeti i trendovi iz digitalnog marketinga: društvene mreže, SEO, dizajn i nove tehnologije.' },
  { path: '/kontakt/', title: `Kontakt | ${NAME}`, description: 'Kontaktirajte Bonaco Media: Hiseta br. 11, Sarajevo, +387 33 258 900, bonacomedia@gmail.com. Pošaljite upit i javit ćemo vam se s prijedlogom.' },
  { path: '/politika-privatnosti/', title: `Politika privatnosti | ${NAME}`, description: 'Kako Bonaco Media prikuplja i koristi lične podatke posjetilaca web stranice.' },
  ...PROJECTS.map(p => ({ path: `/portfolio/${p.slug}/`, title: `${p.client} – ${p.title} | ${NAME}`, description: p.summary, image: p.cover })),
  ...POSTS.map(p => ({ path: `/${p.slug}/`, title: `${p.title} | ${NAME}`, description: p.description, image: p.cover, type: 'article' })),
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
  ].join('\n    ');
  const html = template.slice(0, template.indexOf(START)) + block + template.slice(template.indexOf(END) + END.length);
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
