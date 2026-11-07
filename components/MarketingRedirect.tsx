// Stari URL /nase-usluge/ (i /en/marketing/, /nase-usluge/#seo) vodi na marketing sekciju početne,
// s odabranim tabom usluge ako je naveden (dorade v08: Marketing nije zasebna stranica).
import { Navigate, useLocation } from 'react-router-dom';
import { langOf } from '../lib/i18n';

export default function MarketingRedirect() {
  const { pathname, hash, search } = useLocation();
  const slug = decodeURIComponent(hash.slice(1)) || new URLSearchParams(search).get('usluga') || '';
  const home = langOf(pathname) === 'en' ? '/en/' : '/';
  return <Navigate to={`${home}${slug ? `?usluga=${encodeURIComponent(slug)}` : ''}#marketing`} replace />;
}
