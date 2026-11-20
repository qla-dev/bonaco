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
        <h1>{t('AI podrška za', 'AI support for')}<br /><span>{t('svakodnevni posao.', 'your everyday work.')}</span></h1>
        <p className="bonexis-coming-intro">{t('Pripremamo AI asistente za sadržaj i SEO, pronalazak novih klijenata te organizaciju i pregled rada tima. Sve na jednom mjestu, uz vašu kontrolu i odobrenje.', 'We’re preparing AI assistants for content and SEO, finding new clients, and organising and reviewing your team’s work. All in one place, with you in control and every step subject to your approval.')}</p>
        <ul className="bonexis-coming-features" aria-label={t('Šta možete očekivati', 'What to expect')}>
          <li>{t('Sadržaj i SEO', 'Content & SEO')}</li>
          <li>{t('Klijenti i prodaja', 'Clients & sales')}</li>
          <li>{t('Tim i zadaci', 'Team & tasks')}</li>
        </ul>
        <p className="bonexis-coming-credit">{t('Razvijamo u saradnji s qla.dev.', 'In development with qla.dev.')}</p>
        <p className="bonexis-coming-status"><span aria-hidden="true" />Coming soon</p>
      </div>
    </section>
  </>;
}
