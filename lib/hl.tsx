// Oznake u tekstu:
//   *riječ*   -> naglašena riječ u naslovu: boja brenda sekcije (--accent) + shimmer
//   **fraza** -> bold u tekstu (bijelo, deblje)
// Bez oznaka tekst ostaje isti.
import type { ReactNode } from 'react';

export function hl(text: string): ReactNode {
  if (!text.includes('*')) return text;
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i} className="shimmer hl">{part.slice(1, -1)}</em>;
    return part;
  });
}
