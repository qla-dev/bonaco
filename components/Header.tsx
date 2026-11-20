import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { NAV, NAV_OFFER, SOCIAL } from '../data/site';
import { counterpart, useLang } from '../lib/i18n';
import SocialIcon from './SocialIcon';
import BrandLogo, { type Brand } from './BrandLogo';
import { getScrollY, onScroll, scrollToY } from '../lib/scroller';

export const brandOf = (pathname: string): Brand =>
  /^\/(en\/)?bonexis/.test(pathname) ? 'bonexis' : 'bonaco';

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
  const desktopDropdown = useRef<HTMLDivElement>(null);
  const mobileDropdown = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const { t, to } = useLang();
  const home = to('/');

  useEffect(() => { setOpen(false); setDdOpen(false); }, [pathname]);
  useEffect(() => {
    if (!ddOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!desktopDropdown.current?.contains(event.target as Node) && !mobileDropdown.current?.contains(event.target as Node)) setDdOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [ddOpen]);
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

  const routePath = pathname.replace(/\/?$/, '/');
  const overview = { to: '/sta-nudimo/', bs: 'Šta nudimo', en: 'Services', color: '#f5862a' };
  const offerLinks = NAV_OFFER.map(n => n.to === '/bonexis/' ? { ...n, bs: 'Bonexis', en: 'Bonexis' } : n);
  const activeOffer = offerLinks.find(n => routePath.startsWith(to(n.to)));
  const offerActive = routePath === to(overview.to) || !!activeOffer;
  const offerLabel = activeOffer ? t(activeOffer.bs, activeOffer.en) : t(overview.bs, overview.en);
  const dropdownLinks = [overview, ...offerLinks.filter(n => n.to !== activeOffer?.to)];
  const currentSection = [...NAV, overview, ...offerLinks].find(n => routePath.startsWith(to(n.to)));
  const currentLabel = currentSection ? t(currentSection.bs, currentSection.en) : pathname === home ? t('Početna', 'Home') : t('Bonaco', 'Bonaco');

  const navLinks = NAV.map(n => (
    <NavLink key={n.to} to={to(n.to)} className={({ isActive }) => (isActive ? 'active' : undefined)}>
      {t(n.bs, n.en)}
    </NavLink>
  ));

  return (
    <header className={`site-header ${pathname === home ? 'is-overlay' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="header-shell">
      <div className="container header-inner">
        <div className="header-brand">
          <Link to={home} className="logo" aria-label={t('Bonaco — početna', 'Bonaco — home')} aria-current={pathname === home ? 'page' : undefined}><BrandLogo /></Link>
          {pathname !== home && <span className="header-current" aria-label={t('Trenutna stranica: ', 'Current page: ') + currentLabel}>{currentLabel}</span>}
        </div>
        <nav className="main-nav" aria-label={t('Glavni meni', 'Main menu')}>
          <div className="nav-left">
            <NavLink to={to('/portfolio/')}>{t('Radovi', 'Work')}</NavLink>
            <NavLink to={to('/o-nama/')}>{t('O nama', 'About')}</NavLink>
          </div>
          <div className="nav-right">
          <div ref={desktopDropdown} className="nav-dd" onKeyDown={event => { if (event.key === 'Escape') { setDdOpen(false); event.currentTarget.querySelector('button')?.focus(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDdOpen(false); }}>
            <div className="nav-offer-heading">
              <button type="button" className={`nav-offer-link offer-navigation-trigger${offerActive ? ' active' : ''}`} aria-expanded={ddOpen} aria-controls="desktop-offer-menu" onClick={() => setDdOpen(current => !current)}>{offerLabel}<ChevronDown size={15} className={ddOpen ? 'rot180' : ''} aria-hidden="true" /></button>
            </div>
            <div id="desktop-offer-menu" hidden={!ddOpen} className={`nav-dd-panel${ddOpen ? ' is-open' : ''}`}>
              {dropdownLinks.map(n => (
                <NavLink key={n.to} to={to(n.to)} onClick={() => setDdOpen(false)} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  <span className="offer-dot" style={{background: n.color}} aria-hidden="true" />{t(n.bs, n.en)}
                </NavLink>
              ))}
            </div>
          </div>

            <NavLink to={to('/kontakt/')}>{t('Kontakt', 'Contact')}</NavLink>
          </div>
        </nav>
        <button className="icon-btn menu-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? t('Zatvori meni', 'Close menu') : t('Otvori meni', 'Open menu')}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <LangSwitch />
      </div>
      <div className="mobile-menu" hidden={!open}>
        <nav aria-label={t('Mobilni meni', 'Mobile menu')} onClick={event => { if ((event.target as Element).closest('a')) { setOpen(false); setDdOpen(false); } }}>
          <NavLink to={home} end>{t('Početna', 'Home')}</NavLink>
          <div ref={mobileDropdown} className="mobile-dd" onKeyDown={event => { if (event.key === 'Escape') { setDdOpen(false); event.currentTarget.querySelector('button')?.focus(); } }}>
            <div className="mobile-offer-heading">
              <button type="button" className={`offer-navigation-trigger${offerActive ? ' active' : ''}`} onClick={() => setDdOpen(o => !o)} aria-expanded={ddOpen} aria-controls="mobile-offer-menu">{offerLabel}<ChevronDown size={18} className={ddOpen ? 'rot180' : ''} aria-hidden="true" /></button>
            </div>
            {ddOpen && (
              <div id="mobile-offer-menu" className="mobile-dd-panel">
                {dropdownLinks.map(n => (
                  <NavLink key={n.to} to={to(n.to)} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    <span className="offer-dot" style={{background: n.color}} aria-hidden="true" />{t(n.bs, n.en)}
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
