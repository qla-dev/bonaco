// Animacije na skrol za cijeli sajt:
// 1) ulaz: elementi klize/izranjaju kad uđu u ekran (stagger među susjedima),
// 2) parallax: slike u krugovima, kartice i dekoracije se pomjeraju sporije/brže od skrola.
// Elementi se biraju automatski selektorima, pa nove stranice dobijaju efekte bez dodatnog koda.
// Uz prefers-reduced-motion ništa se ne pokreće.
import { useEffect } from 'react';
import { onScroll as listenScroll } from './scroller';

const REVEAL: [string, string?][] = [
  ['.page-hero .container > *'],
  ['.section-head > div > *, .section-head > .text-link, .center-title'],
  ['.svc-circles', 'rv-fade'], // cijeli red (stavke unutar horizontalnog skrola bi se odsjekle)
  ['.work-circles .wc', 'rv-zoom'],
  ['.mv-copy > :not(.mv-steps)', 'rv-left'],
  ['.mv-steps li', 'rv-left'],
  ['.mv-play-label', 'rv-left'],
  ['.mv-media .video-play', 'rv-zoom'],
  ['.mkt-video > .video', 'rv-right'],
  ['.mq-row', 'rv-fade'],
  ['.clients-all'],
  ['.mkt2-top > *, .mkt2-tabs, .mkt2-clients'],
  ['.mkt2-text', 'rv-left'],
  ['.mkt2-ex', 'rv-right'],
  ['.contact2-top > *, .contact2-form'],
  ['.bxc-head > *'],
  ['.bxc-orbit', 'rv-zoom'],
  ['.bxc-panel', 'rv-right'],
  ['.bxc-note'],
  ['.bev-visual', 'rv-left'],
  ['.bev-copy > *'],
  ['.bev-services li, .bev-refs li'],
  ['.ev-types li, .ev-process li', 'rv-zoom'],
  ['.end-card'],
  ['.service-slide .ss-inner > *'],
  ['.steps li, .pillar, .principle, .trio-card, .capsule-card', 'rv-zoom'],
  ['.brand-tiles', 'rv-fade'],
  ['.projects-grid .project-card, .posts-grid .post-card'],
  ['.about-grid > :first-child', 'rv-left'],
  ['.about-grid > :last-child', 'rv-right'],
  ['.contact-info > *', 'rv-left'],
  ['.contact-form-wrap', 'rv-right'],
  ['.gallery .gallery-item', 'rv-fade'],
  ['.case-facts', 'rv-left'],
  ['.case-body > *'],
  ['.case-cover', 'rv-zoom'],
  ['.cta-inner > *'],
  ['.sc-intro > *, .bx-team-head > *'],
  ['.sc-block > :first-child', 'rv-left'],
  ['.sc-block > :last-child', 'rv-right'],
  ['.bxd-section .bxd', 'rv-zoom'],
  ['.footer-grid > div'],
  ['.hv-below > *'],
];

// [selektor, brzina Y u px po visini ekrana (negativno = suprotan smjer), brzina X]
const PARALLAX: [string, number, number?][] = [
  // radovi u krugovima lagano plove na skrol, naizmjenično lijevo/desno
  ['.work-circles .wc:nth-child(odd)', -26, 16],
  ['.work-circles .wc:nth-child(even)', 26, -16],
  ['.hv-sphere', -70],
  ['.hv-b', -40],
  ['.wc-circle img', 36],
  ['.project-media img', 30],
  ['.bev-hero img', 46],
  ['.bev-ring', -34],
  ['.bxc-orbit', 28],
  ['.mkt-video .video', 22],
  ['.bev-ref-circle img', 18],
  ['.trio-card .brand-logo', 14],
  ['.end-card h2', 12],
];

export function useScrollFx(pathname: string) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const main = document.getElementById('sadrzaj');
    if (!main) return;

    // ---------- Ulaz ----------
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('rv-in');
        const delay = parseFloat(el.style.getPropertyValue('--rv-d')) || 0;
        // nakon animacije vrati elementu njegove originalne tranzicije (hover efekti)
        setTimeout(() => {
          el.classList.remove('rv', 'rv-in', 'rv-left', 'rv-right', 'rv-zoom', 'rv-fade');
          el.style.removeProperty('--rv-d');
        }, delay + 1100);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    const scanReveal = (root: ParentNode) => {
      REVEAL.forEach(([sel, variant]) => {
        root.querySelectorAll<HTMLElement>(sel).forEach(el => {
          if (el.dataset.rv) return;
          el.dataset.rv = '1';
          const parent = el.parentElement;
          const i = parent ? Array.from(parent.children).filter(c => (c as HTMLElement).dataset.rv).indexOf(el) : 0;
          el.style.setProperty('--rv-d', `${Math.min(Math.max(i, 0), 6) * 90}ms`);
          el.classList.add('rv');
          if (variant) el.classList.add(variant);
          io.observe(el);
        });
      });
    };

    // ---------- Parallax ----------
    let items: { el: HTMLElement; k: number; kx: number }[] = [];
    const scanParallax = () => {
      items = [];
      PARALLAX.forEach(([sel, k, kx = 0]) => document.querySelectorAll<HTMLElement>(sel).forEach(el => {
        el.classList.add('px');
        items.push({ el, k, kx });
      }));
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const mobile = window.innerWidth < 760 ? 0.6 : 1;
      items.forEach(({ el, k, kx }) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh * 0.3 || r.top > vh * 1.3) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 (gore) … 1 (dolje)
        el.style.translate = `${(p * kx * mobile).toFixed(1)}px ${(p * k * mobile).toFixed(1)}px`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    const scan = () => { scanReveal(document); scanParallax(); update(); };
    const start = requestAnimationFrame(scan);
    // novi sadržaj (tabovi, "svi klijenti", lazy dijelovi) dobija efekte automatski
    let t = 0;
    const mo = new MutationObserver(() => { clearTimeout(t); t = window.setTimeout(scan, 120); });
    mo.observe(document.body, { childList: true, subtree: true });
    const offScroll = listenScroll(onScroll);
    addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(start); cancelAnimationFrame(raf); clearTimeout(t);
      io.disconnect(); mo.disconnect();
      offScroll(); removeEventListener('resize', onScroll);
    };
  }, [pathname]);
}
