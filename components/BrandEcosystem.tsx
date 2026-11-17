import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';
import BrandLogo from './BrandLogo';

export default function BrandEcosystem() {
  const { t, to } = useLang();
  return <section className="section eco eco-round" id="ecosystem">
    <div className="container">
      <h1 className="eco-title">{hl(t('Jedna agencija, *četiri smjera*.', 'One agency, *four directions*.'))}</h1>
      <div className="eco-core">
        <Link className="eco-main-circle" to={to('/nase-usluge/')}>
          <BrandLogo brand="bonaco" />
          <strong>Full-service<br />marketing</strong>
          <span>{t('Naša osnovna djelatnost', 'Our core offering')}</span>
        </Link>
        <p className="eco-lead">{t('Povezujemo strategiju, kreativu, produkciju i oglašavanje u kompletnu marketinšku podršku vašem brendu.', 'We connect strategy, creativity, production and advertising to give your brand complete marketing support.')}</p>
      </div>
    </div>
  </section>;
}
