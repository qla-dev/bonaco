export interface MosaicCircle { x: number; y: number; r: number }

// Seeded packing keeps each photograph distinct and stable across renders.
export function mosaicCircles(key: string, portrait = false): MosaicCircle[] {
  let seed = 2166136261;
  for (const char of key) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  const random = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let n = Math.imul(seed ^ seed >>> 15, 1 | seed); n ^= n + Math.imul(n ^ n >>> 7, 61 | n); return ((n ^ n >>> 14) >>> 0) / 4294967296; };
  const circles: MosaicCircle[] = [portrait ? { x: 390, y: 150, r: 120 } : { x: 270 + random() * 65, y: 190 + random() * 45, r: 108 + random() * 12 }];
  for (const target of [95, 86, 78, 70, 62, 54, 47, 40, 33]) {
    let placed = false;
    for (let r = target * (.94 + random() * .12); r >= 22 && !placed; r -= 5) {
      let best: MosaicCircle | undefined;
      let bestScore = -Infinity;
      for (let sample = 0; sample < 400; sample++) {
        const x = r + 4 + random() * (592 - r * 2);
        const y = r + 4 + random() * (442 - r * 2);
        const clearance = Math.min(...circles.map(c => Math.hypot(x - c.x, y - c.y) - r - c.r));
        if (clearance < 6) continue;
        const edge = Math.min(x - r, y - r, 600 - x - r, 450 - y - r);
        const score = Math.min(clearance, edge) + random() * 4;
        if (score > bestScore) { bestScore = score; best = { x, y, r }; }
      }
      if (best) { circles.push(best); placed = true; }
    }
  }
  return circles;
}

const masks = new Map<string, string>();
export function mosaicMask(src: string, portrait = false): string {
  const key = src + (portrait ? '#portrait' : '');
  if (!masks.has(key)) {
    const circles = mosaicCircles(key, portrait).map(({x,y,r}) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="white"/>`).join('');
    masks.set(key, 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">' + circles + '</svg>') + '")');
  }
  return masks.get(key)!;
}
