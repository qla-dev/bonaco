import { Link } from 'react-router-dom';
import { SITE, SOCIAL } from '../data/site';
import { useLang } from '../lib/i18n';
import BrandLogo from './BrandLogo';
import SocialIcon from './SocialIcon';

export default function Footer() {
  const { t, to } = useLang();
  return <footer className="ref-footer">
    <div className="ref-wrap ref-footer-top">
      <div className="footer-brand">
        <Link to={to('/')} aria-label="Bonaco Media"><BrandLogo /></Link>
        <p>{t('Strategija, kreativa i produkcija. Iz Sarajeva, za ideje koje idu dalje.', 'Strategy, design and production. Based in Sarajevo. Creating work that reaches further.')}</p>
        <span className="footer-signature">{t('Povezujemo ideje i ljude.', 'Connecting ideas and people.')}</span>
      </div>
      <div className="footer-column">
        <h2>{t('Istražite', 'Explore')}</h2>
        <nav aria-label={t('Linkovi u podnožju', 'Footer navigation')}>
          <Link to={to('/o-nama/')}>{t('O nama', 'About')}</Link>
          <Link to={to('/portfolio/')}>{t('Naši radovi', 'Our work')}</Link>
          <Link to={to('/nase-usluge/')}>Bonaco marketing</Link>
          <Link to={to('/kontakt/')}>{t('Kontakt', 'Contact')}</Link>
        </nav>
      </div>
      <div className="footer-column footer-contact">
        <h2>{t('Pronađite nas', 'Find us')}</h2>
        <a href={'mailto:' + SITE.email}>{SITE.email}</a>
        <a href={SITE.phoneHref}>{SITE.phone}</a>
        <a className="footer-address" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">{SITE.address.street}<br />{SITE.address.zip} {SITE.address.city}, BiH <span aria-hidden="true">↗</span></a>
      </div>
      <div className="footer-column footer-follow">
        <h2>{t('U našem krugu', 'Stay in the loop')}</h2>
        <p>{t('Novi radovi, ideje i priče iza kadra.', 'Our latest work, fresh ideas and a look behind the scenes.')}</p>
        <nav className="footer-social-links" aria-label={t('Društvene mreže', 'Social media')}>
          {SOCIAL.map(s => <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}><SocialIcon id={s.id} size={18} /></a>)}
        </nav>
      </div>
    </div>
    <div className="ref-wrap ref-footer-bottom">
      <span>© {new Date().getFullYear()} {SITE.legalName}</span>
      <Link to={to('/politika-privatnosti/')}>{t('Politika privatnosti', 'Privacy policy')}</Link>
      <a href="https://qla.dev" target="_blank" rel="noopener noreferrer">Made by qla.dev ↗</a>
    </div>
  </footer>;
}
