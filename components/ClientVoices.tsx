import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { asset } from '../lib/asset';

// Editorial proposals requested for the review site, not quotations received from clients.
const proposals = [
  { name: 'Summer Lounge', mark: 'summer', logo: '/media/clients/summer-logo-trim-v8.png', bs: 'Najave, fotografije i video prenose energiju našeg programa i prepoznatljivu atmosferu ljeta.', en: 'From the first announcement to the final film, our content captures the energy of summer.' },
  { name: 'Sarajevska pivara', mark: 'pivara', logo: '/media/clients/pivara-logo-trim-v8.png', bs: 'Jasna poruka, kreativna ideja i pažljivo odabrana publika povezuju svaki korak naše kampanje.', en: 'Clear ideas, a focused message and the right audience bring each part of our campaign together.' },
  { name: 'Wine Shop Sarajevo', mark: 'wine', logo: '/media/clients/wine-shop-original-white-v8.png', bs: 'Fotografija, dizajn i društvene mreže pričaju priču naših vina, s pažnjom prema svakom detalju.', en: 'Photography, design and social media tell the story of our wines, with care in every detail.' },
  { name: 'Omega', mark: 'omega', logo: '/media/clients/omega-logo-trim-v8.png', bs: 'Produktne fotografije i sadržaj za mreže povezuju naše brendove, uz prepoznatljiv karakter svakog od njih.', en: 'Product photography and social content bring our brands together while keeping each one distinctive.' },
];

export default function ClientVoices() {
  const { t, lang } = useLang();
  const [paused, setPaused] = useState(false);
  return <section className={'client-voices' + (paused ? ' is-paused' : '')} aria-label={t('Prijedlozi svjedočenja klijenata', 'Draft client testimonials')}>
    <div className="ref-wrap voices-heading"><p className="ref-eyebrow">{t('U našem krugu', 'Shared ideas')}</p><h2>{t('Priče o saradnji.', 'Built on collaboration.')}</h2><p className="voices-disclosure">{t('Prijedlozi izjava — čekaju potvrdu klijenata.', 'Proposed testimonials — awaiting client confirmation.')}</p></div>
    <div className="voices-viewport"><div className="voices-track">{[0, 1].map(copy => <div className="voices-group" key={copy} aria-hidden={copy === 1 || undefined}>{proposals.map(item => <article className="voice-circle" key={item.name}>
      <div className={'voice-brandmark voice-brandmark-' + item.mark}><img src={asset(item.logo)} alt="" loading="lazy" decoding="async" width="200" height="200" /></div><span className="voice-draft">{t('Nacrt za potvrdu', 'Draft for approval')}</span><p>{item[lang]}</p><h3>{item.name}</h3>
    </article>)}</div>)}</div></div>
    <button className="voices-pause" type="button" aria-pressed={paused} aria-label={paused ? t('Pokreni izjave', 'Play testimonials') : t('Pauziraj izjave', 'Pause testimonials')} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? t('Pokreni', 'Play') : t('Pauziraj', 'Pause')}</button>
  </section>;
}
