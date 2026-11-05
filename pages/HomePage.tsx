import { asset } from '../lib/asset';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import SEO from '../components/SEO';
import HeroStage from '../components/HeroStage';
import ServiceIcon from '../components/ServiceIcon';
import BonexisSection from '../components/bonexis/BonexisSection';
import { ClientLogos, PostCard, ProjectCard, Stats, TestimonialCarousel, YouTube } from '../components/Blocks';
import SocialIcon from '../components/SocialIcon';
import { PROJECTS } from '../data/projects';
import { SERVICES } from '../data/services';
import { SITE, SOCIAL, VIDEOS } from '../data/site';
import { POSTS } from '../data/posts.generated';
import { GALLERIES } from '../data/galleries.generated';

const FOLLOW = [
  ...(GALLERIES['summer-lounge'] ?? []).slice(1, 3),
  ...(GALLERIES['beautyco'] ?? []).slice(1, 3),
  ...(GALLERIES['bh-travel'] ?? []).slice(1, 2),
  ...(GALLERIES['summer-lounge'] ?? []).slice(5, 6),
];

// Sa stare stranice "O nama" (REA export)
const PILLARS = [
  { title: 'Misija', text: 'Pomažemo kompanijama da se istaknu u digitalnom svijetu kroz strategije za društvene mreže, SEO, web i grafički dizajn, evente te fotografiju i video.' },
  { title: 'Dugoročna saradnja', text: 'Strategije prilagođavamo ciljevima svakog klijenta i gradimo odnose koji traju godinama, a ne jednu kampanju.' },
  { title: 'Nove tehnologije', text: 'Pratimo trendove prije nego postanu standard. Zato smo razvili i vlastite AI alate pod imenom Bonexis.' },
];

export default function HomePage() {
  return (
    <>
      <SEO
        title={SITE.name}
        description="Bonaco Media je agencija za digitalni marketing iz Sarajeva: društvene mreže, SEO, web i grafički dizajn, event management, foto i video te Bonexis AI alati."
      />

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">Agencija za digitalni marketing iz Sarajeva</p>
            <h1>Jedina agencija koja vam je potrebna</h1>
            <p className="lead">
              Društvene mreže, web, dizajn, foto i video te eventi pod jednim krovom od {SITE.founded}. godine, a sada i uz vlastite AI agente.
            </p>
            <div className="btn-row">
              <Link to="/kontakt/" className="btn btn-primary btn-lg">Zatražite ponudu</Link>
              <Link to="/portfolio/" className="btn btn-secondary btn-lg">Pogledajte radove</Link>
            </div>
            <Stats />
          </div>
          <HeroStage />
        </div>
      </section>

      <section className="logos-band" aria-label="Klijenti">
        <ClientLogos />
      </section>

      {/* 1. Usluge */}
      <section className="section light" id="usluge">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Sve za vaš brend na jednom mjestu</h2>
              <p className="lead">Kreiramo personalizirane strategije i izvodimo ih od prve objave do velikog eventa.</p>
            </div>
            <Link to="/nase-usluge/" className="text-link">Sve usluge <ArrowRight size={16} /></Link>
          </div>
          <div className="services-grid">
            {SERVICES.map(s => (
              <Link key={s.slug} to={`/nase-usluge/#${s.slug}`} className="service-card">
                <span className="service-icon"><ServiceIcon slug={s.slug} size={26} /></span>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
              </Link>
            ))}
            <Link to="/bonexis/" className="service-card service-card-ai">
              <span className="service-icon"><ServiceIcon slug="bonexis" size={26} /></span>
              <h3>Bonexis AI agenti</h3>
              <p>Šest AI agenata za klijente, SEO, pozive, kapacitete i kontrolu isporuke.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Bonexis: chat pa AI tim */}
      <section className="bonexis-home" aria-label="Bonexis">
        <BonexisSection />
      </section>

      {/* 3. Radovi */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Odabrani radovi</h2>
              <p className="lead">Projekti za brendove iz regije, od društvenih mreža do web stranica i evenata.</p>
            </div>
            <Link to="/portfolio/" className="text-link">Svi projekti <ArrowRight size={16} /></Link>
          </div>
          <div className="projects-grid">
            {PROJECTS.slice(0, 4).map(p => <ProjectCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {/* 4. O nama, vizija, misija */}
      <section className="section light" id="o-nama">
        <div className="container">
          <div className="about-grid">
            <div>
              <h2>Spoj kreativnosti i strategije</h2>
              <p className="lead">
                Bonaco Media je agencija za digitalni marketing sa sjedištem u Sarajevu, osnovana {SITE.founded}. godine. Za nekoliko godina postali smo pouzdan partner domaćim i međunarodnim klijentima.
              </p>
              <p>Naš tim mladih i obrazovanih profesionalaca slaže svaki detalj vašeg marketinga kao slagalicu: svaki komadić ima svoje mjesto u strategiji.</p>
            </div>
            <div className="showreel">
              <YouTube id={VIDEOS.showreel} title="Bonaco Media – pogledajte naš rad" />
            </div>
          </div>
          <div className="vision">
            <div className="vision-card">
              <h3>Vizija</h3>
              <p>Povezati brendove s pravom publikom i stvoriti trajne digitalne veze koje povećavaju angažman i povjerenje. Cilj nam je da postanemo vodeća agencija za digitalni marketing u regiji.</p>
            </div>
            <div className="pillars">
              {PILLARS.map(p => (
                <div key={p.title} className="pillar">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recenzije klijenata */}
      <section className="section">
        <div className="container">
          <h2 className="center-title">Šta kažu naši klijenti</h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* 6. Pratite nas */}
      <section className="section light">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Pratite nas</h2>
              <p className="lead">Projekti, eventi i reelsi iza kulisa.</p>
            </div>
          </div>
          <div className="follow-grid">
            {FOLLOW.map(img => (
              <a key={img.src} href={SOCIAL[0].href} target="_blank" rel="noopener" className="follow-tile" aria-label="Pogledajte na Instagramu">
                <img src={asset(img.thumb)} alt="" loading="lazy" />
              </a>
            ))}
          </div>
          <div className="follow-links">
            {SOCIAL.map(s => (
              <a key={s.id} href={s.href} target="_blank" rel="noopener" className="btn btn-outline-dark">
                <SocialIcon id={s.id} /> {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Vijesti */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Vijesti</h2>
            <Link to="/vijesti/" className="text-link">Sve vijesti <ArrowRight size={16} /></Link>
          </div>
          <div className="posts-grid">
            {POSTS.slice(0, 3).map(p => <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>

      {/* 8. Slogan sa stare stranice */}
      <section className="section slogan">
        <div className="container slogan-inner">
          <h2>Ako vam je marketing onako, pozovite Bonaco!</h2>
          <p>Zakažite besplatne konsultacije i zajedno ćemo vidjeti gdje vaš brend može rasti.</p>
          <div className="btn-row">
            <a href={SITE.phoneHref} className="btn btn-primary btn-lg"><Phone size={18} /> {SITE.phone}</a>
            <Link to="/kontakt/" className="btn btn-secondary btn-lg">Pošaljite upit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
