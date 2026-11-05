// Prvi ekran (brief v1.3, A + Video 2): artistički hero video kao tiha petlja, a naslov, podnaslov
// i CTA su zaseban HTML sloj (lokalizovan BS/EN). Dok Bonaco ne preda video, prikazuje se originalna
// kružna animacija znaka "B." sa stvarnim radovima u kružnim maskama. Pauza je uvijek dostupna;
// uz "reduced motion" ide poster ili mirna kompozicija.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { asset } from '../lib/asset';
import { useLang } from '../lib/i18n';
import { useReducedMotion } from '../lib/motion';
import { HERO_VIDEO } from '../data/site';

const SHOTS = [
  '/img/projects/summer-lounge/IMG_2776-800.webp',
  '/img/projects/beautyco/IMG_2053-800.webp',
  '/img/projects/bh-travel/IMG_6395-800.webp',
];

function HeroMotion() {
  return (
    <div className="hm">
      <span className="hm-ring hm-ring-1" />
      <span className="hm-ring hm-ring-2" />
      {SHOTS.map((src, i) => (
        <span key={src} className={`hm-shot hm-shot-${i + 1}`} style={{ backgroundImage: `url(${asset(src)})` }} />
      ))}
      <span className="hm-b">B<i /></span>
    </div>
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

  const still = reduce || paused;

  return (
    <section className={`hv ${still ? 'is-paused' : ''} ${hasVideo ? '' : 'hv-art'}`} aria-label="Bonaco Media">
      <div className="hv-media" aria-hidden="true">
        {hasVideo && !reduce ? (
          <video ref={video} autoPlay muted loop playsInline preload="metadata" poster={asset(HERO_VIDEO.poster) || undefined}>
            {HERO_VIDEO.mobile && <source media="(max-width: 700px)" src={asset(HERO_VIDEO.mobile)} type="video/mp4" />}
            <source src={asset(HERO_VIDEO.desktop)} type="video/mp4" />
          </video>
        ) : hasVideo && HERO_VIDEO.poster ? (
          <picture>
            {HERO_VIDEO.posterMobile && <source media="(max-width: 700px)" srcSet={asset(HERO_VIDEO.posterMobile)} />}
            <img src={asset(HERO_VIDEO.poster)} alt="" fetchPriority="high" />
          </picture>
        ) : (
          <HeroMotion />
        )}
      </div>

      <div className="container hv-copy">
        <h1>{t('Ideje koje pokreću brendove.', 'Ideas that move brands.')}</h1>
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
      </div>

      {!reduce && (
        <button type="button" className="hv-pause" onClick={() => setPaused(p => !p)} aria-pressed={paused}
          aria-label={paused ? t('Pokreni animaciju', 'Play animation') : t('Pauziraj animaciju', 'Pause animation')}>
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      )}
    </section>
  );
}
