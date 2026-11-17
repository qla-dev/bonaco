import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { asset } from '../lib/asset';
import { tr, useLang } from '../lib/i18n';
import { hl } from '../lib/hl';
import { SERVICES } from '../data/services';
import { CLIENTS } from '../data/clients';
import ServiceIcon from './ServiceIcon';

// Fotografije iz potvrđenog Drive foldera _Klijenti, uvijek u istom redu.
const WORK = [
  { src: '/media/asa-poslovnica.webp', name: 'ASA Banka', bs: 'Fotografija iz poslovnice ASA Banke', en: 'ASA Bank branch photography' },
  { src: '/media/symbol-tas-352.webp', name: 'Symbol', bs: 'Symbol TAS kolekcija', en: 'Symbol TAS collection' },
  { src: '/media/bh-posta-event.webp', name: 'BH Pošta', bs: 'BH Pošta, fotografija s događaja', en: 'BH Pošta event photography' },
  { src: '/media/summer-lounge-2026.webp', name: 'Summer Lounge', bs: 'Summer Lounge 2026, atmosfera događaja', en: 'Summer Lounge 2026 event atmosphere' },
];

export default function MarketingTabs() {
  const { lang, t, to } = useLang();
  const [params] = useSearchParams();
  const initial = SERVICES.findIndex(s => s.slug === params.get('usluga'));
  const [sel, setSel] = useState(initial >= 0 ? initial : 0);
  useEffect(() => { if (initial >= 0) setSel(initial); }, [initial]);

  const tabs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = tabs.current;
    const active = row?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const r = row.getBoundingClientRect(), a = active.getBoundingClientRect();
    if (a.left < r.left || a.right > r.right) row.scrollBy({left: a.left - r.left - (r.width - a.width) / 2, behavior: 'smooth'});
  }, [sel]);
  const s = SERVICES[sel];
  const x = tr(s, lang);

  return (
    <section className="section mkt2" id="marketing">
      <div className="container">
        {/* Klijenti: kompaktno, dio marketing cjeline */}
        <div className="mkt2-clients">
          <span className="mkt2-clients-label">{t('Klijenti sa kojima smo radili', 'Clients we have worked with')}</span>
          <div className="mq-row">
            <ul className="mq-track">
              {[...CLIENTS, ...CLIENTS].map((c, i) => (
                <li key={i} aria-hidden={i >= CLIENTS.length || undefined}>
                  <span className="medallion sm2" title={c.name}><img src={asset(c.logo)} alt={i < CLIENTS.length ? c.name : ''} loading="lazy" width="200" height="200" /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mkt2-top">
          <span className="eyebrow">Marketing</span>
          <h2>{hl(t('Full-service marketing, od ideje do *rezultata*', 'Full-service marketing, from idea to *results*'))}</h2>
        </div>

        <div ref={tabs} className="mkt2-tabs" role="tablist" aria-label={t('Usluge', 'Services')}>
          {SERVICES.map((v, i) => (
            <button key={v.slug} type="button" role="tab" id={`tab-${v.slug}`} aria-selected={i === sel} aria-controls="mkt2-panel"
              className={i === sel ? 'is-on' : ''} onClick={() => setSel(i)}>
              <span className="mkt2-tab-circle"><ServiceIcon slug={v.slug} size={24} /></span>
              <span className="mkt2-tab-label">{tr(v, lang).title}</span>
            </button>
          ))}
        </div>

        <div className="mkt2-body" role="tabpanel" id="mkt2-panel" aria-labelledby={`tab-${s.slug}`} key={s.slug}>
          <div className="mkt2-text">
            <div className="mkt2-head">
              <span className="mkt2-icon"><ServiceIcon slug={s.slug} size={28} /></span>
              <h3>{x.title}</h3>
            </div>
            <p className="mkt2-short">{x.short}</p>
            <p>{x.text}</p>
            <div className="btn-row">
              <Link to={`${to('/nase-usluge/')}#${s.slug}`} className="btn btn-glass mkt2-more-circle">{t('Više o usluzi', 'More about this service')} <ArrowRight size={16} /></Link>
            </div>
          </div>
          <ul className="mkt2-examples" aria-label={t('Fotografije naših klijenata', 'Client photography')}>
            {WORK.map(work => <li key={work.name} className="mkt2-ex">
              <figure>
                <span className="mkt2-blob"><img src={asset(work.src)} alt={work[lang]} loading="lazy" width="640" height="640" /></span>
                <figcaption className="mkt2-cap"><strong>{work.name}</strong></figcaption>
              </figure>
            </li>)}
          </ul>
        </div>


      </div>
    </section>
  );
}
