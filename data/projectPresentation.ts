export const WORK_FILTERS = ['Sve', 'Društvene mreže', 'Event', 'Grafički dizajn', 'Web dizajn', 'Foto i video', 'OOH / DOOH', 'Kampanje'];
export const WORK_ORDER: Record<string, string[]> = {
  Sve: ['summer-lounge', 'bh-posta', 'asa-banka', 'jovs', 'symbol', 'omega-orasi'],
  'Društvene mreže': ['summer-lounge', 'bh-posta', 'asa-banka', 'jovs', 'symbol', 'omega-orasi'],
  'Foto i video': ['medicana', 'bh-posta', 'golf-klub-sarajevo', 'protech', 'asa-banka', 'symbol', 'summer-lounge', 'bonaco-craft'],
  Event: ['jovs', 'golf-klub-sarajevo', 'summer-lounge'],
  'Grafički dizajn': ['symbol-dzeko', 'symbol-dukserice', 'symbol-tas', 'summer-lounge-identitet', 'summer-wine-lounge', 'bonaco-craft'],
  Kampanje: ['symbol-tas'],
  'OOH / DOOH': ['opel-dooh', 'zmaj', 'jovs-bilbordi'],
};
// Independent crops for wide rows and phone compositions.
export const STRIP_FOCUS: Record<string, { desktop: string; mobile: string }> = {
  'summer-lounge': { desktop: '50% 48%', mobile: '55% 43%' },
  'bh-posta': { desktop: '50% 28%', mobile: '54% 26%' },
  'asa-banka': { desktop: '50% 78%', mobile: '50% 88%' },
  'jovs': { desktop: '50% 42%', mobile: '50% 42%' },
  'symbol': { desktop: '50% 38%', mobile: '50% 38%' },
  'ecomm': { desktop: '50% 25%', mobile: '50% 25%' },
  'medicana': { desktop: '50% 20%', mobile: '50% 12%' },
  'peoples': { desktop: '70% 44%', mobile: '75% 45%' },
  'omega-orasi': { desktop: '50% 52%', mobile: '50% 50%' },
};
export const STRIP_FULL_ARTWORK = ['symbol-dzeko', 'symbol-dukserice', 'symbol-tas', 'summer-lounge-identitet', 'summer-wine-lounge', 'rooms-hr', 'skuter', 'bunjo-grupacija', 'max-media', 'opel-dooh', 'zmaj', 'jovs-bilbordi', 'ecomm', 'medicana', 'omega-orasi', 'omega-zelene-doline', 'flok', 'peoples'];
