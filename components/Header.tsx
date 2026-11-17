import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { NAV, NAV_OFFER, SOCIAL } from '../data/site';
import { counterpart, useLang } from '../lib/i18n';
import SocialIcon from './SocialIcon';
import BrandLogo, { type Brand } from './BrandLogo';
import { getScrollY, onScroll, scrollToY } from '../lib/scroller';

export const brandOf = (pathname: string): Brand =>
  /^\/(en\/)?bonexis/.test(pathname) ? 'bonexis' : /^\/(en\/)?bonevents/.test(pathname) ? 'bonevents' : 'bonaco';

export function LangSwitch() {
  const { pathname, hash } = useLocation();
  const { lang } = useLang();
  const alt = counterpart(pathname);
  return (
    <div className="lang-switch" role="group" aria-label={lang === 'en' ? 'Language' : 'Jezik'}>
      <Link to={alt.bs + (lang === 'bs' ? hash : '')} hrefLang="bs" lang="bs" aria-current={lang === 'bs' ? 'true' : undefined} aria-label="Bosanski">BS</Link>
      <span aria-hidden="true">/</span>
      <Link to={alt.en ?? '/en/'} hrefLang="en" lang="en" aria-current={lang === 'en' ? 'true' : undefined} aria-label="English">EN</Link>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const { pathname } = useLocation();
  const { t, to } = useLang();
  const brand = brandOf(pathname);
  const home = to('/');

  useEffect(() => { setOpen(false); setDdOpen(false); }, [pathname]);
  useEffect(() => {
    const check = () => setScrolled(getScrollY() > 24);
    check();
    return onScroll(check);
  }, []);
  useEffect(() => {
    if (!open) return;
    const y = getScrollY();
    const at = window.location.pathname;
    document.body.style.top = `-${y}px`;
    document.documentElement.classList.add('menu-open');
    return () => {
      document.documentElement.classList.remove('menu-open');
      document.body.style.top = '';
      if (window.location.pathname === at) scrollToY(y);
    };
  }, [open]);

  const offerActive = NAV_OFFER.some(n => pathname.startsWith(to(n.to)));

  const navLinks = NAV.map(n => (
    <NavLink key={n.to} to={to(n.to)} className={({ isActive }) => (isActive ? 'active' : undefined)}>
      {t(n.bs, n.en)}
    </NavLink>
  ));

  return (
    <header className={`site-header ${pathname === home ? 'is-overlay' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link to={home} className="logo" aria-label={t('početna', 'home')}>
          <BrandLogo brand={brand} />
        </Link>
        <nav className="main-nav" aria-label={t('Glavni meni', 'Main menu')}>
          <div className="nav-left">
            <NavLink to={to('/portfolio/')}>{t('Radovi', 'Work')}</NavLink>
            <NavLink to={to('/o-nama/')}>{t('O nama', 'About')}</NavLink>
          </div>
          <div className="nav-right">
          <div className="nav-dd" onMouseEnter={() => setDdOpen(true)} onMouseLeave={() => setDdOpen(false)} onKeyDown={event => { if (event.key === 'Escape') setDdOpen(false); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDdOpen(false); }}>
            <button type="button" className={`nav-dd-trigger${offerActive ? ' active' : ''}`} aria-expanded={ddOpen} onClick={event => setDdOpen(current => event.detail === 0 ? !current : true)}>
              {t('Šta nudimo', 'What we offer')} <ChevronDown size={14} />
            </button>
            <div className={`nav-dd-panel${ddOpen ? ' is-open' : ''}`}>
              {NAV_OFFER.map(n => (
                <NavLink key={n.to} to={to(n.to)} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  {t(n.bs, n.en)}
                </NavLink>
              ))}
            </div>
          </div>

            <NavLink to={to('/kontakt/')}>{t('Kontakt', 'Contact')}</NavLink>
          </div>
        </nav>
        <LangSwitch />
        <button className="icon-btn menu-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? t('Zatvori meni', 'Close menu') : t('Otvori meni', 'Open menu')}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="mobile-menu" hidden={!open}>
        <nav aria-label={t('Mobilni meni', 'Mobile menu')}>
          <NavLink to={home} end>{t('Početna', 'Home')}</NavLink>
          <div className="mobile-dd">
            <button type="button" className="mobile-dd-trigger" onClick={() => setDdOpen(o => !o)} aria-expanded={ddOpen}>
              {t('Šta nudimo', 'What we offer')} <ChevronDown size={16} className={ddOpen ? 'rot180' : ''} />
            </button>
            {ddOpen && (
              <div className="mobile-dd-panel">
                {NAV_OFFER.map(n => (
                  <NavLink key={n.to} to={to(n.to)} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    {t(n.bs, n.en)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          {navLinks}
        </nav>
        <div className="mobile-social">
          {SOCIAL.map(s => (
            <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.label}><SocialIcon id={s.id} size={22} /></a>
          ))}
        </div>
        <Link to={to('/kontakt/')} className="btn btn-primary">{t('Zatražite ponudu', 'Request a quote')}</Link>
      </div>
    </header>
  );
}
