import SEO from '../components/SEO';
import { CTASection } from '../components/Blocks';
import { PoslovniOglasiBlock } from '../components/Circles';
import { useLang } from '../lib/i18n';

export default function PoslovniOglasiPage() {
  const { t } = useLang();
  return (
    <>
      <SEO
        title={t('Poslovni Oglasi – pronađite posao ili radnike u BiH', 'Poslovni Oglasi – find a job or workers in BiH')}
        description={t(
          'Poslovni Oglasi je platforma za oglašavanje poslova u Bosni i Hercegovini. U partnerstvu s Bonaco Media, povežite se s pravim kandidatima brže i efikasnije.',
          'Poslovni Oglasi is a job advertising platform in Bosnia and Herzegovina. In partnership with Bonaco Media, connect with the right candidates faster and more efficiently.',
        )}
      />
      <PoslovniOglasiBlock page />
      <CTASection
        title={t('Tražite *radnike*?', 'Looking for *workers*?')}
        text={t('Objavite oglas na Poslovni Oglasi platformi ili nas kontaktirajte za pomoć oko promocije vašeg oglasa.', 'Post a listing on the Poslovni Oglasi platform or contact us for help promoting your listing.')}
        inquiry="Poslovni Oglasi"
      />
    </>
  );
}
