import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname, hash } = useLocation();
  // Na novu stranicu kreni od vrha; za /#sekcija skroluj do sekcije
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <a href="#sadrzaj" className="skip-link">Preskoči na sadržaj</a>
      <Header />
      <main id="sadrzaj">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
