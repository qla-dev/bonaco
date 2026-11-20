import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { PORTFOLIO_2026 } from '../data/portfolio2026';
import { CATEGORY_EN } from '../data/projects';
import { WORK_FILTERS, WORK_ORDER } from '../data/projectPresentation';
import { useLang } from '../lib/i18n';
import type { Project } from '../types';
import { WorkGrid } from './ReferenceSections';

function ProjectPages({ projects, showAllLink }: { projects: Project[]; showAllLink: boolean }) {
  const { t, to } = useLang();
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(!document.hidden);
  const [reduceMotion, setReduceMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const root = useRef<HTMLDivElement>(null);
  const count = Math.ceil(projects.length / 3);
  const active = page % Math.max(count, 1);
  const visibleProjects = Array.from({ length: Math.min(3, projects.length) }, (_, index) => projects[(active * 3 + index) % projects.length]);
  const rotating = count > 1 && !paused && !hovered && !focused && visible && documentVisible && !reduceMotion;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    if (root.current) observer.observe(root.current);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduceMotion(media.matches);
    const visibility = () => setDocumentVisible(!document.hidden);
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setPage(previous => (previous + 1) % count), 9000);
    return () => window.clearInterval(timer);
  }, [count, rotating]);
  const move = (direction: number) => { setPage((active + direction + count) % count); setPaused(true); };
  return <div ref={root} className="project-pages" role="region" aria-roledescription={t('karusel projekata', 'project carousel')} aria-label={t('Odabrani projekti', 'Selected projects')}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className="project-page" key={active} aria-live="off"><WorkGrid projects={visibleProjects} /></div>
    <div className="project-controls">
      {count > 1 && <div className="project-pagination">
        <button type="button" onClick={() => move(-1)} aria-label={t('Prethodna tri projekta', 'Previous three projects')}><ArrowLeft size={20} aria-hidden="true" /></button>
        <span className="project-page-count" aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">{active + 1} / {count}</span>
        <button type="button" onClick={() => move(1)} aria-label={t('Sljedeća tri projekta', 'Next three projects')}><ArrowRight size={20} aria-hidden="true" /></button>
        {!reduceMotion && <button className="project-autoplay" type="button" aria-pressed={!paused} onClick={() => { setPaused(value => !value); if (paused) { setFocused(false); setHovered(false); } }} aria-label={paused ? t('Pokreni automatsku izmjenu', 'Start automatic rotation') : t('Pauziraj automatsku izmjenu', 'Pause automatic rotation')}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
      </div>}
      {showAllLink && <Link className="ref-pill project-all-link" to={to('/portfolio/')}>{t('Vidi sve projekte', 'View all projects')}</Link>}
    </div>
  </div>;
}

export default function ProjectShowcase({ home = false }: { home?: boolean }) {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState(WORK_FILTERS[0]);
  const order = WORK_ORDER[filter] || [];
  const rank = (slug: string) => order.includes(slug) ? order.indexOf(slug) : order.length;
  const projects = PORTFOLIO_2026.filter(project => filter === 'Sve' || (project.categories.includes(filter) && !(filter === 'OOH / DOOH' && project.slug === 'jovs-bilbordi'))).sort((a, b) => rank(a.slug) - rank(b.slug));
  const Heading = home ? 'h2' : 'h1';
  return <section className="ref-wrap project-showcase" id={home ? 'odabrani-radovi' : undefined}>
    <Heading className="project-showcase-title">{t('Naši radovi', 'Our work')}</Heading>
    <div className="project-filters" role="group" aria-label={t('Filtriraj radove', 'Filter projects')}>
      {WORK_FILTERS.map(category => <button type="button" key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category === 'Sve' ? t('Sve', 'All') : lang === 'en' ? (CATEGORY_EN[category] || category) : category}</button>)}
    </div>
    <ProjectPages key={filter} projects={projects} showAllLink={home} />
  </section>;
}
