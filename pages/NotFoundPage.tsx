import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Stranica nije pronađena" description="Tražena stranica ne postoji." />
      <section className="page-hero not-found">
        <div className="container">
          <span className="eyebrow">404</span>
          <h1>Ova stranica ne postoji</h1>
          <p className="lead">Možda je premještena. Pogledajte početnu stranicu ili nam se javite.</p>
          <div className="btn-row">
            <Link to="/" className="btn btn-primary">Početna</Link>
            <Link to="/kontakt/" className="btn btn-secondary">Kontakt</Link>
          </div>
        </div>
      </section>
    </>
  );
}
