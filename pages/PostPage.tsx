import { asset, withBase } from '../lib/asset';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { CTASection, PostCard, formatDate } from '../components/Blocks';
import { POSTS } from '../data/posts.generated';
import NotFoundPage from './NotFoundPage';
import { hl } from '../lib/hl';

export default function PostPage() {
  const { slug } = useParams();
  const post = POSTS.find(p => p.slug === slug);
  if (!post) return <NotFoundPage />;
  const more = POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
  return (
    <>
      <SEO title={post.title} description={post.description} image={post.cover ?? undefined} type="article" />
      <article className="post">
        <header className="container narrow post-header">
          <Link to="/vijesti/" className="text-link back-link"><ArrowLeft size={16} /> Vijesti</Link>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <h1>{post.title}</h1>
        </header>
        {post.cover && <div className="container narrow post-cover"><img src={asset(post.cover)} alt="" fetchPriority="high" /></div>}
        {/* HTML dolazi iz našeg REA importa (očišćen u scripts/import-rea.mjs), ne od korisnika */}
        <div className="container narrow prose" dangerouslySetInnerHTML={{ __html: withBase(post.html) }} />
      </article>
      <section className="section light">
        <div className="container">
          <h2 className="gallery-title">{hl('Još *vijesti*')}</h2>
          <div className="posts-grid">{more.map(p => <PostCard key={p.slug} post={p} />)}</div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
