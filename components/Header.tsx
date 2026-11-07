import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV, SOCIAL } from '../data/site';
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
  const { pathname } = useLocation();
  const { t, to } = useLang();
  const brand = brandOf(pathname);
  const home = to('/');

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const check = () => setScrolled(getScrollY() > 24);
    check();
    return onScroll(check);
  }, []);
  // Otvoren meni: zaključaj skrol stranice (i na iOS-u, gdje body overflow nije dovoljan)
  useEffect(() => {
    if (!open) return;
    const y = getScrollY();
    const at = window.location.pathname;
    document.body.style.top = `-${y}px`;
    document.documentElement.classList.add('menu-open');
    return () => {
      document.documentElement.classList.remove('menu-open');
      document.body.style.top = '';
      // Vrati poziciju samo ako je meni zatvoren na istoj stranici (link vodi na vrh nove stranice)
      if (window.location.pathname === at) scrollToY(y);
    };
  }, [open]);

  const links = NAV.map(n => (n.to.includes('#') ? (
    <Link key={n.to} to={to(n.to)}>{t(n.bs, n.en)}</Link>
  ) : (
    <NavLink key={n.to} to={to(n.to)} className={({ isActive }) => (isActive ? 'active' : undefined)}>
      {t(n.bs, n.en)}
    </NavLink>
  )));

  return (
    <header className={`site-header ${pathname === home ? 'is-overlay' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link to={brand === 'bonaco' ? home : to(`/${brand}/`)} className="logo" aria-label={t('početna', 'home')}>
          <BrandLogo brand={brand} />
        </Link>
        <nav className="main-nav" aria-label={t('Glavni meni', 'Main menu')}>{links}</nav>
        <LangSwitch />
        <button className="icon-btn menu-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? t('Zatvori meni', 'Close menu') : t('Otvori meni', 'Open menu')}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="mobile-menu" hidden={!open}>
        <nav aria-label={t('Mobilni meni', 'Mobile menu')}>
          <NavLink to={home} end>{t('Početna', 'Home')}</NavLink>
          {links}
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
