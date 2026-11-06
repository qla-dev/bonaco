// Bogatiji elementi početne: rotirajući bedž "Showreel" i velika traka ključnih riječi.
import { useLang } from '../lib/i18n';

/** Kružni bedž s tekstom koji se polako okreće oko narandžaste tačke. */
export function SpinBadge({ text }: { text: string }) {
  return (
    <span className="spin-badge" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs><path id="spin-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        <text><textPath href="#spin-circle" startOffset="0">{text}</textPath></text>
      </svg>
      <i />
    </span>
  );
}

const WORDS = {
  bs: ['Strategija', 'Kampanje', 'Društvene mreže', 'Dizajn', 'Video', 'Web', 'SEO', 'OOH / DOOH', 'Eventi', 'AI'],
  en: ['Strategy', 'Campaigns', 'Social media', 'Design', 'Video', 'Web', 'SEO', 'OOH / DOOH', 'Events', 'AI'],
};

/** Velika traka ključnih riječi koja klizi preko ekrana (puna i obrisna slova naizmjenično). */
export function KeywordTicker() {
  const { lang } = useLang();
  const words = WORDS[lang];
  const row = [...words, ...words];
  return (
    <div className="kw-ticker" role="img" aria-label={words.join(', ')}>
      <div className="kw-track" aria-hidden="true">
        {row.map((w, i) => (
          <span key={i} className={i % 2 ? 'kw-outline' : ''}>{w}<i /></span>
        ))}
      </div>
    </div>
  );
}
