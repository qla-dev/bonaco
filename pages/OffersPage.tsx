import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO';
import BrandLogo from '../components/BrandLogo';
import PoslovniOglasiLogo from '../components/PoslovniOglasiLogo';
import { ContactBand } from '../components/ReferenceSections';
import { NAV_OFFER } from '../data/site';
import { useLang } from '../lib/i18n';
import { asset } from '../lib/asset';

export default function OffersPage() {
  const { t, to } = useLang();
  const offers = [
    {
      ...NAV_OFFER[0], brand: 'bonaco' as const, name: 'Bonaco marketing',
      title: t('Da vas primijete. I zapamte.', 'Be seen. Be remembered.'),
      text: t('Strategija, dizajn, sadržaj i oglašavanje povezani u prepoznatljivu priču vašeg brenda.', 'Strategy, design, content and advertising brought together to tell your brand’s story.'),
      tags: t('Strategija · Kreativa · Produkcija', 'Strategy · Creative · Production'),
      image: '/media/portfolio/symbol-tas-shirt-design-v8.webp',
      alt: t('Symbol TAS, grafički dizajn majice', 'Symbol TAS T-shirt design'), position: '50% 52%',
    },
    {
      ...NAV_OFFER[1], brand: 'bonexis' as const, name: 'Bonexis',
      title: t('Novi prostor za pametniji rad.', 'A new way to work smarter.'),
      text: t('Poslovna AI rješenja koja razvijamo u saradnji s qla.dev. Nova priča u Bonaco krugu — uskoro sa vama.', 'Business AI solutions in development with qla.dev. A new chapter in the Bonaco family — coming soon.'),
      tags: t('Poslovni AI · Uskoro', 'Business AI · Coming soon'), image: '', alt: '', position: '',
    },
    {
      ...NAV_OFFER[2], brand: null, name: 'Poslovni oglasi',
      title: t('Pravi ljudi. Nova prilika.', 'The right people. A new opportunity.'),
      text: t('Naš partner za povezivanje poslodavaca i kandidata. Predstavite otvorene pozicije i pronađite ljude za svoj tim.', 'Our partner for connecting employers and candidates. Share your open roles and find people for your team.'),
      tags: t('Partnerska platforma · Zapošljavanje', 'Partner platform · Recruitment'),
      image: '/media/poslovni-oglasi-real-stock.webp',
      alt: t('Kolege za zajedničkim stolom', 'Colleagues working together'), position: '50% 50%',
    },
  ];
  return <div className="ref-page ref-offers">
    <SEO title={t('Šta nudimo', 'Services')} description={t('Bonaco marketing, Bonexis AI i partnerska platforma Poslovni oglasi.', 'Bonaco marketing, Bonexis AI and our partner platform Poslovni oglasi.')} />
    <header className="ref-wrap offers-intro">
      <p className="ref-eyebrow">{t('Šta nudimo', 'What we offer')}</p>
      <h1>{t('Tri smjera.', 'Three directions.')}<br /><span>{t('Vaš sljedeći korak.', 'Your next move.')}</span></h1>
      <p>{t('Izgraditi brend. Unaprijediti posao. Pronaći pravi tim. Odaberite odakle počinje vaša priča.', 'Build a brand. Rethink how you work. Find the right team. Choose where your story begins.')}</p>
      <div className="offers-colour-key" aria-hidden="true">{offers.map(offer => <i key={offer.to} style={{background: offer.color}} />)}</div>
    </header>
    <section className="ref-wrap offers-grid" aria-label={t('Naša tri smjera', 'Our three areas')}>
      {offers.map(offer => <article key={offer.to} className="offer-card" style={{['--offer-color' as string]: offer.color}}>
        <div className="offer-card-top"><span className="offer-wordmark">{offer.brand ? <BrandLogo brand={offer.brand} /> : <PoslovniOglasiLogo />}</span></div>
        <div className="offer-card-main">
          <div className="offer-card-copy"><h2>{offer.title}</h2><p>{offer.text}</p></div>
          {offer.image ? <div className="offer-visual"><img src={asset(offer.image)} alt={offer.alt} loading="lazy" width="600" height="600" style={{objectPosition: offer.position}} /></div> :
            <div className="offer-visual offer-ai-art" aria-hidden="true"><i /><i /><i /><span>AI<span>bonexis</span></span></div>}
        </div>
        <div className="offer-card-bottom"><span className="offer-dot" style={{background: offer.color}} aria-hidden="true" /><span>{offer.tags}</span><Link className="offer-card-action" to={to(offer.to)} aria-label={t('Istraži: ', 'Explore: ') + offer.name}>{t('Istraži', 'Explore')}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </article>)}
    </section>
    <ContactBand />
  </div>;
}
