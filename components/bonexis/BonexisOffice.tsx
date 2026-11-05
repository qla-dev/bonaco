import { forwardRef, useEffect, useRef, useState } from 'react';
import { BONEXIS_AGENTS } from '../../data/bonexis';
import AgentSidebar from './AgentSidebar';
import type { OfficeHandle } from './officeScene';

interface Props {
  height?: string;
  /** Kontrolisani odabir (npr. iz Ben AI chata). Bez ovoga komponenta sama čuva stanje. */
  selected?: number;
  onSelectedChange?: (i: number) => void;
  onShowScenario?: (i: number) => void;
}

const BonexisOffice = forwardRef<HTMLDivElement, Props>(function BonexisOffice({ height = 'min(86svh, 820px)', selected: selProp, onSelectedChange, onShowScenario }, outerRef) {
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
          personas: BONEXIS_AGENTS.map(a => a.persona),
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

  const sidebar = <AgentSidebar index={selected} onChange={setSelected} onShowScenario={onShowScenario} />;

  if (state === 'fallback') {
    return (
      <div className="container" ref={outerRef}>
        <div className="agent-grid">
          {BONEXIS_AGENTS.map((a, i) => (
            <button key={a.name} className="agent-card agent-card-btn" onClick={() => setSelected(i)}>
              <span className="agent-num">{a.persona}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </button>
          ))}
        </div>
        {sidebar}
      </div>
    );
  }

  return (
    <div ref={outerRef} className="office-shell">
      <div className={`office ${selected >= 0 ? 'is-selected' : ''}`} ref={wrap} style={{ height }}>
        <canvas ref={canvas} aria-hidden="true" />
        {state === 'idle' && <div className="office-loading" aria-hidden="true" />}
        <div className="office-tip" style={{ left: tip.x, top: tip.y, opacity: tip.i >= 0 && selected < 0 ? 1 : 0 }}>
          {tip.i >= 0 ? `${BONEXIS_AGENTS[tip.i].persona}, ${BONEXIS_AGENTS[tip.i].title}` : ''}
        </div>
        <nav className="office-nav" aria-label="Bonexis AI agenti">
          {BONEXIS_AGENTS.map((a, i) => (
            <button key={a.name} aria-pressed={i === selected} onClick={() => setSelected(i === selected ? -1 : i)}>
              <strong>{a.persona}</strong> <span>{a.name}</span>
            </button>
          ))}
        </nav>
      </div>
      {sidebar}
    </div>
  );
});

export default BonexisOffice;
