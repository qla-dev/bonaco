// "Tri brenda, jedna ekipa": tri kartice u bojama brendova (po uzoru na brend paletu, Opcija 2),
// bijeli logo na teksturisanoj podlozi. Koristi se na početnoj (ispod heroja) i na O nama.
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BrandLogo, { type Brand } from './BrandLogo';
import BrandTileArt from './BrandTileArt';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';

const TILES: { brand: Brand; to: string; label: string; bs: string; en: string }[] = [
  { brand: 'bonaco', to: '/nase-usluge/', label: 'Marketing', bs: 'Full-service marketing: strategija, kampanje, sadržaj, dizajn, produkcija, web i SEO.', en: 'Full-service marketing: strategy, campaigns, content, design, production, web and SEO.' },
  { brand: 'bonexis', to: '/bonexis/', label: 'Bonexis', bs: 'Marketing CRM sa sedam AI kapsula, u razvoju s partnerom qla.dev.', en: 'A marketing CRM with seven AI capsules, built with our partner qla.dev.' },
  { brand: 'bonevents', to: '/bonevents/', label: 'BonEvents', bs: 'Planiranje, produkcija i promocija događaja za brendove.', en: 'Planning, production and promotion of events for brands.' },
];

export default function BrandTiles({ heading = true }: { heading?: boolean }) {
  const { lang, t, to } = useLang();
  return (
    <section className="section brand-tiles-section">
      <div className="container">
        {heading && <h2 className="center-title">{hl(t('Tri *brenda*, jedna ekipa', 'Three *brands*, one team'))}</h2>}
        <div className="brand-tiles">
          {TILES.map(x => (
            <Link key={x.brand} to={to(x.to)} className={`brand-tile brand-tile-${x.brand}`}>
              <BrandTileArt brand={x.brand} />
              <BrandLogo brand={x.brand} mono />
              <p>{x[lang]}</p>
              <span className="bt-link">{x.label} <ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
