import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { EditorialIntro, ClientClouds, ContactBand } from './ReferenceSections';
import ProjectShowcase from './ProjectShowcase';
import BrandServiceLinks from './BrandServiceLinks';
import ClientVoices from './ClientVoices';
export default function CreativeHome(){const {t,to}=useLang();return <div className="ref-home">
 <EditorialIntro id="marketing" label="Bonaco Media · Marketing" title={<>{t('Dobre ideje','Great ideas')}<br/><span>{t('šire krugove.','reach further.')}</span></>}><p>{t('Strategija, kreativa i produkcija. Povezujemo sve što vašem brendu treba da ostavi trag.','Strategy, design and production. Everything your brand needs to connect with people and leave a lasting impression.')}</p><Link to={to('/nase-usluge/')} className="ref-text-link">{t('Više o usluzi','Explore our services')}<ArrowUpRight size={20}/></Link></EditorialIntro>
 <ProjectShowcase home />
 <ClientClouds/><BrandServiceLinks/><ClientVoices/><ContactBand/>
 </div>;}
