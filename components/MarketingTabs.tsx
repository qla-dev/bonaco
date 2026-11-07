// Marketing na početnoj (dorade v08): jedna sekcija s tabovima usluga.
// Desktop: tekst LIJEVO (sticky unutar sekcije), primjeri DESNO se smjenjuju pri kratkom skrolu.
// Tekst se mijenja tek kad se izabere drugi tab. Klijenti kompaktno na dnu iste cjeline.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { asset } from '../lib/asset';
import { tr, useLang } from '../lib/i18n';
import { hl } from '../lib/hl';
import { SERVICES } from '../data/services';
import { PROJECTS, CATEGORY_EN } from '../data/projects';
import { CLIENTS } from '../data/clients';
import ServiceIcon from './ServiceIcon';
import { MarketingVideo } from './Circles';

// Postojeći radovi po usluzi (2–3 primjera; "video" = postojeći showreel)
const EXAMPLES: Record<string, string[]> = {
  'strategija-kampanje': ['summer-lounge', 'rooms-hr', 'beautyco'],
  'drustvene-mreze': ['summer-lounge', 'beautyco', 'rooms-hr'],
  'graficki-dizajn': ['rooms-hr', 'summer-lounge'],
  'foto-video': ['video', 'bh-travel', 'beautyco'],
  'web-dizajn': ['bunjo-grupacija', 'max-media', 'beautyco'],
  seo: ['bunjo-grupacija', 'beautyco'],
  'ooh-dooh': ['max-media'],
};

export default function MarketingTabs() {
  const { lang, t, to } = useLang();
  const [params] = useSearchParams();
  const initial = SERVICES.findIndex(s => s.slug === params.get('usluga'));
  const [sel, setSel] = useState(initial >= 0 ? initial : 0);
  useEffect(() => { if (initial >= 0) setSel(initial); }, [initial]);

  const s = SERVICES[sel];
  const x = tr(s, lang);
  const examples = (EXAMPLES[s.slug] ?? []).slice(0, 3);
  const cat = (c: string) => (lang === 'en' ? CATEGORY_EN[c] ?? c : c);

  return (
    <section className="section mkt2" id="marketing">
      <div className="container">
        <div className="mkt2-top">
          <span className="eyebrow">Marketing</span>
          <h2>{hl(t('Full-service marketing, od ideje do *rezultata*', 'Full-service marketing, from idea to *results*'))}</h2>
        </div>

        <div className="mkt2-tabs" role="tablist" aria-label={t('Usluge', 'Services')}>
          {SERVICES.map((v, i) => (
            <button key={v.slug} type="button" role="tab" id={`tab-${v.slug}`} aria-selected={i === sel} aria-controls="mkt2-panel"
              className={i === sel ? 'is-on' : ''} onClick={() => setSel(i)}>
              <ServiceIcon slug={v.slug} size={18} />{tr(v, lang).title}
            </button>
          ))}
        </div>

        <div className="mkt2-body" role="tabpanel" id="mkt2-panel" aria-labelledby={`tab-${s.slug}`} key={s.slug}>
          <div className="mkt2-text">
            <span className="mkt2-icon"><ServiceIcon slug={s.slug} size={28} /></span>
            <h3>{x.title}</h3>
            <p>{x.short}</p>
            <div className="btn-row">
              <Link to={`${to('/kontakt/')}?usluga=${encodeURIComponent(s.title)}`} className="btn btn-primary">{t('Zatražite ponudu', 'Request a quote')}</Link>
              <Link to={to('/portfolio/')} className="btn btn-glass">{t('Svi radovi', 'All work')} <ArrowRight size={16} /></Link>
            </div>
          </div>
          <ul className="mkt2-examples">
            {examples.map(id => {
              if (id === 'video') {
                return <li key={id} className="mkt2-ex mkt2-ex-video"><MarketingVideo /><span className="mkt2-cap"><strong>Showreel</strong><small>{t('Foto i video produkcija', 'Photo and video production')}</small></span></li>;
              }
              const p = PROJECTS.find(q => q.slug === id);
              if (!p) return null;
              const px = tr(p, lang);
              return (
                <li key={id} className="mkt2-ex">
                  <Link to={to(`/portfolio/${p.slug}/`)}>
                    <span className="mkt2-blob"><img src={asset(p.cover)} alt={px.coverAlt} loading="lazy" /></span>
                    <span className="mkt2-cap"><strong>{p.client}</strong><small>{p.categories.map(cat).join(' · ')}</small></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Klijenti: kompaktno, dio marketing cjeline */}
        <div className="mkt2-clients">
          <span className="mkt2-clients-label">{t('Brendovi s kojima smo sarađivali', 'Brands we have worked with')}</span>
          <div className="mq-row">
            <ul className="mq-track">
              {[...CLIENTS, ...CLIENTS].map((c, i) => (
                <li key={i} aria-hidden={i >= CLIENTS.length || undefined}>
                  <span className="medallion sm2" title={c.name}><img src={asset(`/img/clients/${c.id}.webp`)} alt={i < CLIENTS.length ? c.name : ''} loading="lazy" width="200" height="200" /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
