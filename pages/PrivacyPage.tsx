import SEO from '../components/SEO';
import { SITE } from '../data/site';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';

// NACRT – pravni tekst treba pregledati i odobriti Bonaco prije objave.
export default function PrivacyPage() {
  const { lang, t } = useLang();
  const mail = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;
  const domain = SITE.url.replace('https://', '');
  return (
    <>
      <SEO title={t('Politika privatnosti', 'Privacy policy')} description={t('Kako Bonaco Media prikuplja i koristi lične podatke posjetilaca web stranice.', 'How Bonaco Media collects and uses the personal data of website visitors.')} />
      <section className="page-hero"><div className="container narrow"><h1>{hl(t('Politika *privatnosti*', '*Privacy* policy'))}</h1></div></section>
      <section className="section">
        {lang === 'en' ? (
          <div className="container narrow prose">
            <p>This policy explains how {SITE.legalName}, {SITE.address.street}, {SITE.address.zip} {SITE.address.city} (“we”) processes the personal data of visitors to {domain}.</p>
            <h2>What we collect</h2>
            <p>When you send an inquiry through the contact form we collect the details you enter: your name and email, and optionally your company, phone, approximate budget and message.</p>
            <h2>Why we use it</h2>
            <p>We use this data only to respond to your inquiry and prepare a quote. We do not sell it or share it with third parties for marketing.</p>
            <h2>How long we keep it</h2>
            <p>We keep inquiries for as long as needed for communication and possible cooperation, and at most two years after the last contact, unless the law requires otherwise.</p>
            <h2>Cookies and external content</h2>
            <p>The site does not use tracking or advertising cookies. YouTube videos and the Google map load only when you start them; Google’s privacy rules then apply.</p>
            <h2>Your rights</h2>
            <p>You can request access to, correction or deletion of your data by emailing {mail}.</p>
          </div>
        ) : (
          <div className="container narrow prose">
            <p>Ova politika objašnjava kako {SITE.legalName}, {SITE.address.street}, {SITE.address.zip} {SITE.address.city} („mi“) obrađuje lične podatke posjetilaca stranice {domain}.</p>
            <h2>Koje podatke prikupljamo</h2>
            <p>Kada pošaljete upit putem kontakt forme, prikupljamo podatke koje unesete: ime i prezime, email, a opcionalno firmu, telefon, okvirni budžet i sadržaj poruke.</p>
            <h2>Zašto ih koristimo</h2>
            <p>Podatke koristimo isključivo kako bismo odgovorili na vaš upit i pripremili ponudu. Ne prodajemo ih i ne dijelimo s trećim stranama radi marketinga.</p>
            <h2>Koliko ih čuvamo</h2>
            <p>Upite čuvamo onoliko dugo koliko je potrebno za komunikaciju i eventualnu saradnju, a najduže dvije godine od posljednjeg kontakta, osim ako zakon ne nalaže drugačije.</p>
            <h2>Kolačići i vanjski sadržaj</h2>
            <p>Stranica ne koristi kolačiće za praćenje ni oglašavanje. YouTube video i Google mapa učitavaju se tek kada ih sami pokrenete; tada se primjenjuju pravila privatnosti kompanije Google.</p>
            <h2>Vaša prava</h2>
            <p>Možete zatražiti uvid, ispravku ili brisanje svojih podataka slanjem emaila na {mail}.</p>
          </div>
        )}
      </section>
    </>
  );
}
