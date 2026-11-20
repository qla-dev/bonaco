import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import SEO from '../components/SEO';
import { WorkGrid, ClientClouds, ContactBand } from '../components/ReferenceSections';
import { PROJECTS, CATEGORY_EN } from '../data/projects';
import { PORTFOLIO_2026 } from '../data/portfolio2026';
import { PROJECT_DETAILS } from '../data/projectDetails';
import { projectExamples } from '../data/projectMedia';
import { asset } from '../lib/asset';
import { tr, useLang } from '../lib/i18n';
import ProjectFilmPlayer from '../components/ProjectFilmPlayer';
import NotFoundPage from './NotFoundPage';

export default function ProjectPage() {
  const { slug } = useParams();
  const project = PROJECTS.find(item => item.slug === slug);
  const { lang, t, to } = useLang();
  const examples = project ? projectExamples(project) : [];
  const [selected, setSelected] = useState(-1);
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => { setSelected(-1); }, [slug]);
  useEffect(() => {
    if (selected < 0) { dialog.current?.close(); previousFocus.current?.focus(); return; }
    if (!dialog.current?.open) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      close.current?.focus();
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setSelected(value => (value + 1) % examples.length);
      if (event.key === 'ArrowLeft') setSelected(value => (value + examples.length - 1) % examples.length);
    };
    addEventListener('keydown', handleKey);
    return () => removeEventListener('keydown', handleKey);
  }, [selected, examples.length]);
  if (!project) return <NotFoundPage />;
  const copy = tr(project, lang);
  const detail = PROJECT_DETAILS[project.slug];
  const index = PORTFOLIO_2026.findIndex(item => item.slug === project.slug);
  const next = PORTFOLIO_2026[(index + 1) % PORTFOLIO_2026.length];
  const current = examples[selected];
  const coverFilmIndex = examples.findIndex(example => example.kind === 'video' && example.src === project.cover);
  const gallery = examples.map((example, index) => ({ example, index })).filter(item => item.index !== coverFilmIndex);
  return <div className="ref-page ref-case">
    <SEO title={project.client + ' — ' + copy.title} description={copy.summary} image={project.cover} />
    <article>
      <header className="ref-wrap ref-case-heading">
        <Link className="ref-text-link" to={to('/portfolio/')}><ArrowLeft size={16} />{t('Radovi', 'Work')}</Link>
        <h1>{project.client}</h1><p>{copy.title}</p>
      </header>
      <div className="ref-wrap ref-case-intro">
        <figure className="project-cover">{coverFilmIndex >= 0 ? <button type="button" className="project-cover-play" onClick={() => setSelected(coverFilmIndex)} aria-label={t('Pokreni video: ', 'Play video: ') + project.client}>
          <img src={asset(project.cover)} alt={copy.coverAlt} decoding="async" /><span className="example-play" aria-hidden="true"><Play fill="currentColor" size={23} /><span>Video</span></span>
        </button> : <img src={asset(project.cover)} alt={copy.coverAlt} decoding="async" />}</figure>
        <div className="ref-case-copy">
          <div className="ref-tags">{project.categories.map(category => <span key={category}>{lang === 'en' ? (CATEGORY_EN[category] || category) : category}</span>)}</div>
          <p className="ref-case-summary">{copy.summary}</p>
          {detail && <p className="ref-case-detail">{detail[lang === 'en' ? 'en' : 'bs']}</p>}
          <p className="ref-eyebrow">{t('Naš angažman', 'Our role')}</p>
          <ul>{copy.work.map(work => <li key={work}>{work}</li>)}</ul>
          {copy.results.length > 0 && <div className="ref-case-results"><p className="ref-eyebrow">{t('Rezultat kampanje', 'Campaign result')}</p>{copy.results.map(result => <p key={result}>{result}</p>)}</div>}
          {project.url && <a className="ref-text-link" href={project.url} target="_blank" rel="noopener noreferrer">{t('Pogledaj web', 'View website')}<ArrowUpRight size={18} /></a>}
        </div>
      </div>
      {gallery.length > 0 && <section className="ref-wrap ref-case-gallery ref-case-triptych" aria-label={t('Odabrani primjeri projekta', 'Selected project examples')}>
        <div className="ref-gallery-grid" data-count={gallery.length}>{gallery.map(({example, index: position}) => <figure key={example.src + example.kind}>
          <button className={'project-example' + (example.kind === 'video' ? ' is-video' : '')} type="button" onClick={() => setSelected(position)} aria-label={example.kind === 'video' ? t('Pokreni video: ', 'Play video: ') + example.film.label : t('Otvori fotografiju ', 'Open photo ') + (position + 1)}>
            <img src={asset(example.src)} alt={example.kind === 'video' ? example.film.label : project.client + ' — ' + (position + 1)} loading="lazy" decoding="async" />
            {example.kind === 'video' && <span className="example-play" aria-hidden="true"><Play fill="currentColor" size={23} /><span>Video</span></span>}
          </button>
        </figure>)}</div>
      </section>}
    </article>
    <section className="ref-wrap ref-next"><p className="ref-eyebrow">{t('Sljedeći projekat', 'Next project')}</p><WorkGrid projects={[next]} /></section>
    <ClientClouds /><ContactBand />
    <dialog className="ref-lightbox ref-media-lightbox" ref={dialog} aria-label={project.client + ' — ' + t('primjeri rada', 'project examples')} onCancel={() => setSelected(-1)} onClick={event => { if (event.target === event.currentTarget) setSelected(-1); }}>
      {current && <>
        {current.kind === 'video' ? <ProjectFilmPlayer key={current.src} film={current.film} autoOpen /> : <img src={asset(current.src)} alt={project.client + ' — ' + (selected + 1)} />}
        <button ref={close} className="ref-lb-close" type="button" onClick={() => setSelected(-1)} aria-label={t('Zatvori', 'Close')}><X /></button>
        {examples.length > 1 && <><button className="ref-lb-prev" type="button" onClick={() => setSelected((selected + examples.length - 1) % examples.length)} aria-label={t('Prethodna', 'Previous')}><ChevronLeft /></button>
        <button className="ref-lb-next" type="button" onClick={() => setSelected((selected + 1) % examples.length)} aria-label={t('Sljedeća', 'Next')}><ChevronRight /></button></>}
        <span>{selected + 1} / {examples.length}</span>
      </>}
    </dialog>
  </div>;
}
