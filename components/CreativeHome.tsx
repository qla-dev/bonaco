import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_2026 } from '../data/portfolio2026';
import { useLang } from '../lib/i18n';
import { EditorialIntro, WorkGrid, ClientClouds, ContactBand } from './ReferenceSections';
import BrandServiceLinks from './BrandServiceLinks';
export default function CreativeHome(){const {t,to}=useLang();return <div className="ref-home">
 <EditorialIntro id="marketing" label="Bonaco Media · Marketing" title={<>{t('Dobre ideje','Good ideas')}<br/><span>{t('šire krugove.','make waves.')}</span></>}><p>{t('Strategija, kreativa i produkcija. Povezujemo sve što vašem brendu treba da ostavi trag.','Strategy, creativity and production. We connect everything your brand needs to make its mark.')}</p><Link to={to('/nase-usluge/')} className="ref-text-link">{t('Više o usluzi','Explore our services')}<ArrowUpRight size={20}/></Link></EditorialIntro>
 <section className="ref-wrap ref-selected" id="odabrani-radovi"><WorkGrid projects={PORTFOLIO_2026.slice(0,6)} wave/><div className="ref-work-bottom"><span>{t('Pređi mišem za valove. Dodirni za cijelu fotografiju.','Move to make waves. Tap to see the full photo.')}</span><Link className="ref-pill" to={to('/portfolio/')}>{t('Svi radovi','All work')}<ArrowUpRight size={18}/></Link></div></section>
 <ClientClouds/><BrandServiceLinks/><ContactBand/>
 </div>;}
