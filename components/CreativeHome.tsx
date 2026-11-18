import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_2026 } from '../data/portfolio2026';
import { useLang } from '../lib/i18n';
import { EditorialIntro, WorkGrid, ClientClouds, ContactBand } from './ReferenceSections';
import BrandServiceLinks from './BrandServiceLinks';
import ClientVoices from './ClientVoices';
export default function CreativeHome(){const {t,to}=useLang();return <div className="ref-home">
 <EditorialIntro id="marketing" label="Bonaco Media · Marketing" title={<>{t('Dobre ideje','Great ideas')}<br/><span>{t('šire krugove.','reach further.')}</span></>}><p>{t('Strategija, kreativa i produkcija. Povezujemo sve što vašem brendu treba da ostavi trag.','Strategy, design and production. Everything your brand needs to connect with people and leave a lasting impression.')}</p><Link to={to('/nase-usluge/')} className="ref-text-link">{t('Više o usluzi','Explore our services')}<ArrowUpRight size={20}/></Link></EditorialIntro>
 <section className="ref-wrap ref-selected" id="odabrani-radovi"><WorkGrid projects={PORTFOLIO_2026.slice(0,6)} wave/><div className="ref-work-bottom"><span className="work-desktop-hint">{t('Pređi mišem za valove. Dodirni za cijelu fotografiju.','Hover to make waves. Select a photo to see the full image.')}</span><span className="work-mobile-hint">{t('Prevucite za još radova · Dodirnite fotografiju','Swipe to explore · Tap a photo to see more')}</span><Link className="ref-pill" to={to('/portfolio/')}>{t('Svi radovi','View all work')}<ArrowUpRight size={18}/></Link></div></section>
 <ClientClouds/><BrandServiceLinks/><ClientVoices/><ContactBand/>
 </div>;}
