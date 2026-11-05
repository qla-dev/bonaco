import { asset } from '../lib/asset';
import SEO from '../components/SEO';
import { CTASection } from '../components/Blocks';
import { BonEventsBlock } from '../components/Circles';
import { GALLERIES } from '../data/galleries.generated';
import { useLang } from '../lib/i18n';

const GALLERY = (GALLERIES['summer-lounge'] ?? []).slice(0, 9);

export default function BonEventsPage() {
  const { t } = useLang();
  return (
    <>
      <SEO
        title={t('BonEvents – organizacija i produkcija događaja', 'BonEvents – event planning and production')}
        description={t(
          'BonEvents planira, producira i promoviše događaje za brendove: organizacija, produkcija, hostese, foto i video. Reference: JOVS i Summer Lounge.',
          'BonEvents plans, produces and promotes events for brands: organisation, production, hosts, photo and video. References: JOVS and Summer Lounge.',
        )}
        image={GALLERY[0]?.src}
      />
      <BonEventsBlock page />
      {GALLERY.length > 0 && (
        <section className="section light" data-brand="bonevents">
          <div className="container">
            <h2 className="gallery-title">{t('Iz naših događaja', 'From our events')}</h2>
            <div className="gallery">
              {GALLERY.map((g, i) => (
                <figure key={g.src} className="gallery-item">
                  <img src={asset(g.thumb)} alt={t(`Summer Lounge, fotografija ${i + 1}`, `Summer Lounge, photo ${i + 1}`)} loading="lazy" width={g.width} height={g.height} />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
      <CTASection
        title={t('Planirate događaj?', 'Planning an event?')}
        text={t('Pošaljite datum, okvirni broj gostiju i ideju, a mi ćemo predložiti koncept i ponudu.', 'Send us the date, the expected number of guests and your idea, and we will suggest a concept and a quote.')}
        inquiry="BonEvents"
      />
    </>
  );
}
