import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header, { brandOf } from './Header';
import Footer from './Footer';
import MobileCta from './MobileCta';
import { langOf } from '../lib/i18n';
import { useScrollFx } from '../lib/scrollfx';
import { scrollToY } from '../lib/scroller';

export default function Layout() {
  const { pathname, hash } = useLocation();
  const lang = langOf(pathname);
  useScrollFx(pathname);

  // Na novu stranicu kreni od vrha; za /#sekcija skroluj do sekcije
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) { el.scrollIntoView(); return; }
    }
    scrollToY(0);
  }, [pathname, hash]);

  // Jezik dokumenta i boja brenda (Bonexis/BonEvents stranice dobijaju svoj akcent)
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.brand = brandOf(pathname);
  }, [lang, pathname]);

  return (
    <>
      <a href="#sadrzaj" className="skip-link">{lang === 'en' ? 'Skip to content' : 'Preskoči na sadržaj'}</a>
      <Header />
      <main id="sadrzaj">
        {/* nova stranica ulazi s blagim fade/slide/blur prelazom (key = putanja) */}
        <div key={pathname} className="page-enter"><Outlet /></div>
      </main>
      <Footer />
      <MobileCta />
      {/* Safari (iOS) boji donju adresnu traku prema elementu uz dno: tanka tamna traka drži je tamnom */}
      <div className="tint-sentinel" aria-hidden="true" />
    </>
  );
}
