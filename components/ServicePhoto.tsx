import { asset } from '../lib/asset';

export default function ServicePhoto({ src, alt, position = '50% 50%', artwork = false, strip = false }: {
  src: string; alt: string; position?: string; artwork?: boolean; strip?: boolean;
}) {
  return <div className={'service-photo' + (artwork ? ' is-artwork' : '') + (strip ? ' service-strip' : '')}>
    <img src={asset(src)} alt={alt} loading="lazy" decoding="async"
      style={{ objectPosition: position }} />
  </div>;
}
