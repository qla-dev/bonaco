import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO';
import ServicePhoto from '../components/ServicePhoto';
import PoslovniOglasiLogo from '../components/PoslovniOglasiLogo';
import { useLang } from '../lib/i18n';

export default function PoslovniOglasiPage() {
  const { t, to } = useLang();
  return (
    <div className="ref-page ref-jobs">
      <SEO title="Poslovni oglasi" description={t('Povezivanje poslodavaca i kandidata u Bosni i Hercegovini.', 'Connecting employers and candidates in Bosnia and Herzegovina.')} />
      <section className="ref-wrap ref-service-hero">
        <div>
          <div className="po-hero-wordmark"><PoslovniOglasiLogo /></div>
          <h1>{t('Pravi ljudi.', 'The right people.')}<br /><span>{t('Nove prilike.', 'New opportunities.')}</span></h1>
          <p>{t('Mjesto susreta poslodavaca koji grade tim i ljudi koji traže sljedeći korak u karijeri. Pregledna radna mjesta, jasna očekivanja i jednostavan put do informacija o prijavi.', 'Connecting employers with their next team member and people with their next career move. Explore clear job listings, understand what is expected and find out how to apply.')}</p>
          <a className="ref-pill" href="https://poslovnioglasi.ba/" target="_blank" rel="noopener noreferrer">{t('Otvori Poslovne oglase', 'Visit Poslovni oglasi')}<ArrowUpRight size={18} /></a>
        </div>
        <ServicePhoto strip src="/media/poslovni-oglasi-real-stock.webp" alt={t('Kolege rade za zajedničkim stolom u kancelariji', 'Colleagues working at a shared table in an office')} position="50% 50%" />
      </section>
      <section className="ref-wrap ref-job-columns">
        <article>
          <h2>{t('Za poslodavce', 'For employers')}</h2>
          <p>{t('Predstavite poziciju tako da pravi kandidat može prepoznati svoju priliku. Jasno opišite odgovornosti, potrebne vještine, mjesto rada i ono što vaš tim nudi.', 'Help the right candidates see themselves in your team. Describe the role, key responsibilities, required skills, location and what you offer.')}</p>
          <p>{t('Dobar oglas daje kandidatima dovoljno informacija za odluku. Uz opis kompanije, navedite rok i način prijave te kontakt za dodatna pitanja.', 'A good listing gives candidates enough information to make a decision. Alongside the company description, include the deadline, application method and a contact for questions.')}</p>
          <Link className="ref-text-link" to={to('/kontakt/?usluga=Poslovni%20oglasi')}>{t('Upit za oglašavanje posla', 'Job advertising inquiry')}<ArrowUpRight size={18} /></Link>
        </article>
        <article>
          <h2>{t('Za kandidate', 'For candidates')}</h2>
          <p>{t('Istražite objavljena radna mjesta u Bosni i Hercegovini i pronađite prilike koje odgovaraju vašem iskustvu i interesovanjima. Pročitajte opis pozicije, uslove i informacije o poslodavcu.', 'Explore vacancies in Bosnia and Herzegovina and find opportunities that fit your experience and interests. Read the role description, requirements and employer information.')}</p>
          <p>{t('Pripremite prijavu prema zahtjevima konkretnog oglasa i pošaljite je navedenim putem. Aktuelni konkursi, rokovi i upute dostupni su na platformi Poslovni oglasi.', 'Prepare your application to match the requirements of the listing and submit it through the stated channel. Current vacancies, deadlines and instructions are available on Poslovni oglasi.')}</p>
          <a className="ref-text-link" href="https://poslovnioglasi.ba/" target="_blank" rel="noopener noreferrer">{t('Pogledaj prilike', 'Explore opportunities')}<ArrowUpRight size={18} /></a>
        </article>
      </section>
      <section className="ref-wrap jobs-finish"><h2>{t('Sljedeća prilika je bliže.', 'Your next opportunity starts here.')}</h2><a className="ref-pill" href="https://poslovnioglasi.ba/" target="_blank" rel="noopener noreferrer">poslovnioglasi.ba<ArrowUpRight size={18} /></a></section>
    </div>
  );
}
