// Početni ekran: lijevo poruka, desno "mozak" Bonexisa. Ben je središnji neuron, owner agenti
// kapsula su istaknuti neuroni s mislima; klik na agenta otvara mali chat s njim.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, X } from 'lucide-react';
import { STATS } from '../data/site';
import { BONEXIS_AGENTS, roleLabel } from '../data/bonexis';
import { agentRing, brainMap, startBrain, type BrainHandle, type P } from './heroBrain';

// Agenti na pravilnom unutrašnjem prstenu (redoslijed kao BONEXIS_AGENTS)
const POS: P[] = agentRing(BONEXIS_AGENTS.length);
const BEN_POS: P = { x: 0, y: 0 };

export default function Hero() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brain = useRef<BrainHandle | null>(null);
  const navigate = useNavigate();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [thinking, setThinking] = useState(0);
  const [open, setOpen] = useState(-1);
  const [step, setStep] = useState(0);
  const [ask, setAsk] = useState('');
  const reduce = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = boxRef.current, cv = canvasRef.current;
    if (!el || !cv) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    brain.current = startBrain(cv, { agents: POS, ben: BEN_POS });
    return () => { ro.disconnect(); brain.current?.destroy(); };
  }, []);

  // Agenti redom "razmišljaju": Ben im šalje impuls, a pored neurona se pojavi misao
  useEffect(() => {
    if (open >= 0) return;
    brain.current?.fire(thinking);
    if (reduce) return;
    const id = setTimeout(() => setThinking(i => (i + 1) % BONEXIS_AGENTS.length), 2800);
    return () => clearTimeout(id);
  }, [thinking, open, reduce]);

  // Mali chat: prve poruke iz scenarija agenta se pojavljuju jedna po jedna
  useEffect(() => { setStep(reduce ? 2 : 0); setAsk(''); }, [open, reduce]);
  useEffect(() => {
    if (open < 0 || step >= 2) return;
    const id = setTimeout(() => setStep(s => s + 1), step === 0 ? 250 : 900);
    return () => clearTimeout(id);
  }, [open, step]);
  useEffect(() => {
    if (open < 0) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(-1); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  const map = brainMap(size.w, size.h);
  const at = (p: P) => (size.w ? map.px(p) : { x: -999, y: -999 });
  const ben = at(BEN_POS);
  const narrow = size.w > 0 && size.w < 560; // mobitel: misao iznad agenta

  const onAsk = (e: FormEvent) => {
    e.preventDefault();
    const q = ask.trim();
    if (q) navigate(`/bonexis/?pitanje=${encodeURIComponent(q)}`);
  };

  const agent = open >= 0 ? BONEXIS_AGENTS[open] : null;
  const ap = open >= 0 ? at(POS[open]) : null;
  const chatLeft = ap ? (POS[open].x > 0 ? ap.x - 336 : ap.x + 30) : 0;

  return (
    <section className="hero3" aria-label="Bonaco Media">
      <div className="hero3-glow" aria-hidden="true" />
      <div className="container hero3-grid">
        <div className="hero3-copy">
          <h1><span>Jedina <em className="shimmer">agencija</em></span> <span>koja vam je potrebna</span></h1>
          <p className="hero3-lead">
            Vodimo društvene mreže, evente, foto i video, web i dizajn za brendove iz regije. Vašoj firmi nudimo i <strong>Bonexis</strong>, marketing CRM u kojem svaku od sedam AI kapsula vodi njen owner agent, a Ben ih povezuje u jedan mozak.
          </p>
          <div className="btn-row">
            <Link to="/kontakt/" className="btn btn-primary btn-lg">Zatražite ponudu</Link>
            <Link to="/bonexis/" className="btn btn-glass btn-lg">Upoznajte Bonexis</Link>
          </div>
          <dl className="hero3-stats">
            <div><dd>{STATS.clients}</dd><dt>klijenata</dt></div>
            <div><dd>{STATS.years}</dd><dt>godina iskustva</dt></div>
            <div><dd>7</dd><dt>AI kapsula</dt></div>
          </dl>
        </div>

        <div className="brain" ref={boxRef}>
          <canvas ref={canvasRef} aria-hidden="true" />
          <div className="brain-ben" style={{ left: ben.x, top: ben.y }} aria-hidden="true">BEN</div>
          {BONEXIS_AGENTS.map((a, i) => {
            const p = at(POS[i]);
            return (
              <button
                key={a.persona}
                type="button"
                className={`neuron ${i === open ? 'is-open' : ''} ${i === thinking && open < 0 ? 'is-thinking' : ''}`}
                style={{ left: p.x, top: p.y }}
                onClick={() => setOpen(o => (o === i ? -1 : i))}
                aria-expanded={i === open}
                aria-label={`${a.persona}, ${roleLabel(a)}: otvori chat`}
              >
                <span className="neuron-dot" aria-hidden="true">{a.persona[0]}</span>
                <span className="neuron-name" aria-hidden="true">{a.persona}<small>K{a.capsule}</small></span>
              </button>
            );
          })}
          {open < 0 && (
            <div key={thinking} className={`thought ${narrow ? 'above' : `${POS[thinking].x > 0 ? 'to-right' : 'to-left'} ${POS[thinking].y > 0 ? 'to-bottom' : 'to-top'}`}`} style={{ left: narrow ? Math.min(Math.max(at(POS[thinking]).x, 96), size.w - 96) : at(POS[thinking]).x, top: at(POS[thinking]).y }} aria-live="polite">
              {BONEXIS_AGENTS[thinking].thought}
            </div>
          )}
          {agent && ap && (
            <div
              className="neuron-chat"
              style={{ left: Math.max(8, Math.min(size.w - 336, chatLeft)), top: Math.max(8, Math.min(size.h - 340, ap.y - 60)) }}
              role="dialog"
              aria-label={`Chat: ${agent.persona}`}
            >
              <div className="nc-head">
                <span className="nc-avatar" aria-hidden="true">{agent.persona[0]}</span>
                <div><strong>{agent.persona}</strong><span>{roleLabel(agent)}</span></div>
                <button type="button" className="nc-close" onClick={() => setOpen(-1)} aria-label="Zatvori chat"><X size={16} /></button>
              </div>
              <div className="nc-body">
                {agent.scenario.messages.slice(0, step).map((m, i) => (
                  <p key={i} className={m.from}>{m.text}</p>
                ))}
                {step < 2 && <p className="agent bx-typing" aria-label="piše"><i /><i /><i /></p>}
              </div>
              <form className="nc-ask" onSubmit={onAsk}>
                <input value={ask} onChange={e => setAsk(e.target.value)} placeholder="Vaše pitanje…" aria-label="Vaše pitanje" maxLength={300} />
                <button type="submit" aria-label="Pošalji" disabled={!ask.trim()}><ArrowUp size={16} /></button>
              </form>
              <Link to={`/#scenarij-${agent.persona.toLowerCase()}`} className="nc-more" onClick={() => setOpen(-1)}>Pogledajte cijeli scenarij</Link>
            </div>
          )}
          <p className="brain-hint">Kliknite neuron agenta za kratak chat</p>
        </div>
      </div>
    </section>
  );
}
