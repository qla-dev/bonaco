import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE } from '../data/site';

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

/** Postavlja naslov, opis, canonical i Open Graph za trenutnu stranicu.
 *  Statičke verzije istih tagova za crawlere pravi scripts/prerender-meta.mjs pri buildu. */
export default function SEO({ title, description, image = '/og-default.jpg', type = 'website' }: Props) {
  const { pathname } = useLocation();
  useEffect(() => {
    const full = title === SITE.name ? `${SITE.name} – digitalna marketinška agencija, Sarajevo` : `${title} | ${SITE.name}`;
    const url = SITE.url + pathname;
    const img = image.startsWith('http') ? image : SITE.url + image;
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:type', type);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
  }, [title, description, image, type, pathname]);
  return null;
}
