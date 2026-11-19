import { useEffect, useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';
import { asset } from '../lib/asset';
import { useLang } from '../lib/i18n';
import CircleWave from './CircleWave';

interface CircleMosaicProps {
  src: string;
  alt: string;
  position?: string;
  contain?: boolean;
  interactive?: boolean;
  portrait?: boolean;
  wave?: boolean;
  scale?: number;
}

export default function CircleMosaic({ src, alt, position = '50% 50%', contain = false, interactive = false, wave = false, scale = 1 }: CircleMosaicProps) {
  const { t } = useLang();
  const [revealed, setRevealed] = useState(false);
  const [opened, setOpened] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (opened) { dialog.current?.showModal(); close.current?.focus(); }
    else if (dialog.current?.open) { dialog.current.close(); trigger.current?.focus(); }
  }, [opened]);
  const visual = <div className="mosaic-aperture" role={wave ? 'img' : undefined} aria-label={wave ? alt : undefined}><div className="mosaic-frame" style={{transform: `scale(${scale})`, transformOrigin: position}}>
    {interactive || wave ? <CircleWave src={src} name={alt} focus={parseFloat(position.split(' ')[1] || '50') / 100} focusX={parseFloat(position.split(' ')[0] || '50') / 100} mosaic passive /> :
      <img src={asset(src)} alt={alt} width="1200" height="900" loading="lazy" decoding="async" style={{ objectPosition: position, objectFit: 'cover' }} />}
  </div></div>;
  return <div className={'circle-mosaic circle-reveal' + (revealed ? ' is-revealed' : '') + (contain ? ' is-contained' : '')}
    onPointerEnter={e => { if (e.pointerType === 'mouse') setRevealed(true); }} onPointerLeave={() => setRevealed(false)}
    onFocus={() => setRevealed(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setRevealed(false); }}>
    {interactive ? <button ref={trigger} type="button" className="mosaic-open" onClick={() => setOpened(true)} aria-label={t('Otvori cijelu fotografiju: ', 'Open full photo: ') + alt}>
      {visual}<span className="mosaic-view"><Expand size={14} /><span>{t('Pogledaj', 'View')}</span></span>
    </button> : visual}
    {interactive && <dialog ref={dialog} className="ref-lightbox mosaic-lightbox" onCancel={() => setOpened(false)} onClick={e => { if (e.target === e.currentTarget) setOpened(false); }}>
      {opened && <><img src={asset(src)} alt={alt} /><button ref={close} className="ref-lb-close" type="button" aria-label={t('Zatvori fotografiju', 'Close photo')} onClick={() => setOpened(false)}><X /></button><p className="mosaic-caption">{alt}</p></>}
    </dialog>}
  </div>;
}
