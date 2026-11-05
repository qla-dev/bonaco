import { asset } from '../lib/asset';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import SEO from '../components/SEO';
import { CTASection, ProjectCard, Testimonials } from '../components/Blocks';
import { PROJECTS } from '../data/projects';
import { GALLERIES } from '../data/galleries.generated';
import NotFoundPage from './NotFoundPage';

export default function ProjectPage() {
  const { slug } = useParams();
  const index = PROJECTS.findIndex(p => p.slug === slug);
  const p = PROJECTS[index];
  const [lightbox, setLightbox] = useState(-1);
  const gallery = p?.gallery ? GALLERIES[p.gallery] ?? [] : [];

  useEffect(() => {
    if (lightbox < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(-1);
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setLightbox(i => (i + gallery.length - 1) % gallery.length);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [lightbox, gallery.length]);

  if (!p) return <NotFoundPage />;
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <>
      <SEO title={`${p.client} – ${p.title}`} description={p.summary} image={p.cover} />
      <article>
        <section className="case-hero">
          <div className="container">
            <Link to="/portfolio/" className="text-link back-link"><ArrowLeft size={16} /> Portfolio</Link>
            <span className="eyebrow">{p.categories.join(' · ')}</span>
            <h1>{p.client}</h1>
            <p className="lead">{p.title}</p>
          </div>
          <div className="container case-cover">
            <img src={asset(p.mockup ?? p.cover)} alt={p.coverAlt} fetchPriority="high" />
          </div>
        </section>

        <section className="section">
          <div className="container case-grid">
            <aside className="case-facts">
              <dl>
                <div><dt>Klijent</dt><dd>{p.client}</dd></div>
                <div><dt>Usluge</dt><dd>{p.categories.join(', ')}</dd></div>
                {p.url && <div><dt>Web</dt><dd><a href={p.url} target="_blank" rel="noopener">{new URL(p.url).hostname} <ExternalLink size={14} /></a></dd></div>}
              </dl>
            </aside>
            <div className="case-body">
              <h2>Zadatak</h2>
              <p>{p.task}</p>
              <h2>Naš angažman</h2>
              <ul className="check-list">{p.work.map(w => <li key={w}>{w}</li>)}</ul>
              {p.results.length > 0 && (
                <>
                  <h2>Rezultati</h2>
                  <ul className="results">{p.results.map(r => <li key={r}>{r}</li>)}</ul>
                </>
              )}
            </div>
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="section light">
            <div className="container">
              <h2 className="gallery-title">Galerija</h2>
              <div className="gallery">
                {gallery.map((g, i) => (
                  <button key={g.src} className="gallery-item" onClick={() => setLightbox(i)} aria-label={`Otvori fotografiju ${i + 1}`}>
                    <img src={asset(g.thumb)} alt={`${p.client}, fotografija ${i + 1}`} loading="lazy" width={g.width} height={g.height} />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {p.testimonial && (
          <section className="section">
            <div className="container narrow"><Testimonials ids={[p.testimonial]} /></div>
          </section>
        )}
      </article>

      <section className="section light">
        <div className="container">
          <div className="section-head">
            <h2>Sljedeći projekat</h2>
            <Link to="/portfolio/" className="text-link">Svi projekti <ArrowRight size={16} /></Link>
          </div>
          <div className="projects-grid single"><ProjectCard p={next} /></div>
        </div>
      </section>
      <CTASection />

      {lightbox >= 0 && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galerija" onClick={() => setLightbox(-1)}>
          <img src={asset(gallery[lightbox].src)} alt={`${p.client}, fotografija ${lightbox + 1}`} onClick={e => e.stopPropagation()} />
          <button className="icon-btn lb-close" onClick={() => setLightbox(-1)} aria-label="Zatvori"><X /></button>
          <button className="icon-btn lb-prev" onClick={e => { e.stopPropagation(); setLightbox((lightbox + gallery.length - 1) % gallery.length); }} aria-label="Prethodna"><ChevronLeft /></button>
          <button className="icon-btn lb-next" onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }} aria-label="Sljedeća"><ChevronRight /></button>
          <span className="lb-count">{lightbox + 1} / {gallery.length}</span>
        </div>
      )}
    </>
  );
}
