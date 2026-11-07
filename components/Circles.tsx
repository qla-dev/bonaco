// Kružni sistem iz briefa v1.3: krug iz znaka "B." nosi marketing radove, logotipe klijenata,
// pet Bonexis kapsula i BonEvents. Tekst je uvijek uz krug (ne zaključan u malom krugu),
// sve radi na dodir i tastaturu, a kontinuirane animacije se mogu zaustaviti.
import { useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Gift, Pause, Play, Sparkles, Wrench } from 'lucide-react';
import { asset } from '../lib/asset';
import { tr, useLang } from '../lib/i18n';
import { CATEGORY_EN, PROJECTS } from '../data/projects';
import { SERVICES } from '../data/services';
import { CLIENTS } from '../data/clients';
import { MARKETING_VIDEO, VIDEOS } from '../data/site';
import { PUBLIC_CAPSULES } from '../data/capsules';
import { EVENT_HERO_IMAGE, EVENT_REFERENCES, EVENT_SERVICES } from '../data/bonevents';
import ServiceIcon from './ServiceIcon';
import BrandIcon, { type IconName } from './BrandIcon';
import BrandLogo, { QlaMark } from './BrandLogo';
import { YouTube } from './Blocks';
import { hl } from '../lib/hl';

/* ---------- Marketing: usluge kao mali krugovi ---------- */
export function ServiceCircles() {
  const { lang, to } = useLang();
  return (
    <ul className="svc-circles">
      {SERVICES.map(s => {
        const x = tr(s, lang);
        return (
          <li key={s.slug}>
            <Link to={to(`/?usluga=${s.slug}#marketing`)}>
              <span className="svc-dot"><ServiceIcon slug={s.slug} size={22} /></span>
              <span>{x.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Marketing: radovi u krugovima različitih veličina ---------- */
const SIZES = ['xl', 'm', 'l', 's', 'l', 'm', 's', 'm'];
export function WorkCircles({ limit = 6 }: { limit?: number }) {
  const { lang, to } = useLang();
  return (
    <ul className="work-circles">
      {PROJECTS.slice(0, limit).map((p, i) => {
        const x = tr(p, lang);
        const cats = p.categories.map(c => (lang === 'en' ? CATEGORY_EN[c] ?? c : c)).join(' · ');
        return (
          <li key={p.slug} className={`wc wc-${SIZES[i % SIZES.length]}`}>
            <Link to={to(`/portfolio/${p.slug}/`)} className="wc-link">
              <span className="wc-circle"><img src={asset(p.cover)} alt={x.coverAlt} loading="lazy" /></span>
              <span className="wc-label"><strong>{p.client}</strong><small>{cats}</small></span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Video 1: informativni marketing video, na klik ---------- */
export function MarketingVideo() {
  const { lang, t } = useLang();
  const src = MARKETING_VIDEO[lang];
  const captions = lang === 'en' ? MARKETING_VIDEO.captionsEn : MARKETING_VIDEO.captionsBs;
  if (!src) return <YouTube id={VIDEOS.showreel} title={t('Bonaco Media – pogledajte naš rad', 'Bonaco Media – see our work')} />;
  return (
    <div className="video">
      <video controls preload="none" playsInline poster={asset(MARKETING_VIDEO.poster) || undefined}>
        <source src={asset(src)} type="video/mp4" />
        {captions && <track kind="captions" src={asset(captions)} srcLang={lang} label={lang === 'en' ? 'English' : 'Bosanski'} default />}
      </video>
    </div>
  );
}

/* ---------- Klijenti: dvije trake kružnih medaljona ---------- */
const CLIENT_PROJECT: Record<string, string> = {
  beautyco: 'beautyco', rooms: 'rooms-hr', 'bh-travel': 'bh-travel', 'summer-lounge': 'summer-lounge', 'max-media': 'max-media',
};

function Medallion({ c, hidden, small }: { c: { id: string; name: string }; hidden?: boolean; small?: boolean }) {
  const { to } = useLang();
  const img = <img src={asset(`/img/clients/${c.id}.webp`)} alt={hidden ? '' : c.name} loading="lazy" width="200" height="200" />;
  const cls = `medallion ${small ? 'sm' : ''}`;
  const slug = CLIENT_PROJECT[c.id];
  return slug ? (
    <Link to={to(`/portfolio/${slug}/`)} className={`${cls} is-link`} tabIndex={hidden ? -1 : undefined} title={c.name}>{img}</Link>
  ) : (
    <span className={cls} title={c.name}>{img}</span>
  );
}

export function ClientsMarquee() {
  const { t } = useLang();
  const [paused, setPaused] = useState(false);
  const [all, setAll] = useState(false);
  const half = Math.ceil(CLIENTS.length / 2);
  const rows = [CLIENTS.slice(0, half), CLIENTS.slice(half)];
  return (
    <section className="section clients" aria-labelledby="clients-title">
      <div className="container section-head">
        <div>
          <h2 id="clients-title">{hl(t('Brendovi s kojima smo *sarađivali*', 'Brands we have *worked* with'))}</h2>
          <p className="lead">{hl(t('Od **lokalnih brendova** do **regionalnih kompanija**.', 'From **local brands** to **regional companies**.'))}</p>
        </div>
        <button type="button" className="mq-toggle" onClick={() => setPaused(p => !p)} aria-pressed={paused}
          aria-label={paused ? t('Pokreni kretanje logotipa', 'Play logo motion') : t('Zaustavi kretanje logotipa', 'Stop logo motion')}>
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      </div>
      <div className={`marquee ${paused ? 'is-paused' : ''}`}>
        {rows.map((row, k) => (
          <div key={k} className={`mq-row ${k ? 'mq-rev' : ''}`}>
            <ul className="mq-track">
              {[...row, ...row].map((c, i) => (
                <li key={i} aria-hidden={i >= row.length || undefined}><Medallion c={c} hidden={i >= row.length} /></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container clients-all">
        <button type="button" className="text-link" onClick={() => setAll(a => !a)} aria-expanded={all} aria-controls="svi-klijenti">
          {all ? t('Sakrij listu', 'Hide list') : t('Pogledajte sve klijente', 'See all clients')} <ArrowRight size={16} />
        </button>
        {all && (
          <ul id="svi-klijenti" className="clients-list">
            {CLIENTS.map(c => <li key={c.id}><Medallion c={c} small hidden /><span>{c.name}</span></li>)}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ---------- Bonexis: centralni krug i pet kapsula ---------- */
export function BonexisCapsules({ page = false }: { page?: boolean }) {
  const { lang, t, to } = useLang();
  const [sel, setSel] = useState(0);
  const c = PUBLIC_CAPSULES[sel];
  const n = PUBLIC_CAPSULES.length;
  const Heading = page ? 'h1' : 'h2';

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (sel + d + n) % n;
    setSel(next);
    document.getElementById(`kapsula-${PUBLIC_CAPSULES[next].id}`)?.focus();
  };

  return (
    <section className={`section bxc ${page ? 'is-page' : ''}`} data-brand="bonexis" id="bonexis-kapsule">
      <div className="container">
        <div className="bxc-head">
          <div className="bxc-badges">
            <span className="badge"><Wrench size={14} aria-hidden="true" /> {t('U razvoju', 'In development')}</span>
            <span className="badge badge-ghost"><img className="badge-bonaco" src={asset('/img/logo/bonaco-word.webp')} alt="Bonaco" width="639" height="99" /> × <QlaMark /></span>
          </div>
          <Heading className="bxc-title"><BrandLogo brand="bonexis" /></Heading>
          <p className="lead">
            {hl(t(
              'Marketing CRM sa **sedam AI kapsula**: društvene mreže, SEO audit, blog, leadovi s AI sekretaricom, kapacitet, kontrola isporuke i revizija rada. Svaku kapsulu vodi njen **owner agent**, a **odluke uvijek ostaju na vama**.',
              'A marketing CRM with **seven AI capsules**: social media, SEO audit, blog, leads with an AI assistant, capacity, delivery control and work audit. Each capsule is run by its **owner agent**, and **decisions always stay with you**.',
            ))}
          </p>
        </div>

        <div className="bxc-grid">
          <div className="bxc-orbit" role="tablist" aria-label={t('Bonexis kapsule', 'Bonexis capsules')} onKeyDown={onKey}>
            <span className="bxc-core" aria-hidden="true">BONEXIS<i /></span>
            {PUBLIC_CAPSULES.map((x, i) => (
              <button
                key={x.id}
                id={`kapsula-${x.id}`}
                type="button"
                role="tab"
                aria-selected={i === sel}
                aria-controls="kapsula-panel"
                tabIndex={i === sel ? 0 : -1}
                className={`bxc-cap ${i === sel ? 'is-on' : ''}`}
                style={{ ['--a' as string]: `${(360 / n) * i - 90}deg` }}
                onClick={() => setSel(i)}
              >
                <span className="bxc-cap-circle"><BrandIcon name={`k${x.n}` as IconName} size={20} /><b>{String(i + 1).padStart(2, '0')}</b>{x.short}</span>
              </button>
            ))}
          </div>

          <div className="bxc-panel" role="tabpanel" id="kapsula-panel" aria-labelledby={`kapsula-${c.id}`} key={c.id}>
            <span className="bxc-n">{t('Kapsula', 'Capsule')} {sel + 1} / {n}</span>
            <h3>{c.name}</h3>
            <p className="bxc-owner">Owner agent: <strong>{c.persona}</strong>{c.assistant && <>{t(', uz AI sekretaricu ', ', with AI assistant ')}<strong>{c.assistant}</strong></>}</p>
            <dl>
              <div><dt><Sparkles size={14} aria-hidden="true" /> {t('Šta radi', 'What it does')}</dt><dd>{c.does[lang]}</dd></div>
              <div><dt><Gift size={14} aria-hidden="true" /> {t('Šta dobijate', 'What you get')}</dt><dd>{c.gets[lang]}</dd></div>
              <div><dt><Clock size={14} aria-hidden="true" /> Status</dt><dd>{t('U razvoju, predstavljanje planirano za januar 2027.', 'In development, launch planned for January 2027.')}</dd></div>
            </dl>
            <div className="btn-row">
              {page ? (
                <Link to={`${to('/kontakt/')}?usluga=Bonexis`} className="btn btn-primary">{t('Prijavite se za predstavljanje', 'Sign up for the launch')}</Link>
              ) : (
                <Link to={to('/bonexis/')} className="btn btn-primary">{t('Saznajte više', 'Learn more')} <ArrowRight size={18} /></Link>
              )}
            </div>
          </div>
        </div>
        <p className="bxc-note">
          {t(
            'Opisi kapsula su koncept u razvoju s partnerom qla.dev; konačne funkcije potvrđujemo prije predstavljanja.',
            'Capsule descriptions are a concept in development with our partner qla.dev; final features will be confirmed before launch.',
          )}
        </p>
      </div>
    </section>
  );
}

/* ---------- BonEvents: veliki krug s event kadrom, usluge i reference ---------- */
export function BonEventsBlock({ page = false }: { page?: boolean }) {
  const { lang, t, to } = useLang();
  const Heading = page ? 'h1' : 'h2';
  return (
    <section className={`section bev ${page ? 'is-page' : ''}`} data-brand="bonevents" id="bonevents">
      <div className="container bev-grid">
        <div className="bev-visual">
          <span className="bev-hero"><img src={asset(EVENT_HERO_IMAGE)} alt={t('Publika i DJ nastup na Summer Lounge eventu', 'Crowd and DJ set at a Summer Lounge event')} loading={page ? 'eager' : 'lazy'} /></span>
          <span className="bev-ring" aria-hidden="true" />
        </div>
        <div className="bev-copy">
          <Heading className="bev-title"><BrandLogo brand="bonevents" /></Heading>
          <p className="lead">
            {hl(t(
              'Događaji koje ljudi **pamte**: **planiramo, produciramo i promovišemo** evente za brendove, od **poslovnih okupljanja** do **ljetnih sezona**.',
              'Events people **remember**: we **plan, produce and promote** events for brands, from **business gatherings** to **summer seasons**.',
            ))}
          </p>
          <ul className="bev-services">
            {EVENT_SERVICES.map(s => (
              <li key={s.id}>
                <span className="bev-dot" aria-hidden="true"><BrandIcon name={s.icon} size={20} /></span>
                <div><h3>{s[lang].title}</h3><p>{s[lang].text}</p></div>
              </li>
            ))}
          </ul>
          <h3 className="bev-refs-title">{t('Reference', 'References')}</h3>
          <ul className="bev-refs">
            {EVENT_REFERENCES.map(r => {
              const inner = (
                <>
                  <span className="bev-ref-circle">{r.image ? <img src={asset(r.image)} alt="" loading="lazy" /> : <b>{r.name}</b>}</span>
                  <span><strong>{r.name}</strong><small>{r[lang].scope}</small><span>{r[lang].text}</span></span>
                </>
              );
              return <li key={r.id}>{r.project ? <Link to={to(`/portfolio/${r.project}/`)} className="bev-ref">{inner}</Link> : <div className="bev-ref">{inner}</div>}</li>;
            })}
          </ul>
          <div className="btn-row">
            {page ? (
              <Link to={`${to('/kontakt/')}?usluga=BonEvents`} className="btn btn-primary">{t('Pošaljite upit za event', 'Send an event inquiry')}</Link>
            ) : (
              <Link to={to('/bonevents/')} className="btn btn-primary">{t('Upoznajte BonEvents', 'Discover BonEvents')} <ArrowRight size={18} /></Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
