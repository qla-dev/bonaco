// Scenariji Bonexis agenata kao zasebne sekcije (kao Lena scenariji na Pathtrck landingu):
// blokovi se smjenjuju lijevo/desno, razgovor kreće kad blok dođe na ekran.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { BONEXIS_AGENTS, roleLabel } from '../../data/bonexis';

const STEP_MS = 1100;
const reduceMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Razgovor jednog agenta + kartica s rezultatom koja se puni. */
export function ScenarioPlayer({ agent, play }: { agent: number; play: boolean }) {
  const a = BONEXIS_AGENTS[agent];
  const sc = a.scenario;
  const total = sc.messages.length + 1;
  const [step, setStep] = useState(reduceMotion() ? total : 0);
  const [run, setRun] = useState(0);

  useEffect(() => { setStep(reduceMotion() ? total : 0); }, [agent, run, total]);
  useEffect(() => {
    if (!play || step >= total) return;
    const id = setTimeout(() => setStep(s => s + 1), step === 0 ? 300 : STEP_MS);
    return () => clearTimeout(id);
  }, [step, total, play]);

  const shown = sc.messages.slice(0, step);
  const typing = play && step > 0 && step < sc.messages.length && sc.messages[step]?.from === 'agent';
  const rowsShown = Math.max(0, Math.min(sc.result.rows.length, step - 1));
  const done = step >= total;

  return (
    <div className="sc-visual">
      <div className="sc-chat" aria-live="polite">
        {shown.map((m, i) => (
          <div key={`${run}-${i}`} className={`sc-msg ${m.from}`}>
            <span className="sc-who">{m.from === 'agent' ? <><Sparkles size={13} /> {a.persona}</> : sc.clientLabel}</span>
            <p>{m.text}</p>
          </div>
        ))}
        {typing && (
          <div className="sc-msg agent">
            <span className="sc-who"><Sparkles size={13} /> {a.persona}</span>
            <p className="bx-typing" aria-label={`${a.persona} piše`}><i /><i /><i /></p>
          </div>
        )}
        {done && (
          <button type="button" className="sc-replay" onClick={() => setRun(r => r + 1)}><RotateCcw size={14} /> Pokreni ponovo</button>
        )}
      </div>
      <div className={`sc-canvas ${step > 1 ? 'is-on' : ''}`}>
        <div className="sc-canvas-head">
          <span>{sc.result.title}</span>
          <span className="sc-live">{done ? 'Gotovo' : step > 0 ? 'Radi…' : 'Čeka'}</span>
        </div>
        <ul>
          {sc.result.rows.map((r, i) => (
            <li key={r.label} className={`tone-${r.tone} ${i < rowsShown || done ? 'is-on' : ''}`}>
              <span>{r.label}</span>
              <strong>{r.value}</strong>
            </li>
          ))}
        </ul>
        <div className={`sc-status ${done ? 'is-on' : ''}`}><CheckCircle2 size={16} /> {sc.result.status}</div>
      </div>
    </div>
  );
}

function ScenarioBlock({ agent, onShowAgent }: { agent: number; onShowAgent?: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);
  const a = BONEXIS_AGENTS[agent];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className={`sc-block ${agent % 2 ? 'is-flipped' : ''}`} id={`scenarij-${a.persona.toLowerCase()}`}>
      <div className="sc-copy">
        <div className="sc-agent">
          <span className="sc-avatar" aria-hidden="true">{a.persona[0]}</span>
          <div><strong>{a.persona}</strong><span>{a.role === 'owner' ? `${roleLabel(a)}: ${a.title}` : roleLabel(a)}</span></div>
        </div>
        <h3>{a.scenario.title}</h3>
        <p>{a.scenario.desc}</p>
        <ul className="check-list">{a.list.map(l => <li key={l}>{l}</li>)}</ul>
        {onShowAgent && (
          <button type="button" className="text-link sc-open" onClick={() => onShowAgent(agent)}>Otvorite {a.persona} u kancelariji</button>
        )}
      </div>
      <ScenarioPlayer agent={agent} play={play} />
    </article>
  );
}

export default function ScenarioSections({ onShowAgent }: { onShowAgent?: (i: number) => void }) {
  return (
    <section className="sc-section" id="scenariji" aria-labelledby="scenariji-title">
      <div className="container">
        <div className="sc-intro">
          <h2 id="scenariji-title">Bonexis u praksi</h2>
          <p>Kako bi Bonexis radio u vašoj firmi: sedam kapsula, njihovi owner agenti i tipične situacije od prve poruke do rezultata. Primjeri su ilustrativni.</p>
        </div>
        {BONEXIS_AGENTS.map((_, i) => <ScenarioBlock key={i} agent={i} onShowAgent={onShowAgent} />)}
        <p className="sc-foot">Želite ovo za svoj biznis? <Link to="/kontakt/?usluga=Bonexis">Zatražite demo</Link></p>
      </div>
    </section>
  );
}
