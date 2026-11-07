// Kontakt (dorade v08): lijevo kratak uvod, desno podaci, ispod zaseban zaobljeni panel s formom.
// Koristi se na početnoj (5. sekcija) i na /kontakt/. Logika forme je nepromijenjena (ContactForm).
import { Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from './ContactForm';
import SocialIcon from './SocialIcon';
import { SITE, SOCIAL } from '../data/site';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';

export default function ContactBlock({ heading = true, id }: { heading?: boolean; id?: string }) {
  const { t } = useLang();
  return (
    <section className="section contact2" id={id}>
      <div className="container">
        <div className="contact2-top">
          <div>
            <span className="eyebrow">{t('Kontakt', 'Contact')}</span>
            {heading && <h2>{hl(t('Recite nam šta vam *treba*', 'Tell us what you *need*'))}</h2>}
            <p className="lead">{hl(t('Odgovaramo najčešće **isti ili sljedeći radni dan**.', 'We usually reply **the same or the next working day**.'))}</p>
          </div>
          <div className="contact2-data">
            <a href={SITE.phoneHref} className="contact-item"><Phone /><span><small>{t('Telefon', 'Phone')}</small>{SITE.phone}</span></a>
            <a href={`mailto:${SITE.email}`} className="contact-item"><Mail /><span><small>Email</small>{SITE.email}</span></a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="contact-item"><MapPin /><span><small>{t('Adresa', 'Address')}</small>{SITE.address.street}, {SITE.address.zip} {SITE.address.city}</span></a>
            <div className="contact-social">
              {SOCIAL.map(s => <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.label}><SocialIcon id={s.id} size={20} /></a>)}
            </div>
          </div>
        </div>
        <div className="contact2-form">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
