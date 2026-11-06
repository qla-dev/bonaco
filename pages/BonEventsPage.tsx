import { asset } from '../lib/asset';
import SEO from '../components/SEO';
import { CTASection } from '../components/Blocks';
import { BonEventsBlock } from '../components/Circles';
import { GALLERIES } from '../data/galleries.generated';
import { EVENT_PROCESS, EVENT_TYPES } from '../data/bonevents';
import BrandIcon from '../components/BrandIcon';
import { useLang } from '../lib/i18n';
import { hl } from '../lib/hl';

const GALLERY = (GALLERIES['summer-lounge'] ?? []).slice(0, 9);

export default function BonEventsPage() {
  const { lang, t } = useLang();
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

      {/* Vrste događaja */}
      <section className="section bev-more" data-brand="bonevents">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t('Šta organizujemo', 'What we organise')}</span>
              <h2>{hl(t('Vrste *događaja*', 'Types of *events*'))}</h2>
              <p className="lead">{t('Od intimnih poslovnih okupljanja do cijelih ljetnih sezona, uvijek s jasnim ciljem za brend.', 'From intimate business gatherings to entire summer seasons, always with a clear goal for the brand.')}</p>
            </div>
          </div>
          <ul className="ev-types">
            {EVENT_TYPES.map(x => (
              <li key={x.bs}><span className="ev-icon"><BrandIcon name={x.icon} size={24} /></span><span>{x[lang]}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* Proces */}
      <section className="section bev-more" data-brand="bonevents">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t('Kako radimo', 'How we work')}</span>
              <h2>{hl(t('Od briefa do *aftermovieja*', 'From brief to *aftermovie*'))}</h2>
            </div>
          </div>
          <ol className="ev-process">
            {EVENT_PROCESS.map((x, i) => (
              <li key={x.bs.title}>
                <span className="ev-icon"><BrandIcon name={x.icon} size={24} /></span>
                <span className="ev-step">{String(i + 1).padStart(2, '0')}</span>
                <h3>{x[lang].title}</h3>
                <p>{x[lang].text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {GALLERY.length > 0 && (
        <section className="section light" data-brand="bonevents">
          <div className="container">
            <h2 className="gallery-title">{hl(t('Iz naših *događaja*', 'From our *events*'))}</h2>
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
        title={t('Planirate *događaj*?', 'Planning an *event*?')}
        text={t('Pošaljite datum, okvirni broj gostiju i ideju, a mi ćemo predložiti koncept i ponudu.', 'Send us the date, the expected number of guests and your idea, and we will suggest a concept and a quote.')}
        inquiry="BonEvents"
      />
    </>
  );
}
