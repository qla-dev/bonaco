import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import PoslovniOglasiLogo from './PoslovniOglasiLogo';
import BrandLogo from './BrandLogo';

const BRANDS = [
  { id: 'bonaco', brand: 'bonaco' as const, name: 'Bonaco Media', to: '/nase-usluge/', bs: 'Marketing', en: 'Marketing' },
  { id: 'bonexis', brand: 'bonexis' as const, name: 'Bonexis', to: '/bonexis/', bs: 'AI rješenja', en: 'AI solutions' },
  { id: 'poslovni-oglasi', brand: null, name: 'Poslovni oglasi', to: '/poslovni-oglasi/', bs: 'Partnerska platforma', en: 'Partner platform' },
];

export default function BrandServiceLinks() {
  const { lang, t, to } = useLang();
  return <nav className="ref-wrap footer-family" aria-label={t('Bonaco, Bonexis i naši partneri', 'Bonaco, Bonexis and our partners')}>
    {BRANDS.map(b => <Link key={b.id} to={to(b.to)} className="footer-family-link" data-footer-brand={b.id} aria-label={b.name}>
      <span className="footer-family-logo">{b.brand ? <BrandLogo brand={b.brand}/> : <PoslovniOglasiLogo/>}</span>
      <span className="footer-family-caption">{b[lang]}</span>
    </Link>)}
  </nav>;
}
