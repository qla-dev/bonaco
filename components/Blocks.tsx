import { asset } from '../lib/asset';
// Manji dijeljeni blokovi: CTA, YouTube (učitava se na klik), logotipi, testimonijali, kartice.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';
import { CATEGORY_EN } from '../data/projects';
import { tr, useLang } from '../lib/i18n';
import type { Post, Project } from '../types';

export function CTASection({ title, text, inquiry }: { title?: string; text?: string; inquiry?: string }) {
  const { t, to } = useLang();
  return (
    <section className="section cta-section">
      <div className="container cta-inner">
        <div>
          <h2>{title ?? t('Imate projekat na umu?', 'Have a project in mind?')}</h2>
          <p>{text ?? t('Recite nam šta vam treba, a mi ćemo predložiti rješenje i okvirnu ponudu.', 'Tell us what you need and we will suggest a solution and a ballpark quote.')}</p>
        </div>
        <div className="btn-row">
          <Link to={to('/kontakt/') + (inquiry ? `?usluga=${encodeURIComponent(inquiry)}` : '')} className="btn btn-primary">{t('Zatražite ponudu', 'Request a quote')}</Link>
          <Link to={to('/portfolio/')} className="btn btn-secondary">{t('Pogledajte radove', 'See our work')}</Link>
        </div>
      </div>
    </section>
  );
}

export function YouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  const { t } = useLang();
  return (
    <div className="video">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button className="video-poster" onClick={() => setPlay(true)} aria-label={`${t('Pokreni video', 'Play video')}: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="video-play"><Play size={28} fill="currentColor" /></span>
        </button>
      )}
    </div>
  );
}

export function Testimonials({ ids }: { ids?: string[] }) {
  const list = ids ? TESTIMONIALS.filter(t => ids.includes(t.id)) : TESTIMONIALS;
  return (
    <div className="testimonials">
      {list.map(t => (
        <figure key={t.id} className="testimonial">
          <blockquote>„{t.text}“</blockquote>
          <figcaption>
            <img src={asset(t.photo)} alt="" width="48" height="48" loading="lazy" />
            <span>{t.company}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  return (
    <div className="t-carousel">
      <figure className="t-quote" key={t.id}>
        <blockquote>„{t.text}“</blockquote>
        <figcaption>{t.company}</figcaption>
      </figure>
      <div className="t-picker" role="tablist" aria-label="Odaberite klijenta">
        {TESTIMONIALS.map((x, k) => (
          <button key={x.id} role="tab" aria-selected={k === i} className={k === i ? 'is-on' : ''} onClick={() => setI(k)}>
            <img src={asset(x.photo)} alt="" width="44" height="44" loading="lazy" />
            <span>{x.company}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export const catLabel = (c: string, lang: 'bs' | 'en') => (lang === 'en' ? CATEGORY_EN[c] ?? c : c);

export function ProjectCard({ p }: { p: Project }) {
  const { lang, to } = useLang();
  const x = tr(p, lang);
  return (
    <Link to={to(`/portfolio/${p.slug}/`)} className="project-card">
      <div className="project-media"><img src={asset(p.cover)} alt={x.coverAlt} loading="lazy" /></div>
      <div className="project-body">
        <span className="project-cats">{p.categories.map(c => catLabel(c, lang)).join(' · ')}</span>
        <h3>{p.client}</h3>
        <p>{x.summary}</p>
      </div>
    </Link>
  );
}

const fmt = new Intl.DateTimeFormat('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' });
export const formatDate = (d: string) => (d ? fmt.format(new Date(d)) : '');

export function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/${post.slug}/`} className="post-card">
      {post.cover && <div className="post-media"><img src={asset(post.cover)} alt="" loading="lazy" /></div>}
      <div className="post-body">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <h3>{post.title}</h3>
        <span className="text-link">Pročitajte <ArrowRight size={16} /></span>
      </div>
    </Link>
  );
}

export function SectionHead({ eyebrow, title, text, link }: { eyebrow?: string; title: string; text?: string; link?: { to: string; label: string } }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {text && <p className="lead">{text}</p>}
      </div>
      {link && <Link to={link.to} className="text-link">{link.label} <ArrowRight size={16} /></Link>}
    </div>
  );
}
