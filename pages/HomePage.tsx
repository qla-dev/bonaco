// Početna (dorade v08): pet glavnih sekcija.
// 1) Video/hero preko cijelog prvog ekrana 2) Marketing (tabovi usluga, radovi, kompaktni klijenti)
// 3) Bonexis 4) BonEvents 5) Kontakt i upit.
import SEO from '../components/SEO';
import HeroVideo from '../components/HeroVideo';
import MarketingTabs from '../components/MarketingTabs';
import ContactBlock from '../components/ContactBlock';
import { BonEventsBlock, BonexisCapsules } from '../components/Circles';
import { SITE } from '../data/site';
import { useLang } from '../lib/i18n';

export default function HomePage() {
  const { t } = useLang();
  return (
    <>
      <SEO
        title={SITE.name}
        description={t(
          'Bonaco Media je full-service marketinška agencija iz Sarajeva: strategija i kampanje, društvene mreže, dizajn i branding, foto i video, web i SEO, OOH. Uz Bonexis AI rješenja i BonEvents.',
          'Bonaco Media is a full-service marketing agency from Sarajevo: strategy and campaigns, social media, design and branding, photo and video, web and SEO, OOH. Plus Bonexis AI solutions and BonEvents.',
        )}
      />
      <HeroVideo />
      <MarketingTabs />
      <BonexisCapsules />
      <BonEventsBlock />
      <ContactBlock id="kontakt" />
    </>
  );
}
