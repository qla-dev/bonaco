// Sajt radi i na podputanji (npr. https://qla.dev/bonaco/) i na rootu (bonacomedia.com).
// Sve apsolutne putanje do fajlova iz public/ idu kroz asset().
const BASE = import.meta.env.BASE_URL; // '/' ili '/bonaco/'

export const asset = (p?: string | null): string =>
  !p ? '' : p.startsWith('/') && !p.startsWith('//') ? BASE + p.slice(1) : p;

/** Za HTML postova iz REA importa: /img/... i interni linkovi dobijaju base. */
export const withBase = (html: string): string =>
  BASE === '/' ? html : html.replace(/(src|href)="\/(?!\/)/g, `$1="${BASE}`);

export const ROUTER_BASENAME = BASE.replace(/\/$/, '') || '/';
