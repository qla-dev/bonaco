import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { asset } from '../lib/asset';

// Editorial proposals requested for the review site, not quotations received from clients.
const proposals = [
  { name: 'Summer Lounge', mark: 'summer', logo: '/media/clients/SummerLounge.png', bs: 'Energija događaja počinje prije dolaska. Najave, vizuali i video povezuju naš program i atmosferu u prepoznatljivu ljetnu priču.', en: 'The energy starts before guests arrive. Announcements, visuals and video connect our programme and atmosphere into a recognisable summer story.' },
  { name: 'Sarajevska pivara', mark: 'pivara', logo: '/img/clients/sarajevska-pivara.webp', bs: 'Jasna poruka i pažljivo odabrana publika. Kreativna ideja i digitalni kanali povezani su kroz preglednu pripremu i realizaciju kampanje.', en: 'A clear message and a carefully chosen audience. Creative ideas and digital channels connect through a focused campaign, from preparation to delivery.' },
  { name: 'Wine Shop Sarajevo', mark: 'wine', logo: '/img/testimonials/wine-shop.webp', bs: 'Karakter vina zaslužuje svoju priču. Fotografija, dizajn i društvene mreže daju našem sadržaju dosljedan i prepoznatljiv izraz.', en: 'Every wine has a story to tell. Photography, design and social media give our content a consistent and recognisable expression.' },
  { name: 'Omega', mark: 'omega', logo: '/media/clients/Omega.png', bs: 'Više brendova, svaki sa svojim karakterom. Produktne fotografije, vizuali i sadržaj za mreže prate jasan plan i čuvaju njihov prepoznatljiv glas.', en: 'Several brands, each with its own character. Product photography, visuals and social content follow a clear plan while preserving each distinctive voice.' },
];

export default function ClientVoices() {
  const { t, lang } = useLang();
  const [paused, setPaused] = useState(false);
  return <section className={'client-voices' + (paused ? ' is-paused' : '')} aria-label={t('Prijedlozi svjedočenja klijenata', 'Draft client testimonials')}>
    <div className="ref-wrap voices-heading"><p className="ref-eyebrow">{t('U našem krugu', 'In our circle')}</p><h2>{t('Priče o saradnji.', 'Stories of working together.')}</h2><p className="voices-disclosure">{t('Prijedlozi izjava — čekaju potvrdu klijenata.', 'Proposed testimonials — awaiting client confirmation.')}</p></div>
    <div className="voices-viewport"><div className="voices-track">{[0, 1].map(copy => <div className="voices-group" key={copy} aria-hidden={copy === 1 || undefined}>{proposals.map(item => <article className="voice-circle" key={item.name}>
      <div className={'voice-brandmark voice-brandmark-' + item.mark}><img src={asset(item.logo)} alt="" loading="lazy" decoding="async" width="200" height="200" /></div><span className="voice-draft">{t('Nacrt za potvrdu', 'Draft for approval')}</span><p>{item[lang]}</p><h3>{item.name}</h3>
    </article>)}</div>)}</div></div>
    <button className="voices-pause" type="button" aria-pressed={paused} aria-label={paused ? t('Pokreni izjave', 'Play testimonials') : t('Pauziraj izjave', 'Pause testimonials')} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? t('Pokreni', 'Play') : t('Pauziraj', 'Pause')}</button>
  </section>;
}
