import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import BrandLogo from '../components/BrandLogo';
import BrandServiceLinks from '../components/BrandServiceLinks';
import { CirclePhoto, ClientClouds, ContactBand } from '../components/ReferenceSections';
import { SERVICES, SERVICE_INCLUDES } from '../data/services';
import { tr, useLang } from '../lib/i18n';

const photos: Record<string,string> = {
  "strategija-kampanje": "symbol-tas-08139.webp",
  "drustvene-mreze": "symbol-hoodies-08393.webp",
  "graficki-dizajn": "symbol-hoodies-08335.webp",
  "foto-video": "golf-sarajevo-sunlight.webp",
  "foto-videoprodukcija": "golf-sarajevo-sunlight.webp",
  "web-dizajn": "skuter-live-website.webp",
  "ooh-dooh": "jovs-central-building.webp",
  "digitalno-oglasavanje": "ecomm-kupac-9.webp",
  "meta-google": "ecomm-kupac-9.webp"
};

export default function ServicesPage() {
  const { t, to, lang } = useLang();
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const section = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (section instanceof HTMLDetailsElement) section.open = true;
  }, [hash]);
  return (
    <div className="ref-page ref-marketing">
      <SEO title="Bonaco marketing" description={t('Strategija, društvene mreže, dizajn, produkcija, web i oglašavanje.', 'Strategy, social media, design, production, web and advertising.')} />
      <section className="ref-wrap ref-service-hero">
        <div>
          <BrandLogo />
          <p className="ref-eyebrow">Bonaco marketing</p>
          <h1>{t('Sve počinje', 'It all starts')}<br /><span>{t('dobrom idejom.', 'with a good idea.')}</span></h1>
          <p>{t('Dajemo joj strategiju, oblik, glas i publiku. Povezujemo usluge prema onome što vašem brendu treba, od prve kampanje do kontinuirane komunikacije na više kanala.', 'We give it a strategy, a shape, a voice and an audience. We connect services around what your brand needs, from a first campaign to ongoing communication across multiple channels.')}</p>
        </div>
        <CirclePhoto src="/media/portfolio/bonaco-sarajevo-pinned.webp" alt="Sarajevo, Bonaco Media" />
      </section>
      <section className="ref-wrap ref-service-list">
        {SERVICES.map((service, index) => {
          const translated = tr(service, lang);
          const includes = SERVICE_INCLUDES[service.slug];
          return (
            <details id={service.slug} key={service.slug} open={index === 0}>
              <summary><h2>{translated.title}</h2><ChevronDown className="service-chevron" size={22} aria-hidden="true" /></summary>
              <div className="ref-service-content">
                <div>
                  <p className="service-lead">{translated.short}</p>
                  <p>{translated.text}</p>
                  <ul className="service-includes">{(lang === 'en' ? includes.en : includes.includes).map(item => <li key={item}>{item}</li>)}</ul>
                  <Link className="ref-text-link" to={to('/kontakt/?usluga=' + encodeURIComponent(service.title))}>{t('Razgovarajmo o projektu', 'Let’s discuss your project')}<ArrowUpRight size={18} /></Link>
                </div>
                <CirclePhoto src={'/media/portfolio/' + (photos[service.slug] || 'ecomm-kupac-9.webp')} alt={translated.title} contain={service.slug === 'web-dizajn'} />
              </div>
            </details>
          );
        })}
      </section>
      <ClientClouds /><BrandServiceLinks /><ContactBand />
    </div>
  );
}
