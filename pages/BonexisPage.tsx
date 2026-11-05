import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BonexisSection from '../components/bonexis/BonexisSection';
import BonexisDashboard from '../components/bonexis/BonexisDashboard';
import { BONEXIS_AGENTS, BONEXIS_TAGLINE, CAPSULES, CORE_FEATURES, PRINCIPLES } from '../data/bonexis';

export default function BonexisPage() {
  return (
    <>
      <SEO
        title="Bonexis – marketing CRM s AI agentima"
        description="Bonexis je marketing CRM sa sedam AI kapsula: društvene mreže, SEO audit, blog, leadovi s AI sekretaricom, kapacitet, kontrola isporuke i revizija rada. Svaku kapsulu vodi owner agent."
      />
      <BonexisSection headingLevel="h1" page />

      {/* Dashboard */}
      <section className="bxd-section" id="dashboard">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Dashboard za svaku kapsulu</h2>
              <p className="lead">Agenti rade, ali vi upravljate. Svaka kapsula ima svoj pregled: šta čeka odobrenje, rezultate i zadatke za owner agenta. Isprobajte demo.</p>
            </div>
          </div>
          <BonexisDashboard />
        </div>
      </section>

      {/* Kapsule i owner agenti */}
      <section className="section bx-capsules">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{BONEXIS_TAGLINE}</h2>
              <p className="lead">Svaku kapsulu vodi njen owner agent. Firma aktivira jednu kapsulu ili kombinaciju, a sve dijele isti CORE: klijente, projekte, zadatke i dokaze.</p>
            </div>
          </div>
          <div className="capsule-grid">
            {CAPSULES.map(c => {
              const agents = BONEXIS_AGENTS.filter(a => a.capsule === c.n);
              const owner = agents.find(a => a.role === 'owner')!;
              return (
                <article key={c.n} className="capsule-card">
                  <span className="capsule-n">Kapsula {c.n}</span>
                  <h3>{c.title}</h3>
                  <p className="capsule-owner">
                    Owner agent: <strong>{owner.persona}</strong>
                    {agents.filter(a => a.role === 'assistant').map(a => <span key={a.persona}>, uz {a.title.toLowerCase()} {a.persona}</span>)}
                  </p>
                  <p>{owner.desc}</p>
                  <ul className="check-list">{owner.list.map(l => <li key={l}>{l}</li>)}</ul>
                  <Link to={`/bonexis/#scenarij-${owner.persona.toLowerCase()}`} className="text-link">Pogledajte scenarij</Link>
                </article>
              );
            })}
            <article className="capsule-card capsule-core">
              <span className="capsule-n">Zajednička osnova</span>
              <h3>CORE</h3>
              <p>CORE nije posebna kapsula, nego osnova na kojoj sve radi.</p>
              <ul className="check-list">{CORE_FEATURES.map(l => <li key={l}>{l}</li>)}</ul>
            </article>
          </div>
        </div>
      </section>

      {/* Načela */}
      <section className="section">
        <div className="container">
          <h2 className="center-title">Kako Bonexis radi s vama</h2>
          <div className="principles">
            {PRINCIPLES.map(p => (
              <div key={p.title} className="principle">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Bonexis za vašu firmu</h2>
            <p>Bonexis razvijamo s partnerom QLA.dev. Javite se za demo i pilot, pa ćemo zajedno odabrati kapsule koje vašoj firmi trebaju.</p>
          </div>
          <div className="btn-row">
            <Link to="/kontakt/?usluga=Bonexis" className="btn btn-primary">Prijavite se za demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
