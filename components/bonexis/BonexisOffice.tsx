import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { BONEXIS_AGENTS } from '../../data/bonexis';
import type { OfficeHandle } from './officeScene';

interface Props {
  height?: string;
  /** Kontrolisani odabir (npr. iz Bonexis chata). Bez ovoga komponenta sama čuva stanje. */
  selected?: number;
  onSelectedChange?: (i: number) => void;
}

const BonexisOffice = forwardRef<HTMLDivElement, Props>(function BonexisOffice({ height = 'min(86svh, 820px)', selected: selProp, onSelectedChange }, outerRef) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<OfficeHandle | null>(null);
  const [selInner, setSelInner] = useState(-1);
  const selected = selProp ?? selInner;
  const setSelected = (i: number) => { setSelInner(i); onSelectedChange?.(i); };
  const setRef = useRef(setSelected); setRef.current = setSelected;
  const [tip, setTip] = useState<{ i: number; x: number; y: number }>({ i: -1, x: 0, y: 0 });
  const [state, setState] = useState<'idle' | 'ready' | 'fallback'>('idle');

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      try {
        const test = document.createElement('canvas');
        if (!(test.getContext('webgl2') || test.getContext('webgl'))) throw new Error('no webgl');
        const { createOffice } = await import('./officeScene');
        if (cancelled || !canvas.current || !wrap.current) return;
        handle.current = createOffice(canvas.current, wrap.current, {
          agentNames: BONEXIS_AGENTS.map(a => a.name),
          onHover: (i, x, y) => setTip(prev => (prev.i === i && i < 0 ? prev : { i, x, y })),
          onSelect: i => setRef.current(i),
        });
        setState('ready');
      } catch {
        setState('fallback');
      }
    }, { rootMargin: '300px' });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); handle.current?.destroy(); handle.current = null; };
  }, []);

  useEffect(() => { handle.current?.select(selected); }, [selected, state]);

  useEffect(() => {
    if (selected < 0) return;
    const n = BONEXIS_AGENTS.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRef.current(-1);
      if (e.key === 'ArrowRight') setRef.current((selected + 1) % n);
      if (e.key === 'ArrowLeft') setRef.current((selected + n - 1) % n);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [selected]);

  const agent = selected >= 0 ? BONEXIS_AGENTS[selected] : null;

  if (state === 'fallback') {
    return (
      <div className="container agent-grid" ref={outerRef}>
        {BONEXIS_AGENTS.map(a => (
          <article key={a.name} className="agent-card"><h3>{a.title}</h3><p>{a.desc}</p></article>
        ))}
      </div>
    );
  }

  return (
    <div ref={outerRef} className="office-shell">
      <div className={`office ${selected >= 0 ? 'is-selected' : ''}`} ref={wrap} style={{ height }}>
        <canvas ref={canvas} aria-hidden="true" />
        {state === 'idle' && <div className="office-loading" aria-hidden="true" />}
        <div className="office-tip" style={{ left: tip.x, top: tip.y, opacity: tip.i >= 0 && selected < 0 ? 1 : 0 }}>
          {tip.i >= 0 ? BONEXIS_AGENTS[tip.i].title : ''}
        </div>
        {agent && (
          <aside className="office-panel" aria-live="polite">
            <button className="icon-btn office-close" onClick={() => setSelected(-1)} aria-label="Zatvori"><X size={18} /></button>
            <span className="office-count">Agent {selected + 1} od {BONEXIS_AGENTS.length}</span>
            <h3>{agent.title}</h3>
            <p>{agent.desc}</p>
            <ul className="check-list">{agent.list.map(l => <li key={l}>{l}</li>)}</ul>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/kontakt/?usluga=Bonexis">Zatražite demo</Link>
              <button className="btn btn-secondary" onClick={() => setSelected((selected + 1) % BONEXIS_AGENTS.length)}>
                Sljedeći agent <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        )}
        <nav className="office-nav" aria-label="Bonexis AI agenti">
          {BONEXIS_AGENTS.map((a, i) => (
            <button key={a.name} aria-pressed={i === selected} onClick={() => setSelected(i === selected ? -1 : i)}>{a.name}</button>
          ))}
        </nav>
      </div>
    </div>
  );
});

export default BonexisOffice;
