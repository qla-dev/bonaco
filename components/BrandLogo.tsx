// Zajednički DNK tri logotipa: isti font (Outfit 700), ista crna/bijela, iste proporcije
// i ista veličina/položaj tačke. Mijenja se samo naziv i boja tačke (boja brenda).
export type Brand = 'bonaco' | 'bonexis' | 'bonevents';

export const BRANDS: Record<Brand, { word: string; sub: string; name: string }> = {
  bonaco: { word: 'BONACO', sub: 'MEDIA', name: 'Bonaco Media' },
  bonexis: { word: 'BONEXIS', sub: 'AI SOLUTIONS', name: 'Bonexis' },
  bonevents: { word: 'BONEVENTS', sub: 'EVENTS', name: 'BonEvents' },
};

export default function BrandLogo({ brand = 'bonaco', sub = true, className = '' }: { brand?: Brand; sub?: boolean; className?: string }) {
  const b = BRANDS[brand];
  return (
    <span className={`brand-logo brand-logo-${brand} ${className}`}>
      <span className="sr-only">{b.name}</span>
      <span className="bl-word" aria-hidden="true">{b.word}<i className="bl-dot" /></span>
      {sub && <span className="bl-sub" aria-hidden="true">{b.sub}</span>}
    </span>
  );
}
