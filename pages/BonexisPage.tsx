// /bonexis/: do januara 2027. najava (pet kapsula, U razvoju, Bonaco × qla.dev) prema briefu v1.3.
// Dosadašnji demo (Ben chat, scenariji, 3D AI tim, dashboard) uključuje se s BONEXIS_DEMO_PUBLIC.
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BonexisCapsules } from '../components/Circles';
import BonexisSection from '../components/bonexis/BonexisSection';
import BonexisDashboard from '../components/bonexis/BonexisDashboard';
import { BONEXIS_AGENTS, BONEXIS_TAGLINE, CAPSULES, CORE_FEATURES, PRINCIPLES } from '../data/bonexis';
import { BONEXIS_DEMO_PUBLIC } from '../data/capsules';
import { useLang } from '../lib/i18n';

function BonexisDemo() {
  return (
    <>
      <BonexisSection page />

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
      <section className="section light">
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
    </>
  );
}

export default function BonexisPage() {
  const { lang, t, to } = useLang();
  return (
    <>
      <SEO
        title={t('Bonexis – AI rješenja za vaš tim (uskoro)', 'Bonexis – AI solutions for your team (coming soon)')}
        description={t(
          'Bonexis by Bonaco × qla.dev: pet AI kapsula za web, sadržaj i SEO, leadove, planiranje kapaciteta, kontrolu isporuke i reviziju rada. U razvoju, predstavljanje januar 2027.',
          'Bonexis by Bonaco × qla.dev: five AI capsules for web, content and SEO, leads, capacity planning, delivery control and work audit. In development, launching January 2027.',
        )}
      />
      <BonexisCapsules page />

      {BONEXIS_DEMO_PUBLIC && lang === 'bs' && <BonexisDemo />}

      <section className="section cta-section">
        <div className="container cta-inner">
          <div>
            <h2>{t('Budite među prvima', 'Be among the first')}</h2>
            <p>{t(
              'Bonexis razvijamo s partnerom qla.dev. Ostavite kontakt i javit ćemo vam se kada krene predstavljanje i pilot za firme.',
              'We are building Bonexis with our partner qla.dev. Leave your details and we will get in touch when the launch and company pilot begin.',
            )}</p>
          </div>
          <div className="btn-row">
            <Link to={`${to('/kontakt/')}?usluga=Bonexis`} className="btn btn-primary">{t('Prijavite se', 'Sign up')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
