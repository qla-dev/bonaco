import { asset } from '../lib/asset';
export type Brand = 'bonaco' | 'bonexis' | 'bonevents';

export const BRANDS: Record<Brand, { name: string; dark: string; light: string }> = {
  bonaco: { name: 'Bonaco Media', dark: '/media/brand/bonaco-v12.svg', light: '/media/brand/bonaco-v12-mono.svg' },
  bonexis: { name: 'Bonexis', dark: '/media/brand/bonexis-v12.svg', light: '/media/brand/bonexis-v12-mono.svg' },
  bonevents: { name: 'Bonevent', dark: '/media/brand/bonevent-v12.svg', light: '/media/brand/bonevent-v12-mono.svg' },
};

export function QlaMark({ className = '' }: { className?: string }) {
  return <img className={`qla-mark ${className}`} src={asset('/img/logo/qla-dev.webp')} alt="qla.dev" width="84" height="24" loading="lazy" />;
}

export default function BrandLogo({ brand = 'bonaco', mono = false, className = '' }: { brand?: Brand; sub?: boolean; mono?: boolean; className?: string }) {
  const b = BRANDS[brand];
  return (
    <span className={`brand-logo brand-logo-${brand} brand-logo-img ${mono ? 'is-mono' : ''} ${className}`} role="img" aria-label={b.name}>
      <img className="bl-dark" src={asset(b.dark)} alt={b.name} />
      <img className="bl-light" src={asset(b.light)} alt="" aria-hidden="true" />
    </span>
  );
}
