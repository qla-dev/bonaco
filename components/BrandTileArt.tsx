import { useId } from 'react';
import type { Brand } from './BrandLogo';

const COLORS: Record<Brand, [string, string, string]> = {
  bonaco: ['#ffe0a6', '#ff9b38', '#a83a09'],
  bonexis: ['#b7fff0', '#31d8ce', '#00615e'],
  bonevents: ['#e4cfff', '#a17aff', '#46208f'],
};

/** Decorative vector artwork, shared by the home and about page tiles. */
export default function BrandTileArt({ brand }: { brand: Brand }) {
  const id = useId();
  const [light, mid, dark] = COLORS[brand];
  const fill = (name: string) => `url(#${id}-${name})`;

  return (
    <span className="bt-art" aria-hidden="true">
      <svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id={`${id}-surface`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={light} />
            <stop offset=".26" stopColor={mid} />
            <stop offset=".7" stopColor={dark} />
            <stop offset="1" stopColor={mid} />
          </linearGradient>
          <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2=".8">
            <stop stopColor={light} stopOpacity=".85" />
            <stop offset=".48" stopColor={mid} stopOpacity=".15" />
            <stop offset="1" stopColor={light} stopOpacity=".45" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="0" cy="0" r="1" gradientTransform="translate(30 0) rotate(45) scale(400 310)" gradientUnits="userSpaceOnUse">
            <stop stopColor={light} stopOpacity=".35" />
            <stop offset="1" stopColor={mid} stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M0 0H400V360H0Z" fill={fill('glow')} />

        {brand === 'bonaco' && (
          <>
            <g fill="none" stroke={fill('surface')}>
              <ellipse cx="-48" cy="384" rx="298" ry="220" transform="rotate(30 -48 384)" strokeWidth="48" />
              <ellipse cx="-48" cy="384" rx="228" ry="154" transform="rotate(30 -48 384)" strokeWidth="40" />
              <ellipse cx="-48" cy="384" rx="164" ry="96" transform="rotate(30 -48 384)" strokeWidth="32" />
              <ellipse cx="400" cy="-81" rx="150" ry="169" transform="rotate(32 400 -81)" strokeWidth="44" />
            </g>
            <g fill="none" stroke={fill('edge')} strokeWidth="1">
              <ellipse cx="-48" cy="384" rx="322" ry="244" transform="rotate(30 -48 384)" />
              <ellipse cx="-48" cy="384" rx="248" ry="174" transform="rotate(30 -48 384)" />
              <ellipse cx="-48" cy="384" rx="180" ry="112" transform="rotate(30 -48 384)" />
              <ellipse cx="400" cy="-81" rx="172" ry="191" transform="rotate(32 400 -81)" />
            </g>
          </>
        )}

        {brand === 'bonexis' && (
          <g transform="rotate(-34 200 180)" fill="none">
            <ellipse cx="200" cy="180" rx="256" ry="143" stroke={fill('surface')} strokeWidth="40" />
            <ellipse cx="200" cy="180" rx="276" ry="163" stroke={fill('edge')} />
            <ellipse cx="200" cy="180" rx="236" ry="123" stroke={fill('edge')} />
            <ellipse cx="200" cy="180" rx="312" ry="202" stroke={fill('edge')} strokeOpacity=".4" />
            <ellipse cx="200" cy="180" rx="349" ry="240" stroke={fill('surface')} strokeWidth="18" />
            <ellipse cx="200" cy="180" rx="358" ry="249" stroke={fill('edge')} />
            <circle cx="404" cy="90" r="4" fill={light} stroke={mid} strokeWidth="7" strokeOpacity=".25" />
          </g>
        )}

        {brand === 'bonevents' && (
          <>
            <path d="M-80 4C46-64 114 13 158 55S274 118 480-44" fill="none" stroke={dark} strokeOpacity=".5" strokeWidth="66" />
            <path d="M-80-7C46-75 114 2 158 44S274 107 480-55" fill="none" stroke={fill('surface')} strokeWidth="52" />
            <path d="M-80-33C46-101 114-24 158 18S274 81 480-81" fill="none" stroke={fill('edge')} />
            <path d="M-65 369C55 229 130 262 223 321S358 414 458 219" fill="none" stroke={dark} strokeOpacity=".6" strokeWidth="77" />
            <path d="M-65 356C55 216 130 249 223 308S358 401 458 206" fill="none" stroke={fill('surface')} strokeWidth="62" />
            <path d="M-65 325C55 185 130 218 223 277S358 370 458 175" fill="none" stroke={fill('edge')} />
            <path d="M347-58C458 91 328 125 380 244S495 322 466 439" fill="none" stroke={fill('surface')} strokeWidth="32" strokeOpacity=".5" />
            <path d="M331-58C442 91 312 125 364 244S479 322 450 439" fill="none" stroke={fill('edge')} strokeOpacity=".6" />
          </>
        )}
      </svg>
    </span>
  );
}
