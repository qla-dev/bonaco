import { asset } from '../lib/asset';
// Logotipi tri brenda.
// BONACO: pravi logotip (HD slika, nova narandžasta tačka i MEDIA).
// BONEXIS / BONEVENT: vektorski (font Outfit 700), oštri u svakoj veličini; posebno slovo "E"
// iz dostavljenog logotipa (tri vodoravne crte) crta se CSS-om, tačka i MEDIA u boji brenda.
export type Brand = 'bonaco' | 'bonexis' | 'bonevents';

export const BRANDS: Record<Brand, { word: string; sub: { bs: string; en: string }; name: string }> = {
  bonaco: { word: 'BONACO', sub: { bs: 'MEDIA', en: 'MEDIA' }, name: 'Bonaco Media' },
  bonexis: { word: 'BONEXIS', sub: { bs: 'MEDIA', en: 'MEDIA' }, name: 'Bonexis' },
  bonevents: { word: 'BONEVENT', sub: { bs: 'MEDIA', en: 'MEDIA' }, name: 'BonEvents' },
};

/** qla.dev znak: originalni logo (mala slova, izvorni font, plavi ".dev"). */
export function QlaMark({ className = '' }: { className?: string }) {
  return <img className={`qla-mark ${className}`} src={asset('/img/logo/qla-dev.webp')} alt="qla.dev" width="84" height="24" loading="lazy" />;
}

export default function BrandLogo({ brand = 'bonaco', mono = false, className = '' }: { brand?: Brand; sub?: boolean; /** sve bijelo (npr. na obojenoj podlozi) */ mono?: boolean; className?: string }) {
  const b = BRANDS[brand];
  if (brand === 'bonaco') {
    return (
      <span className={`brand-logo brand-logo-bonaco brand-logo-img ${className}`}>
        <img src={asset(mono ? '/img/logo/bonaco-logo-white.webp' : '/img/logo/bonaco-logo-hd.webp')} alt="Bonaco Media" width="639" height="168" />
      </span>
    );
  }
  // prvo "E" iza "BON" je znak s tri crte
  const letters = b.word.split('');
  return (
    <span className={`brand-logo brand-logo-${brand} brand-logo-vec ${mono ? 'is-mono' : ''} ${className}`} role="img" aria-label={b.name}>
      <span className="bl-word" aria-hidden="true">
        {letters.map((ch, i) => (i === 3 && ch === 'E' ? <span key={i} className="bl-e" /> : <span key={i}>{ch}</span>))}
        <i className="bl-dot" />
      </span>
      <span className="bl-sub" aria-hidden="true">{b.sub.bs}</span>
    </span>
  );
}
