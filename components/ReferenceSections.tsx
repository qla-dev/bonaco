import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { CLIENTS } from '../data/clients';
import { CATEGORY_EN } from '../data/projects';
import { PROJECT_FOCUS, PROJECT_CONTAIN, PROJECT_SCALE } from '../data/portfolio2026';
import { asset } from '../lib/asset';
import { tr, useLang } from '../lib/i18n';
import type { Project } from '../types';
import BrandLogo from './BrandLogo';
import PoslovniOglasiLogo from './PoslovniOglasiLogo';
import CircleMosaic from './CircleMosaic';

export function EditorialIntro({label,title,children,id,secondary=false}:{label:string;title:ReactNode;children?:ReactNode;id?:string;secondary?:boolean}) {
 const Heading=secondary?'h2':'h1'; return <section className="ref-intro ref-wrap" id={id}><p className="ref-eyebrow"><i/>{label}</p><div><Heading>{title}</Heading>{children}</div></section>;
}
export function CirclePhoto({src,alt,position='50% 50%',contain=false,scale=1}:{src:string;alt:string;position?:string;contain?:boolean;scale?:number}) {
 return <CircleMosaic src={src} alt={alt} position={position} contain={contain} scale={scale} />;
}
export function WorkGrid({projects}:{projects:Project[];wave?:boolean}) {
 const {lang,to,t}=useLang();
 return <div className="ref-work-grid">{projects.map(p=>{const x=tr(p,lang);return <article className="ref-work-card" key={p.slug}>
   <CircleMosaic src={p.cover} alt={x.coverAlt} position={PROJECT_FOCUS[p.slug]} contain={PROJECT_CONTAIN.includes(p.slug)} scale={PROJECT_SCALE[p.slug]} projectTo={to('/portfolio/'+p.slug+'/')} />
   <Link className="ref-card-title" to={to('/portfolio/'+p.slug+'/')}><h2>{p.client}</h2><ArrowUpRight aria-hidden="true" size={23}/></Link>
   <div className="ref-card-meta">
     <Link className="ref-story-link" to={to('/portfolio/'+p.slug+'/')}>{t('Vidi projekat','View project')}<ArrowUpRight size={13} aria-hidden="true" /></Link>
   </div>
   <div className="ref-tags">{p.categories.map(c=><span key={c}>{lang==='en'?(CATEGORY_EN[c]||c):c}</span>)}</div>
 </article>})}</div>;
}
export function ClientClouds() {
 const {t}=useLang();const [paused,setPaused]=useState(false);
 return <section className={'client-clouds'+(paused?' is-paused':'')} aria-label={t('Klijenti sa kojima smo radili','Clients we have worked with')}>
  <div className="cloud-viewport"><div className="cloud-track">{[0,1].map(copy=><div className="cloud-group" key={copy} aria-hidden={copy===1?true:undefined}>{CLIENTS.map(c=><div className="client-cloud" data-client={c.id} key={c.id}><img src={asset(c.logo)} alt={copy===0?c.name:''} loading="lazy" width="110" height="110"/></div>)}</div>)}</div></div>
  <button type="button" className="cloud-pause" aria-pressed={paused} onClick={()=>setPaused(!paused)} aria-label={paused?t('Pokreni logotipe','Play logos'):t('Pauziraj logotipe','Pause logos')}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>
 </section>;
}
export function ContactBand() {
 const {t,to}=useLang();
 return <section className="ref-contact-band ref-wrap"><h2><Link to={to('/kontakt/')}>{t('Koliko daleko može vaša ideja?','How far can your idea go?')}<ArrowUpRight aria-hidden="true"/></Link></h2></section>;
}
export function BrandOrbit({compact=false}:{compact?:boolean}) {
 const {t,to}=useLang();
 return <section className={'brand-orbit'+(compact?' is-compact':'')} aria-label={t('Bonaco i povezani brendovi','The Bonaco brand family')}>
  <div className="orbit-rings" aria-hidden="true"><i/><i/><i/></div>
  <Link to={to('/nase-usluge/')} className="orbit-core"><BrandLogo/><span>Marketing</span></Link>
  {!compact&&<h1>{t('Jedan krug.','One circle.')}<br/><span>{t('Više mogućnosti.','Many possibilities.')}</span></h1>}
  <div className="orbit-branches">
    <Link to={to('/bonexis/')} className="orbit-brand orbit-ai"><BrandLogo brand="bonexis"/><span>{t('AI rješenja · Uskoro','AI solutions · Coming soon')}</span></Link>
    <Link to={to('/bonevents/')} className="orbit-brand orbit-events"><BrandLogo brand="bonevents"/><span>{t('Događaji i produkcija','Events and production')}</span></Link>
    <Link to={to('/poslovni-oglasi/')} className="orbit-brand orbit-po"><PoslovniOglasiLogo/><span>{t('Poslovni oglasi','Careers and recruitment')}</span></Link>
  </div>
 </section>;
}
