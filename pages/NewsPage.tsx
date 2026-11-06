import SEO from '../components/SEO';
import { PostCard } from '../components/Blocks';
import { POSTS } from '../data/posts.generated';
import { hl } from '../lib/hl';

export default function NewsPage() {
  return (
    <>
      <SEO title="Vijesti" description="Novosti, savjeti i trendovi iz digitalnog marketinga: društvene mreže, SEO, dizajn i nove tehnologije." />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Vijesti</span>
          <h1>{hl('Iz našeg *ugla*')}</h1>
          <p className="lead">Novosti iz agencije, savjeti i trendovi iz digitalnog marketinga.</p>
        </div>
      </section>
      <section className="section">
        <div className="container posts-grid">
          {POSTS.map(p => <PostCard key={p.slug} post={p} />)}
        </div>
      </section>
    </>
  );
}
