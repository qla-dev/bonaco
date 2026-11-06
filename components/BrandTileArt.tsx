import type { Brand } from './BrandLogo';
import { asset } from '../lib/asset';

/** Generated architectural backgrounds based on the brand palette reference. */
export default function BrandTileArt({ brand }: { brand: Brand }) {
  return (
    <span className="bt-art" aria-hidden="true">
      <img
        src={asset(`/brand/${brand}-architecture.webp`)}
        alt=""
        width={1254}
        height={1254}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
