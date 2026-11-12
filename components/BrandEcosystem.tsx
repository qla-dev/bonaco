import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { asset } from '../lib/asset';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';
import BrandLogo from './BrandLogo';

const BRANCHES = [
  {
    brand: 'bonaco' as const,
    to: '/nase-usluge/',
    color: 'var(--bonaco)',
    bs: { tag: 'Marketing', desc: 'Full-service marketing: strategija, kampanje, dizajn, produkcija i web.' },
    en: { tag: 'Marketing', desc: 'Full-service marketing: strategy, campaigns, design, production and web.' },
  },
  {
    brand: 'bonexis' as const,
    to: '/bonexis/',
    color: 'var(--bonexis)',
    bs: { tag: 'AI Solutions', desc: 'Marketing CRM sa pet AI kapsula i owner agentima.' },
    en: { tag: 'AI Solutions', desc: 'Marketing CRM with five AI capsules run by owner agents.' },
  },
  {
    brand: 'bonevents' as const,
    to: '/bonevents/',
    color: 'var(--bonevents)',
    bs: { tag: 'Events', desc: 'Planiranje, produkcija i promocija događaja za brendove.' },
    en: { tag: 'Events', desc: 'Event planning, production and promotion for brands.' },
  },
  {
    brand: null,
    to: '/poslovni-oglasi/',
    color: 'var(--poslovnioglasi)',
    bs: { tag: 'Jobs', desc: 'Platforma za oglašavanje poslova i traženje radnika u BiH.' },
    en: { tag: 'Jobs', desc: 'Job advertising platform connecting employers and candidates in BiH.' },
  },
];

export default function BrandEcosystem() {
  const { t, to, lang } = useLang();
  return (
    <section className="section eco" id="ecosystem">
      <div className="container">
        <div className="eco-core">
          <img className="eco-logo" src={asset('/img/logo/bonaco-logo-hd.webp')} alt="Bonaco Media" width="639" height="168" />
          <h2 className="eco-title">
            {hl(t(
              'Jedna agencija, *četiri smjera*.',
              'One agency, *four directions*.',
            ))}
          </h2>
          <p className="eco-lead">
            {t(
              'Bonaco Media je krovno za sve: marketing, AI rješenja, eventi i zapošljavanje — četiri smjera, jedan tim.',
              'Bonaco Media is the parent for everything: marketing, AI solutions, events and employment — four directions, one team.',
            )}
          </p>
        </div>
        <div className="eco-branches">
          {BRANCHES.map(b => {
            const x = b[lang];
            return (
              <Link key={b.to} to={to(b.to)} className="eco-card" style={{ ['--card-accent' as string]: b.color }}>
                <span className="eco-card-brand">
                  {b.brand ? <BrandLogo brand={b.brand} /> : <span className="eco-card-name">Poslovni Oglasi</span>}
                </span>
                <span className="eco-card-tag">{x.tag}</span>
                <p>{x.desc}</p>
                <span className="eco-card-link">{t('Saznajte više', 'Learn more')} <ArrowRight size={14} /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
