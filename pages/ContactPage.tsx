import { useState } from 'react';
import { MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import ContactBlock from '../components/ContactBlock';
import { SITE } from '../data/site';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';

export default function ContactPage() {
  const [map, setMap] = useState(false);
  const { t } = useLang();
  return (
    <>
      <SEO title={t('Kontakt', 'Contact')} description={t('Kontaktirajte Bonaco Media: Hiseta br. 11, Sarajevo, +387 33 258 900, bonacomedia@gmail.com. Upit za marketing, BonEvents ili Bonexis.', 'Contact Bonaco Media: Hiseta br. 11, Sarajevo, +387 33 258 900, bonacomedia@gmail.com. Inquiries for marketing, BonEvents or Bonexis.')} />
      <section className="page-hero">
        <div className="container">
          <h1>{hl(t('Recite nam šta vam *treba*', 'Tell us what you *need*'))}</h1>
        </div>
      </section>
      <ContactBlock heading={false} />
      <section className="map">
        {/* Mapa se učitava tek na klik: brža stranica i bez Google kolačića dok posjetilac ne odluči */}
        {map ? (
          <iframe src={SITE.mapsEmbed} title={t('Lokacija Bonaco Media na mapi', 'Bonaco Media location on the map')} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <button className="map-placeholder" onClick={() => setMap(true)}>
            <MapPin size={28} />
            <span>{SITE.address.street}, {SITE.address.zip} {SITE.address.city}</span>
            <span className="btn btn-secondary btn-sm">{t('Prikaži mapu', 'Show map')}</span>
          </button>
        )}
      </section>
    </>
  );
}
