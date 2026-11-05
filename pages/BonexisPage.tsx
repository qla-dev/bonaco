import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BonexisSection from '../components/bonexis/BonexisSection';
import { BONEXIS_AGENTS } from '../data/bonexis';

export default function BonexisPage() {
  return (
    <>
      <SEO
        title="Bonexis – AI agenti za vaš biznis"
        description="Bonexis: šest AI agenata za audit vizuala, blog i SEO, pronalaženje klijenata, planiranje kapaciteta, kontrolu isporuke i AI sekretaricu koja prima i obavlja pozive."
      />
      <BonexisSection headingLevel="h1" />

      <section className="section light">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Šest agenata, manje ručnog posla</h2>
              <p className="lead">Svaki agent rješava konkretan problem u marketingu i poslovanju. Možete koristiti jednog ili cijeli tim.</p>
            </div>
          </div>
          <div className="agent-grid">
            {BONEXIS_AGENTS.map(a => (
              <article key={a.name} className="agent-card">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <ul className="check-list">{a.list.map(l => <li key={l}>{l}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Pogledajte Bonexis na vašem primjeru</h2>
            <p>Zakažite kratak demo, pa ćemo pokazati koji agenti imaju smisla za vaš biznis.</p>
          </div>
          <div className="btn-row">
            <Link to="/kontakt/?usluga=Bonexis" className="btn btn-primary">Zatražite demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
