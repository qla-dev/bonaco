// Bonexis wordmark (bez podnaslova) – isti DNK kao BrandLogo, tačka u boji Bonexisa.
export default function BonexisLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`bonexis-logo ${className}`}>
      <span className="sr-only">Bonexis</span>
      <span aria-hidden="true">BONEXIS</span>
      <i aria-hidden="true" />
    </span>
  );
}
