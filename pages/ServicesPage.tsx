import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import BrandLogo from '../components/BrandLogo';
import BrandServiceLinks from '../components/BrandServiceLinks';
import { CirclePhoto, ClientClouds, ContactBand } from '../components/ReferenceSections';
import { SERVICES, SERVICE_INCLUDES } from '../data/services';
import { tr, useLang } from '../lib/i18n';

const photos: Record<string, {src:string; position:string; bs:string; en:string}> = {
  "strategija-kampanje": {
    "src": "/media/portfolio/symbol-tas-08139.webp",
    "position": "50% 38%",
    "bs": "Symbol TAS kampanja, odjeća i fotografija",
    "en": "Symbol TAS campaign: fashion photography"
  },
  "drustvene-mreze": {
    "src": "/media/portfolio/social-zmaj-food-photo-v8.webp",
    "position": "50% 50%",
    "bs": "Produktna fotografija hrane, sadržaj iz Bonaco produkcije",
    "en": "Food photography from a Bonaco product shoot"
  },
  "graficki-dizajn": {
    "src": "/media/portfolio/symbol-tas-shirt-design-v8.webp",
    "position": "50% 52%",
    "bs": "Symbol, grafički dizajn TAS majice",
    "en": "Symbol: TAS T-shirt graphic design"
  },
  "foto-video": {
    "src": "/media/portfolio/golf-sarajevo-sunlight.webp",
    "position": "50% 40%",
    "bs": "Golf klub Sarajevo, fotografija golferke",
    "en": "Golf Club Sarajevo: a golfer on the course"
  },
  "web-dizajn": {
    "src": "/media/portfolio/rooms-website-service-v8.webp",
    "position": "50% 35%",
    "bs": "ROOMS.hr, dizajn početne stranice",
    "en": "ROOMS.hr homepage design"
  },
  "ooh-dooh": {
    "src": "/media/portfolio/zmaj-led-service-v8.webp",
    "position": "50% 44%",
    "bs": "Zmaj, animacija prikazana na LED ekranu",
    "en": "Zmaj animation on a digital outdoor screen"
  },
  "digitalno-oglasavanje": {
    "src": "/media/portfolio/meta-marketing-stock-v8.webp",
    "position": "50% 50%",
    "bs": "Laptop na radnom stolu, stock fotografija Mikaela Blomkvista",
    "en": "Laptop on a desk, stock photograph by Mikael Blomkvist"
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
        <CirclePhoto src="/media/portfolio/bonaco-sarajevo-pinned.webp" alt="Sarajevo, Bonaco Media" />
      </section>
      <section className="ref-wrap ref-service-list">
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
                <CirclePhoto src={photo.src} alt={photo[lang]} position={photo.position} />
              </div>
            </details>
          );
        })}
      </section>
      <ClientClouds /><BrandServiceLinks /><ContactBand />
    </div>
  );
}
