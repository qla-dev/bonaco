import { asset } from '../lib/asset';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SERVICES } from '../data/services';
import { SITE, SOCIAL } from '../data/site';
import SocialIcon from './SocialIcon';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src={asset('/img/logo/bonaco-media.webp')} alt="Bonaco Media" width="640" height="168" loading="lazy" />
          <p>Agencija za digitalni marketing iz Sarajeva. Društvene mreže, web, dizajn, foto i video, eventi i Bonexis, marketing CRM s AI agentima.</p>
          <div className="footer-social">
            {SOCIAL.map(s => (
              <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.label}><SocialIcon id={s.id} size={20} /></a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="footer-title">Usluge</h2>
          <ul>
            {SERVICES.map(s => <li key={s.slug}><Link to={`/nase-usluge/#${s.slug}`}>{s.title}</Link></li>)}
            <li><Link to="/bonexis/">Bonexis CRM</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Kompanija</h2>
          <ul>
            <li><Link to="/#o-nama">O nama</Link></li>
            <li><Link to="/portfolio/">Portfolio</Link></li>
            <li><Link to="/vijesti/">Vijesti</Link></li>
            <li><Link to="/kontakt/">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Kontakt</h2>
          <ul className="footer-contact">
            <li><a href={SITE.phoneHref}><Phone size={16} /> {SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`}><Mail size={16} /> {SITE.email}</a></li>
            <li><a href={SITE.mapsUrl} target="_blank" rel="noopener"><MapPin size={16} /> {SITE.address.street}, {SITE.address.zip} {SITE.address.city}</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} {SITE.legalName}{SITE.companyIds.map(c => ` · ${c.label}: ${c.value}`).join('')}</span>
        <nav aria-label="Pravne informacije">
          <Link to="/politika-privatnosti/">Politika privatnosti</Link>
          <a href="https://qla.dev" target="_blank" rel="noopener" className="made-by" aria-label="Made by qla.dev">
            <span>Made by</span>
            <img src={asset('/img/logo/qla-dev.webp')} alt="qla.dev" width="84" height="24" loading="lazy" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
