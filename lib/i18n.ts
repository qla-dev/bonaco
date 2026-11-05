// Dvojezičnost: bosanski je na rootu (/kontakt/), engleski ispod /en/ (/en/contact/).
// Svaka stranica ima par BS ↔ EN, pa prekidač jezika ostaje na istoj podstranici.
import { useLocation } from 'react-router-dom';

export type Lang = 'bs' | 'en';

/** Parovi putanja [bs, en]. Duži prefiksi prvo (portfolio/slug prije portfolio). */
export const PATHS: [string, string][] = [
  ['/nase-usluge/', '/en/marketing/'],
  ['/bonexis/', '/en/bonexis/'],
  ['/bonevents/', '/en/bonevents/'],
  ['/portfolio/', '/en/work/'],
  ['/o-nama/', '/en/about/'],
  ['/kontakt/', '/en/contact/'],
  ['/politika-privatnosti/', '/en/privacy-policy/'],
  ['/', '/en/'],
];

export const langOf = (pathname: string): Lang => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'bs');

const withSlash = (p: string) => (p.endsWith('/') ? p : p + '/');

/** BS putanja (može imati #hash ili ?query) -> putanja na traženom jeziku. */
export function localize(bsPath: string, lang: Lang): string {
  if (lang === 'bs') return bsPath;
  const m = bsPath.match(/^([^?#]*)(.*)$/)!;
  const path = withSlash(m[1] || '/');
  for (const [bs, en] of PATHS) {
    if (bs === '/' ? path === '/' : path.startsWith(bs)) return en + path.slice(bs.length) + m[2];
  }
  return '/en/' + m[2];
}

/** Ista stranica na drugom jeziku. null = stranica postoji samo na bosanskom (vijesti, postovi). */
export function counterpart(pathname: string): { bs: string; en: string | null } {
  const path = withSlash(pathname);
  if (langOf(path) === 'en') {
    for (const [bs, en] of PATHS) if (path.startsWith(en)) return { bs: bs + path.slice(en.length), en: path };
    return { bs: '/', en: path };
  }
  for (const [bs, en] of PATHS) {
    if (bs === '/' ? path === '/' : path.startsWith(bs)) return { bs: path, en: en + path.slice(bs.length) };
  }
  return { bs: path, en: null };
}

export function useLang() {
  const { pathname } = useLocation();
  const lang = langOf(pathname);
  return {
    lang,
    /** t('bosanski', 'English') */
    t: (bs: string, en: string) => (lang === 'en' ? en : bs),
    /** Lokalizovan link: to('/kontakt/') */
    to: (bsPath: string) => localize(bsPath, lang),
  };
}

/** Polje s BS tekstom i opcionalnim EN prijevodom. */
export type L10n<T> = T & { en?: Partial<T> };
export const tr = <T extends object>(item: L10n<T>, lang: Lang): T => (lang === 'en' && item.en ? { ...item, ...item.en } : item);
