// Uvozi sadržaj iz REA exporta (../rea-export) u React projekat:
//  - optimizovane WebP slike u public/img
//  - data/posts.generated.ts iz renderovanog HTML-a blog postova
// Pokretanje: npm run import-rea
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import * as cheerio from 'cheerio';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REA = path.resolve(ROOT, '../rea-export');
const UP = path.join(REA, 'assets/bonacomedia.com/wp-content/uploads');
const OUT = path.join(ROOT, 'public/img');

const done = [];
async function img(src, dest, { width = 1600, quality = 78 } = {}) {
  const from = path.join(UP, src);
  const to = path.join(OUT, dest);
  if (!fs.existsSync(from)) { console.warn('nedostaje u REA exportu:', src); return null; }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const info = await sharp(from).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(to);
  done.push(dest);
  return { src: '/img/' + dest.replace(/\\/g, '/'), width: info.width, height: info.height };
}

// --- Logo i favicon
await img('2024/09/IMG-464ae62e583541c1741590a1929839bc-V.png', 'logo/bonaco-media.webp', { width: 640, quality: 90 });
await img('2024/09/Asset-4LOGO-BONACO-MEDIA-bijela.png', 'logo/bonaco-b.webp', { width: 142, quality: 90 });
fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
await sharp(path.join(UP, '2024/09/Asset-4LOGO-BONACO-MEDIA-bijela.png'))
  .resize(180, 180, { fit: 'contain', background: '#0d0b0a' }).flatten({ background: '#0d0b0a' }).png().toFile(path.join(ROOT, 'public/apple-touch-icon.png'));
await sharp(path.join(UP, '2024/09/Asset-4LOGO-BONACO-MEDIA-bijela.png'))
  .resize(64, 64, { fit: 'contain', background: '#0d0b0a' }).flatten({ background: '#0d0b0a' }).png().toFile(path.join(ROOT, 'public/favicon.png'));

// --- Logotipi klijenata
const CLIENT_LOGOS = {
  'ecomm': '2024/09/ecomm-logo.png', 'edemus': '2024/09/edemus-logo.png', 'flok': '2024/09/flok-logo.png',
  'golf-klub-sarajevo': '2024/09/golf-klub-sarajevo-logo.png', 'fk-zeljeznicar': '2025/11/image-798-scaled.png',
  'women-in-adria': '2025/11/Woemn-in-adria.png', 'medicana': '2025/11/Medicana.png', 'zmaj': '2025/11/Zmaj.png',
  'omega': '2025/11/Omega.png', 'inspect-rgh': '2025/11/INSPECT-RGH.png', 'km-trade': '2024/09/kmtrade-logo.png',
  'm90': '2024/09/m90-logo.png', 'max-media': '2024/09/max-media-logo.png', 'peoples': '2024/09/Peoples-logo.png',
  'pivnica-hs': '2024/09/Pivnica-hs-logo.png', 'rooms': '2024/09/rooms-logo.png', 'sarajevska-pivara': '2024/09/Sarajevska-pivara-logo.png',
  'summer-lounge': '2024/09/Summer-lounge-logo.png', 'tehnologic': '2024/09/tehnologic-logo.png', 'an-carstvo': '2024/09/An-carstvo-logo.png',
  'bb': '2024/09/BB-logo.png', 'beautyco': '2024/09/beautyco-logo.png', 'bh-travel': '2024/09/bh-travel-logo.png', 'btf': '2024/09/btf-logo.png',
};
for (const [k, v] of Object.entries(CLIENT_LOGOS)) await img(v, `clients/${k}.webp`, { width: 360, quality: 90 });

// --- Projekti: mockupi i galerije
const MOCKUPS = { 'max-media': 'web-01.png', 'bunjo': 'web-2.png', 'skuter': 'web-3.png', 'summer-lounge': 'web-4.png', 'beautyco': 'web-5.png', 'rooms': 'web-6.png' };
for (const [k, v] of Object.entries(MOCKUPS)) await img('2024/09/' + v, `projects/${k}/mockup.webp`, { width: 1200, quality: 82 });

const portfolio = cheerio.load(fs.readFileSync(path.join(REA, 'pages/portfolio/rendered.html'), 'utf8'));
const galleries = {};
let current = null;
portfolio('h2, a[href$="-scaled.jpg"]').each((_, el) => {
  if (el.tagName === 'h2') { current = portfolio(el).text().trim(); return; }
  const href = portfolio(el).attr('href');
  if (current && href) (galleries[current] ??= new Set()).add(href);
});
const GALLERY_SLUG = { 'Summer Lounge': 'summer-lounge', 'BeautyCO': 'beautyco', 'BH Travel': 'bh-travel' };
const galleryData = {};
for (const [name, urls] of Object.entries(galleries)) {
  const slug = GALLERY_SLUG[name]; if (!slug) continue;
  galleryData[slug] = [];
  for (const u of urls) {
    const rel = u.replace('https://bonacomedia.com/wp-content/uploads/', '');
    const base = path.basename(rel).replace(/-min-scaled\.jpg$/, '');
    const big = await img(rel, `projects/${slug}/${base}.webp`, { width: 1800, quality: 78 });
    const thumb = await img(rel, `projects/${slug}/${base}-800.webp`, { width: 800, quality: 74 });
    if (big) galleryData[slug].push({ src: big.src, thumb: thumb.src, width: big.width, height: big.height });
  }
}

// --- Testimonijali (fotografije)
for (const [k, v] of Object.entries({ rooms: '2024/09/IMG_2275.jpg', beautyco: '2024/09/Image_Editor.png', 'wine-shop': '2024/09/296036351_475945727868601_1753662433959115018_n.jpg', 'sarajevska-pivnica': '2024/09/images.jpg' }))
  await img(v, `testimonials/${k}.webp`, { width: 200, quality: 85 });

// --- Blog postovi
const POSTS = ['bonaco-media-ima-novu-i-rebrandiranu-web-stranicu', 'fresh-start', 'seo', 'figma', 'instagram', 'tehnologija', 'kako-postati-uspjesta-marketinska-agencija-bonaco-media'];
const posts = [];
for (const slug of POSTS) {
  const $ = cheerio.load(fs.readFileSync(path.join(REA, 'pages', slug, 'rendered.html'), 'utf8'));
  const body = $('.elementor-widget-theme-post-content .elementor-widget-container, .entry-content').first();
  body.find('script, style, noscript').remove();
  // očisti WordPress/Elementor atribute, zadrži samo semantiku
  body.find('*').each((_, el) => {
    for (const a of Object.keys(el.attribs || {})) if (!['href', 'src', 'alt'].includes(a)) $(el).removeAttr(a);
  });
  for (const el of body.find('img').toArray()) {
    const src = $(el).attr('src') || '';
    const rel = src.replace(/^https?:\/\/bonacomedia\.com\/wp-content\/uploads\//, '');
    const local = rel !== src ? await img(rel, `posts/${slug}/${path.basename(rel).replace(/\.\w+$/, '')}.webp`, { width: 1200 }) : null;
    if (local) $(el).attr('src', local.src).attr('loading', 'lazy'); else $(el).remove();
    if (!$(el).attr('alt')) $(el).attr('alt', '');
  }
  body.find('a').each((_, a) => {
    const h = $(a).attr('href') || '';
    $(a).attr('href', h.replace(/^https?:\/\/bonacomedia\.com/, ''));
  });
  body.find('p').each((_, p) => { if (!$(p).text().trim() && !$(p).find('img').length) $(p).remove(); });
  const ogImage = ($('meta[property="og:image"]').attr('content') || '').replace(/^https?:\/\/bonacomedia\.com\/wp-content\/uploads\//, '');
  const cover = ogImage ? await img(ogImage, `posts/${slug}/cover.webp`, { width: 1400 }) : null;
  const title = $('h1').toArray().map(h => $(h).text().trim()).filter(Boolean).pop() || $('title').text();
  posts.push({
    slug,
    title,
    date: ($('meta[property="article:published_time"]').attr('content') || '').slice(0, 10),
    description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
    cover: cover?.src || null,
    html: (body.html() || '').replace(/\s+/g, ' ').replace(/<(div|span)>\s*<\/\1>/g, '').trim(),
  });
}
posts.sort((a, b) => b.date.localeCompare(a.date));

fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data/posts.generated.ts'),
  `// Generisano iz REA exporta (scripts/import-rea.mjs). Ne mijenjati ručno.\nimport type { Post } from '../types';\n\nexport const POSTS: Post[] = ${JSON.stringify(posts, null, 2)};\n`);
fs.writeFileSync(path.join(ROOT, 'data/galleries.generated.ts'),
  `// Generisano iz REA exporta (scripts/import-rea.mjs). Ne mijenjati ručno.\nimport type { GalleryImage } from '../types';\n\nexport const GALLERIES: Record<string, GalleryImage[]> = ${JSON.stringify(galleryData, null, 2)};\n`);
console.log(`Slike: ${done.length}, postovi: ${posts.length}, galerije: ${Object.entries(galleryData).map(([k, v]) => `${k}=${v.length}`).join(', ')}`);
