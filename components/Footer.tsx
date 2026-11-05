import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SITE, SOCIAL } from '../data/site';
import { useLang } from '../lib/i18n';
import SocialIcon from './SocialIcon';
import BrandLogo, { QlaMark } from './BrandLogo';

export default function Footer() {
  const year = new Date().getFullYear();
  const { lang, t, to } = useLang();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <BrandLogo brand="bonaco" />
          <p>{t(
            'Full-service marketinška agencija iz Sarajeva: strategija, kreativa, produkcija i rezultati.',
            'A full-service marketing agency from Sarajevo: strategy, creativity, production and results.',
          )}</p>
          <div className="footer-social">
            {SOCIAL.map(s => (
              <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.label}><SocialIcon id={s.id} size={20} /></a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="footer-title">{t('Brendovi', 'Brands')}</h2>
          <ul className="footer-brands">
            <li><Link to={to('/nase-usluge/')}><i className="dot dot-bonaco" aria-hidden="true" />Bonaco Media · Marketing</Link></li>
            <li><Link to={to('/bonexis/')}><i className="dot dot-bonexis" aria-hidden="true" />Bonexis · AI Solutions</Link></li>
            <li><Link to={to('/bonevents/')}><i className="dot dot-bonevents" aria-hidden="true" />BonEvents · Events</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-title">{t('Kompanija', 'Company')}</h2>
          <ul>
            <li><Link to={to('/portfolio/')}>{t('Radovi', 'Work')}</Link></li>
            <li><Link to={to('/o-nama/')}>{t('O nama', 'About')}</Link></li>
            {lang === 'bs' && <li><Link to="/vijesti/">Vijesti</Link></li>}
            <li><Link to={to('/kontakt/')}>{t('Kontakt', 'Contact')}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-title">{t('Kontakt', 'Contact')}</h2>
          <ul className="footer-contact">
            <li><a href={SITE.phoneHref}><Phone size={16} /> {SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`}><Mail size={16} /> {SITE.email}</a></li>
            <li><a href={SITE.mapsUrl} target="_blank" rel="noopener"><MapPin size={16} /> {SITE.address.street}, {SITE.address.zip} {SITE.address.city}</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} {SITE.legalName}{SITE.companyIds.map(c => ` · ${c.label}: ${c.value}`).join('')}</span>
        <nav aria-label={t('Pravne informacije', 'Legal')}>
          <Link to={to('/politika-privatnosti/')}>{t('Politika privatnosti', 'Privacy policy')}</Link>
          <a href="https://qla.dev" target="_blank" rel="noopener" className="made-by" aria-label="Made by qla.dev">
            <span>Made by</span>
            <QlaMark />
          </a>
        </nav>
      </div>
    </footer>
  );
}
