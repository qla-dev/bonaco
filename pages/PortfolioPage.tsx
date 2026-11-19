import SEO from '../components/SEO';
import { ClientClouds, ContactBand } from '../components/ReferenceSections';
import ProjectShowcase from '../components/ProjectShowcase';
import { useLang } from '../lib/i18n';
export default function PortfolioPage() {
  const { t } = useLang();
  return <div className="ref-page">
    <SEO title={t('Radovi', 'Work')} description={t('Odabrani radovi Bonaco Media: društvene mreže, kampanje, produkcija i web dizajn.', 'Selected Bonaco Media work: social media, campaigns, production and web design.')} />
    <ProjectShowcase /><ClientClouds /><ContactBand />
  </div>;
}
