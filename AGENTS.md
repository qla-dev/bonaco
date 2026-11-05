# Bonaco Media web

React + Vite sajt za https://bonacomedia.com (zamjena za stari WordPress). Ovaj repo je web root na serveru: `.htaccess` servira build iz `dist/`, prerenderovane stranice (`dist/kontakt/index.html` ...) i za ostale klijentske rute vraća `dist/index.html`. `redeploy.php` ostaje izvan builda.

## Struktura

- `pages/`, `components/` – React stranice i komponente (flat, kao geovizija)
- `components/bonexis/` – Bonexis chat (`BonexisChat`), 3D kancelarija (`officeScene.ts`, three.js se učitava tek kad je sekcija blizu ekrana)
- `data/` – sav sadržaj: kontakt i mreže (`site.ts`), usluge, projekti, testimonijali, klijenti, Bonexis agenti
- `data/*.generated.ts` i `public/img/` – generisano iz REA exporta stare stranice (`npm run import-rea`, čita `../rea-export`); ne mijenjati ručno
- `public/contact.php` – kontakt forma (PHP `mail()`, honeypot, rate limit)

## Build

`npm run build` = `tsc` + `vite build` + `scripts/prerender-meta.mjs` (title/description/OG po ruti i `sitemap.xml`). Stari WordPress URL-ovi su zadržani (`/nase-usluge/`, `/kontakt/`, `/<slug-posta>/`), a preusmjerenja su u `.htaccess`.

## Deployment

Nakon pusha otvoriti https://bonacomedia.com/redeploy.php (`git pull --ff-only`, `npm ci`, `npm run build`, ispis uživo). Na cPanelu mora biti uključen Node.js 20+.

`npm ci` traži da je `package-lock.json` commitovan i usklađen s `package.json`. Ne commitovati `dist/` ni `node_modules/`.

## Otvorene stavke (Bonaco)

- `GOOGLE_REVIEWS` u `data/site.ts`: upisati ocjenu i broj recenzija
- `data/projects.ts`: konačni tekstovi studija slučaja i potvrđeni rezultati
- saglasnost klijenata za testimonijale; pregled politike privatnosti
- stvarne Bonaco fotografije za prvi ekran (`components/HeroStage.tsx`)
