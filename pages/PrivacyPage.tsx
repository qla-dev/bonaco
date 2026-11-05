import SEO from '../components/SEO';
import { SITE } from '../data/site';

// NACRT – pravni tekst treba pregledati i odobriti Bonaco prije objave.
export default function PrivacyPage() {
  return (
    <>
      <SEO title="Politika privatnosti" description="Kako Bonaco Media prikuplja i koristi lične podatke posjetilaca web stranice." />
      <section className="page-hero"><div className="container narrow"><h1>Politika privatnosti</h1></div></section>
      <section className="section">
        <div className="container narrow prose">
          <p>Ova politika objašnjava kako {SITE.legalName}, {SITE.address.street}, {SITE.address.zip} {SITE.address.city} („mi“) obrađuje lične podatke posjetilaca stranice {SITE.url.replace('https://', '')}.</p>
          <h2>Koje podatke prikupljamo</h2>
          <p>Kada pošaljete upit putem kontakt forme, prikupljamo podatke koje unesete: ime i prezime, email, a opcionalno firmu, telefon, okvirni budžet i sadržaj poruke.</p>
          <h2>Zašto ih koristimo</h2>
          <p>Podatke koristimo isključivo kako bismo odgovorili na vaš upit i pripremili ponudu. Ne prodajemo ih i ne dijelimo s trećim stranama radi marketinga.</p>
          <h2>Koliko ih čuvamo</h2>
          <p>Upite čuvamo onoliko dugo koliko je potrebno za komunikaciju i eventualnu saradnju, a najduže dvije godine od posljednjeg kontakta, osim ako zakon ne nalaže drugačije.</p>
          <h2>Kolačići i vanjski sadržaj</h2>
          <p>Stranica ne koristi kolačiće za praćenje ni oglašavanje. YouTube video i Google mapa učitavaju se tek kada ih sami pokrenete; tada se primjenjuju pravila privatnosti kompanije Google.</p>
          <h2>Vaša prava</h2>
          <p>Možete zatražiti uvid, ispravku ili brisanje svojih podataka slanjem emaila na <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
