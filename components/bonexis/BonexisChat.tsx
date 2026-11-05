// Bonexis chat (izgled kao moderni AI chat: prekidač gore, pozdrav, pilula za unos).
// Odgovori su lokalni i skriptovani: prepoznaju problem i preporuče pravog AI agenta.
// Kad bude AI backend, zamijeniti funkciju answer() pozivom API-ja.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUp, Mic, Plus } from 'lucide-react';
import { BEN, BONEXIS_AGENTS } from '../../data/bonexis';

interface Msg { role: 'user' | 'ai'; text: string; agent?: number }

const SUGGESTIONS = [
  'Trebam više klijenata',
  'Kako da budem bolje rangiran na Googleu?',
  'Ko će odgovarati na pozive kad nismo tu?',
  'Stalno kasnimo s rokovima',
  'Imamo 80 stranica, kako ih sve provjeriti?',
];

const RULES: [number, RegExp][] = [
  [5, /poziv|telefon|zov|nazov|sekretar|termin|sastan|javlja/i],
  [2, /klijent|lead|kupc|prodaj|prilik|posao više|novih/i],
  [1, /seo|google|blog|ključn|pretra|rangir|organsk|tekst|članak/i],
  [0, /audit|pregled|provjer|stranic|vizual|greš|baner|dizajn/i],
  [4, /ugovor|ponud|obeća|isporu|dogovor|van ponude|nije urađen/i],
  [3, /kapacitet|tim|zaposlen|opterećen|raspored|zastoj|kasni|rok/i],
];

function answer(q: string): Msg {
  const hit = RULES.find(([, re]) => re.test(q));
  if (!hit) {
    return {
      role: 'ai',
      text: 'Ja sam Ben i vodim Bonexis tim od šest agenata: Vida radi audit vizuala, Selma blog i SEO, Lejla pronalazi klijente, Kenan planira kapacitete, Dino kontroliše isporuku, a Sara prima i obavlja pozive. Opišite problem svojim riječima, na primjer „trebam više klijenata“, i spojit ću vas s pravim agentom.',
    };
  }
  const a = BONEXIS_AGENTS[hit[0]];
  return { role: 'ai', agent: hit[0], text: `Za to je tu ${a.persona}, naš ${a.title} agent. ${a.desc}` };
}

type SR = { lang: string; interimResults: boolean; start: () => void; stop: () => void; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void };
const SpeechRec = typeof window !== 'undefined'
  ? ((window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }).SpeechRecognition
    ?? (window as unknown as { webkitSpeechRecognition?: new () => SR }).webkitSpeechRecognition)
  : undefined;

interface Props {
  onShowAgent?: (index: number) => void;
  onShowScenario?: (index: number) => void;
}

export default function BonexisChat({ onShowAgent, onShowScenario }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState(0); // broj prikazanih znakova zadnjeg AI odgovora
  const [menu, setMenu] = useState(false);
  const [listening, setListening] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const last = msgs[msgs.length - 1];
  const streaming = last?.role === 'ai' && shown < last.text.length;

  useEffect(() => {
    if (!streaming) return;
    const id = setInterval(() => setShown(n => Math.min(n + 3, last.text.length)), 16);
    return () => clearInterval(id);
  }, [streaming, last]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, shown, typing]);

  function send(text: string) {
    const q = text.trim();
    if (!q || typing || streaming) return;
    setMenu(false);
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setTyping(true);
    setTimeout(() => {
      const a = answer(q);
      setTyping(false);
      setShown(reduce ? a.text.length : 0);
      setMsgs(m => [...m, a]);
    }, reduce ? 0 : 650);
  }

  const onSubmit = (e: FormEvent) => { e.preventDefault(); send(input); };

  // Pitanje iz Ben prozora u heroju (/?pitanje=...#bonexis): postavi ga ovdje jednom
  const [params] = useSearchParams();
  const asked = params.get('pitanje');
  const handled = useRef<string | null>(null);
  useEffect(() => {
    if (!asked || handled.current === asked) return;
    handled.current = asked;
    send(asked);
    inputRef.current?.closest('.bx-chat')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asked]);

  function toggleMic() {
    if (!SpeechRec) return;
    if (listening) return;
    const rec = new SpeechRec();
    rec.lang = 'bs-BA';
    rec.interimResults = true;
    rec.onresult = e => setInput(Array.from(e.results).map(r => r[0].transcript).join(''));
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  const empty = msgs.length === 0;

  return (
    <div className={`bx-chat ${empty ? 'is-empty' : 'has-msgs'}`}>
      {empty ? (
        <h2 className="bx-greeting">Ja sam {BEN.name}. Koji problem da riješimo danas?</h2>
      ) : (
        <div className="bx-messages" ref={listRef} aria-live="polite">
          {msgs.map((m, i) => {
            const isLast = i === msgs.length - 1;
            const text = m.role === 'ai' && isLast ? m.text.slice(0, shown) : m.text;
            return (
              <div key={i} className={`bx-msg ${m.role}`}>
                {m.role === 'ai' && <span className="bx-avatar" aria-hidden="true">B</span>}
                <div className="bx-bubble">
                  <p>{text}</p>
                  {m.role === 'ai' && m.agent !== undefined && (!isLast || !streaming) && (
                    <>
                      <ul>{BONEXIS_AGENTS[m.agent].list.map(l => <li key={l}>{l}</li>)}</ul>
                      <div className="bx-actions">
                        <button type="button" className="bx-action" onClick={() => onShowAgent?.(m.agent!)}>Otvori {BONEXIS_AGENTS[m.agent].persona}</button>
                        <button type="button" className="bx-action" onClick={() => onShowScenario?.(m.agent!)}>Pogledajte scenarij</button>
                        <Link className="bx-action primary" to="/kontakt/?usluga=Bonexis">Zatražite demo</Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="bx-msg ai">
              <span className="bx-avatar" aria-hidden="true">B</span>
              <div className="bx-bubble bx-typing" aria-label={`${BEN.name} piše`}><i /><i /><i /></div>
            </div>
          )}
        </div>
      )}

      <form className="bx-composer" onSubmit={onSubmit}>
        <button type="button" className="bx-icon" aria-label="Prijedlozi pitanja" aria-expanded={menu} onClick={() => setMenu(v => !v)}>
          <Plus size={22} />
        </button>
        <label className="sr-only" htmlFor="bx-input">Pitajte {BEN.name}</label>
        <input
          id="bx-input"
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={listening ? 'Slušam…' : `Pitajte ${BEN.name}`}
          autoComplete="off"
          maxLength={300}
        />
        {SpeechRec && (
          <button type="button" className={`bx-icon ${listening ? 'is-live' : ''}`} aria-label="Govorite" onClick={toggleMic}>
            <Mic size={20} />
          </button>
        )}
        <button type="submit" className="bx-send" aria-label="Pošalji" disabled={!input.trim() || typing || streaming}>
          <ArrowUp size={20} />
        </button>
        {menu && (
          <div className="bx-menu" role="menu">
            {SUGGESTIONS.map(s => <button key={s} type="button" role="menuitem" onClick={() => send(s)}>{s}</button>)}
          </div>
        )}
      </form>

      {empty && (
        <div className="bx-suggestions">
          {SUGGESTIONS.slice(0, 4).map(s => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}
        </div>
      )}
    </div>
  );
}
