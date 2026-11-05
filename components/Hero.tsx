// Početni ekran: mreža čestica (Bonexis CRM kao mreža agenata oko Bena) i Ben AI prozor
// koji sam vodi razgovor; posjetilac može odmah upisati pitanje.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, CheckCircle2, Phone } from 'lucide-react';
import { asset } from '../lib/asset';
import { STATS } from '../data/site';
import { BEN, BONEXIS_AGENTS } from '../data/bonexis';
import { startParticles } from './heroParticles';

type Line =
  | { from: 'user'; text: string }
  | { from: 'ben'; text: string; card?: { image: string; title: string; text: string; to: string }; rows?: [string, string][]; chip?: string };

const SCRIPT: Line[] = [
  { from: 'user', text: 'Trebamo sadržaj za Instagram za ljetnu sezonu.' },
  { from: 'ben', text: 'To je naš tim radio za Summer Lounge: najave nastupa, reelsi i foto s evenata.', card: { image: '/img/projects/summer-lounge/mockup.webp', title: 'Summer Lounge', text: 'Društvene mreže i eventi', to: '/portfolio/summer-lounge/' } },
  { from: 'user', text: 'A kako da dođemo do novih klijenata?' },
  { from: 'ben', text: 'U Bonexis CRM-u to radi Lejla. Pronašla je firme koje odgovaraju vašem profilu i pripremila poruke.', rows: [['Pronađeno firmi', '24'], ['Odlično uklapanje', '8'], ['Poruke spremne', '8']] },
  { from: 'user', text: 'Ko će ih nazvati?' },
  { from: 'ben', text: 'Sara zove s vašeg broja, odgovara na pitanja i zakazuje sastanke.', chip: 'Termin zakazan: utorak u 10:00' },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reduce = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [step, setStep] = useState(reduce ? SCRIPT.length : 0);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    return startParticles(canvasRef.current, {
      agents: BONEXIS_AGENTS.map(a => a.persona),
      benAnchor: () => {
        const c = canvasRef.current, win = windowRef.current;
        if (!c || !win || win.offsetParent === null) return null;
        const cr = c.getBoundingClientRect(), wr = win.getBoundingClientRect();
        return { x: wr.left - cr.left + wr.width / 2, y: wr.top - cr.top + wr.height / 2, w: wr.width / 2 + 85, h: wr.height / 2 + 50 };
      },
    });
  }, []);

  // Razgovor se sam odvija i ponavlja; staje dok posjetilac piše
  useEffect(() => {
    if (reduce || hold) return;
    if (step >= SCRIPT.length) {
      const id = setTimeout(() => setStep(0), 5000);
      return () => clearTimeout(id);
    }
    const next = SCRIPT[step];
    const delay = step === 0 ? 700 : next.from === 'ben' ? 900 : 1700;
    if (next.from === 'ben') setTyping(true);
    const id = setTimeout(() => { setTyping(false); setStep(s => s + 1); }, delay);
    return () => clearTimeout(id);
  }, [step, hold, reduce]);

  useEffect(() => { const b = bodyRef.current; if (b) b.scrollTo({ top: b.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }); }, [step, typing, reduce]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    navigate(`/?pitanje=${encodeURIComponent(q)}#bonexis`);
  };

  return (
    <section className="hero3" ref={sectionRef} aria-label="Bonaco Media">
      <canvas ref={canvasRef} className="hero3-canvas" aria-hidden="true" />
      <div className="hero3-glow" aria-hidden="true" />

      <div className="container hero3-grid">
        <div className="hero3-copy">
          <h1>Jedina agencija koja vam je potrebna</h1>
          <p className="hero3-lead">
            Vodimo društvene mreže, evente, foto i video, web i dizajn za brendove iz regije. Uz to radimo i u <strong>Bonexisu</strong>, našem marketing CRM-u u kojem klijente, kampanje i rokove vode AI agenti.
          </p>
          <div className="btn-row">
            <Link to="/kontakt/" className="btn btn-primary btn-lg">Zatražite ponudu</Link>
            <Link to="/bonexis/" className="btn btn-glass btn-lg">Upoznajte Bonexis</Link>
          </div>
          <dl className="hero3-stats">
            <div><dd>{STATS.clients}</dd><dt>klijenata</dt></div>
            <div><dd>{STATS.years}</dd><dt>godina iskustva</dt></div>
            <div><dd>{BONEXIS_AGENTS.length}</dd><dt>AI agenata u CRM-u</dt></div>
          </dl>
        </div>

        <div className="ben-window" ref={windowRef} onMouseEnter={() => setHold(false)}>
          <div className="ben-top">
            <span className="ben-avatar">B</span>
            <div>
              <strong>{BEN.name}</strong>
              <span><i className="ben-dot" /> Bonexis CRM, online</span>
            </div>
          </div>
          <div className="ben-body" ref={bodyRef} aria-live="polite">
            {SCRIPT.slice(0, step).map((l, i) => (
              <div key={i} className={`ben-msg ${l.from}`}>
                <p>{l.text}</p>
                {l.from === 'ben' && l.card && (
                  <Link to={l.card.to} className="ben-card">
                    <img src={asset(l.card.image)} alt="" />
                    <span><strong>{l.card.title}</strong>{l.card.text}</span>
                    <ArrowUpRight size={16} />
                  </Link>
                )}
                {l.from === 'ben' && l.rows && (
                  <ul className="ben-rows">{l.rows.map(([k, v]) => <li key={k}><span>{k}</span><strong>{v}</strong></li>)}</ul>
                )}
                {l.from === 'ben' && l.chip && (
                  <span className="ben-chip"><CheckCircle2 size={15} /> {l.chip}</span>
                )}
              </div>
            ))}
            {typing && <div className="ben-msg ben"><p className="bx-typing" aria-label="Ben piše"><i /><i /><i /></p></div>}
          </div>
          <form className="ben-composer" onSubmit={onSubmit}>
            <label htmlFor="hero-ask" className="sr-only">Pitajte Bena</label>
            <input id="hero-ask" value={input} onChange={e => setInput(e.target.value)} onFocus={() => setHold(true)} placeholder="Pitajte Bena, npr. trebam više klijenata" autoComplete="off" maxLength={300} />
            <button type="submit" aria-label="Pošalji" disabled={!input.trim()}><ArrowUp size={18} /></button>
          </form>
          <a href="tel:+38733258900" className="ben-call"><Phone size={14} /> Radije razgovor s ljudima? +387 33 258 900</a>
        </div>
      </div>
    </section>
  );
}
