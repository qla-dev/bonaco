import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { CTASection, SectionHead } from '../components/Blocks';
import { SERVICES, STEPS } from '../data/services';

export default function ServicesPage() {
  return (
    <>
      <SEO title="Usluge" description="Vođenje društvenih mreža, SEO optimizacija, web i grafički dizajn, event management te fotografisanje i snimanje. Personalizirana strategija za vaš brend." />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Usluge</span>
          <h1>Šta radimo</h1>
          <p className="lead">Na osnovu vaših ciljeva razvijamo strategiju koja donosi rezultate u digitalnom marketingu, i onlajn i na događajima.</p>
        </div>
      </section>
      <section className="section">
        <div className="container services-list">
          {SERVICES.map((s, i) => (
            <article key={s.slug} id={s.slug} className="service-row">
              <span className="service-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </div>
              <Link to={`/kontakt/?usluga=${encodeURIComponent(s.title)}`} className="btn btn-secondary btn-sm">Zatražite ponudu</Link>
            </article>
          ))}
          <article id="bonexis" className="service-row service-row-accent">
            <span className="service-num">AI</span>
            <div>
              <h2>Bonexis AI alati</h2>
              <p>Šest AI agenata za audit vizuala, blog i SEO, pronalaženje klijenata, planiranje kapaciteta, kontrolu isporuke i pozive.</p>
            </div>
            <Link to="/bonexis/" className="btn btn-primary btn-sm">Upoznajte Bonexis</Link>
          </article>
        </div>
      </section>
      <section className="section light">
        <div className="container">
          <SectionHead eyebrow="Kako radimo" title="Tri koraka do rezultata" />
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title}><span className="step-num">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>
            ))}
          </ol>
        </div>
      </section>
      <CTASection />
    </>
  );
}
