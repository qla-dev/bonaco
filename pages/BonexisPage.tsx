import SEO from '../components/SEO';
import BrandLogo from '../components/BrandLogo';
import { useLang } from '../lib/i18n';

export default function BonexisPage() {
  const { t } = useLang();
  return <>
    <SEO title={t('Bonexis – Uskoro sa vama', 'Bonexis – Coming soon')}
      description={t('Poslovna AI rješenja u saradnji s qla.dev. Bonexis — uskoro sa vama.', 'Business AI solutions with qla.dev. Bonexis — coming soon.')} />
    <section className="bonexis-coming" data-brand="bonexis">
      <div className="container">
        <div className="bonexis-coming-mark"><BrandLogo brand="bonexis" /></div>
        <h1>{t('Uskoro sa vama', 'Coming soon')}</h1>
        <p>{t('Bonexis razvija poslovna AI rješenja u saradnji s qla.dev.', 'Bonexis is developing business AI solutions with qla.dev.')}</p>
      </div>
    </section>
  </>;
}
