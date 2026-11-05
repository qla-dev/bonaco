import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE } from '../data/site';
import { counterpart, langOf } from '../lib/i18n';

interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
}

const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.content = value;
};

const setAlternate = (hreflang: string, href: string | null) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!href) { el?.remove(); return; }
  if (!el) { el = document.createElement('link'); el.rel = 'alternate'; el.hreflang = hreflang; document.head.appendChild(el); }
  el.href = href;
};

/** Postavlja naslov, opis, canonical, hreflang i Open Graph za trenutnu stranicu.
 *  Statičke verzije istih tagova za crawlere pravi scripts/prerender-meta.mjs pri buildu. */
export default function SEO({ title, description, image = '/og-default.jpg', type = 'website' }: Props) {
  const { pathname } = useLocation();
  useEffect(() => {
    const en = langOf(pathname) === 'en';
    const home = en ? `${SITE.name} – full-service marketing agency, Sarajevo` : `${SITE.name} – full-service marketinška agencija, Sarajevo`;
    const full = title === SITE.name ? home : `${title} | ${SITE.name}`;
    const url = SITE.url + pathname;
    const img = image.startsWith('http') ? image : SITE.url + image;
    const alt = counterpart(pathname);
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:locale', en ? 'en_US' : 'bs_BA');
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
    setAlternate('bs', alt.en ? SITE.url + alt.bs : null);
    setAlternate('en', alt.en ? SITE.url + alt.en : null);
    setAlternate('x-default', alt.en ? SITE.url + alt.bs : null);
  }, [title, description, image, type, pathname]);
  return null;
}
