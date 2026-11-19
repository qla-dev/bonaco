// Fiksni CTA na dnu ekrana (samo telefon), po uzoru na qla.dev: "Pogledajte radove" + "Zatražite ponudu".
// Na početnoj se pojavljuje tek poslije videa; sakriven na kontaktu i dok je meni otvoren.
// Boja prati sekciju ispod trake: kad skrolom uđete u Bonexis, dugme postepeno (proporcionalno
// skrolu) prelazi u tirkiznu/ljubičastu i nazad.
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { onScroll } from '../lib/scroller';

const INK: Record<string, string> = { bonaco: '#141414', bonexis: '#0c0c0c' };
const FADE = 160; // px skrola za puni prelaz boje

export default function MobileCta() {
  const { pathname } = useLocation();
  const { t, to } = useLang();
  const ref = useRef<HTMLElement>(null);
  const isHome = pathname.replace(/\/$/, '') === to('/').replace(/\/$/, '');
  const [clearHero, setClearHero] = useState(!isHome);

  useEffect(() => {
    let raf = 0;
    setClearHero(!isHome);
    const update = () => {
      raf = 0;
      const bar = ref.current;
      if (!bar) return;
      const hero = isHome ? document.querySelector('.hv') : null;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
      setClearHero(!hero || hero.getBoundingClientRect().bottom <= headerHeight);
      const line = bar.getBoundingClientRect().top; // gornja ivica trake
      let brand = '', p = 0;
      document.querySelectorAll<HTMLElement>('main section[data-brand]').forEach(sec => {
        const r = sec.getBoundingClientRect();
        if (r.top < line && r.bottom > line) {
          const k = Math.min(1, (line - r.top) / FADE, (r.bottom - line) / FADE);
          if (k > p) { p = k; brand = sec.dataset.brand || ''; }
        }
      });
      if (brand) {
        bar.style.setProperty('--cta-to', `var(--${brand})`);
        bar.style.setProperty('--cta-ink-to', INK[brand] ?? '#141414');
      }
      bar.style.setProperty('--cta-p', `${Math.round(p * 100)}%`);
    };
    // stvarna visina trake -> --cta-h (slajdovi pune visine završavaju tačno na traci)
    const ro = new ResizeObserver(() => {
      const h = ref.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty('--cta-h', `${h}px`);
    });
    if (ref.current) ro.observe(ref.current);
    const onS = () => { if (!raf) raf = requestAnimationFrame(update); };
    const off = onScroll(onS);
    const t0 = setTimeout(update, 300);
    return () => { off(); ro.disconnect(); cancelAnimationFrame(raf); clearTimeout(t0); document.documentElement.style.removeProperty('--cta-h'); };
  }, [pathname, isHome]);

  if (isHome || pathname.startsWith(to('/kontakt/'))) return null;
  return (
    <nav ref={ref} className={`mobile-cta ${isHome && !clearHero ? 'is-over-hero' : ''}`} aria-label={t('Brze akcije', 'Quick actions')}>
      <Link to={to('/portfolio/')} className="btn btn-primary">{t('Pogledajte radove', 'See our work')}</Link>
      <Link to={to('/kontakt/')} className="btn btn-glass">{t('Zatražite ponudu', 'Request a quote')}</Link>
    </nav>
  );
}
