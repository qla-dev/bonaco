// Marketing: usluge full-service agencije, proces, istaknuti radovi i kontakt (URL /nase-usluge/ zadržan radi SEO).
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { CTASection } from '../components/Blocks';
import { WorkCircles } from '../components/Circles';
import ServiceIcon from '../components/ServiceIcon';
import { SERVICES, STEPS } from '../data/services';
import { tr, useLang } from '../lib/i18n';
import { hl } from '../lib/hl';
import { getScrollY, scrollToY } from '../lib/scroller';

export default function ServicesPage() {
  const { lang, t, to } = useLang();
  const listRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const { hash } = useLocation();

  // Link na uslugu (/nase-usluge/#seo): poravnaj slajd i nakon što se stranica/iOS adresna traka smiri,
  // inače snap na iPhoneu zna završiti na susjednom slajdu.
  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;
    const go = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70;
      scrollToY(el.getBoundingClientRect().top + getScrollY() - head, 'instant' as ScrollBehavior);
    };
    const raf = requestAnimationFrame(go);
    const t1 = setTimeout(go, 350), t2 = setTimeout(go, 900);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, [hash]);

  // TikTok stil: svaka usluga je slajd pune visine sa snapom; stepper desno prati aktivni slajd
  useEffect(() => {
    document.documentElement.classList.add('snap-y');
    const list = listRef.current;
    if (!list) return;
    const slides = Array.from(list.querySelectorAll<HTMLElement>('.service-slide'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }), { threshold: 0.55 });
    slides.forEach(el => io.observe(el));
    const io2 = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '-40% 0px -40% 0px' });
    io2.observe(list);
    return () => { document.documentElement.classList.remove('snap-y'); io.disconnect(); io2.disconnect(); };
  }, []);
  return (
    <>
      <SEO
        title="Marketing"
        description={t(
          'Strategija i kampanje, društvene mreže, grafički dizajn i branding, foto i video, web dizajn, SEO i OOH/DOOH oglašavanje. Full-service marketing za vaš brend.',
          'Strategy and campaigns, social media, graphic design and branding, photo and video, web design, SEO and OOH/DOOH advertising. Full-service marketing for your brand.',
        )}
      />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Marketing</span>
          <h1>{hl(t('Sve za vaš *brend* na jednom mjestu', 'Everything your *brand* needs in one place'))}</h1>
          <p className="lead">{hl(t(
            'Bonaco je **full-service marketinška agencija**: na osnovu **vaših ciljeva** gradimo strategiju i izvodimo je kroz **kreativu, produkciju i digital**.',
            'Bonaco is a **full-service marketing agency**: we build a strategy from **your goals** and deliver it through **creative, production and digital**.',
          ))}</p>
        </div>
      </section>
      <section className="svc-slides" ref={listRef} aria-label={t('Usluge', 'Services')}>
        {SERVICES.map((s, i) => {
          const x = tr(s, lang);
          return (
            <article key={s.slug} id={s.slug} className="service-slide" data-i={i}>
              <span className="ss-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="container ss-inner">
                <span className="ss-icon"><ServiceIcon slug={s.slug} size={34} /></span>
                <span className="ss-count">{String(i + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}</span>
                <h2>{x.title}</h2>
                <p>{x.text}</p>
                <Link to={`${to('/kontakt/')}?usluga=${encodeURIComponent(s.title)}`} className="btn btn-primary">{t('Zatražite ponudu', 'Request a quote')} <ArrowRight size={18} /></Link>
              </div>
            </article>
          );
        })}
        <nav className={`svc-stepper ${inView ? 'is-on' : ''}`} aria-label={t('Usluge', 'Services')}>
          {SERVICES.map((s, i) => (
            <a key={s.slug} href={`#${s.slug}`} className={i === active ? 'is-on' : ''} aria-current={i === active ? 'true' : undefined}
              onClick={e => { e.preventDefault(); document.getElementById(s.slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              <span>{tr(s, lang).title}</span>
            </a>
          ))}
        </nav>
      </section>
      <section className="section light">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t('Kako radimo', 'How we work')}</span>
              <h2>{hl(t('Tri koraka do *rezultata*', 'Three steps to *results*'))}</h2>
            </div>
          </div>
          <ol className="steps">
            {STEPS.map((s, i) => {
              const x = tr(s, lang);
              return <li key={s.title}><span className="step-num">{i + 1}</span><h3>{x.title}</h3><p>{x.text}</p></li>;
            })}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{hl(t('Istaknuti *radovi*', 'Featured *work*'))}</h2>
            <Link to={to('/portfolio/')} className="text-link">{t('Svi radovi', 'All work')} <ArrowRight size={16} /></Link>
          </div>
          <WorkCircles limit={4} />
        </div>
      </section>
      <CTASection inquiry="Marketing" />
    </>
  );
}
