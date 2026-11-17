import { useState } from 'react';
import SEO from '../components/SEO';
import { WorkGrid, ClientClouds, ContactBand } from '../components/ReferenceSections';
import { PORTFOLIO_2026 } from '../data/portfolio2026';
import { CATEGORY_EN } from '../data/projects';
import { useLang } from '../lib/i18n';

const filters = ['Društvene mreže', 'Foto i video', 'Event', 'Web dizajn', 'Grafički dizajn', 'Kampanje', 'OOH / DOOH'];
const categoryOrder: Record<string, string[]> = {
  'Grafički dizajn': ['symbol-dzeko', 'symbol-dukserice', 'symbol-tas', 'summer-lounge-identitet', 'summer-wine-lounge', 'bonaco-craft', 'bosnalijek'],
  Kampanje: ['symbol-tas'],
  'OOH / DOOH': ['opel-dooh', 'zmaj', 'jovs-bilbordi'],
};

export default function PortfolioPage() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState(filters[0]);
  const order = categoryOrder[filter] || [];
  const rank = (slug: string) => order.includes(slug) ? order.indexOf(slug) : order.length;
  const projects = PORTFOLIO_2026.filter(project => project.categories.includes(filter)).sort((a, b) => rank(a.slug) - rank(b.slug));
  return (
    <div className="ref-page">
      <SEO title={t('Radovi', 'Work')} description={t('Odabrani radovi Bonaco Media: društvene mreže, kampanje, produkcija i web dizajn.', 'Selected Bonaco Media work: social media, campaigns, production and web design.')} />
      <section className="ref-wrap ref-portfolio">
        <div className="ref-work-heading"><h1>{t('Naši radovi', 'Our work')}</h1><span>Bonaco Media</span></div>
        <div className="ref-filters" aria-label={t('Filtriraj radove', 'Filter projects')}>
          {filters.map(category => (
            <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>
              {lang === 'en' ? (CATEGORY_EN[category] || category) : category}
            </button>
          ))}
        </div>
        <WorkGrid projects={projects} />
      </section>
      <ClientClouds />
      <ContactBand />
    </div>
  );
}
