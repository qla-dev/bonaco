// Bonexis wordmark po uzoru na BONACO logo: velika slova (Outfit 700) i okrugla bakarna tačka.
export default function BonexisLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`bonexis-logo ${className}`}>
      <span className="sr-only">Bonexis</span>
      <span aria-hidden="true">BONEXIS</span>
      <i aria-hidden="true" />
    </span>
  );
}
