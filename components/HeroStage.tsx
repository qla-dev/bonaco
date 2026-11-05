import { asset } from '../lib/asset';
// Interaktivni hero: odabir usluge mijenja "pozornicu" sa stvarnim Bonaco radovima.
// Slojevi prate kursor (dubina), a pozornica se sama mijenja dok posjetilac ne klikne.
import { useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Play } from 'lucide-react';
import { GALLERIES } from '../data/galleries.generated';
import ServiceIcon from './ServiceIcon';

const sl = GALLERIES['summer-lounge'] ?? [];
const bc = GALLERIES['beautyco'] ?? [];
const bh = GALLERIES['bh-travel'] ?? [];

interface Stage { id: string; icon: string; label: string; to: string; caption: string; render: () => ReactNode }

const layer = (depth: number, cls: string, children: ReactNode) => (
  <div className={`stage-layer ${cls}`} style={{ '--d': depth } as CSSProperties}>{children}</div>
);

function PhoneFeed({ images }: { images: string[] }) {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const feed = [...images, ...images];
  return (
    <div className="phone">
      <div className="phone-bar">
        <img src={asset('/img/logo/bonaco-b.webp')} alt="" />
        <strong>bonacomedia</strong>
      </div>
      <div className="phone-feed">
        <div className="phone-track">
          {feed.map((src, i) => (
            <div key={i} className="phone-post">
              <img src={asset(src)} alt="" loading="lazy" />
              <button
                type="button"
                className={`like ${liked[i % images.length] ? 'is-on' : ''}`}
                onClick={() => setLiked(l => ({ ...l, [i % images.length]: !l[i % images.length] }))}
                aria-label="Sviđa mi se"
                aria-pressed={!!liked[i % images.length]}
              >
                <Heart size={18} fill={liked[i % images.length] ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STAGES: Stage[] = [
  {
    id: 'social', icon: 'drustvene-mreze', label: 'Društvene mreže', to: '/nase-usluge/#drustvene-mreze',
    caption: 'Sadržaj i vođenje profila za Summer Lounge i BeautyCO',
    render: () => (
      <>
        {layer(0.35, 'l-back', <img src={asset('/img/projects/summer-lounge/mockup.webp')} alt="Instagram objave za Summer Lounge" />)}
        {layer(0.9, 'l-phone', <PhoneFeed images={[bc[1]?.thumb, sl[2]?.thumb, bc[3]?.thumb, sl[6]?.thumb, bc[5]?.thumb].filter(Boolean) as string[]} />)}
        {layer(1.3, 'l-chip chip-a', <span><Heart size={14} fill="currentColor" /> Kliknite srce na objavi</span>)}
      </>
    ),
  },
  {
    id: 'web', icon: 'web-dizajn', label: 'Web dizajn', to: '/nase-usluge/#web-dizajn',
    caption: 'Web stranice za Bunjo Grupaciju, Max Media i Skuter',
    render: () => (
      <>
        {layer(0.3, 'l-back', <img src={asset('/img/projects/max-media/mockup.webp')} alt="Web stranica Max Media" />)}
        {layer(0.7, 'l-main', <img src={asset('/img/projects/bunjo/mockup.webp')} alt="Web stranica Bunjo Grupacije" />)}
        {layer(1.2, 'l-front', <img src={asset('/img/projects/skuter/mockup.webp')} alt="Web stranica Skuter" />)}
      </>
    ),
  },
  {
    id: 'foto', icon: 'foto-video', label: 'Foto i video', to: '/nase-usluge/#foto-video',
    caption: 'Fotografija vozila za BH Travel i proizvoda za BeautyCO',
    render: () => (
      <>
        {layer(0.3, 'l-back', <img src={asset(bc[0]?.thumb)} alt="Produktna fotografija BeautyCO" />)}
        {layer(0.7, 'l-main', <img src={asset(bh[0]?.thumb)} alt="Vozila BH Travel" />)}
        {layer(1.2, 'l-front l-video', <><img src={asset(bh[2]?.thumb)} alt="" /><span className="play"><Play size={20} fill="currentColor" /></span></>)}
      </>
    ),
  },
  {
    id: 'event', icon: 'event-management', label: 'Eventi', to: '/nase-usluge/#event-management',
    caption: 'Ljetna sezona na Platou Skenderija za Summer Lounge',
    render: () => (
      <>
        {layer(0.3, 'l-back', <img src={asset(sl[4]?.thumb)} alt="" />)}
        {layer(0.7, 'l-main', <img src={asset(sl[0]?.thumb)} alt="DJ nastup na Summer Lounge eventu" />)}
        {layer(1.2, 'l-front', <img src={asset(sl[8]?.thumb)} alt="" />)}
      </>
    ),
  },
  {
    id: 'dizajn', icon: 'graficki-dizajn', label: 'Grafički dizajn', to: '/nase-usluge/#graficki-dizajn',
    caption: 'Vizuali za ROOMS.hr i BeautyCO',
    render: () => (
      <>
        {layer(0.35, 'l-back', <img src={asset('/img/projects/beautyco/mockup.webp')} alt="Dizajn objava za BeautyCO" />)}
        {layer(0.8, 'l-main', <img src={asset('/img/projects/rooms/mockup.webp')} alt="Vizuali za ROOMS.hr" />)}
      </>
    ),
  },
  {
    id: 'bonexis', icon: 'bonexis', label: 'Bonexis AI', to: '/bonexis/',
    caption: 'Šest AI agenata koji rade za vaš biznis 0–24',
    render: () => (
      <>
        {layer(0.35, 'l-back l-glow', <div className="glow-orb" />)}
        {layer(0.8, 'l-chat', (
          <div className="mini-chat">
            <p className="b-user">Trebam više klijenata.</p>
            <p className="b-ai">AI Leads je pronašao 24 firme koje odgovaraju vašem profilu i pripremio prve poruke.</p>
            <p className="b-user">Može li neko i da ih nazove?</p>
            <p className="b-ai">AI Sekretarica zove s vašeg broja i zakazuje sastanke.</p>
          </div>
        ))}
        {layer(1.3, 'l-chip chip-b', <span><Phone size={14} /> Termin zakazan: utorak u 10:00</span>)}
      </>
    ),
  },
];

const AUTOPLAY_MS = 5200;

export default function HeroStage() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const stageRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = stageRef.current!;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const my = ((e.clientY - r.top) / r.height) * 2 - 1;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => { el.style.setProperty('--mx', mx.toFixed(3)); el.style.setProperty('--my', my.toFixed(3)); });
  };
  const onLeave = () => { stageRef.current?.style.setProperty('--mx', '0'); stageRef.current?.style.setProperty('--my', '0'); };

  const pick = (i: number) => { setAuto(false); setActive(i); };
  const s = STAGES[active];

  return (
    <div className="hero-stage-wrap">
      <div className="service-pills" role="tablist" aria-label="Odaberite uslugu">
        {STAGES.map((st, i) => (
          <button
            key={st.id}
            role="tab"
            aria-selected={i === active}
            aria-controls="hero-stage"
            className={`service-pill ${i === active ? 'is-on' : ''}`}
            onClick={() => pick(i)}
            onMouseEnter={() => { if (!auto) setActive(i); }}
          >
            <ServiceIcon slug={st.icon} size={18} />
            {st.label}
            {auto && i === active && (
              <span className="pill-progress" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} onAnimationEnd={() => setActive(a => (a + 1) % STAGES.length)} />
            )}
          </button>
        ))}
      </div>
      <div className="stage" id="hero-stage" role="tabpanel" ref={stageRef} onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="stage-scene" key={s.id}>{s.render()}</div>
        <Link to={s.to} className="stage-caption">
          <span>{s.caption}</span>
          <strong>Saznajte više</strong>
        </Link>
      </div>
    </div>
  );
}
