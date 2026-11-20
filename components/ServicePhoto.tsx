import { asset } from '../lib/asset';
import FramedImage from './FramedImage';
import type { CSSProperties } from 'react';

export default function ServicePhoto({ src, alt, position = '50% 50%', mobilePosition = position, artwork = false, strip = false }: {
  src: string; alt: string; position?: string; mobilePosition?: string; artwork?: boolean; strip?: boolean;
}) {
  return <div className={'service-photo' + (artwork ? ' is-artwork' : '') + (strip ? ' service-strip' : '')} style={{'--service-focus': position, '--service-focus-mobile': mobilePosition} as CSSProperties}>
    {artwork ? <FramedImage src={src} alt={alt} /> : <img src={asset(src)} alt={alt} loading="lazy" decoding="async"
      />}
  </div>;
}
