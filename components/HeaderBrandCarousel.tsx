import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import BrandLogo, { BRANDS, type Brand } from './BrandLogo';

const brands: { id: Brand; path: string }[] = [
  { id: 'bonaco', path: '/' },
  { id: 'bonexis', path: '/bonexis/' },
];

export default function HeaderBrandCarousel({ selected }: { selected: Brand }) {
  const { t, to } = useLang();
  const active = brands.findIndex(brand => brand.id === selected);
  return <nav className="header-brand-carousel" aria-label={t('Bonaco brendovi', 'Bonaco brands')}>
    {brands.map((brand, index) => {
      const offset = (index - active + brands.length) % brands.length;
      const position = offset === 0 ? 'front' : offset === 1 ? 'right' : 'left';
      return <Link key={brand.id} to={to(brand.path)} className="header-brand-slide" data-position={position}
        aria-current={offset === 0 ? 'true' : undefined} aria-label={BRANDS[brand.id].name}>
        <span className="header-brand-face"><BrandLogo brand={brand.id} /></span>
      </Link>;
    })}
  </nav>;
}
