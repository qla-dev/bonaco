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
import { CLIENTS } from '../data/clients';
import type { OrbitHandle } from './heroOrbitScene';
import { hl } from '../lib/hl';

// Logotipi na sferi (12 = po 4 na svakom aktivnom prstenu) i klijenti s povezanom studijom slučaja
const ORBIT_CLIENTS = ['fk-zeljeznicar', 'medicana', 'sarajevska-pivara', 'zmaj', 'golf-klub-sarajevo', 'women-in-adria', 'beautyco', 'rooms', 'summer-lounge', 'bh-travel', 'max-media', 'flok'];
const CLIENT_PROJECT: Record<string, string> = { beautyco: 'beautyco', rooms: 'rooms-hr', 'bh-travel': 'bh-travel', 'summer-lounge': 'summer-lounge', 'max-media': 'max-media' };

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
    const items = ORBIT_CLIENTS.map(id => CLIENTS.find(c => c.id === id)!).filter(Boolean).map(c => ({
      src: asset(`/img/clients/${c.id}.webp`),
      href: CLIENT_PROJECT[c.id] ? to(`/portfolio/${CLIENT_PROJECT[c.id]}/`) : null,
      label: c.name,
    }));
    import('./heroOrbitScene').then(({ startOrbit }) => {
      if (dead || !canvas.current) return;
      handle.current = startOrbit(canvas.current, items, {
        accent: getComputedStyle(document.documentElement).getPropertyValue('--bonaco').trim() || '#F58426',
        reduce,
        onPick: href => navigate(href),
        onHover: setLabel,
        obstacle: canvas.current.parentElement?.querySelector<HTMLElement>('.hv-b'),
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
  const { lang, t, to } = useLang();
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(HERO_VIDEO.desktop);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (paused) v.pause(); else v.play().catch(() => setPaused(true));
  }, [paused]);

  // jedna riječ u boji brenda sa shimmerom
  const title = lang === 'en'
    ? <h1>Ideas that <em className="shimmer hl">move</em> brands.</h1>
    : <h1>Ideje koje <em className="shimmer hl">pokreću</em> brendove.</h1>;
  const below = (
    <>
      <p className="hv-lead">
        {hl(t(
          'Bonaco je **full-service marketinška agencija** koja spaja **strategiju, kreativnost, produkciju i rezultate**.',
          'Bonaco is a **full-service marketing agency** that brings together **strategy, creativity, production and results**.',
        ))}
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
      <section className={`hv hv-orbit ${paused ? 'is-paused' : ''}`} aria-label="Bonaco Media">
        <div className="container hv-grid">
          <div className="hv-stage">
            <HeroSphere paused={paused} />
            <div className="hv-center" aria-hidden="true"><span className="hv-b">B<i /></span></div>
            {pauseBtn}
          </div>
          <div className="hv-below">
            {title}
            {below}
            <p className="hv-hint" aria-hidden="true">{t('Prevucite da okrenete sferu', 'Drag to turn the sphere')}</p>
          </div>
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
