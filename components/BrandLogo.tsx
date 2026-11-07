import { asset } from '../lib/asset';
// Zajednički DNK tri logotipa: isti font (Outfit 700), ista crna/bijela, iste proporcije
// i ista veličina/položaj tačke. Mijenja se samo naziv i boja tačke (boja brenda).
export type Brand = 'bonaco' | 'bonexis' | 'bonevents';

import { useLang } from '../lib/i18n';

export const BRANDS: Record<Brand, { word: string; sub: { bs: string; en: string }; name: string }> = {
  bonaco: { word: 'BONACO', sub: { bs: 'MEDIA', en: 'MEDIA' }, name: 'Bonaco Media' },
  bonexis: { word: 'BONEXIS', sub: { bs: 'MARKETING CRM SA AI AGENTIMA', en: 'MARKETING CRM WITH AI AGENTS' }, name: 'Bonexis' },
  bonevents: { word: 'BONEVENTS', sub: { bs: 'EVENTS', en: 'EVENTS' }, name: 'BonEvents' },
};

/** qla.dev znak: originalni logo (mala slova, izvorni font, plavi ".dev"). */
export function QlaMark({ className = '' }: { className?: string }) {
  return <img className={`qla-mark ${className}`} src={asset('/img/logo/qla-dev.webp')} alt="qla.dev" width="84" height="24" loading="lazy" />;
}

export default function BrandLogo({ brand = 'bonaco', sub = true, mono = false, className = '' }: { brand?: Brand; sub?: boolean; /** sve bijelo (npr. na narandžastoj podlozi) */ mono?: boolean; className?: string }) {
  const b = BRANDS[brand];
  const { lang } = useLang();
  // BONACO koristi pravi logotip (originalni znak, prebojan na novu narandžastu tačku)
  if (brand === 'bonaco') {
    return (
      <span className={`brand-logo brand-logo-bonaco brand-logo-img ${className}`}>
        <img src={asset(mono ? '/img/logo/bonaco-logo-white.webp' : '/img/logo/bonaco-logo-hd.webp')} alt="Bonaco Media" width="639" height="168" />
      </span>
    );
  }
  return (
    <span className={`brand-logo brand-logo-${brand} ${className}`}>
      <span className="sr-only">{b.name}</span>
      <span className="bl-word" aria-hidden="true">{b.word}<i className="bl-dot" /></span>
      {sub && <span className="bl-sub" aria-hidden="true">{b.sub[lang]}</span>}
    </span>
  );
}
