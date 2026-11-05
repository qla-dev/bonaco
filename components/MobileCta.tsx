// Fiksni CTA na dnu ekrana (samo telefon), po uzoru na qla.dev: "Pogledajte radove" + "Zatražite ponudu".
// Uvijek vidljiv na telefonu (dugmad u heroju se tada ne prikazuju); sakriven na kontaktu i dok je meni otvoren.
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../lib/i18n';

export default function MobileCta() {
  const { pathname } = useLocation();
  const { t, to } = useLang();
  if (pathname.startsWith(to('/kontakt/'))) return null;
  return (
    <nav className="mobile-cta" aria-label={t('Brze akcije', 'Quick actions')}>
      <Link to={to('/portfolio/')} className="btn btn-primary">{t('Pogledajte radove', 'See our work')}</Link>
      <Link to={to('/kontakt/')} className="btn btn-glass">{t('Zatražite ponudu', 'Request a quote')}</Link>
    </nav>
  );
}
