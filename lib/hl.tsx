// Naglašena riječ u naslovu: tekst između zvjezdica ("Tri *brenda*, jedna ekipa") dobija boju brenda
// sekcije (--accent) i shimmer. Bez zvjezdica tekst ostaje isti.
import type { ReactNode } from 'react';

export function hl(text: string): ReactNode {
  if (!text.includes('*')) return text;
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? <em key={i} className="shimmer hl">{part.slice(1, -1)}</em> : part,
  );
}
