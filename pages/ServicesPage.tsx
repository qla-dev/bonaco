import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import BrandLogo from '../components/BrandLogo';
import { ClientClouds, ContactBand } from '../components/ReferenceSections';
import ServicePhoto from '../components/ServicePhoto';
import { SERVICES, SERVICE_INCLUDES } from '../data/services';
import { tr, useLang } from '../lib/i18n';

const photos: Record<string, {src:string; position:string; mobilePosition:string; artwork:boolean; bs:string; en:string}> = {
  "strategija-kampanje": {
    "src": "/media/portfolio/service-strategy-tas-v22.webp",
    "position": "50% 43%",
    "mobilePosition": "50% 43%",
    "artwork": true,
    "bs": "Symbol TAS, fotografija iz kampanje s modelom u crvenom automobilu",
    "en": "Symbol TAS campaign photograph with a model in a red car"
  },
  "drustvene-mreze": {
    "src": "/media/portfolio/service-social-orasi-v22.webp",
    "position": "50% 50%",
    "mobilePosition": "50% 50%",
    "artwork": true,
    "bs": "Omega / OraSì, objava s napitkom od badema i kafom",
    "en": "Omega / OraSì social creative featuring almond drink and coffee"
  },
  "graficki-dizajn": {
    "src": "/media/portfolio/service-design-symbol-v22.webp",
    "position": "50% 52%",
    "mobilePosition": "50% 52%",
    "artwork": true,
    "bs": "Symbol, grafički dizajn printa na duksericama",
    "en": "Symbol graphic print designs on hoodies"
  },
  "foto-video": {
    "src": "/media/portfolio/service-production-golf-v22.webp",
    "position": "50% 60%",
    "mobilePosition": "50% 55%",
    "artwork": false,
    "bs": "Golf klub Sarajevo, fotografija Cedevita Sarajevo Open događaja",
    "en": "Golf Club Sarajevo: Cedevita Sarajevo Open event photography"
  },
  "web-dizajn": {
    "src": "/media/portfolio/service-web-rooms-v22.webp",
    "position": "50% 50%",
    "mobilePosition": "50% 50%",
    "artwork": true,
    "bs": "ROOMS.hr, prikaz dizajna web stranice na laptopu",
    "en": "ROOMS.hr website design presented on a laptop"
  },
  "ooh-dooh": {
    "src": "/media/portfolio/service-outdoor-jovs-v22.webp",
    "position": "50% 48%",
    "mobilePosition": "50% 48%",
    "artwork": true,
    "bs": "JOVS kampanja na gradskom LED ekranu",
    "en": "JOVS campaign on a city LED screen"
  },
  "digitalno-oglasavanje": {
    "src": "/media/portfolio/service-digital-workspace-v22.webp",
    "position": "35% 75%",
    "mobilePosition": "32% 70%",
    "artwork": false,
    "bs": "Laptop s prikazom digitalnog marketinga na radnom stolu; ilustrativna stock fotografija",
    "en": "Laptop displaying digital marketing on a desk; illustrative stock photograph"
  }
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
          <p>{t('Dajemo joj strategiju, oblik, glas i publiku. Povezujemo usluge prema onome što vašem brendu treba, od prve kampanje do kontinuirane komunikacije na više kanala.', 'We turn ideas into a clear strategy, distinctive design and content that reaches the right people. From your first campaign to your everyday brand presence, we bring the right skills together.')}</p>
        </div>
        <ServicePhoto strip src="/media/portfolio/bonaco-sarajevo-pinned.webp" alt="Sarajevo, Bonaco Media" position="50% 85%" />
      </section>
      <section className="ref-wrap ref-service-list" aria-labelledby="marketing-services-heading">
        <header className="service-list-heading"><p className="ref-eyebrow">{t('Bonaco marketing', 'Bonaco marketing')}</p><h2 id="marketing-services-heading">{t('Usluge za vašu ideju.', 'Services for your idea.')}</h2></header>
        {SERVICES.map((service, index) => {
          const translated = tr(service, lang);
          const includes = SERVICE_INCLUDES[service.slug];
          const photo = photos[service.slug];
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
                <ServicePhoto strip src={photo.src} alt={photo[lang]} position={photo.position} mobilePosition={photo.mobilePosition} artwork={photo.artwork} />
              </div>
            </details>
          );
        })}
      </section>
      <ClientClouds /><ContactBand />
    </div>
  );
}
