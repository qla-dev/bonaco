// O nama: iskustvo, način rada, vrijednosti i veza s Bonexisom i BonEventsom.
// Bez izmišljenih fotografija tima i prostorija (brief v1.3); brojke tek nakon provjere.
import SEO from '../components/SEO';
import BrandTiles from '../components/BrandTiles';
import { CTASection, TestimonialCarousel, YouTube } from '../components/Blocks';
import { SITE, VIDEOS } from '../data/site';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';

const PILLARS = [
  {
    bs: { title: 'Misija', text: 'Pomažemo kompanijama da se istaknu kroz strategiju, kreativu, produkciju i digital, s jasnim ciljem i mjerljivim rezultatom.' },
    en: { title: 'Mission', text: 'We help companies stand out through strategy, creative, production and digital, with a clear goal and measurable results.' },
  },
  {
    bs: { title: 'Dugoročna saradnja', text: 'Strategije prilagođavamo ciljevima svakog klijenta i gradimo odnose koji traju godinama, a ne jednu kampanju.' },
    en: { title: 'Long-term partnership', text: 'We tailor strategies to each client’s goals and build relationships that last for years, not just one campaign.' },
  },
  {
    bs: { title: 'Nove tehnologije', text: 'Pratimo trendove prije nego postanu standard. Zato s partnerom qla.dev razvijamo Bonexis AI rješenja.' },
    en: { title: 'New technology', text: 'We follow trends before they become the standard. That is why we are building Bonexis AI solutions with our partner qla.dev.' },
  },
];

export default function AboutPage() {
  const { lang, t } = useLang();
  return (
    <>
      <SEO
        title={t('O nama', 'About us')}
        description={t(
          `Bonaco Media je full-service marketinška agencija iz Sarajeva, osnovana ${SITE.founded}. Uz marketing razvijamo Bonexis AI rješenja i BonEvents organizaciju događaja.`,
          `Bonaco Media is a full-service marketing agency from Sarajevo, founded in ${SITE.founded}. Alongside marketing we build Bonexis AI solutions and run BonEvents.`,
        )}
      />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">{t('O nama', 'About us')}</span>
          <h1>{hl(t('Spoj *kreativnosti* i strategije', 'Where *creativity* meets strategy'))}</h1>
          <p className="lead">{hl(t(
            `Bonaco Media je marketinška agencija sa sjedištem u **Sarajevu**, osnovana **${SITE.founded}. godine**. Za nekoliko godina postali smo **pouzdan partner** domaćim i međunarodnim klijentima.`,
            `Bonaco Media is a marketing agency based in **Sarajevo**, founded in **${SITE.founded}**. In a few years we have become a **trusted partner** to local and international clients.`,
          ))}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <h2>{hl(t('Kako *radimo*', 'How we *work*'))}</h2>
            <p>{hl(t(
              'Naš tim slaže svaki detalj vašeg marketinga kao **slagalicu**: strategija, sadržaj, dizajn, produkcija i mjerenje rezultata imaju svoje mjesto u **istom planu**.',
              'Our team fits every detail of your marketing together like a **puzzle**: strategy, content, design, production and measurement all have their place in **one plan**.',
            ))}</p>
            <p>{hl(t(
              'Vizija nam je povezati brendove s **pravom publikom** i stvoriti **trajne digitalne veze** koje povećavaju angažman i povjerenje.',
              'Our vision is to connect brands with **the right audience** and build **lasting digital relationships** that grow engagement and trust.',
            ))}</p>
          </div>
          <div className="showreel">
            <YouTube id={VIDEOS.showreel} title={t('Bonaco Media – pogledajte naš rad', 'Bonaco Media – see our work')} />
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="container">
          <div className="pillars">
            {PILLARS.map(p => (
              <div key={p.bs.title} className="pillar">
                <h3>{p[lang].title}</h3>
                <p>{p[lang].text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BrandTiles />

      {lang === 'bs' && (
        <section className="section">
          <div className="container">
            <h2 className="center-title">{hl('Šta kažu naši *klijenti*')}</h2>
            <TestimonialCarousel />
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
