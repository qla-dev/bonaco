import { asset } from '../lib/asset';

export default function ServicePhoto({ src, alt, position = '50% 50%', artwork = false }: {
  src: string; alt: string; position?: string; artwork?: boolean;
}) {
  return <div className={'service-photo' + (artwork ? ' is-artwork' : '')}>
    <img src={asset(src)} alt={alt} width="1000" height="1000" loading="lazy" decoding="async"
      style={{ objectPosition: position }} />
  </div>;
}
