// Početna po web briefu v1.3: Video → Marketing i radovi → Klijenti → Bonexis (5 kapsula)
// → BonEvents → O nama / Kontakt.
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import SEO from '../components/SEO';
import HeroVideo from '../components/HeroVideo';
import BrandTiles from '../components/BrandTiles';
import { BonEventsBlock, BonexisCapsules, ClientsMarquee, MarketingVideo, ServiceCircles, WorkCircles } from '../components/Circles';
import { SITE } from '../data/site';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';

export default function HomePage() {
  const { t, to } = useLang();
  return (
    <>
      <SEO
        title={SITE.name}
        description={t(
          'Bonaco Media je full-service marketinška agencija iz Sarajeva: strategija i kampanje, društvene mreže, dizajn i branding, foto i video, web i SEO, OOH. Uz Bonexis AI rješenja i BonEvents.',
          'Bonaco Media is a full-service marketing agency from Sarajevo: strategy and campaigns, social media, design and branding, photo and video, web and SEO, OOH. Plus Bonexis AI solutions and BonEvents.',
        )}
      />

      <HeroVideo />

      <BrandTiles />

      {/* Marketing: usluge i radovi u krugovima */}
      <section className="section mkt" id="marketing">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Marketing</span>
              <h2>{hl(t('Full-service marketing, od ideje do *rezultata*', 'Full-service marketing, from idea to *results*'))}</h2>
              <p className="lead">{hl(t(
                'Strategija, kreativa i produkcija **pod jednim krovom**. Pogledajte izbor radova za **brendove iz regije**.',
                'Strategy, creative and production **under one roof**. Take a look at selected work for **brands across the region**.',
              ))}</p>
            </div>
            <Link to={to('/portfolio/')} className="text-link">{t('Pogledajte sve radove', 'See all work')} <ArrowRight size={16} /></Link>
          </div>
          <ServiceCircles />
          <WorkCircles limit={6} />
          <div className="mkt-video">
            <div>
              <h3>{t('Bonaco u pokretu', 'Bonaco in motion')}</h3>
              <p>{hl(t('Kratak pregled onoga što radimo: **kampanje, dizajn, produkcija, web i digital**.', 'A quick look at what we do: **campaigns, design, production, web and digital**.'))}</p>
            </div>
            <MarketingVideo />
          </div>
        </div>
      </section>

      <ClientsMarquee />

      <BonexisCapsules />

      <BonEventsBlock />

      {/* O nama i kontakt */}
      <section className="section end-section">
        <div className="container end-grid">
          <article className="end-card">
            <span className="eyebrow">{t('O nama', 'About us')}</span>
            <h2>{hl(t('Spoj *kreativnosti* i strategije', 'Where *creativity* meets strategy'))}</h2>
            <p>{hl(t(
              `Bonaco Media je marketinška agencija iz **Sarajeva**, osnovana **${SITE.founded}. godine**. Radimo s **domaćim i međunarodnim klijentima** i svaki detalj marketinga slažemo kao dio **jedne strategije**.`,
              `Bonaco Media is a marketing agency from **Sarajevo**, founded in **${SITE.founded}**. We work with **local and international clients** and fit every marketing detail into **one strategy**.`,
            ))}</p>
            <Link to={to('/o-nama/')} className="text-link">{t('Više o nama', 'More about us')} <ArrowRight size={16} /></Link>
          </article>
          <article className="end-card end-card-contact">
            <span className="eyebrow">{t('Kontakt', 'Contact')}</span>
            <h2>{hl(t('Recite nam šta vam *treba*', 'Tell us what you *need*'))}</h2>
            <ul className="end-contact">
              <li><a href={SITE.phoneHref}><Phone size={18} /> {SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`}><Mail size={18} /> {SITE.email}</a></li>
            </ul>
            <Link to={to('/kontakt/')} className="btn btn-primary">{t('Zatražite ponudu', 'Request a quote')}</Link>
          </article>
        </div>
      </section>
    </>
  );
}
