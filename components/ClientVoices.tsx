import { useState } from 'react';
import { Pause, Play, Quote } from 'lucide-react';
import { useLang } from '../lib/i18n';

// Editorial proposals requested for the review site, not quotations received from clients.
const proposals = [
  { name: 'Summer Lounge', bs: 'Željeli smo da se energija Summer Loungea osjeti i prije dolaska na događaj. Najave, vizuali i video sadržaj povezani su u prepoznatljivu ljetnu priču, od programa do atmosfere na platou.', en: 'We wanted people to feel the energy of Summer Lounge before arriving. Announcements, visuals and video connect the programme and atmosphere into a recognisable summer story.' },
  { name: 'Sarajevska pivara', bs: 'Za kampanju nam je bila važna jasna poruka i pažljivo odabrana publika. Bonacov pristup povezuje kreativnu ideju s digitalnim kanalima, uz preglednu komunikaciju kroz pripremu i realizaciju.', en: 'A clear message and a carefully selected audience mattered to our campaign. Bonaco’s approach connects the creative idea with digital channels and clear communication throughout preparation and delivery.' },
  { name: 'Wine Shop Sarajevo', bs: 'Naš sadržaj treba prenijeti karakter vina i iskustvo koje nudimo. Kroz fotografiju, dizajn i komunikaciju na društvenim mrežama, priča Wine Shopa dobija dosljedan i prepoznatljiv izraz.', en: 'Our content needs to convey the character of the wines and the experience we offer. Photography, design and social communication give Wine Shop’s story a consistent and recognisable expression.' },
  { name: 'Omega', bs: 'Više brendova traži jasan plan, ali i osjećaj za njihov različit karakter. Produktne fotografije, vizuali i sadržaj za mreže povezani su tako da svaki brend zadrži svoj prepoznatljiv glas.', en: 'Working with several brands requires a clear plan and sensitivity to their different identities. Product photography, visuals and social content are connected while each brand keeps its own voice.' },
];

export default function ClientVoices() {
  const { t, lang } = useLang();
  const [paused, setPaused] = useState(false);
  return <section className={'client-voices' + (paused ? ' is-paused' : '')} aria-label={t('Prijedlozi svjedočenja klijenata', 'Draft client testimonials')}>
    <div className="ref-wrap voices-heading"><p className="ref-eyebrow">{t('U našem krugu', 'In our circle')}</p><h2>{t('Priče o saradnji.', 'Stories of working together.')}</h2><p className="voices-disclosure">{t('Prijedlozi izjava — čekaju potvrdu klijenata.', 'Proposed testimonials — awaiting client confirmation.')}</p></div>
    <div className="voices-viewport"><div className="voices-track">{[0, 1].map(copy => <div className="voices-group" key={copy} aria-hidden={copy === 1 || undefined}>{proposals.map(item => <article className="voice-circle" key={item.name}>
      <Quote size={23} aria-hidden="true" /><span className="voice-draft">{t('Nacrt za potvrdu', 'Draft for approval')}</span><p>{item[lang]}</p><h3>{item.name}</h3>
    </article>)}</div>)}</div></div>
    <button className="voices-pause" type="button" aria-pressed={paused} aria-label={paused ? t('Pokreni izjave', 'Play testimonials') : t('Pauziraj izjave', 'Pause testimonials')} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? t('Pokreni', 'Play') : t('Pauziraj', 'Pause')}</button>
  </section>;
}
