import SEO from '../components/SEO';
import HeroReel from '../components/HeroReel';
import CreativeHome from '../components/CreativeHome';


import { SITE } from '../data/site';
import { useLang } from '../lib/i18n';

export default function HomePage() {
  const { t } = useLang();
  return (
    <>
      <SEO
        title={SITE.name}
        description={t(
          'Bonaco Media je full-service marketinška agencija iz Sarajeva: strategija i kampanje, društvene mreže, dizajn i branding, foto i video, web dizajn, OOH. Uz Bonexis AI rješenja.',
          'Bonaco Media is a full-service marketing agency from Sarajevo: strategy and campaigns, social media, design and branding, photo and video, web design, OOH. Plus Bonexis AI solutions.',
        )}
      />
      <div className="bonaco-creative"><HeroReel /><CreativeHome /></div>
    </>
  );
}
