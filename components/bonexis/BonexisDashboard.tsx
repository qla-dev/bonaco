// Bonexis dashboard (demo): izgled kao Claude – lijevo sidebar s kapsulama i owner agentima,
// desno radni prikaz kapsule s KPI-jevima, redom za odobrenje, panelom i zadatkom za agenta.
import { useMemo, useState, type FormEvent } from 'react';
import { ArrowUp, Check, LayoutDashboard, Pencil, Plus, Search, Users, FolderKanban, ListChecks } from 'lucide-react';
import { BEN, BONEXIS_AGENTS, roleLabel } from '../../data/bonexis';
import { DASHBOARDS, DEMO_COMPANY, type DashItem, type Tone } from '../../data/dashboards';
import BonexisLogo from './BonexisLogo';

const OWNERS = BONEXIS_AGENTS.filter(a => a.role === 'owner');

type Msg = { from: 'user' | 'agent'; text: string };

export default function BonexisDashboard() {
  const [view, setView] = useState<string>('overview');
  const [items, setItems] = useState<Record<string, DashItem[]>>(() =>
    Object.fromEntries(Object.entries(DASHBOARDS).map(([k, d]) => [k, d.queue])));
  const [feed, setFeed] = useState<Record<string, Msg[]>>({});
  const [input, setInput] = useState('');

  const pending = (k: string) => (items[k] ?? []).filter(i => i.tone === 'warn' || i.tone === 'bad').length;
  const agent = OWNERS.find(a => a.persona === view);
  const assistants = agent ? BONEXIS_AGENTS.filter(a => a.capsule === agent.capsule && a.role === 'assistant') : [];
  const dash = agent ? DASHBOARDS[agent.persona] : null;

  const act = (k: string, id: string, kind: 'approve' | 'edit') =>
    setItems(s => ({ ...s, [k]: s[k].map(i => (i.id !== id ? i : kind === 'approve'
      ? { ...i, status: 'Odobreno', tone: 'ok' as Tone }
      : { ...i, status: 'Vraćeno na izmjenu', tone: 'info' as Tone })) }));

  const send = (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    const who = agent ? agent.persona : 'Ben';
    const reply = agent
      ? `Primljeno. ${agent.persona} radi na tome i javlja vam se kad rezultat čeka vaše odobrenje.`
      : 'Primljeno. Raspoređujem zadatak kapsuli koja ga rješava i javljam vam se s prijedlogom.';
    setFeed(f => ({ ...f, [who]: [...(f[who] ?? []), { from: 'user', text: q }, { from: 'agent', text: reply }] }));
    setInput('');
  };

  const totalPending = useMemo(() => OWNERS.reduce((n, a) => n + pending(a.persona), 0), [items]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bxd" role="region" aria-label="Bonexis dashboard, demo">
      <aside className="bxd-side">
        <div className="bxd-brand"><BonexisLogo /><span className="bxd-demo">Demo</span></div>
        <button type="button" className="bxd-new" onClick={() => setView('overview')}><Plus size={16} /> Novi zadatak za Bena</button>
        <nav aria-label="Bonexis navigacija">
          <button type="button" className={view === 'overview' ? 'is-on' : ''} onClick={() => setView('overview')}>
            <LayoutDashboard size={16} /> Pregled {totalPending > 0 && <em>{totalPending}</em>}
          </button>
          <span className="bxd-label">Kapsule</span>
          {OWNERS.map(a => (
            <button type="button" key={a.persona} className={view === a.persona ? 'is-on' : ''} onClick={() => setView(a.persona)}>
              <span className="bxd-av">{a.persona[0]}</span>
              <span className="bxd-nm"><strong>{a.name}</strong><small>{a.persona}, K{a.capsule}</small></span>
              {pending(a.persona) > 0 && <em>{pending(a.persona)}</em>}
            </button>
          ))}
          <span className="bxd-label">CORE</span>
          <span className="bxd-core"><Users size={15} /> Klijenti</span>
          <span className="bxd-core"><FolderKanban size={15} /> Projekti</span>
          <span className="bxd-core"><ListChecks size={15} /> Zadaci i dokazi</span>
        </nav>
        <div className="bxd-user"><span className="bxd-av light">D</span>{DEMO_COMPANY}</div>
      </aside>

      <section className="bxd-main">
        <header className="bxd-top">
          {agent ? (
            <>
              <div className="bxd-title">
                <span className="bxd-cap">Kapsula {agent.capsule}</span>
                <h3>{agent.title}</h3>
                <p>Owner agent: <strong>{agent.persona}</strong>{assistants.map(s => <span key={s.persona}>, uz {s.title.toLowerCase()} {s.persona}</span>)}</p>
              </div>
              <div className="bxd-search"><Search size={15} /> Pretraga</div>
            </>
          ) : (
            <div className="bxd-title">
              <span className="bxd-cap">Dobro jutro</span>
              <h3>Šta čeka vašu odluku danas</h3>
              <p>{BEN.name} je složio pregled iz svih kapsula. Ništa se ne objavljuje i ne šalje bez vašeg odobrenja.</p>
            </div>
          )}
        </header>

        {!agent && (
          <div className="bxd-overview">
            {OWNERS.map(a => (
              <button type="button" key={a.persona} className="bxd-ocard" onClick={() => setView(a.persona)}>
                <span className="bxd-av">{a.persona[0]}</span>
                <span className="bxd-oinfo"><strong>{a.name}</strong><small>{roleLabel(a)}, {a.persona}</small></span>
                <span className={`bxd-pill ${pending(a.persona) ? 'warn' : 'ok'}`}>{pending(a.persona) ? `${pending(a.persona)} čeka` : 'Sve riješeno'}</span>
                <span className="bxd-otext">{DASHBOARDS[a.persona].kpis[1].label}: <b>{DASHBOARDS[a.persona].kpis[1].value}</b></span>
              </button>
            ))}
          </div>
        )}

        {agent && dash && (
          <>
            <div className="bxd-skills">{agent.list.map(l => <span key={l}>{l}</span>)}</div>
            <div className="bxd-kpis">
              {dash.kpis.map(k => <div key={k.label} className={`bxd-kpi ${k.tone ?? ''}`}><b>{k.value}</b><span>{k.label}</span></div>)}
            </div>
            <div className="bxd-grid">
              <div className="bxd-card">
                <h4>{dash.queueTitle}</h4>
                <ul className="bxd-queue">
                  {items[agent.persona].map(i => (
                    <li key={i.id}>
                      <div><strong>{i.title}</strong><small>{i.meta}</small></div>
                      <span className={`bxd-pill ${i.tone}`}>{i.status}</span>
                      {(i.tone === 'warn' || i.tone === 'bad') && (
                        <span className="bxd-acts">
                          <button type="button" onClick={() => act(agent.persona, i.id, 'approve')}><Check size={14} /> Odobri</button>
                          <button type="button" onClick={() => act(agent.persona, i.id, 'edit')}><Pencil size={14} /> Uredi</button>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bxd-card">
                <h4>{dash.panelTitle}</h4>
                {dash.panel.type === 'week' && (
                  <div className="bxd-week">
                    {dash.panel.days.map(d => (
                      <div key={d.day}><span>{d.day}</span>{d.posts.map(p => <i key={p.title} className={p.tone}><b>{p.time}</b> {p.title} <small>{p.channel}</small></i>)}</div>
                    ))}
                  </div>
                )}
                {dash.panel.type === 'bars' && (
                  <div className="bxd-bars">
                    {dash.panel.items.map(b => {
                      const max = Math.max(100, ...(dash.panel.type === 'bars' ? dash.panel.items.map(x => x.value) : [100]));
                      return <div key={b.label}><span>{b.label}</span><div><i style={{ width: `${(b.value / max) * 100}%` }} className={b.value > 100 ? 'bad' : ''} /></div><b>{b.value}{agent.persona === 'Kenan' ? '%' : ''}</b>{b.note && <small>{b.note}</small>}</div>;
                    })}
                  </div>
                )}
                {dash.panel.type === 'list' && (
                  <ul className="bxd-list">{dash.panel.items.map(r => <li key={r.label} className={r.tone}><span>{r.label}</span><b>{r.value}</b></li>)}</ul>
                )}
                {dash.panel.type === 'pipeline' && (
                  <div className="bxd-pipe">{dash.panel.cols.map(c => <div key={c.name}><b>{c.count}</b><span>{c.name}</span></div>)}</div>
                )}
              </div>
            </div>
          </>
        )}

        {(feed[agent?.persona ?? 'Ben'] ?? []).length > 0 && (
          <div className="bxd-feed" aria-live="polite">
            {feed[agent?.persona ?? 'Ben'].map((m, i) => <p key={i} className={m.from}>{m.text}</p>)}
          </div>
        )}
        <form className="bxd-composer" onSubmit={send}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder={agent ? `Zadatak za agenta ${agent.persona}…` : `Zadatak za ${BEN.name}…`} aria-label="Zadatak za agenta" maxLength={300} />
          <button type="submit" aria-label="Pošalji" disabled={!input.trim()}><ArrowUp size={18} /></button>
        </form>
        <p className="bxd-note">Demo prikaz s izmišljenim podacima. Bonexis je u razvoju s partnerom qla.dev.</p>
      </section>
    </div>
  );
}
