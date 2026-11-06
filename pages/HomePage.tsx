// Početna po web briefu v1.3: Video → Marketing i radovi → Klijenti → Bonexis (5 kapsula)
// → BonEvents → O nama / Kontakt.
import { Link } from 'react-router-dom';
import { ArrowRight, Clapperboard, Lightbulb, Mail, Phone, Sparkles, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';
import HeroVideo from '../components/HeroVideo';
import BrandTiles from '../components/BrandTiles';
import { KeywordTicker, SpinBadge } from '../components/Showcase';
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
            <div className="mv-copy">
              <span className="eyebrow">Showreel</span>
              <h3>{hl(t('Bonaco u *pokretu*', 'Bonaco in *motion*'))}</h3>
              <p>{hl(t(
                'Od prve ideje do kampanje koja se vidi: ovako izgleda naš rad na terenu i na ekranu. **Kampanje, dizajn, produkcija, web i digital** u jednom kadru, za brendove koji žele da ih ljudi zapamte.',
                'From the first idea to a campaign people notice: this is what our work looks like on set and on screen. **Campaigns, design, production, web and digital** in one frame, for brands that want to be remembered.',
              ))}</p>
              <ol className="mv-steps">
                <li><span><Lightbulb size={18} /></span><div><strong>{t('Ideja i strategija', 'Idea and strategy')}</strong><small>{t('Cilj, publika, poruka', 'Goal, audience, message')}</small></div></li>
                <li><span><Clapperboard size={18} /></span><div><strong>{t('Snimanje i montaža', 'Filming and editing')}</strong><small>{t('Foto, video, reels', 'Photo, video, reels')}</small></div></li>
                <li><span><Sparkles size={18} /></span><div><strong>{t('Dizajn i animacija', 'Design and animation')}</strong><small>{t('Vizuali koji se pamte', 'Visuals that stick')}</small></div></li>
                <li><span><TrendingUp size={18} /></span><div><strong>{t('Objava i rezultati', 'Publishing and results')}</strong><small>{t('Mjerenje i optimizacija', 'Measurement and optimisation')}</small></div></li>
              </ol>
            </div>
            <div className="mv-media">
              <MarketingVideo />
              <div className="mv-play-label" aria-hidden="true">
                <b>05</b>
                <strong>{t('Pogledajte showreel', 'Watch the showreel')}</strong>
                <small>{t('Kampanje, eventi, produkcija', 'Campaigns, events, production')}</small>
              </div>
              <SpinBadge text="BONACO • SHOWREEL • KREATIVA • PRODUKCIJA • " />
            </div>
          </div>
        </div>
      </section>

      <KeywordTicker />

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
