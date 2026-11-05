// Prvi ekran (brief v1.3, A + Video 2). Bez videa: 3D sfera od tri rotirajuća prstena s projektima
// (three.js, okreće se prevlačenjem, klik otvara rad), a naslov stoji u sredini sfere.
// Kad Bonaco preda Video 2 (data/site.ts HERO_VIDEO), prikazuje se tiha video petlja s HTML naslovom.
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { asset } from '../lib/asset';
import { useLang } from '../lib/i18n';
import { useReducedMotion } from '../lib/motion';
import { HERO_VIDEO } from '../data/site';
import { PROJECTS } from '../data/projects';
import type { OrbitHandle } from './heroOrbitScene';

function HeroSphere({ paused }: { paused: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<OrbitHandle | null>(null);
  const navigate = useNavigate();
  const { to } = useLang();
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    let dead = false;
    const items = PROJECTS.slice(0, 6).map(p => ({ src: asset(p.cover), href: to(`/portfolio/${p.slug}/`), label: p.client }));
    import('./heroOrbitScene').then(({ startOrbit }) => {
      if (dead || !canvas.current) return;
      handle.current = startOrbit(canvas.current, items, {
        accent: getComputedStyle(document.documentElement).getPropertyValue('--bonaco').trim() || '#F58426',
        reduce,
        onPick: href => navigate(href),
        onHover: setLabel,
      });
      setReady(true);
    }).catch(() => {});
    return () => { dead = true; handle.current?.destroy(); handle.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => { handle.current?.setPaused(paused); }, [paused, ready]);

  return (
    <>
      <canvas ref={canvas} className={`hv-sphere ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
      <span className={`hv-sphere-label ${label ? 'is-on' : ''}`} aria-hidden="true">{label}</span>
    </>
  );
}

export default function HeroVideo() {
  const { t, to } = useLang();
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(HERO_VIDEO.desktop);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (paused) v.pause(); else v.play().catch(() => setPaused(true));
  }, [paused]);

  const title = <h1>{t('Ideje koje pokreću brendove.', 'Ideas that move brands.')}</h1>;
  const below = (
    <>
      <p className="hv-lead">
        {t(
          'Bonaco je full-service marketinška agencija koja spaja strategiju, kreativnost, produkciju i rezultate.',
          'Bonaco is a full-service marketing agency that brings together strategy, creativity, production and results.',
        )}
      </p>
      <div className="btn-row">
        <Link to={to('/portfolio/')} className="btn btn-primary btn-lg">{t('Pogledajte radove', 'See our work')} <ArrowRight size={18} /></Link>
        <Link to={to('/kontakt/')} className="btn btn-glass btn-lg">{t('Zatražite ponudu', 'Request a quote')}</Link>
      </div>
    </>
  );
  const pauseBtn = !reduce && (
    <button type="button" className="hv-pause" onClick={() => setPaused(p => !p)} aria-pressed={paused}
      aria-label={paused ? t('Pokreni animaciju', 'Play animation') : t('Pauziraj animaciju', 'Pause animation')}>
      {paused ? <Play size={16} /> : <Pause size={16} />}
    </button>
  );

  if (!hasVideo) {
    return (
      <section className="hv hv-orbit" aria-label="Bonaco Media">
        <div className="hv-stage">
          <HeroSphere paused={paused} />
          <div className="container hv-center">{title}</div>
          {pauseBtn}
        </div>
        <div className="container hv-below">
          {below}
          <p className="hv-hint" aria-hidden="true">{t('Prevucite sferu da je okrenete, kliknite projekat da ga otvorite', 'Drag the sphere to turn it, click a project to open it')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`hv ${reduce || paused ? 'is-paused' : ''}`} aria-label="Bonaco Media">
      <div className="hv-media" aria-hidden="true">
        {!reduce ? (
          <video ref={video} autoPlay muted loop playsInline preload="metadata" poster={asset(HERO_VIDEO.poster) || undefined}>
            {HERO_VIDEO.mobile && <source media="(max-width: 700px)" src={asset(HERO_VIDEO.mobile)} type="video/mp4" />}
            <source src={asset(HERO_VIDEO.desktop)} type="video/mp4" />
          </video>
        ) : HERO_VIDEO.poster ? (
          <picture>
            {HERO_VIDEO.posterMobile && <source media="(max-width: 700px)" srcSet={asset(HERO_VIDEO.posterMobile)} />}
            <img src={asset(HERO_VIDEO.poster)} alt="" fetchPriority="high" />
          </picture>
        ) : null}
      </div>
      <div className="container hv-copy">{title}{below}</div>
      {pauseBtn}
    </section>
  );
}
