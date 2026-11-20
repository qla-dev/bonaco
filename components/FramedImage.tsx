import { asset } from '../lib/asset';

/** Preserve the complete artwork over a soft backdrop from the same image. */
export default function FramedImage({ src, alt, className = '', loading = 'lazy' }: {
  src: string; alt: string; className?: string; loading?: 'lazy' | 'eager';
}) {
  return <div className={'framed-image ' + className}>
    <img className="framed-image-backdrop" src={asset(src)} alt="" aria-hidden="true" loading={loading} decoding="async" />
    <img className="framed-image-foreground" src={asset(src)} alt={alt} loading={loading} decoding="async" />
  </div>;
}
