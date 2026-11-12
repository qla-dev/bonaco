import { asset } from '../lib/asset';
export type Brand = 'bonaco' | 'bonexis' | 'bonevents';

export const BRANDS: Record<Brand, { name: string; dark: string; light: string }> = {
  bonaco: { name: 'Bonaco Media', dark: '/img/logo/bonaco-logo-hd.webp', light: '/img/logo/bonaco-logo-white.webp' },
  bonexis: { name: 'Bonexis', dark: '/img/logo/bonexis-logo-dark.png', light: '/img/logo/bonexis-logo-white.png' },
  bonevents: { name: 'Bonevent', dark: '/img/logo/bonevent-logo-dark.png', light: '/img/logo/bonevent-logo-white.png' },
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
