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
    "src": "/media/portfolio/service-strategy-team-v23.webp",
    "position": "50% 65%",
    "mobilePosition": "50% 62%",
    "artwork": false,
    "bs": "Tim sarađuje na planiranju projekta; ilustrativna fotografija",
    "en": "Team collaborating on project planning; illustrative photograph"
  },
  "drustvene-mreze": {
    "src": "/media/portfolio/service-social-content-v24.webp",
    "position": "50% 0%",
    "mobilePosition": "50% 50%",
    "artwork": false,
    "bs": "Kreiranje sadržaja uz mobilni telefon i studijsku rasvjetu; ilustrativna fotografija",
    "en": "Creating content with a smartphone and studio lighting; illustrative photograph"
  },
  "graficki-dizajn": {
    "src": "/media/portfolio/service-design-symbol-v23.webp",
    "position": "50% 49%",
    "mobilePosition": "50% 50%",
    "artwork": false,
    "bs": "Grafički printovi na Symbol duksericama",
    "en": "Graphic prints on Symbol hoodies"
  },
  "foto-video": {
    "src": "/media/portfolio/service-production-event-v23.webp",
    "position": "50% 60%",
    "mobilePosition": "50% 55%",
    "artwork": false,
    "bs": "Fotografija događaja Sarajevo Open u Golf klubu Sarajevo",
    "en": "Sarajevo Open event photography at Golf Club Sarajevo"
  },
  "web-dizajn": {
    "src": "/media/portfolio/service-web-collaboration-v23.webp",
    "position": "35% 80%",
    "mobilePosition": "30% 70%",
    "artwork": false,
    "bs": "Laptop na radnom stolu; ilustrativna fotografija web okruženja",
    "en": "Laptop on a desk; illustrative photograph of a web workspace"
  },
  "ooh-dooh": {
    "src": "/media/portfolio/service-outdoor-city-v24.webp",
    "position": "50% 50%",
    "mobilePosition": "50% 50%",
    "artwork": false,
    "bs": "Digitalni reklamni ekrani na Times Squareu; ilustrativna fotografija",
    "en": "Digital advertising screens in Times Square; illustrative photograph"
  },
  "digitalno-oglasavanje": {
    "src": "/media/portfolio/service-digital-workspace-v23.webp",
    "position": "50% 60%",
    "mobilePosition": "50% 50%",
    "artwork": false,
    "bs": "Tim razmatra plan i rezultate kampanje; ilustrativna fotografija",
    "en": "Team discussing a campaign plan and results; illustrative photograph"
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
