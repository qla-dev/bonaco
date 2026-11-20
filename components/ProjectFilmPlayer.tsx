import { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import type { ProjectFilm } from '../data/portfolio2026';
import { asset } from '../lib/asset';
import { useLang } from '../lib/i18n';
import CircleMosaic from './CircleMosaic';

export default function ProjectFilmPlayer({ film, autoOpen = false }: { film: ProjectFilm; autoOpen?: boolean }) {
  const { t } = useLang();
  const [opened, setOpened] = useState(autoOpen);
  return <div className="project-film">
    <div className="project-film-heading"><h2>{film.label}</h2><span className="ref-eyebrow">{t('Pogledaj u pokretu', 'See it in motion')}</span></div>
    {film.src ? <video key={film.src} controls playsInline autoPlay={autoOpen} preload="none" poster={asset(film.poster)} aria-label={film.label}>
      {film.webmMobile && <source src={asset(film.webmMobile)} type="video/webm" media="(max-width: 680px)" />}
      {film.mobile && <source src={asset(film.mobile)} type="video/mp4" media="(max-width: 680px)" />}
      {film.webm && <source src={asset(film.webm)} type="video/webm" />}
      <source src={asset(film.src)} type="video/mp4" />
    </video> : film.youtube ? <>
      {opened ? <iframe className={'project-youtube' + (film.portrait ? ' is-portrait' : '')} src={'https://www.youtube-nocookie.com/embed/' + film.youtube + '?autoplay=1&rel=0'} title={film.label} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <button className="project-film-launch" onClick={() => setOpened(true)} aria-label={t('Pokreni video: ', 'Play video: ') + film.label}><CircleMosaic src={film.poster} alt={film.label} /><span><Play size={36} />{t('Pokreni video', 'Play video')}</span></button>}
      <div className="project-film-source"><a className="ref-text-link" href={'https://www.youtube.com/watch?v=' + film.youtube} target="_blank" rel="noopener noreferrer">{t('Pogledaj na YouTubeu', 'Watch on YouTube')}<ArrowUpRight size={17} /></a></div>
    </> : film.instagram && <>
      {opened ? <iframe className="project-instagram" src={film.instagram + 'embed/'} title={film.label} allow="autoplay; encrypted-media; fullscreen" allowFullScreen /> : <button className="project-film-launch" onClick={() => setOpened(true)} aria-label={t('Pokreni video: ', 'Play video: ') + film.label}>
        <CircleMosaic src={film.poster} alt={film.label} />
        <span><Play size={36} />{t('Pokreni video', 'Play video')}</span>
      </button>}
      <div className="project-film-source"><a className="ref-text-link" href={film.instagram} target="_blank" rel="noopener noreferrer">{t('Otvori na Instagramu', 'Open on Instagram')}<ArrowUpRight size={17} /></a></div>
    </>}
  </div>;
}
