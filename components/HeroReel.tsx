import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { asset } from '../lib/asset';
import { useLang } from '../lib/i18n';
import { HERO_MEDIA } from '../data/heroMedia';

// The latest finished film, with separate desktop and portrait compositions.
export default function HeroReel() {
  const { t } = useLang();
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 960px) and (orientation: portrait)').matches);
  const ref = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const query = matchMedia('(max-width: 960px) and (orientation: portrait)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const format = mobile ? 'mobile' : 'desktop';
  const film = HERO_MEDIA[format];
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (paused || !visible) video.pause();
    else void video.play().catch(error => { if (error.name !== 'AbortError') setPaused(true); });
  }, [mobile, paused, visible]);
  return <section ref={section} className="hv creative-reel" aria-label={t('Bonaco video', 'Bonaco film')}>
    <video key={format} ref={ref} className="reel-picture" muted={muted} autoPlay loop playsInline preload="auto"
      poster={asset(film.poster)}
      aria-label="Bonaco · Craft">
      <source src={asset(film.webm)} type="video/webm" />
      <source src={asset(film.mp4)} type="video/mp4" />
    </video>
    <div className="reel-controls">
      <button className="reel-sound" type="button" aria-pressed={!muted} onClick={() => {
        const next = !muted;
        if (ref.current) { ref.current.muted = next; if (!paused) void ref.current.play().catch(() => setPaused(true)); }
        setMuted(next);
      }} aria-label={muted ? t('Uključi muziku', 'Enable music') : t('Isključi muziku', 'Mute music')}>
        {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}<span>{muted ? t('Uključi zvuk', 'Sound on') : t('Zvuk uključen', 'Sound is on')}</span>
      </button>
      <button className="reel-pause" type="button" onClick={() => setPaused(p => !p)}
        aria-label={paused ? t('Pokreni video', 'Play film') : t('Pauziraj video', 'Pause film')}>
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  </section>;
}
