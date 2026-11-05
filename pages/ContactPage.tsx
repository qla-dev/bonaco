import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';
import SocialIcon from '../components/SocialIcon';
import { SITE, SOCIAL } from '../data/site';

export default function ContactPage() {
  const [map, setMap] = useState(false);
  return (
    <>
      <SEO title="Kontakt" description="Kontaktirajte Bonaco Media: Hiseta br. 11, Sarajevo, +387 33 258 900, bonacomedia@gmail.com. Pošaljite upit i javit ćemo vam se s prijedlogom." />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Kontakt</span>
          <h1>Recite nam šta vam treba</h1>
          <p className="lead">Odgovaramo najčešće isti ili sljedeći radni dan.</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-grid">
          <aside className="contact-info">
            <a href={SITE.phoneHref} className="contact-item"><Phone /><span><small>Telefon</small>{SITE.phone}</span></a>
            <a href={`mailto:${SITE.email}`} className="contact-item"><Mail /><span><small>Email</small>{SITE.email}</span></a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="contact-item"><MapPin /><span><small>Adresa</small>{SITE.address.street}, {SITE.address.zip} {SITE.address.city}</span></a>
            <div className="contact-social">
              {SOCIAL.map(s => <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.label}><SocialIcon id={s.id} size={20} /></a>)}
            </div>
          </aside>
          <div className="contact-form-wrap">
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="map">
        {/* Mapa se učitava tek na klik: brža stranica i bez Google kolačića dok posjetilac ne odluči */}
        {map ? (
          <iframe src={SITE.mapsEmbed} title="Lokacija Bonaco Media na mapi" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <button className="map-placeholder" onClick={() => setMap(true)}>
            <MapPin size={28} />
            <span>{SITE.address.street}, {SITE.address.zip} {SITE.address.city}</span>
            <span className="btn btn-secondary btn-sm">Prikaži mapu</span>
          </button>
        )}
      </section>
    </>
  );
}
