// Na telefonu (kao na qla.dev) skroluje se #root, a ne dokument: Safari tada nikad ne skuplja/širi
// donju adresnu traku, pa visina ekrana ostaje stabilna (slajdovi pune visine, fiksni CTA).
// Na desktopu se i dalje skroluje prozor. Svi dijelovi sajta čitaju skrol preko ovih helpera.

export function scroller(): HTMLElement | null {
  const r = document.getElementById('root');
  if (!r) return null;
  const oy = getComputedStyle(r).overflowY;
  return oy === 'auto' || oy === 'scroll' ? r : null;
}

export const getScrollY = (): number => scroller()?.scrollTop ?? window.scrollY;

export function scrollToY(top: number, behavior: ScrollBehavior = 'auto') {
  const el = scroller();
  if (el) el.scrollTo({ top, behavior });
  else window.scrollTo({ top, behavior });
}

/** Sluša skrol i prozora i #root (capture na dokumentu hvata skrol bilo kojeg elementa). */
export function onScroll(fn: () => void): () => void {
  const opts: AddEventListenerOptions = { capture: true, passive: true };
  document.addEventListener('scroll', fn, opts);
  return () => document.removeEventListener('scroll', fn, opts);
}
