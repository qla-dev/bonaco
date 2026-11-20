import { SITE } from '../data/site';
import { useLang } from '../lib/i18n';
export default function LocationStrip() {
 const {t}=useLang();
 return <section className="ref-wrap contact-location" aria-labelledby="location-title">
  <div className="contact-location-heading"><div><h2 id="location-title">{t('Gdje smo','Where we are')}</h2><p>{SITE.address.street} · Sarajevo</p></div><a className="ref-pill" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">{t('Upute do nas','Get directions')} <span aria-hidden="true">↗</span></a></div>
  <iframe title={t('Bonaco Media — mapa lokacije','Bonaco Media — location map')} src={SITE.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
 </section>;
}
