import { asset } from '../lib/asset';

export default function PoslovniOglasiLogo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const file = tone === 'light' ? 'poslovni-oglasi-wordmark-white.png' : 'poslovni-oglasi-wordmark.png';
  return <img className="poslovni-wordmark" src={asset('/media/' + file)} alt="Poslovni oglasi" width="1627" height="252" />;
}
