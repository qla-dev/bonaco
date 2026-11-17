import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import SEO from '../components/SEO';
import { CirclePhoto, WorkGrid, ClientClouds, ContactBand } from '../components/ReferenceSections';
import { PROJECTS, CATEGORY_EN } from '../data/projects';
import { PORTFOLIO_2026, PROJECT_PHOTOS, PROJECT_FOCUS, PROJECT_CONTAIN, PROJECT_FILMS } from '../data/portfolio2026';
import { GALLERIES } from '../data/galleries.generated';
import { asset } from '../lib/asset';
import { tr, useLang } from '../lib/i18n';
import ProjectFilmPlayer from '../components/ProjectFilmPlayer';
import NotFoundPage from './NotFoundPage';
import { PROJECT_STORIES } from '../data/projectStories';
export default function ProjectPage(){
 const {slug}=useParams();const p=PROJECTS.find(p=>p.slug===slug);const {lang,t,to}=useLang();
 const [lightbox,setLightbox]=useState(-1);const dialog=useRef<HTMLDialogElement>(null);const close=useRef<HTMLButtonElement>(null);const lastFocus=useRef<HTMLElement|null>(null);
 const photos=p?(PROJECT_PHOTOS[p.slug]??(p.gallery?(GALLERIES[p.gallery]??[]).map(g=>g.src):[])):[];
 useEffect(()=>{setLightbox(-1);},[slug]);
 useEffect(()=>{if(lightbox<0){dialog.current?.close();lastFocus.current?.focus();return;}if(!dialog.current?.open){lastFocus.current=document.activeElement as HTMLElement;dialog.current?.showModal();close.current?.focus();}const key=(e:KeyboardEvent)=>{if(e.key==='ArrowRight')setLightbox(n=>(n+1)%photos.length);if(e.key==='ArrowLeft')setLightbox(n=>(n+photos.length-1)%photos.length);};addEventListener('keydown',key);return()=>removeEventListener('keydown',key);},[lightbox,photos.length]);
 if(!p)return <NotFoundPage/>;const x=tr(p,lang);const story=PROJECT_STORIES[p.slug];const index=PORTFOLIO_2026.findIndex(n=>n.slug===p.slug);const next=PORTFOLIO_2026[(index+1)%PORTFOLIO_2026.length];
 return <div className="ref-page ref-case"><SEO title={p.client+' — '+x.title} description={x.summary} image={p.cover}/><article><header className="ref-wrap ref-case-heading"><Link className="ref-text-link" to={to('/portfolio/')}><ArrowLeft size={16}/>{t('Radovi','Work')}</Link><h1>{p.client}</h1><p>{x.title}</p></header><div className="ref-wrap ref-case-intro"><CirclePhoto src={p.cover} alt={x.coverAlt} position={PROJECT_FOCUS[p.slug]} contain={PROJECT_CONTAIN.includes(p.slug)}/><div><div className="ref-tags">{p.categories.map(c=><span key={c}>{lang==='en'?(CATEGORY_EN[c]||c):c}</span>)}</div><p className="ref-case-summary">{x.summary}</p>{!story&&<><p className="ref-eyebrow">{t('Naš angažman','Our role')}</p><ul>{x.work.map(w=><li key={w}>{w}</li>)}</ul></>}{x.results.length>0&&<div className="ref-case-results"><p className="ref-eyebrow">{t('Rezultat kampanje','Campaign result')}</p>{x.results.map(r=><p key={r}>{r}</p>)}</div>}{p.url&&<a className="ref-text-link" href={p.url} target="_blank" rel="noopener noreferrer">{t('Pogledaj web','View website')}<ArrowUpRight size={18}/></a>}</div></div>
 {story && <section className="ref-wrap project-story" aria-label={t('Priča projekta','Project story')}>
   <article><span aria-hidden="true">01</span><h2>{t('Zadatak','The task')}</h2><p>{lang==='en'?story.taskEn:story.task}</p></article>
   <article><span aria-hidden="true">02</span><h2>{t('Naša ideja','Our idea')}</h2><p>{lang==='en'?story.ideaEn:story.idea}</p></article>
   <article><span aria-hidden="true">03</span><h2>{t('Izvedba','The execution')}</h2><ul>{x.work.map(w=><li key={w}>{w}</li>)}</ul></article>
 </section>}
 {PROJECT_FILMS[p.slug] && <section className="ref-wrap ref-case-film"><ProjectFilmPlayer film={PROJECT_FILMS[p.slug]} /></section>}
 {photos.length>0&&<section className="ref-wrap ref-case-gallery"><div className="ref-section-line"><h2>{t('Izbliza.','A closer look.')}</h2><span>{t('Odabrani kadrovi','Selected frames')}</span></div><div className="ref-gallery-grid">{photos.map((src,i)=><figure key={src}><button type="button" onClick={()=>setLightbox(i)} aria-label={t('Otvori fotografiju ','Open photo ')+(i+1)}><CirclePhoto src={src} alt={p.client+' — '+(i+1)} position={src.includes('campaign')||src.includes('award')||src.includes('host')?'50% 20%':'50% 50%'}/></button>{p.slug==='jovs'&&<figcaption>{src.includes('campaign')?t('Studijska kampanja','Studio campaign'):src.includes('room')?t('Priprema događaja','Event preparation'):t('Detalji događaja','Event details')}</figcaption>}</figure>)}</div></section>}</article><section className="ref-wrap ref-next"><p className="ref-eyebrow">{t('Sljedeći projekat','Next project')}</p><WorkGrid projects={[next]}/></section><ClientClouds/><ContactBand/>
 <dialog className="ref-lightbox" ref={dialog} onCancel={()=>setLightbox(-1)} onClick={e=>{if(e.target===e.currentTarget)setLightbox(-1);}}>{lightbox>=0&&<><img src={asset(photos[lightbox])} alt={p.client+' — '+(lightbox+1)}/><button ref={close} className="ref-lb-close" onClick={()=>setLightbox(-1)} aria-label={t('Zatvori','Close')}><X/></button><button className="ref-lb-prev" onClick={()=>setLightbox((lightbox+photos.length-1)%photos.length)} aria-label={t('Prethodna','Previous')}><ChevronLeft/></button><button className="ref-lb-next" onClick={()=>setLightbox((lightbox+1)%photos.length)} aria-label={t('Sljedeća','Next')}><ChevronRight/></button><span>{lightbox+1} / {photos.length}</span></>}</dialog></div>;
}
