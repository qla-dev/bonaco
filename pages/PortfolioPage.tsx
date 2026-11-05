import { useState } from 'react';
import SEO from '../components/SEO';
import { CTASection, ProjectCard } from '../components/Blocks';
import { CATEGORIES, PROJECTS } from '../data/projects';

export default function PortfolioPage() {
  const [cat, setCat] = useState('Sve');
  const list = cat === 'Sve' ? PROJECTS : PROJECTS.filter(p => p.categories.includes(cat));
  const available = CATEGORIES.filter(c => c === 'Sve' || PROJECTS.some(p => p.categories.includes(c)));
  return (
    <>
      <SEO title="Portfolio" description="Odabrani projekti Bonaco Media: društvene mreže, web stranice, grafički dizajn, fotografija, video i eventi." />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Portfolio</span>
          <h1>Projekti na koje smo ponosni</h1>
          <p className="lead">Odabrani radovi za brendove iz regije. Kliknite na projekat da vidite zadatak, naš angažman i rezultate.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="filters" role="group" aria-label="Filter projekata">
            {available.map(c => (
              <button key={c} className={`chip ${c === cat ? 'is-on' : ''}`} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>
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
