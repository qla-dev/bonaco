import { useState } from 'react';
import SEO from '../components/SEO';
import { CTASection, ProjectCard, catLabel } from '../components/Blocks';
import { CATEGORIES, PROJECTS } from '../data/projects';
import { useLang } from '../lib/i18n';

export default function PortfolioPage() {
  const { lang, t } = useLang();
  const [cat, setCat] = useState('Sve');
  const list = cat === 'Sve' ? PROJECTS : PROJECTS.filter(p => p.categories.includes(cat));
  const available = CATEGORIES.filter(c => c === 'Sve' || PROJECTS.some(p => p.categories.includes(c)));
  return (
    <>
      <SEO title={t('Radovi', 'Work')} description={t('Odabrani radovi Bonaco Media: društvene mreže, web stranice, grafički dizajn, fotografija, video i eventi.', 'Selected work by Bonaco Media: social media, websites, graphic design, photography, video and events.')} />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">{t('Radovi', 'Work')}</span>
          <h1>{t('Projekti na koje smo ponosni', 'Projects we are proud of')}</h1>
          <p className="lead">{t('Odabrani radovi za brendove iz regije. Kliknite na projekat da vidite zadatak, naš angažman i rezultate.', 'Selected work for brands across the region. Open a project to see the brief, our role and the results.')}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="filters" role="group" aria-label={t('Filter projekata', 'Filter projects')}>
            {available.map(c => (
              <button key={c} className={`chip ${c === cat ? 'is-on' : ''}`} aria-pressed={c === cat} onClick={() => setCat(c)}>{catLabel(c, lang)}</button>
            ))}
          </div>
          <div className="projects-grid">
            {list.map(p => <ProjectCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
