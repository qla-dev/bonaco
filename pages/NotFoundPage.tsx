import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';

export default function NotFoundPage() {
  const { t, to } = useLang();
  return (
    <>
      <SEO title={t('Stranica nije pronađena', 'Page not found')} description={t('Tražena stranica ne postoji.', 'The requested page does not exist.')} />
      <section className="page-hero not-found">
        <div className="container">
          <span className="eyebrow">404</span>
          <h1>{hl(t('Ova stranica *ne postoji*', 'This page *does not exist*'))}</h1>
          <p className="lead">{t('Možda je premještena. Pogledajte početnu stranicu ili nam se javite.', 'It may have moved. Go to the home page or get in touch.')}</p>
          <div className="btn-row">
            <Link to={to('/')} className="btn btn-primary">{t('Početna', 'Home')}</Link>
            <Link to={to('/kontakt/')} className="btn btn-secondary">{t('Kontakt', 'Contact')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
