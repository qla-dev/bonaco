import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';
import { asset } from '../lib/asset';
import { useLang } from '../lib/i18n';
import CircleWave from './CircleWave';
import { mosaicCircles } from '../lib/circleMosaic';

interface CircleMosaicProps {
  src: string;
  alt: string;
  position?: string;
  contain?: boolean;
  interactive?: boolean;
  portrait?: boolean;
}

export default function CircleMosaic({ src, alt, position = '50% 50%', contain = false, interactive = false, portrait = false }: CircleMosaicProps) {
  const { t } = useLang();
  const id = 'aperture-' + useId().replace(/:/g, '');
  const circles = useMemo(() => mosaicCircles(src + (portrait ? '#portrait' : ''), portrait), [src, portrait]);
  const [revealed, setRevealed] = useState(false);
  const [opened, setOpened] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (opened) { dialog.current?.showModal(); close.current?.focus(); }
    else if (dialog.current?.open) { dialog.current.close(); trigger.current?.focus(); }
  }, [opened]);
  const visual = <div className="mosaic-aperture" style={{ clipPath: `url(#${id})` }}>
    {interactive ? <CircleWave src={src} name={alt} focus={parseFloat(position.split(' ')[1] || '50') / 100} focusX={parseFloat(position.split(' ')[0] || '50') / 100} mosaic passive /> :
      <img src={asset(src)} alt={alt} width="1200" height="900" loading="lazy" decoding="async" style={{ objectPosition: position, objectFit: 'cover' }} />}
  </div>;
  return <div className={'circle-mosaic circle-reveal' + (revealed ? ' is-revealed' : '') + (contain ? ' is-contained' : '')}
    onPointerEnter={e => { if (e.pointerType === 'mouse') setRevealed(true); }} onPointerLeave={() => setRevealed(false)}
    onFocus={() => setRevealed(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setRevealed(false); }}>
    <svg width="0" height="0" className="mosaic-defs" aria-hidden="true"><defs><clipPath id={id} clipPathUnits="objectBoundingBox">
      {circles.map(({ x, y, r }, i) => <ellipse key={i} cx={x / 600} cy={y / 450} rx={r / 600} ry={r / 450} />)}
    </clipPath></defs></svg>
    {interactive ? <button ref={trigger} type="button" className="mosaic-open" onClick={() => setOpened(true)} aria-label={t('Otvori cijelu fotografiju: ', 'Open full photo: ') + alt}>
      {visual}<span className="mosaic-view"><Expand size={14} /><span>{t('Pogledaj', 'View')}</span></span>
    </button> : visual}
    {interactive && <dialog ref={dialog} className="ref-lightbox mosaic-lightbox" onCancel={() => setOpened(false)} onClick={e => { if (e.target === e.currentTarget) setOpened(false); }}>
      {opened && <><img src={asset(src)} alt={alt} /><button ref={close} className="ref-lb-close" type="button" aria-label={t('Zatvori fotografiju', 'Close photo')} onClick={() => setOpened(false)}><X /></button><p className="mosaic-caption">{alt}</p></>}
    </dialog>}
  </div>;
}
