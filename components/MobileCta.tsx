// Fiksni CTA na dnu ekrana (samo telefon), po uzoru na qla.dev: "Pogledajte radove" + "Zatražite ponudu".
// Na početnoj se pojavljuje tek kad dugmad iz heroja odu s ekrana, da se ne dupliraju.
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../lib/i18n';

export default function MobileCta() {
  const { pathname } = useLocation();
  const { t, to } = useLang();
  const [show, setShow] = useState(false);
  const onContact = pathname.startsWith(to('/kontakt/'));

  useEffect(() => {
    const hero = document.querySelector('.hv-below .btn-row');
    if (!hero) { setShow(true); return; }
    setShow(false);
    const io = new IntersectionObserver(([en]) => setShow(!en.isIntersecting && en.boundingClientRect.top < 0));
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  if (onContact) return null;
  return (
    <div className={`mobile-cta ${show ? 'is-on' : ''}`} aria-hidden={!show}>
      <Link to={to('/portfolio/')} className="btn btn-primary" tabIndex={show ? undefined : -1}>{t('Pogledajte radove', 'See our work')}</Link>
      <Link to={to('/kontakt/')} className="btn btn-glass" tabIndex={show ? undefined : -1}>{t('Zatražite ponudu', 'Request a quote')}</Link>
    </div>
  );
}
