import type { Project } from '../types';
export const WORK_FILTERS = ['Sve', 'Društvene mreže', 'Event', 'Grafički dizajn', 'Web dizajn', 'Foto i video', 'OOH / DOOH', 'Kampanje'];
export const WORK_ORDER: Record<string, string[]> = {
  Sve: ['summer-lounge', 'bh-posta', 'asa-banka', 'jovs', 'symbol', 'omega-orasi'],
  'Društvene mreže': ['summer-lounge', 'bh-posta', 'asa-banka', 'jovs', 'symbol', 'omega-orasi'],
  'Foto i video': ['medicana', 'bh-posta', 'golf-klub-sarajevo', 'protech', 'asa-banka', 'symbol', 'summer-lounge', 'bonaco-craft'],
  Event: ['jovs', 'golf-klub-sarajevo', 'summer-lounge'],
  'Grafički dizajn': ['symbol-dzeko', 'summer-wine-lounge', 'symbol-tas', 'summer-lounge-identitet', 'symbol-dukserice', 'bonaco-craft'],
  Kampanje: ['ecomm', 'symbol-zmajici', 'omega-zelene-doline'],
  'OOH / DOOH': ['opel-dooh', 'zmaj', 'zmaj-dooh'],
};
// Independent crops for wide rows and phone compositions.
export const STRIP_FOCUS: Record<string, { desktop: string; mobile: string }> = {
  'summer-lounge': { desktop: '50% 48%', mobile: '55% 43%' },
  'bh-posta': { desktop: '50% 28%', mobile: '54% 26%' },
  'asa-banka': { desktop: '50% 78%', mobile: '50% 88%' },
  'jovs': { desktop: '50% 42%', mobile: '50% 42%' },
  'symbol': { desktop: '50% 38%', mobile: '50% 38%' },
  'ecomm': { desktop: '50% 25%', mobile: '50% 25%' },
  'medicana': { desktop: '50% 42%', mobile: '52% 38%' },
  'peoples': { desktop: '70% 44%', mobile: '75% 45%' },
  'omega-orasi': { desktop: '50% 52%', mobile: '50% 50%' },
};
export const STRIP_FULL_ARTWORK = ['symbol-dzeko', 'symbol-dukserice', 'symbol-tas', 'summer-lounge-identitet', 'summer-wine-lounge', 'rooms-hr', 'skuter', 'bunjo-grupacija', 'max-media', 'opel-dooh', 'zmaj', 'jovs-bilbordi', 'ecomm', 'omega-orasi', 'omega-zelene-doline', 'flok', 'peoples'];

export function projectNeedsFrame(project: Pick<Project, 'slug' | 'categories'>) {
  return STRIP_FULL_ARTWORK.includes(project.slug) || project.categories.some(category => ['Grafički dizajn', 'Web dizajn', 'OOH / DOOH', 'Kampanje'].includes(category));
}

// Actual project screens, presented inside a shared CSS laptop.
export const WEB_PREVIEWS: Record<string, string> = {
  'rooms-hr': '/media/portfolio/rooms-screen-v5.webp',
  'skuter': '/media/portfolio/skuter-live-website.webp',
  'bunjo-grupacija': '/media/portfolio/bunjo-laptop-v5.webp',
};
export const PANEL_PREVIEWS: Record<string, {src: string; fit: 'cover' | 'contain'; position: string}> = {
  'opel-dooh': {src: '/media/portfolio/cover-opel-dooh.webp', fit: 'cover', position: '50% 50%'},
  'zmaj': {src: '/media/portfolio/zmaj-ooh-artwork-pdf.webp', fit: 'contain', position: 'center'},
  'zmaj-dooh': {src: '/media/portfolio/cover-zmaj-dooh.webp', fit: 'cover', position: '50% 50%'},
  'symbol-zmajici': {src: '/media/portfolio/symbol-zmajici-campaign-v23.webp', fit: 'contain', position: 'center'},
  'ecomm': {src: '/media/portfolio/ecomm-kupac-9.webp', fit: 'contain', position: 'center'},
  'omega-zelene-doline': {src: '/media/portfolio/cover-omega-zelene-doline.webp', fit: 'contain', position: 'center'},
};
