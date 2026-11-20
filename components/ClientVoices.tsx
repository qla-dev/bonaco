import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { asset } from '../lib/asset';

// Published entries are short paraphrases; Summer and Omega remain editorial drafts.
const proposals = [
  { name: 'Summer Lounge', mark: 'summer', logo: '/media/clients/summer-logo-trim-v8.png', draft: true, bs: 'Fotografije i video prenose energiju programa i atmosferu ljeta.', en: 'Photography and film capture the energy of our summer programme.' },
  { name: 'Sarajevska Pivnica', mark: 'pivnica', logo: '/img/clients/pivnica-hs.webp', draft: false, bs: 'Stručna podrška Google Ads kampanji i veća vidljivost naše poruke.', en: 'Expert support for our Google Ads campaign, bringing our message to more people.' },
  { name: 'Wine Shop Sarajevo', mark: 'wine', logo: '/media/clients/wine-shop-original-white-v8.png', draft: false, bs: 'Kreativne objave i dizajn koji prenose našu priču i privlače kupce.', en: 'Creative posts and design that tell our story and attract customers.' },
  { name: 'Omega', mark: 'omega', logo: '/media/clients/omega-logo-trim-v8.png', draft: true, bs: 'Fotografije i sadržaj povezuju brendove, čuvajući karakter svakog od njih.', en: 'Photography and content connect our brands while keeping each one distinctive.' },
  { name: 'ROOMS.hr', mark: 'rooms', logo: '/media/clients/rooms.webp', draft: false, bs: 'Dizajn i digitalni marketing pomogli su nam izgraditi prepoznatljiv brend.', en: 'Design and digital marketing helped us build a recognisable brand.' },
];

export default function ClientVoices() {
  const { t, lang } = useLang();
  const [paused, setPaused] = useState(false);
  return <section className={'client-voices' + (paused ? ' is-paused' : '')} aria-label={t('Priče o saradnji', 'Client collaborations')}>
    <div className="ref-wrap voices-heading"><p className="ref-eyebrow">{t('U našem krugu', 'Shared ideas')}</p><h2>{t('Priče o saradnji.', 'Built on collaboration.')}</h2><p className="voices-disclosure">{t('Sažeci objavljenih izjava. Novi prijedlozi označeni su kao nacrt.', 'Summaries of published testimonials. New proposals are marked as drafts.')}</p></div>
    <div className="voices-viewport"><div className="voices-track">{[0, 1].map(copy => <div className="voices-group" key={copy} aria-hidden={copy === 1 || undefined}>{proposals.map(item => <article className="voice-circle" key={item.name}>
      <div className={'voice-brandmark voice-brandmark-' + item.mark}><img src={asset(item.logo)} alt="" loading="lazy" decoding="async" width="200" height="200" /></div><p>{item[lang]}</p><h3>{item.name}</h3><span className="voice-draft">{item.draft ? t('Nacrt za potvrdu', 'Draft for approval') : t('Sažetak izjave', 'Testimonial summary')}</span>
    </article>)}</div>)}</div></div>
    <button className="voices-pause" type="button" aria-pressed={paused} aria-label={paused ? t('Pokreni izjave', 'Play testimonials') : t('Pauziraj izjave', 'Pause testimonials')} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}<span className="voices-pause-label">{paused ? t('Pokreni', 'Play') : t('Pauziraj', 'Pause')}</span></button>
  </section>;
}
