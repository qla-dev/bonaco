// O nama: iskustvo, način rada, vrijednosti i veza s Bonexisom i BonEventsom.
// Bez izmišljenih fotografija tima i prostorija (brief v1.3); brojke tek nakon provjere.
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import BrandLogo from '../components/BrandLogo';
import { CTASection, TestimonialCarousel, YouTube } from '../components/Blocks';
import { SITE, VIDEOS } from '../data/site';
import { useLang } from '../lib/i18n';

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
  const { lang, t, to } = useLang();
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
          <h1>{t('Spoj kreativnosti i strategije', 'Where creativity meets strategy')}</h1>
          <p className="lead">{t(
            `Bonaco Media je marketinška agencija sa sjedištem u Sarajevu, osnovana ${SITE.founded}. godine. Za nekoliko godina postali smo pouzdan partner domaćim i međunarodnim klijentima.`,
            `Bonaco Media is a marketing agency based in Sarajevo, founded in ${SITE.founded}. In a few years we have become a trusted partner to local and international clients.`,
          )}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <h2>{t('Kako radimo', 'How we work')}</h2>
            <p>{t(
              'Naš tim slaže svaki detalj vašeg marketinga kao slagalicu: strategija, sadržaj, dizajn, produkcija i mjerenje rezultata imaju svoje mjesto u istom planu.',
              'Our team fits every detail of your marketing together like a puzzle: strategy, content, design, production and measurement all have their place in one plan.',
            )}</p>
            <p>{t(
              'Vizija nam je povezati brendove s pravom publikom i stvoriti trajne digitalne veze koje povećavaju angažman i povjerenje.',
              'Our vision is to connect brands with the right audience and build lasting digital relationships that grow engagement and trust.',
            )}</p>
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

      <section className="section">
        <div className="container">
          <h2 className="center-title">{t('Tri brenda, jedna ekipa', 'Three brands, one team')}</h2>
          <div className="brand-trio">
            <Link to={to('/nase-usluge/')} className="trio-card" data-brand="bonaco">
              <BrandLogo brand="bonaco" />
              <p>{t('Full-service marketing: strategija, kampanje, sadržaj, dizajn, produkcija, web i SEO.', 'Full-service marketing: strategy, campaigns, content, design, production, web and SEO.')}</p>
              <span className="text-link">Marketing <ArrowRight size={16} /></span>
            </Link>
            <Link to={to('/bonexis/')} className="trio-card" data-brand="bonexis">
              <BrandLogo brand="bonexis" />
              <p>{t('AI kapsule za web, prodaju, planiranje, isporuku i kvalitet. U razvoju s partnerom qla.dev.', 'AI capsules for web, sales, planning, delivery and quality. In development with our partner qla.dev.')}</p>
              <span className="text-link">Bonexis <ArrowRight size={16} /></span>
            </Link>
            <Link to={to('/bonevents/')} className="trio-card" data-brand="bonevents">
              <BrandLogo brand="bonevents" />
              <p>{t('Planiranje, produkcija i promocija događaja za brendove.', 'Planning, production and promotion of events for brands.')}</p>
              <span className="text-link">BonEvents <ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      {lang === 'bs' && (
        <section className="section">
          <div className="container">
            <h2 className="center-title">Šta kažu naši klijenti</h2>
            <TestimonialCarousel />
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
