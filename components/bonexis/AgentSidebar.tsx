// Detalji Bonexis agenta u fiksnom desnom sidebaru (kao Lena AI u Pathtrcku):
// na većim ekranima stranica pravi mjesto (html.agent-sidebar-open), na mobitelu ide preko cijelog ekrana.
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BONEXIS_AGENTS, roleLabel } from '../../data/bonexis';

interface Props { index: number; onChange: (i: number) => void; onShowScenario?: (i: number) => void }

export default function AgentSidebar({ index, onChange, onShowScenario }: Props) {
  const open = index >= 0;
  const n = BONEXIS_AGENTS.length;
  const agent = open ? BONEXIS_AGENTS[index] : null;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('agent-sidebar-open', open);
    return () => document.documentElement.classList.remove('agent-sidebar-open');
  }, [open]);

  useEffect(() => { if (open) closeRef.current?.focus({ preventScroll: true }); }, [open, index]);

  return createPortal(
    <aside className={`agent-sidebar ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Detalji AI agenta">
      {agent && (
        <div className="as-inner" key={index}>
          <header className="as-head">
            <span className="as-count">Agent {index + 1} od {n}</span>
            <div className="as-nav">
              <button className="icon-btn" onClick={() => onChange((index + n - 1) % n)} aria-label="Prethodni agent"><ChevronLeft size={18} /></button>
              <button className="icon-btn" onClick={() => onChange((index + 1) % n)} aria-label="Sljedeći agent"><ChevronRight size={18} /></button>
              <button className="icon-btn" ref={closeRef} onClick={() => onChange(-1)} aria-label="Zatvori"><X size={18} /></button>
            </div>
          </header>

          <div className="as-body">
            <h2>{agent.persona}</h2>
            <p className="as-role">{agent.role === 'owner' ? `${roleLabel(agent)}: ${agent.title}` : roleLabel(agent)}</p>
            <p className="as-desc">{agent.desc}</p>

            <h3>Šta radi</h3>
            <ul className="check-list">{agent.list.map(l => <li key={l}>{l}</li>)}</ul>

            <h3>Primjer</h3>
            <div className="as-example">
              <strong>{agent.scenario.title}</strong>
              {agent.scenario.messages.slice(0, 2).map((m, i) => (
                <p key={i} className={`as-line ${m.from}`}><span>{m.from === "agent" ? agent.persona : agent.scenario.clientLabel}</span>{m.text}</p>
              ))}
              {onShowScenario && <button className="text-link as-more" onClick={() => onShowScenario(index)}>Pogledajte cijeli scenarij</button>}
            </div>

            <h3>Ostali agenti</h3>
            <div className="as-others">
              {BONEXIS_AGENTS.map((a, i) => (
                <button key={a.name} className={i === index ? 'is-on' : ''} aria-current={i === index} onClick={() => onChange(i)}><strong>{a.persona}</strong> {a.name}</button>
              ))}
            </div>
          </div>

          <footer className="as-foot">
            <Link className="btn btn-primary" to="/kontakt/?usluga=Bonexis">Zatražite demo</Link>
            <button className="btn btn-secondary" onClick={() => onChange((index + 1) % n)}>Sljedeći agent</button>
          </footer>
        </div>
      )}
    </aside>,
    document.body,
  );
}
