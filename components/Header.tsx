import { asset } from '../lib/asset';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV, SOCIAL } from '../data/site';
import SocialIcon from './SocialIcon';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <header className={`site-header ${pathname === '/' ? 'is-overlay' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label="Bonaco Media – početna">
          <img src={asset('/img/logo/bonaco-media.webp')} alt="Bonaco Media" width="640" height="168" />
        </Link>
        <nav className="main-nav" aria-label="Glavni meni">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-social">
          {SOCIAL.slice(0, 4).map(s => (
            <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.label}><SocialIcon id={s.id} /></a>
          ))}
        </div>
        <Link to="/kontakt/" className="btn btn-primary btn-sm header-cta">Kontaktirajte nas</Link>
        <button className="icon-btn menu-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? 'Zatvori meni' : 'Otvori meni'}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobilni meni">
          {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'}>{n.label}</NavLink>)}
          <NavLink to="/kontakt/">Kontakt</NavLink>
        </nav>
        <div className="mobile-social">
          {SOCIAL.map(s => (
            <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.label}><SocialIcon id={s.id} size={22} /></a>
          ))}
        </div>
        <Link to="/kontakt/" className="btn btn-primary">Zatražite ponudu</Link>
      </div>
    </header>
  );
}
