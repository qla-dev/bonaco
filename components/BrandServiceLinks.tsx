import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PoslovniOglasiLogo from './PoslovniOglasiLogo';
import BrandLogo from './BrandLogo';

const BRANDS = [
  { brand:'bonexis' as const, name: 'Bonexis', to: '/bonexis/', color: 'var(--bonexis)', bs: 'Poslovna AI rješenja u saradnji s qla.dev. Uskoro sa vama.', en: 'Business AI solutions with qla.dev. Coming soon.' },
  { brand:'bonevents' as const, name: 'Bonevent', to: '/bonevents/', color: 'var(--bonevents)', bs: 'Organizacija, produkcija i promocija događaja.', en: 'Event planning, production and promotion.' },
  { brand:null, name: 'Poslovni oglasi', to: '/poslovni-oglasi/', color: '#f5f5f4', bs: 'Oglašavanje radnih mjesta i povezivanje s kandidatima.', en: 'Job advertising and connecting with candidates.' },
];

export default function BrandServiceLinks() {
  const { lang, t, to } = useLang();
  return <nav className="brand-services container" aria-label={t('Ostali smjerovi', 'More from Bonaco')}>
    {BRANDS.map(b => <Link key={b.to} className="brand-service-row" to={to(b.to)} style={{ ['--brand-color' as string]: b.color }}>
      <span className="brand-service-line" aria-hidden="true" />
      <span className="brand-service-logo">{b.brand ? <BrandLogo brand={b.brand}/> : <PoslovniOglasiLogo/>}</span>
      <span className="brand-service-description">{b[lang]}</span>
      <ArrowUpRight className="brand-service-arrow" size={22} aria-hidden="true" />
    </Link>)}
  </nav>;
}
