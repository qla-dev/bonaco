// Bonexis 3D office: izometrijska kancelarija sa AI agentima (three.js).
// U centru je "Ben AI" jezgra; cijevi vode podatke od Bena do svakog agenta.
// React upravlja panelom i dugmadima; ova scena javlja hover/klik i prima odabir preko select().
import * as THREE from 'three';

export interface OfficeOptions {
  agentNames: string[];
  /** Imena persona (Vida, Selma…); ako postoje, prikazuju se kao naslov na ekranu agenta. */
  personas?: string[];
  onHover: (index: number, x: number, y: number) => void;
  onSelect: (index: number) => void;
  /** Ako je true, soba se pomjera desno da ne prekriva uvodni tekst lijevo. */
  offsetForIntro?: boolean;
}
export interface OfficeHandle {
  select: (index: number) => void;
  destroy: () => void;
}

const C = {
  floor: 0x2b221c, wall: 0x3b2f27, wall2: 0x33281f, wood: 0x6b4a36, woodDark: 0x4a3326,
  copper: 0x936149, copperLight: 0xd9a385, metal: 0x1d1714, robot: 0xece4dc, chair: 0x231b16, plant: 0x5f8f5a,
  plant2: 0x4f7d4b, fabric: 0x5a3d2d, fabricDark: 0x4d3426, rug: 0x3f2a20, cream: 0xd8cbbd,
};
const GREEN = '#7fc79a', RED = '#e07a6a', AMBER = '#e3b55a', CU = '#d9a385', MUTED = '#8f817a', TXT = '#f4ede8';
const SW = 360, SH = 230;

type Ctx = CanvasRenderingContext2D;
const mark = (ctx: Ctx, x: number, y: number, ok: boolean) => {
  ctx.fillStyle = ok ? GREEN : RED; ctx.font = '700 16px Poppins, sans-serif'; ctx.fillText(ok ? '✓' : '✗', x, y);
};

// Animacije na ekranima agenata, po redu kao u data/bonexis.ts (BONEXIS v3.0, 7 kapsula):
// 0 Lana (K1), 1 Selma (K2), 2 Edin (K3), 3 Lejla (K4), 4 Sara (asistent u K4), 5 Kenan (K5), 6 Dino (K6), 7 Ada (K7)
const DRAW: ((ctx: Ctx, t: number) => void)[] = [
  (ctx, t) => { // Lana: Social Media, kalendar objava
    const days = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'], today = Math.floor(t * 0.4) % 7;
    days.forEach((d, k) => {
      const x = 18 + k * 47;
      ctx.fillStyle = k === today ? 'rgba(217,163,133,0.35)' : 'rgba(244,237,232,0.07)'; ctx.fillRect(x, 46, 41, 30);
      ctx.fillStyle = k === today ? TXT : MUTED; ctx.font = '600 11px Poppins, sans-serif'; ctx.fillText(d, x + 8, 50);
      if (k % 2 === 0 || k === 3) { ctx.fillStyle = CU; ctx.beginPath(); ctx.arc(x + 20, 69, 3.5, 0, 7); ctx.fill(); }
    });
    const posts = ['Reel: iza kulisa', 'Carousel: 5 savjeta', 'Story: anketa', 'Objava: novi klijent'];
    const st: [string, string][] = [['Predloženo', MUTED], ['Čeka odobrenje', AMBER], ['Zakazano', CU], ['Objavljeno', GREEN]];
    const ph = (t * 0.55) % 7;
    posts.forEach((nm, i) => {
      const y = 90 + i * 27, k = Math.max(0, Math.min(3, Math.floor(ph - i * 0.8)));
      ctx.fillStyle = 'rgba(244,237,232,0.05)'; ctx.fillRect(14, y - 4, 332, 23);
      ctx.fillStyle = TXT; ctx.font = '500 13px Poppins, sans-serif'; ctx.fillText(nm, 22, y);
      ctx.fillStyle = st[k][1]; ctx.font = '600 12px Poppins, sans-serif'; ctx.fillText(st[k][0], 214, y + 1);
    });
  },
  (ctx, t) => { // Selma: SEO Audit, pregled stranica
    const cols = 6, rows = 3, cw = 50, ch = 38, n = cols * rows, scan = Math.floor(t * 4) % (n + 6);
    const bad = new Set([2, 7, 11, 15]);
    for (let i = 0; i < n; i++) {
      const x = 18 + (i % cols) * (cw + 5), y = 52 + Math.floor(i / cols) * (ch + 6);
      ctx.fillStyle = i === scan ? 'rgba(217,163,133,0.5)' : 'rgba(244,237,232,0.1)'; ctx.fillRect(x, y, cw, ch);
      ctx.fillStyle = 'rgba(244,237,232,0.18)'; ctx.fillRect(x + 5, y + 6, cw - 10, 6); ctx.fillRect(x + 5, y + 16, cw - 20, 4);
      if (i < scan) mark(ctx, x + cw - 16, y + ch - 20, !bad.has(i));
    }
    const done = Math.min(scan, n);
    ctx.fillStyle = MUTED; ctx.font = '500 15px Poppins, sans-serif';
    ctx.fillText(`Pročitano ${Math.round((done / n) * 80)}/80`, 18, 196);
    ctx.fillStyle = CU; ctx.fillText(`Za odobrenje: ${[...bad].filter(b => b < scan).length}`, 210, 196);
  },
  (ctx, t) => { // Edin: Blog, nacrt članka
    const p = (t * 0.18) % 1.25, title = 'Kako odabrati agenciju za društvene mreže';
    const n = Math.min(title.length, Math.floor(p * 160));
    ctx.fillStyle = TXT; ctx.font = '700 15px Poppins, sans-serif'; ctx.fillText(title.slice(0, n), 18, 50, 324);
    const bars = [300, 320, 270, 0, 310, 290, 180];
    bars.forEach((w, i) => {
      if (!w) return;
      const fill = Math.min(w, Math.max(0, (p - 0.25) * 1400 - i * 140));
      ctx.fillStyle = 'rgba(244,237,232,0.08)'; ctx.fillRect(18, 82 + i * 14, w, 6);
      ctx.fillStyle = 'rgba(217,163,133,0.6)'; ctx.fillRect(18, 82 + i * 14, fill, 6);
    });
    const done = p > 1.0;
    ctx.fillStyle = done ? AMBER : MUTED; ctx.font = '600 14px Poppins, sans-serif';
    ctx.fillText(done ? 'Nacrt čeka odobrenje' : `Pišem nacrt… ${Math.round(Math.min(1, Math.max(0, p - 0.25) / 0.75) * 900)} riječi`, 18, 196);
  },
  (ctx, t) => { // Lejla: Leads
    const names = ['Hotel Sarajevo', 'Tech d.o.o.', 'Klinika Ilidža', 'Auto centar'];
    const scores = [0.92, 0.74, 0.58, 0.85];
    names.forEach((nm, i) => {
      const y = 54 + i * 38, prog = Math.min(1, Math.max(0, (t * 0.6 - i * 0.35) % 3));
      ctx.fillStyle = 'rgba(244,237,232,0.12)'; ctx.beginPath(); ctx.arc(32, y + 14, 12, 0, 7); ctx.fill();
      ctx.fillStyle = TXT; ctx.font = '600 14px Poppins, sans-serif'; ctx.fillText(nm, 54, y + 4);
      ctx.fillStyle = 'rgba(244,237,232,0.1)'; ctx.fillRect(184, y + 8, 90, 8);
      const s = scores[i] * prog; ctx.fillStyle = s > 0.8 ? GREEN : CU; ctx.fillRect(184, y + 8, 90 * s, 8);
      if (prog >= 1) { ctx.fillStyle = scores[i] > 0.8 ? GREEN : CU; ctx.font = '600 11px Poppins, sans-serif'; ctx.fillText(scores[i] > 0.8 ? 'VISOKO' : 'SREDNJE', 282, y + 5); }
    });
    ctx.fillStyle = MUTED; ctx.font = '500 13px Poppins, sans-serif'; ctx.fillText('usklađenost sa profilom klijenta', 18, 206);
  },
  (ctx, t) => { // Sara: AI Sekretarica (asistent u Kapsuli 4)
    const c = t % 10;
    if (c < 2.5) {
      const ph = (c * 2) % 1;
      ctx.strokeStyle = `rgba(127,199,154,${1 - ph})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(70, 125, 22 + ph * 26, 0, 7); ctx.stroke();
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(70, 125, 22, 0, 7); ctx.fill();
      ctx.fillStyle = '#16100d'; ctx.font = '700 22px Poppins, sans-serif'; ctx.fillText('☎', 59, 112);
      ctx.fillStyle = TXT; ctx.font = '600 18px Poppins, sans-serif'; ctx.fillText('Pozivam odobren lead', 120, 100);
      ctx.fillStyle = MUTED; ctx.font = '500 14px Poppins, sans-serif'; ctx.fillText('Hotel Sarajevo', 120, 128);
    } else if (c < 7) {
      const sec = Math.floor((c - 2.5) * 6);
      ctx.fillStyle = GREEN; ctx.font = '600 14px Poppins, sans-serif'; ctx.fillText(`U razgovoru 00:${String(sec).padStart(2, '0')}`, 18, 50);
      for (let k = 0; k < 28; k++) {
        const h = 6 + Math.abs(Math.sin(t * 9 + k * 0.7) * Math.sin(t * 3 + k)) * 34;
        ctx.fillStyle = CU; ctx.fillRect(18 + k * 11.5, 100 - h / 2, 6, h);
      }
      const lines: [string, string][] = [['Klijent', 'Koliko košta vođenje mreža?'], ['Sara', 'Zavisi od paketa, mogu vam zakazati…'], ['Klijent', 'Može utorak ujutro.']];
      lines.forEach(([who, txt], k) => {
        if (c - 2.5 <= k * 1.3) return;
        ctx.fillStyle = who === 'Sara' ? CU : MUTED; ctx.font = '600 13px Poppins, sans-serif'; ctx.fillText(who + ':', 18, 132 + k * 22);
        ctx.fillStyle = TXT; ctx.font = '500 13px Poppins, sans-serif'; ctx.fillText(txt, 80, 132 + k * 22);
      });
    } else {
      ctx.fillStyle = GREEN; ctx.font = '700 40px Poppins, sans-serif'; ctx.fillText('✓', 24, 70);
      ctx.fillStyle = TXT; ctx.font = '700 22px Syne, sans-serif'; ctx.fillText('Sastanak zakazan', 76, 70);
      ctx.fillStyle = MUTED; ctx.font = '500 15px Poppins, sans-serif'; ctx.fillText('Utorak, 10:00, Hotel Sarajevo', 76, 102);
      ctx.fillStyle = CU; ctx.fillText('Sažetak na kartici leada', 76, 132);
    }
  },
  (ctx, t) => { // Kenan: Capacity Planner
    const who = ['Ana', 'Emir', 'Lejla', 'Tarik', 'Mia'];
    ctx.strokeStyle = RED; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(18, 92); ctx.lineTo(342, 92); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = RED; ctx.font = '600 12px Poppins, sans-serif'; ctx.fillText('100%', 300, 74);
    who.forEach((nm, i) => {
      const base = [0.55, 0.7, 0.45, 0.62, 0.5][i];
      const v = i === 1 ? 0.75 + Math.max(0, Math.sin(t * 0.9)) * 0.45 : base + Math.sin(t * 1.3 + i) * 0.08;
      const h = v * 100, x = 30 + i * 62;
      ctx.fillStyle = v > 1 ? RED : CU; ctx.fillRect(x, 192 - h, 34, h);
      ctx.fillStyle = MUTED; ctx.font = '500 13px Poppins, sans-serif'; ctx.fillText(nm, x, 198);
    });
  },
  (ctx, t) => { // Dino: Delivery Control
    ctx.fillStyle = MUTED; ctx.font = '600 13px Poppins, sans-serif';
    ctx.fillText('DOGOVORENO', 18, 52); ctx.fillText('STATUS', 200, 52);
    const rows: [string, string, string][] = [
      ['8 objava', '✓ dostavljeno', GREEN], ['2 kratka videa', '1/2 objavljen', AMBER],
      ['Izvještaj', 'čeka slanje', MUTED], ['Prezentacija', '+ izvan obima', CU],
    ];
    const k = Math.floor(t * 1.2) % (rows.length + 3);
    rows.forEach(([r, st, col], i) => {
      const y = 76 + i * 30;
      ctx.fillStyle = TXT; ctx.font = '500 14px Poppins, sans-serif'; ctx.fillText(r, 18, y);
      if (i >= k) return;
      ctx.fillStyle = col; ctx.font = '600 14px Poppins, sans-serif'; ctx.fillText(st, 200, y);
    });
  },
  (ctx, t) => { // Ada: Work Audit
    const items: [string, string, string][] = [
      ['Vizual Instagram', '✓ usklađeno', GREEN], ['Blog nacrt', '✗ nedostaje logo', RED],
      ['Ponuda PDF', '? nije moguće procijeniti', AMBER], ['Baner', '✓ usklađeno', GREEN],
    ];
    ctx.fillStyle = MUTED; ctx.font = '600 13px Poppins, sans-serif'; ctx.fillText('PREDATO DANAS', 18, 50);
    const k = Math.floor(t * 0.9) % (items.length + 3), frac = (t * 0.9) % 1;
    items.forEach(([nm, st, col], i) => {
      const y = 74 + i * 28;
      ctx.fillStyle = i === k ? 'rgba(217,163,133,0.16)' : 'rgba(244,237,232,0.05)'; ctx.fillRect(14, y - 5, 332, 25);
      ctx.fillStyle = TXT; ctx.font = '500 14px Poppins, sans-serif'; ctx.fillText(nm, 22, y);
      if (i < k) { ctx.fillStyle = col; ctx.font = '600 12px Poppins, sans-serif'; ctx.fillText(st, 160, y + 2); }
      else if (i === k) { ctx.fillStyle = 'rgba(217,163,133,0.25)'; ctx.fillRect(160, y + 4, 170, 6); ctx.fillStyle = CU; ctx.fillRect(160, y + 4, 170 * frac, 6); }
    });
    ctx.fillStyle = CU; ctx.font = '600 14px Poppins, sans-serif';
    ctx.fillText(k >= items.length ? 'Čeka ljudsku provjeru' : 'Provjera prema briefu…', 18, 196);
  },
];

// U-raspored oko Ben jezgre (0,0): četiri stola uz lijevi zid, četiri uz zadnji zid.
// Simetrično u odnosu na dijagonalu kamere, redom slijeva nadesno na ekranu.
const DESKS = [
  { x: -3.9, z: 4.9, ry: Math.PI / 2 },
  { x: -3.9, z: 2.6, ry: Math.PI / 2 },
  { x: -3.9, z: 0.3, ry: Math.PI / 2 },
  { x: -3.9, z: -2.0, ry: Math.PI / 2 },
  { x: -2.0, z: -3.9, ry: 0 },
  { x: 0.3, z: -3.9, ry: 0 },
  { x: 2.6, z: -3.9, ry: 0 },
  { x: 4.9, z: -3.9, ry: 0 },
]
/** Lokalna tačka na stolu gdje cijev ulazi odozdo (desno od stolice, ispod monitora). */
const RISER = { x: 0.58, z: -0.15 };
/** Kapsula kojoj pripada svaki sto (Sara je asistent u Kapsuli 4). */
const CAPSULE = [1, 2, 3, 4, 4, 5, 6, 7];

export function createOffice(canvas: HTMLCanvasElement, container: HTMLElement, opts: OfficeOptions): OfficeHandle {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  const OFFSET = new THREE.Vector3(14, 13, 14);
  const focus = new THREE.Vector3(0, 0.6, 0), focusTarget = new THREE.Vector3();
  let zoomTarget = 1;

  scene.add(new THREE.HemisphereLight(0xfff1e6, 0x3a2a20, 1.5));
  const sun = new THREE.DirectionalLight(0xffe2c8, 1.6);
  sun.position.set(-6, 14, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  const world = new THREE.Group(); scene.add(world);
  const disposables: { dispose: () => void }[] = [];
  const mat = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...extra }); disposables.push(m); return m;
  };
  const basic = (params: THREE.MeshBasicMaterialParameters) => { const m = new THREE.MeshBasicMaterial(params); disposables.push(m); return m; };
  const geo = <T extends THREE.BufferGeometry>(g: T) => { disposables.push(g); return g; };
  // Dijeljeni materijali (po boji) i geometrije (po ključu) da broj GPU resursa ostane mali.
  const matCache = new Map<number, THREE.MeshStandardMaterial>();
  const solid = (color: number) => { let m = matCache.get(color); if (!m) { m = mat(color); matCache.set(color, m); } return m; };
  const gCache = new Map<string, THREE.BufferGeometry>();
  const G = <T extends THREE.BufferGeometry>(key: string, make: () => T): T => {
    let g = gCache.get(key) as T | undefined; if (!g) { g = geo(make()); gCache.set(key, g); } return g;
  };
  const M = (material: number | THREE.Material) => (typeof material === 'number' ? solid(material) : material);
  const UNIT = G('box', () => new THREE.BoxGeometry(1, 1, 1));
  function box(w: number, h: number, d: number, material: number | THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = world) {
    const m = new THREE.Mesh(UNIT, M(material));
    m.scale.set(w, h, d); m.position.set(x, y, z);
    m.castShadow = Math.max(w, h, d) > 0.3; m.receiveShadow = true; parent.add(m); return m;
  }
  function cyl(rt: number, rb: number, h: number, seg: number, material: number | THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = world) {
    const m = new THREE.Mesh(G(`cyl${rt}_${rb}_${h}_${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg)), M(material));
    m.position.set(x, y, z); m.castShadow = Math.max(rt * 2, h) > 0.3; m.receiveShadow = true; parent.add(m); return m;
  }
  function canvasTex(w: number, h: number) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d')!;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; disposables.push(tex);
    return { ctx, tex };
  }
  /** Ravna ploča sa teksturom (zidni ekrani, natpisi). */
  function panel(w: number, h: number, material: THREE.Material, x: number, y: number, z: number, ry = 0, parent: THREE.Object3D = world) {
    const m = new THREE.Mesh(G(`plane${w}_${h}`, () => new THREE.PlaneGeometry(w, h)), material);
    m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
  }
  const rr = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
  };

  // ───────────────────────── Prostorija
  const S = 12;
  const floorTex = canvasTex(512, 512);
  {
    const c = floorTex.ctx; c.fillStyle = '#2b221c'; c.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 16; r++) {
      const y = r * 32; let x = -((r * 97) % 160);
      while (x < 512) {
        const w = 120 + ((Math.abs(x) * 7 + r * 13) % 90);
        c.fillStyle = `rgba(255,232,210,${0.012 + ((Math.abs(x) + r * 31) % 5) * 0.007})`; c.fillRect(x + 1, y + 1, w - 2, 30);
        c.fillStyle = 'rgba(0,0,0,0.28)'; c.fillRect(x + w - 1, y, 1.5, 32);
        x += w;
      }
      c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(0, y, 512, 1.5);
    }
  }
  const floor = box(S, 0.3, S, mat(0xffffff, { map: floorTex.tex, roughness: 0.85 }), 0, -0.15, 0); floor.castShadow = false;
  box(S + 0.3, 0.06, 0.08, C.copper, 0.15, 0.03, S / 2 + 0.04);
  box(0.08, 0.06, S, C.copper, S / 2 + 0.04, 0.03, 0);
  box(S, 4, 0.25, C.wall, 0, 2, -S / 2 - 0.125);
  box(0.25, 4, S + 0.25, C.wall2, -S / 2 - 0.125, 2, -0.125);
  // lajsne i bakarna LED traka uz vrh zidova
  box(S, 0.16, 0.05, C.woodDark, 0, 0.08, -S / 2 + 0.02);
  box(0.05, 0.16, S, C.woodDark, -S / 2 + 0.02, 0.08, 0);
  const stripMat = basic({ color: C.copperLight });
  box(S, 0.04, 0.04, stripMat, 0, 3.86, -S / 2 + 0.03).castShadow = false;
  box(0.04, 0.04, S, stripMat, -S / 2 + 0.03, 3.86, 0).castShadow = false;
  // prozor
  const winMat = basic({ color: 0xffe9cf });
  box(0.05, 1.8, 3.6, winMat, -S / 2 + 0.01, 2.2, 1.2).castShadow = false;
  for (const dz of [-1.2, 0, 1.2]) box(0.08, 1.8, 0.06, C.woodDark, -S / 2 + 0.05, 2.2, 1.2 + dz);
  box(0.08, 0.06, 3.6, C.woodDark, -S / 2 + 0.05, 2.2, 1.2);
  box(0.3, 0.06, 3.8, C.woodDark, -S / 2 + 0.15, 1.28, 1.2);

  // Natpis BONEXIS (wordmark u stilu BONACO loga: Outfit 700, uski razmak, okrugla bakarna tačka na bazi)
  const sign = canvasTex(1024, 256);
  const drawSign = () => {
    const ctx = sign.ctx as Ctx & { letterSpacing?: string }; ctx.clearRect(0, 0, 1024, 256);
    ctx.font = '700 150px Outfit, sans-serif'; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    ctx.letterSpacing = '-1.5px';
    const m = ctx.measureText('BONEXIS'), tw = m.width;
    const cap = m.actualBoundingBoxAscent || 108, r = cap * 0.13, gap = cap * 0.12;
    const total = tw + gap + r * 2, s = Math.min(1, 960 / total), base = 128 + cap / 2;
    ctx.save(); ctx.translate(30, 0); ctx.scale(s, 1);
    ctx.fillStyle = '#f4ede8'; ctx.fillText('BONEXIS', 0, base);
    ctx.fillStyle = '#936149'; ctx.beginPath(); ctx.arc(tw + gap + r, base - r, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); ctx.letterSpacing = '0px'; sign.tex.needsUpdate = true;
  };
  drawSign();
  panel(3.6, 0.9, basic({ map: sign.tex, transparent: true }), 1.3, 3.25, -S / 2 + 0.02);

  // ───────────────────────── Biljke
  const potGeo = G('pot', () => new THREE.CylinderGeometry(0.28, 0.22, 0.5, 12));
  const leafGeos = [0, 1, 2, 3].map(i => G(`leaf${i}`, () => new THREE.IcosahedronGeometry(0.32 - i * 0.04, 0)));
  const leafMat = mat(C.plant, { flatShading: true }), leafMat2 = mat(C.plant2, { flatShading: true });
  const plant = (x: number, z: number, s = 1, tall = 4) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); world.add(g);
    const pot = new THREE.Mesh(potGeo, solid(C.copper)); pot.position.y = 0.25; pot.castShadow = true; g.add(pot);
    for (let i = 0; i < tall; i++) {
      const leaf = new THREE.Mesh(leafGeos[i % 4], i % 2 ? leafMat2 : leafMat);
      leaf.position.set(Math.sin(i * 2.1) * 0.15, 0.75 + i * 0.25, Math.cos(i * 2.1) * 0.15); leaf.castShadow = true; g.add(leaf);
    }
    return g;
  };
  plant(-5.3, 5.3, 1.35, 5); plant(5.3, 5.3, 1.25, 4); plant(5.4, -1.3, 0.9); plant(-5.4, -2.0, 0.75);
  plant(-5.75, 0.0, 0.5, 3).position.y = 1.31; // na prozorskoj dasci

  // ───────────────────────── Ben AI jezgra (centar)
  const core = new THREE.Group(); world.add(core);
  const inlay = new THREE.Mesh(G('inlay', () => new THREE.CylinderGeometry(2.0, 2.0, 0.02, 48)), solid(0x221a15));
  inlay.position.y = 0.01; inlay.receiveShadow = true; core.add(inlay);
  const ringGlowMat = basic({ color: C.copperLight, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  const floorRing = new THREE.Mesh(G('fring', () => new THREE.RingGeometry(1.62, 1.78, 64)), ringGlowMat);
  floorRing.rotation.x = -Math.PI / 2; floorRing.position.y = 0.025; core.add(floorRing);
  cyl(1.4, 1.5, 0.28, 8, C.metal, 0, 0.14, 0, core);
  cyl(1.42, 1.42, 0.05, 8, C.copper, 0, 0.3, 0, core);
  // gornji osmougaoni stub; lica okrenuta tako da jedno gleda pravo u kameru (45°)
  const tier = new THREE.Mesh(G('tier', () => new THREE.CylinderGeometry(1.0, 1.0, 0.5, 8, 1, false, Math.PI / 8)), solid(0x2c211b));
  tier.position.y = 0.57; tier.castShadow = true; tier.receiveShadow = true; core.add(tier);
  const tierCap = new THREE.Mesh(G('tierCap', () => new THREE.CylinderGeometry(1.04, 1.04, 0.05, 8, 1, false, Math.PI / 8)), solid(C.copper));
  tierCap.position.y = 0.84; core.add(tierCap);
  // natpis BEN na plinti
  const benTex = canvasTex(512, 276);
  const drawBen = () => {
    const c = benTex.ctx; c.clearRect(0, 0, 512, 224);
    c.fillStyle = '#16100d'; rr(c, 4, 4, 504, 268, 26); c.fill();
    c.strokeStyle = CU; c.lineWidth = 6; c.stroke();
    c.textAlign = 'center'; c.textBaseline = 'middle';
    const cc = c as Ctx & { letterSpacing?: string };
    cc.letterSpacing = '-2px'; c.fillStyle = TXT; c.font = '700 172px Outfit, sans-serif'; c.fillText('BEN', 256, 116);
    cc.letterSpacing = '6px'; c.fillStyle = CU; c.font = '700 38px Outfit, sans-serif'; c.fillText('AI', 256, 228);
    cc.letterSpacing = '0px';
    benTex.tex.needsUpdate = true;
  };
  drawBen();
  const benMat = basic({ map: benTex.tex });
  const apothem = Math.cos(Math.PI / 8) * 1.0 + 0.006;
  panel(0.74, 0.4, benMat, Math.sin(Math.PI / 4) * apothem, 0.57, Math.cos(Math.PI / 4) * apothem, Math.PI / 4, core);
  // bočna lica: mali svjetleći prorezi
  const slotMat = basic({ color: C.copperLight });
  for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2, Math.PI * 1.25, -Math.PI * 0.25, Math.PI * 0.75]) {
    const sl = box(0.5, 0.05, 0.01, slotMat, Math.sin(a) * apothem, 0.57, Math.cos(a) * apothem, core);
    sl.rotation.y = a; sl.castShadow = false;
  }
  // svjetleći disk, snop i "mozak"
  const coreGlowMat = basic({ color: C.copperLight, transparent: true, opacity: 0.95 });
  const disc = new THREE.Mesh(G('disc', () => new THREE.CylinderGeometry(0.62, 0.62, 0.04, 32)), coreGlowMat);
  disc.position.y = 0.88; core.add(disc);
  const beamMat = basic({ color: C.copperLight, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const beam = new THREE.Mesh(G('beam', () => new THREE.CylinderGeometry(0.12, 0.38, 1.0, 20, 1, true)), beamMat);
  beam.position.y = 1.36; core.add(beam);
  const BRAIN_Y = 2.1;
  const brain = new THREE.Mesh(G('brain', () => new THREE.IcosahedronGeometry(0.5, 1)),
    mat(0x2a1a12, { emissive: C.copper, emissiveIntensity: 1.5, flatShading: true, metalness: 0.6, roughness: 0.3 }));
  brain.position.y = BRAIN_Y; brain.castShadow = true; core.add(brain);
  const wireMat = basic({ color: C.copperLight, wireframe: true, transparent: true, opacity: 0.45 });
  const brainWire = new THREE.Mesh(G('brainWire', () => new THREE.IcosahedronGeometry(0.68, 1)), wireMat);
  brainWire.position.y = BRAIN_Y; core.add(brainWire);
  const orbitMat = basic({ color: C.copperLight });
  const rings = [{ r: 0.95, tube: 0.022, tx: 1.25, tz: 0.25 }, { r: 1.12, tube: 0.016, tx: 1.75, tz: -0.4 }].map(o => {
    const ring = new THREE.Group(); ring.position.y = BRAIN_Y; ring.rotation.set(o.tx, 0, o.tz); core.add(ring);
    const torus = new THREE.Mesh(G(`torus${o.r}`, () => new THREE.TorusGeometry(o.r, o.tube, 8, 72)), orbitMat); ring.add(torus);
    const sat = new THREE.Mesh(G('sat', () => new THREE.SphereGeometry(0.06, 12, 8)), orbitMat); sat.position.x = o.r; ring.add(sat);
    return ring;
  });
  const coreLight = new THREE.PointLight(C.copperLight, 10, 8); coreLight.position.y = BRAIN_Y; core.add(coreLight);

  // ───────────────────────── Radna mjesta
  const count = Math.min(opts.agentNames.length, DESKS.length);
  const rMat = mat(C.robot, { roughness: 0.35, metalness: 0.2 });
  const visorMat = mat(0x15100d, { roughness: 0.2 });
  const hsMat = mat(0x1d1714, { roughness: 0.4 });
  const cuMat = mat(C.copper, { roughness: 0.4 });
  const lampShadeMat = mat(C.copper, { roughness: 0.4, side: THREE.DoubleSide });
  const bulbMat = basic({ color: 0xfff1dc });
  const labelDraws: (() => void)[] = [];
  const stations = DESKS.slice(0, count).map((d, i) => {
    const g = new THREE.Group(); g.position.set(d.x, 0, d.z); g.rotation.y = d.ry; world.add(g);
    box(2.0, 0.08, 0.95, C.wood, 0, 0.78, 0, g);
    for (const [lx, lz] of [[-0.92, -0.4], [0.92, -0.4], [-0.92, 0.4], [0.92, 0.4]]) box(0.07, 0.78, 0.07, C.woodDark, lx, 0.39, lz, g);
    box(1.84, 0.3, 0.03, C.woodDark, 0, 0.6, -0.42, g); // modesty panel
    box(0.08, 0.3, 0.08, C.metal, 0, 0.97, -0.3, g);
    box(0.36, 0.02, 0.22, C.metal, 0, 0.83, -0.3, g);
    const scr = canvasTex(SW, SH);
    box(1.1, 0.68, 0.05, C.metal, 0, 1.38, -0.32, g);
    const face = new THREE.Mesh(G('screen', () => new THREE.PlaneGeometry(1.02, 0.6)), basic({ map: scr.tex }));
    face.position.set(0, 1.38, -0.29); g.add(face);
    box(0.6, 0.03, 0.2, C.metal, -0.1, 0.835, 0.15, g);
    box(0.08, 0.025, 0.12, C.metal, 0.32, 0.832, 0.17, g); // miš
    // ulaz cijevi ispod stola + LED traka na prednjoj ivici
    box(0.24, 0.06, 0.24, cuMat, RISER.x, 0.71, RISER.z, g);
    const ledMat = basic({ color: C.copperLight });
    box(1.9, 0.025, 0.02, ledMat, 0, 0.76, 0.48, g).castShadow = false;
    // sitnice na stolu
    const sek = opts.agentNames[i] === 'AI Sekretarica';
    cyl(0.055, 0.048, 0.11, 12, i % 2 ? C.robot : C.copper, sek ? -0.78 : 0.62, 0.875, 0.22, g);
    box(0.28, 0.025, 0.2, i % 3 === 1 ? C.cream : C.copper, -0.7, 0.832, 0.08, g).rotation.y = 0.25;
    if (i % 3 === 1) { // stona lampa
      cyl(0.09, 0.1, 0.03, 12, C.metal, 0.8, 0.835, -0.3, g);
      box(0.025, 0.42, 0.025, C.metal, 0.8, 1.05, -0.3, g);
      const shade = new THREE.Mesh(G('shade', () => new THREE.CylinderGeometry(0.05, 0.13, 0.13, 14, 1, true)), lampShadeMat);
      shade.position.set(0.8, 1.26, -0.3); g.add(shade);
      const bulb = new THREE.Mesh(G('bulb', () => new THREE.SphereGeometry(0.045, 10, 8)), bulbMat); bulb.position.set(0.8, 1.21, -0.3); g.add(bulb);
    } else { // mala biljka
      cyl(0.07, 0.06, 0.12, 10, C.copper, -0.8, 0.88, -0.28, g);
      const lf = new THREE.Mesh(leafGeos[3], leafMat); lf.scale.setScalar(0.65); lf.position.set(-0.8, 1.02, -0.28); g.add(lf);
    }
    const chair = new THREE.Group(); chair.position.set(0, 0, 0.85); g.add(chair);
    box(0.6, 0.09, 0.55, C.chair, 0, 0.5, 0, chair); box(0.6, 0.6, 0.08, C.chair, 0, 0.85, 0.27, chair);
    box(0.06, 0.45, 0.06, C.metal, 0, 0.23, 0, chair);
    box(0.5, 0.04, 0.06, C.metal, 0, 0.03, 0, chair); box(0.06, 0.04, 0.5, C.metal, 0, 0.03, 0, chair);
    const robot = new THREE.Group(); robot.position.set(0, 0.55, 0.8); robot.rotation.y = Math.PI; g.add(robot);
    const body = new THREE.Mesh(G('body', () => new THREE.CapsuleGeometry(0.22, 0.32, 6, 16)), rMat); body.position.y = 0.38; body.castShadow = true; robot.add(body);
    const head = new THREE.Group(); head.position.y = 0.9; robot.add(head);
    const skull = new THREE.Mesh(G('skull', () => new THREE.SphereGeometry(0.22, 24, 16)), rMat); skull.castShadow = true; head.add(skull);
    const visor = new THREE.Mesh(G('visor', () => new THREE.BoxGeometry(0.3, 0.12, 0.1)), visorMat); visor.position.set(0, 0.01, 0.17); head.add(visor);
    const eyeMat = basic({ color: C.copperLight });
    for (const ex of [-0.07, 0.07]) { const e = new THREE.Mesh(G('eye', () => new THREE.BoxGeometry(0.05, 0.035, 0.02)), eyeMat); e.position.set(ex, 0.01, 0.225); head.add(e); }
    const ant = new THREE.Mesh(G('ant', () => new THREE.SphereGeometry(0.035, 8, 8)), cuMat); ant.position.y = 0.3; head.add(ant);
    box(0.02, 0.1, 0.02, C.metal, 0, 0.23, 0, head);
    // Ruke: lice robota je lokalno +z, pa negativan rotation.x vodi šake naprijed prema tastaturi.
    const arms = [-1, 1].map(s => {
      const pivot = new THREE.Group(); pivot.position.set(0.26 * s, 0.55, 0); robot.add(pivot);
      const arm = new THREE.Mesh(G('arm', () => new THREE.CapsuleGeometry(0.055, 0.28, 4, 8)), rMat); arm.position.y = -0.17; arm.castShadow = true; pivot.add(arm);
      pivot.rotation.x = -0.95; return pivot;
    });
    if (sek) { // slušalice + telefon
      const band = new THREE.Mesh(G('band', () => new THREE.TorusGeometry(0.235, 0.025, 8, 24, Math.PI)), hsMat);
      band.rotation.y = Math.PI / 2; head.add(band);
      for (const s of [-1, 1]) { const cup = new THREE.Mesh(G('cup', () => new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16)), cuMat); cup.rotation.z = Math.PI / 2; cup.position.x = 0.235 * s; head.add(cup); }
      const boom = new THREE.Mesh(G('boom', () => new THREE.CylinderGeometry(0.012, 0.012, 0.2, 6)), hsMat);
      boom.rotation.x = Math.PI / 2; boom.rotation.z = 0.5; boom.position.set(0.2, -0.08, 0.1); head.add(boom);
      box(0.28, 0.06, 0.18, C.metal, 0.62, 0.85, 0.12, g);
      box(0.3, 0.05, 0.08, C.copper, 0.62, 0.9, 0.12, g);
    }
    // pločica sa imenom na vrhu monitora: IME / KAPSULA N (vidljiva iznad glave robota)
    const plate = canvasTex(512, 192);
    const drawPlate = () => {
      const c = plate.ctx as Ctx & { letterSpacing?: string };
      c.fillStyle = '#16100d'; c.fillRect(0, 0, 512, 192);
      c.strokeStyle = CU; c.lineWidth = 8; c.strokeRect(4, 4, 504, 184);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.letterSpacing = '-1px'; c.fillStyle = TXT; c.font = '700 96px Outfit, sans-serif';
      c.fillText((opts.personas?.[i] ?? opts.agentNames[i]).toUpperCase(), 256, 78, 470);
      c.letterSpacing = '6px'; c.fillStyle = CU; c.font = '700 36px Outfit, sans-serif';
      c.fillText(`KAPSULA ${CAPSULE[i] ?? i + 1}`, 256, 154, 470);
      c.letterSpacing = '0px'; plate.tex.needsUpdate = true;
    };
    drawPlate(); labelDraws.push(drawPlate);
    box(0.96, 0.38, 0.04, C.copper, 0, 1.92, -0.34, g).castShadow = false;
    panel(0.92, 0.345, basic({ map: plate.tex }), 0, 1.92, -0.317, 0, g);
    const padMat = basic({ color: C.copper, transparent: true, opacity: 0, depthWrite: false });
    const pad = new THREE.Mesh(G('pad', () => new THREE.PlaneGeometry(2.6, 2.4)), padMat);
    pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.02, 0.4); g.add(pad);
    g.traverse(o => { o.userData.station = i; });
    return { g, scr, robot, head, arms, eyeMat, ledMat, padMat, rest: Math.PI, yaw: Math.PI, phase: Math.random() * 6 };
  });
  // jedno svjetlo koje prati odabrani / hover sto (štedi point lightove na telefonima)
  const deskLight = new THREE.PointLight(C.copperLight, 0, 2.5); deskLight.position.set(0, 1.4, 0.1);
  let deskLightAt = -1;
  const pickables: THREE.Object3D[] = [];
  stations.forEach(s => s.g.traverse(o => { if ((o as THREE.Mesh).isMesh) pickables.push(o); }));

  // ───────────────────────── Cijevi od Bena do agenata
  const roundedPath = (pts: THREE.Vector3[], radius: number) => {
    const path = new THREE.CurvePath<THREE.Vector3>();
    let cur = pts[0].clone();
    for (let k = 1; k < pts.length - 1; k++) {
      const a = pts[k - 1], p = pts[k], b = pts[k + 1];
      const din = p.clone().sub(a), dout = b.clone().sub(p);
      const r = Math.min(radius, din.length() / 2, dout.length() / 2);
      din.normalize(); dout.normalize();
      const s = p.clone().addScaledVector(din, -r), e = p.clone().addScaledVector(dout, r);
      path.add(new THREE.LineCurve3(cur, s)); path.add(new THREE.QuadraticBezierCurve3(s, p.clone(), e)); cur = e;
    }
    path.add(new THREE.LineCurve3(cur, pts[pts.length - 1].clone()));
    return path;
  };
  const toWorld = (d: { x: number; z: number; ry: number }, lx: number, lz: number, y: number) =>
    new THREE.Vector3(d.x + lx * Math.cos(d.ry) + lz * Math.sin(d.ry), y, d.z - lx * Math.sin(d.ry) + lz * Math.cos(d.ry));

  // tekstura toka: svjetli impuls sa repom, ponavlja se svakih PULSE jedinica
  const PULSE = 1.1, PIPE_Y = 0.1;
  const flow = canvasTex(128, 4);
  {
    const c = flow.ctx, gr = c.createLinearGradient(0, 0, 128, 0);
    gr.addColorStop(0, '#3a2219'); gr.addColorStop(0.4, '#4e2f22'); gr.addColorStop(0.82, '#d9a385');
    gr.addColorStop(0.92, '#fff3e6'); gr.addColorStop(1, '#3a2219');
    c.fillStyle = gr; c.fillRect(0, 0, 128, 4);
  }
  flow.tex.wrapS = THREE.RepeatWrapping;
  const glassMat = (o: number) => mat(0xd9a385, { transparent: true, opacity: o, roughness: 0.15, metalness: 0.2, depthWrite: false });
  const BEADS = 3, CLAMPS = 3;
  const beads = new THREE.InstancedMesh(G('bead', () => new THREE.SphereGeometry(0.065, 10, 8)), basic({ color: 0xffffff }), count * BEADS);
  const clamps = new THREE.InstancedMesh(G('clamp', () => new THREE.TorusGeometry(0.1, 0.022, 6, 16)), solid(C.copper), count * CLAMPS);
  beads.frustumCulled = false; world.add(beads, clamps);
  const tm = new THREE.Matrix4(), tq = new THREE.Quaternion(), tsc = new THREE.Vector3(), tcol = new THREE.Color(), zAxis = new THREE.Vector3(0, 0, 1);
  const pipes = DESKS.slice(0, count).map((d, i) => {
    const riser = toWorld(d, RISER.x, RISER.z, PIPE_Y);
    const approach = toWorld(d, RISER.x, RISER.z + 1.7, PIPE_Y);
    const dir = new THREE.Vector3(approach.x, 0, approach.z).normalize();
    const start = dir.clone().multiplyScalar(0.9).setY(PIPE_Y);
    const port = dir.clone().multiplyScalar(1.55).setY(PIPE_Y);
    const path = roundedPath([start, port, approach, riser, riser.clone().setY(0.7)], 0.55);
    const len = path.getLength();
    const tex = flow.tex.clone(); tex.needsUpdate = true; tex.repeat.set(len / PULSE, 1); tex.offset.x = Math.random(); disposables.push(tex);
    const innerMat = basic({ map: tex });
    const inner = new THREE.Mesh(geo(new THREE.TubeGeometry(path, 120, 0.042, 8, false)), innerMat);
    const outerMat = glassMat(0.3);
    const outer = new THREE.Mesh(geo(new THREE.TubeGeometry(path, 120, 0.09, 12, false)), outerMat);
    outer.userData.station = i; outer.renderOrder = 2;
    world.add(inner, outer); pickables.push(outer);
    // spojnica na izlazu iz Bena
    const collar = cyl(0.13, 0.13, 0.12, 14, cuMat, port.x, PIPE_Y, port.z, world);
    collar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    for (let k = 0; k < CLAMPS; k++) {
      const u = 0.3 + k * 0.17, p = path.getPointAt(u);
      tq.setFromUnitVectors(zAxis, path.getTangentAt(u));
      clamps.setMatrixAt(i * CLAMPS + k, tm.compose(p, tq, tsc.set(1, 1, 1)));
    }
    return { path, len, tex, innerMat, outerMat, glow: 1, speed: 1, u: Math.random() };
  });
  clamps.instanceMatrix.needsUpdate = true;

  // ───────────────────────── Server ormar (zadnji lijevi ugao)
  const rack = new THREE.Group(); rack.position.set(-5.05, 0, -5.05); rack.rotation.y = Math.PI / 4; world.add(rack);
  box(1.0, 2.3, 0.8, C.metal, 0, 1.15, 0, rack);
  box(0.9, 0.04, 0.02, C.copper, 0, 2.2, 0.41, rack);
  const LEDS = 24;
  const leds = new THREE.InstancedMesh(G('led', () => new THREE.BoxGeometry(0.12, 0.05, 0.02)), basic({ color: 0xffffff }), LEDS);
  for (let k = 0; k < LEDS; k++) {
    tm.makeTranslation(-0.33 + (k % 4) * 0.22, 0.45 + Math.floor(k / 4) * 0.28, 0.41); leds.setMatrixAt(k, tm);
    leds.setColorAt(k, tcol.set(C.copperLight));
  }
  rack.add(leds);

  // ───────────────────────── Polica sa registratorima (zadnji zid)
  const shelf = new THREE.Group(); shelf.position.set(-3.3, 0, -5.72); world.add(shelf);
  box(1.6, 2.3, 0.04, C.woodDark, 0, 1.15, -0.2, shelf);
  for (const sx of [-0.78, 0.78]) box(0.05, 2.3, 0.44, C.wood, sx, 1.15, 0, shelf);
  const shelfYs = [0.05, 0.62, 1.19, 1.76, 2.3];
  for (const y of shelfYs) box(1.6, 0.05, 0.44, C.wood, 0, y, 0, shelf);
  const binderCols = [C.copper, C.copperLight, C.robot, C.woodDark, 0x7a5442, C.plant2, C.cream];
  const binderList: [number, number, number, number][] = [];
  shelfYs.slice(0, 4).forEach((y, r) => {
    let x = -0.72; let k = r * 3;
    while (x < 0.62) {
      const w = 0.07 + ((k * 37) % 5) * 0.012, h = 0.34 + ((k * 13) % 4) * 0.04;
      if (r === 3 && x > 0.1) break;
      if ((k * 7) % 11 !== 3) binderList.push([x + w / 2, y + 0.025 + h / 2, w, h]);
      x += w + 0.012; k++;
    }
  });
  const binders = new THREE.InstancedMesh(UNIT, solid(0xffffff), binderList.length);
  binderList.forEach(([x, y, w, h], k) => {
    binders.setMatrixAt(k, tm.compose(tsc.set(x, y, 0), tq.identity(), new THREE.Vector3(w, h, 0.32)));
    binders.setColorAt(k, tcol.set(binderCols[(k * 5) % binderCols.length]));
  });
  binders.castShadow = true; shelf.add(binders);
  plant(-2.85, -5.72, 0.35, 3).position.y = 2.33;

  // ───────────────────────── Zidni sat (stvarno vrijeme)
  const clockG = new THREE.Group(); clockG.position.set(-1.4, 3.05, -S / 2 + 0.05); world.add(clockG);
  const clockTex = canvasTex(256, 256);
  {
    const c = clockTex.ctx; c.fillStyle = '#efe7de'; c.beginPath(); c.arc(128, 128, 126, 0, 7); c.fill();
    c.fillStyle = '#2b221c';
    for (let k = 0; k < 12; k++) {
      c.save(); c.translate(128, 128); c.rotate((k / 12) * Math.PI * 2);
      c.fillRect(-3, -112, 6, k % 3 ? 14 : 24); c.restore();
    }
    c.fillStyle = '#936149'; c.font = '700 20px Syne, sans-serif'; c.textAlign = 'center'; c.fillText('BONEXIS', 128, 176);
  }
  const clockFace = new THREE.Mesh(G('clockFace', () => new THREE.CircleGeometry(0.42, 40)), basic({ map: clockTex.tex }));
  clockFace.position.z = 0.02; clockG.add(clockFace);
  const clockRim = new THREE.Mesh(G('clockRim', () => new THREE.TorusGeometry(0.44, 0.035, 8, 40)), cuMat); clockRim.position.z = 0.02; clockG.add(clockRim);
  const hand = (len: number, w: number, color: number, z: number) => {
    const p = new THREE.Group(); p.position.z = z; clockG.add(p);
    box(w, len, 0.01, color, 0, len / 2 - 0.04, 0, p).castShadow = false; return p;
  };
  const hHand = hand(0.22, 0.04, C.metal, 0.03), mHand = hand(0.33, 0.03, C.metal, 0.04), sHand = hand(0.36, 0.012, C.copper, 0.05);

  // ───────────────────────── TV na zidu sa statistikom
  const tv = canvasTex(512, 288);
  box(1.78, 1.04, 0.06, C.metal, 4.0, 2.6, -S / 2 + 0.04).castShadow = false;
  panel(1.68, 0.945, basic({ map: tv.tex }), 4.0, 2.6, -S / 2 + 0.075);
  const drawTV = (t: number) => {
    const c = tv.ctx, W = 512, H = 288;
    c.fillStyle = '#16100d'; c.fillRect(0, 0, W, H);
    c.textBaseline = 'top'; c.textAlign = 'left';
    c.fillStyle = CU; c.font = '700 24px Syne, sans-serif'; c.fillText('BEN · UŽIVO', 26, 22);
    c.fillStyle = Math.sin(t * 4) > 0 ? GREEN : 'rgba(127,199,154,0.3)'; c.beginPath(); c.arc(W - 34, 34, 8, 0, 7); c.fill();
    c.fillStyle = TXT; c.font = '800 96px Syne, sans-serif'; c.fillText(String(137 + Math.floor(t / 2.5)), 24, 66);
    c.fillStyle = MUTED; c.font = '500 20px Poppins, sans-serif'; c.fillText('zadataka završeno danas', 26, 176);
    c.fillStyle = GREEN; c.font = '600 20px Poppins, sans-serif'; c.fillText('▲ 18% u odnosu na juče', 26, 210);
    for (let k = 0; k < 6; k++) {
      const h = 40 + 70 * (0.5 + 0.5 * Math.sin(t * 0.9 + k * 1.4));
      c.fillStyle = k % 2 ? CU : 'rgba(217,163,133,0.55)'; c.fillRect(318 + k * 28, 250 - h, 18, h);
    }
    c.fillStyle = 'rgba(244,237,232,0.2)'; c.fillRect(312, 252, 170, 2);
    tv.tex.needsUpdate = true;
  };

  // ───────────────────────── Whiteboard (lijevi zid)
  const wb = canvasTex(512, 280);
  {
    const c = wb.ctx; c.fillStyle = '#ece6df'; c.fillRect(0, 0, 512, 280);
    c.fillStyle = '#2b221c'; c.font = '700 28px Syne, sans-serif'; c.textBaseline = 'top'; c.fillText('Q4 · rast klijenata', 24, 18);
    c.strokeStyle = 'rgba(43,34,28,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(30, 240); c.lineTo(330, 240); c.moveTo(30, 240); c.lineTo(30, 70); c.stroke();
    [60, 85, 78, 110, 140, 165].forEach((v, k) => { c.fillStyle = k === 5 ? '#936149' : 'rgba(147,97,73,0.45)'; c.fillRect(48 + k * 46, 240 - v, 30, v); });
    c.strokeStyle = '#4f7d4b'; c.lineWidth = 4; c.beginPath();
    [70, 80, 100, 120, 150, 185].forEach((v, k) => { const x = 63 + k * 46, y = 240 - v; if (k) c.lineTo(x, y); else c.moveTo(x, y); }); c.stroke();
    const note = (x: number, y: number, col: string, r: number) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = col; c.fillRect(0, 0, 120, 92); c.fillStyle = 'rgba(43,34,28,0.4)'; c.fillRect(14, 24, 80, 6); c.fillRect(14, 40, 64, 6); c.fillRect(14, 56, 72, 6); c.restore(); };
    note(360, 40, '#e8c9a0', -0.06); note(372, 152, '#b9dcc3', 0.05);
  }
  const wbG = new THREE.Group(); wbG.position.set(-S / 2 + 0.03, 2.2, -3.4); wbG.rotation.y = Math.PI / 2; world.add(wbG);
  box(2.36, 1.34, 0.04, 0xbcb3aa, 0, 0, 0, wbG).castShadow = false;
  panel(2.24, 1.22, basic({ map: wb.tex }), 0, 0, 0.025, 0, wbG);
  box(1.2, 0.04, 0.1, 0xbcb3aa, 0, -0.69, 0.06, wbG);
  box(0.12, 0.03, 0.03, C.copper, -0.3, -0.655, 0.06, wbG); box(0.12, 0.03, 0.03, C.plant2, -0.1, -0.655, 0.06, wbG);

  // ───────────────────────── Slika na lijevom zidu
  const art = canvasTex(256, 320);
  {
    const c = art.ctx; c.fillStyle = '#2b221c'; c.fillRect(0, 0, 256, 320);
    c.fillStyle = '#936149'; c.beginPath(); c.arc(128, 130, 80, 0, 7); c.fill();
    c.fillStyle = '#d9a385'; c.beginPath(); c.arc(170, 200, 50, 0, 7); c.fill();
    c.strokeStyle = '#ece4dc'; c.lineWidth = 5; c.beginPath(); c.arc(100, 210, 60, Math.PI, Math.PI * 1.9); c.stroke();
  }
  const artG = new THREE.Group(); artG.position.set(-S / 2 + 0.03, 2.35, 4.4); artG.rotation.y = Math.PI / 2; world.add(artG);
  box(1.0, 1.24, 0.04, C.copper, 0, 0, 0, artG).castShadow = false;
  panel(0.88, 1.1, basic({ map: art.tex }), 0, 0, 0.025, 0, artG);

  // ───────────────────────── Kafe kutak (zadnji desni ugao)
  const cafe = new THREE.Group(); cafe.position.set(5.3, 0, -5.4); world.add(cafe);
  box(1.2, 0.9, 1.0, C.woodDark, 0, 0.45, 0, cafe);
  box(1.26, 0.05, 1.06, C.wood, 0, 0.92, 0, cafe);
  box(0.45, 0.55, 0.38, C.metal, 0, 1.22, -0.2, cafe);
  box(0.47, 0.06, 0.4, C.copper, 0, 1.52, -0.2, cafe);
  box(0.25, 0.04, 0.08, C.copper, 0, 1.08, -0.02, cafe);
  const coffeeLed = new THREE.Mesh(G('cled', () => new THREE.SphereGeometry(0.025, 8, 6)), basic({ color: 0x7fc79a })); coffeeLed.position.set(0.15, 1.38, 0); cafe.add(coffeeLed);
  for (const [mx, mz] of [[-0.4, 0.25], [-0.25, 0.32], [0.38, 0.28]]) cyl(0.055, 0.048, 0.11, 12, C.robot, mx, 0.995, mz, cafe);
  cyl(0.13, 0.13, 0.5, 14, 0xb9d4d8, 0.4, 1.2, -0.25, cafe).castShadow = false; // flaša vode

  // ───────────────────────── Sastanak (stol sa stolicama)
  const meet = new THREE.Group(); meet.position.set(4.0, 0, 1.0); world.add(meet);
  cyl(0.95, 0.95, 0.06, 28, C.wood, 0, 0.75, 0, meet);
  cyl(0.1, 0.12, 0.72, 10, C.metal, 0, 0.36, 0, meet);
  cyl(0.45, 0.5, 0.04, 20, C.metal, 0, 0.02, 0, meet);
  const simpleChair = (a: number) => {
    const ch = new THREE.Group(); ch.position.set(Math.sin(a) * 1.25, 0, Math.cos(a) * 1.25); ch.rotation.y = a; meet.add(ch);
    box(0.5, 0.08, 0.48, C.fabric, 0, 0.47, 0, ch); box(0.5, 0.5, 0.07, C.fabricDark, 0, 0.75, 0.24, ch);
    box(0.05, 0.43, 0.05, C.metal, 0, 0.22, 0, ch);
  };
  [0.3, Math.PI / 2 + 0.3, Math.PI + 0.3, -Math.PI / 2 + 0.3].forEach(simpleChair);
  // laptop i papiri
  box(0.42, 0.02, 0.3, C.metal, -0.2, 0.79, 0.15, meet).rotation.y = 0.5;
  const lid = box(0.42, 0.28, 0.02, C.metal, -0.27, 0.92, 0.03, meet); lid.rotation.set(-0.2, 0.5, 0);
  box(0.3, 0.01, 0.4, C.robot, 0.35, 0.785, -0.2, meet).rotation.y = -0.3;
  cyl(0.055, 0.048, 0.11, 12, C.copper, 0.25, 0.835, 0.35, meet);

  // ───────────────────────── Lounge (tepih, sofa, fotelja, stočić, lampa)
  box(3.8, 0.02, 2.6, C.rug, 0.4, 0.01, 4.4).castShadow = false;
  box(3.4, 0.022, 2.2, 0x4a3226, 0.4, 0.012, 4.4).castShadow = false;
  const sofa = new THREE.Group(); sofa.position.set(0.3, 0, 5.3); world.add(sofa);
  box(2.4, 0.45, 0.9, C.fabric, 0, 0.3, 0, sofa); box(2.4, 0.6, 0.25, C.fabric, 0, 0.75, 0.33, sofa);
  box(0.25, 0.6, 0.9, C.fabricDark, -1.2, 0.45, 0, sofa); box(0.25, 0.6, 0.9, C.fabricDark, 1.2, 0.45, 0, sofa);
  box(0.42, 0.36, 0.14, C.copper, -0.7, 0.68, 0.15, sofa).rotation.z = 0.12;
  box(0.42, 0.36, 0.14, C.cream, 0.65, 0.68, 0.15, sofa).rotation.z = -0.1;
  const arm = new THREE.Group(); arm.position.set(2.45, 0, 4.0); arm.rotation.y = -Math.PI / 2; world.add(arm);
  box(0.9, 0.42, 0.85, C.fabricDark, 0, 0.28, 0, arm); box(0.9, 0.55, 0.2, C.fabricDark, 0, 0.7, 0.33, arm);
  box(0.18, 0.5, 0.85, C.fabric, -0.45, 0.4, 0, arm); box(0.18, 0.5, 0.85, C.fabric, 0.45, 0.4, 0, arm);
  box(1.3, 0.07, 0.7, C.wood, 0.3, 0.42, 4.1);
  for (const [lx, lz] of [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]]) box(0.06, 0.4, 0.06, C.woodDark, 0.3 + lx * 2, 0.2, 4.1 + lz);
  box(0.2, 0.18, 0.2, C.robot, 0.1, 0.55, 4.1); // mini robot figura
  box(0.32, 0.04, 0.24, C.copper, 0.6, 0.47, 4.05).rotation.y = 0.3; // knjiga
  // podna lampa uz sofu
  cyl(0.18, 0.2, 0.04, 16, C.metal, -1.5, 0.02, 5.5);
  cyl(0.025, 0.025, 1.7, 8, C.metal, -1.5, 0.87, 5.5);
  const floorShade = new THREE.Mesh(G('fshade', () => new THREE.CylinderGeometry(0.2, 0.3, 0.3, 16, 1, true)), lampShadeMat);
  floorShade.position.set(-1.5, 1.8, 5.5); world.add(floorShade);
  const fBulb = new THREE.Mesh(G('bulb', () => new THREE.SphereGeometry(0.045, 10, 8)), bulbMat); fBulb.scale.setScalar(1.6); fBulb.position.set(-1.5, 1.72, 5.5); world.add(fBulb);
  const lampLight = new THREE.PointLight(0xffd9b0, 2.5, 4); lampLight.position.set(-1.5, 1.6, 5.5); world.add(lampLight);

  // ───────────────────────── Pointer
  let selected = -1, hovered = -1, lastHover = -2;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const mouse = { x: 0, y: 0 };
  let dragging = false, lastX = 0, moved = 0, rotTarget = 0;
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    ndc.set((mouse.x / r.width) * 2 - 1, -(mouse.y / r.height) * 2 + 1);
    if (dragging) {
      const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
      rotTarget = THREE.MathUtils.clamp(rotTarget + dx * 0.006, -0.7, 0.5);
    }
  };
  const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; moved = 0; canvas.setPointerCapture(e.pointerId); canvas.classList.add('dragging'); };
  const onUp = () => { dragging = false; canvas.classList.remove('dragging'); if (moved < 6) opts.onSelect(hovered); };
  const onLeave = () => { ndc.set(9, 9); };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointerleave', onLeave);

  // ───────────────────────── Veličina
  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight, a = w / h;
    renderer.setSize(w, h, false);
    const VIEW_W = 17.6; // soba uvijek ispunjava širinu; visinu daje CSS omjer
    const f = VIEW_W / a; // na uskom ekranu stanu svih 8 stolova
    camera.left = (-f * a) / 2; camera.right = (f * a) / 2; camera.top = f / 2; camera.bottom = -f / 2;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(container); resize();

  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(container);

  const clock = new THREE.Clock();
  const camRight = new THREE.Vector3(1, 0, -1).normalize();
  const tmp = new THREE.Vector3(), lift = new THREE.Vector3(0, 1.0, 0);
  const copperCol = new THREE.Color(C.copperLight), dimCol = new THREE.Color(0x3a2219);
  let lastScreen = -1, lastTV = -1, raf = 0;
  const lerpAngle = (a: number, b: number, k: number) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    const motion = reduceMotion ? 0.2 : 1;
    const wide = container.clientWidth > 760;

    world.rotation.y += (rotTarget - world.rotation.y) * 0.08;
    world.updateMatrixWorld();

    if (!dragging) {
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(pickables, false)[0];
      hovered = hit ? (hit.object.userData.station as number) : -1;
      canvas.classList.toggle('hovering', hovered >= 0);
    }
    if (hovered !== lastHover || hovered >= 0) { opts.onHover(hovered, mouse.x, mouse.y); lastHover = hovered; }

    // Ben
    brain.rotation.y += dt * 0.6 * motion; brain.rotation.x += dt * 0.2 * motion;
    brainWire.rotation.y -= dt * 0.3 * motion;
    brain.position.y = brainWire.position.y = BRAIN_Y + Math.sin(t * 1.5) * 0.08 * motion;
    rings[0].rotation.z += dt * 0.7 * motion; rings[1].rotation.z -= dt * 0.45 * motion;
    rings[0].rotation.y += dt * 0.15 * motion;
    const beat = 0.5 + 0.5 * Math.sin(t * 2.2);
    beamMat.opacity = 0.22 + 0.18 * beat;
    ringGlowMat.opacity = 0.22 + 0.2 * beat;
    coreLight.intensity = (selected >= 0 ? 12 : 9) + beat * 2;

    // LED-ovi servera
    for (let k = 0; k < LEDS; k++) leds.setColorAt(k, Math.sin(t * (2 + (k % 5)) + k * 1.7) > -0.3 ? copperCol : dimCol);
    leds.instanceColor!.needsUpdate = true;

    // sat
    const now = new Date(), sec = now.getSeconds() + now.getMilliseconds() / 1000, min = now.getMinutes() + sec / 60;
    sHand.rotation.z = -(sec / 60) * Math.PI * 2; mHand.rotation.z = -(min / 60) * Math.PI * 2;
    hHand.rotation.z = -(((now.getHours() % 12) + min / 60) / 12) * Math.PI * 2;

    const lit = selected >= 0 ? selected : hovered;
    if (lit >= 0 && lit !== deskLightAt) { stations[lit].g.add(deskLight); deskLightAt = lit; }
    deskLight.intensity += ((lit < 0 ? 0 : lit === selected ? 3 : 1.8) - deskLight.intensity) * 0.1;
    stations.forEach((s, i) => {
      const active = i === selected, hot = i === hovered;
      if (!active) { // kucanje: šake naprijed na tastaturi
        s.arms[0].rotation.x = -0.95 + Math.sin(t * 14 + s.phase) * 0.12 * motion;
        s.arms[1].rotation.x = -0.95 + Math.sin(t * 14 + s.phase + 2) * 0.12 * motion;
        s.arms[1].rotation.z *= 0.85;
      } else { // mahanje: desna ruka podignuta
        s.arms[0].rotation.x += (-0.5 - s.arms[0].rotation.x) * 0.15;
        s.arms[1].rotation.x += (-(Math.PI - 0.3) - s.arms[1].rotation.x) * 0.15;
        s.arms[1].rotation.z = Math.sin(t * 8) * 0.35 * motion;
      }
      const toCam = Math.PI / 4 - s.g.rotation.y - world.rotation.y;
      s.yaw = lerpAngle(s.yaw, active ? toCam : s.rest, 0.08);
      s.robot.rotation.y = s.yaw;
      s.head.rotation.y = active ? 0 : Math.sin(t * 0.7 + s.phase) * 0.25 * motion;
      s.eyeMat.color.set(active || hot ? 0xfff3e8 : C.copperLight);
      s.padMat.opacity += ((active ? 0.38 : hot ? 0.2 : 0) - s.padMat.opacity) * 0.15;
    });

    // tok podataka kroz cijevi
    pipes.forEach((p, i) => {
      const active = i === selected, hot = i === hovered;
      const glowT = active ? 1.9 : hot ? 1.6 : selected >= 0 ? 0.35 : 1;
      const speedT = active ? 2.8 : hot ? 2.0 : selected >= 0 ? 0.6 : 1;
      p.glow += (glowT - p.glow) * 0.1; p.speed += (speedT - p.speed) * 0.08;
      const v = 1.3 * p.speed * motion; // jedinica/s
      p.tex.offset.x = (p.tex.offset.x - (dt * v) / PULSE) % 1;
      p.u = (p.u + (dt * v) / p.len) % 1;
      p.innerMat.color.setScalar(p.glow);
      p.outerMat.opacity = 0.18 + 0.14 * p.glow;
      for (let k = 0; k < BEADS; k++) {
        const u = (p.u + k / BEADS) % 1;
        tm.compose(p.path.getPointAt(u), tq.identity(), tsc.setScalar(0.8 + 0.25 * p.glow));
        beads.setMatrixAt(i * BEADS + k, tm);
        beads.setColorAt(i * BEADS + k, tcol.copy(copperCol).multiplyScalar(0.55 + 0.45 * p.glow));
      }
      stations[i].ledMat.color.copy(copperCol).multiplyScalar(Math.min(1.4, 0.25 + 0.4 * p.glow * (0.75 + 0.25 * Math.sin(t * 5 + i))));
    });
    beads.instanceMatrix.needsUpdate = true;
    if (beads.instanceColor) beads.instanceColor.needsUpdate = true;

    if (t - lastScreen > 0.08) {
      lastScreen = t;
      stations.forEach((s, i) => {
        const ctx = s.scr.ctx, on = i === selected || i === hovered;
        ctx.clearRect(0, 0, SW, SH);
        ctx.fillStyle = 'rgba(22,16,13,0.94)'; rr(ctx, 2, 2, SW - 4, SH - 4, 16);
        ctx.fill();
        ctx.strokeStyle = on ? CU : 'rgba(217,163,133,0.45)'; ctx.lineWidth = on ? 4 : 2; ctx.stroke();
        const persona = opts.personas?.[i];
        ctx.fillStyle = CU; ctx.font = '700 22px Syne, sans-serif'; ctx.textBaseline = 'top'; ctx.fillText(persona ?? opts.agentNames[i], 18, 14);
        if (persona) {
          const w = ctx.measureText(persona).width;
          ctx.fillStyle = MUTED; ctx.font = '500 13px Poppins, sans-serif'; ctx.fillText(opts.agentNames[i], 18 + w + 12, 22);
        }
        ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(SW - 24, 26, 6, 0, 7); ctx.fill();
        DRAW[i]?.(ctx, t * motion + i * 1.3);
        s.scr.tex.needsUpdate = true;
      });
    }
    if (t - lastTV > 0.5) { lastTV = t; drawTV(t * motion); }

    if (selected >= 0) {
      stations[selected].g.getWorldPosition(tmp);
      focusTarget.copy(tmp).add(lift);
      zoomTarget = wide ? 2.3 : 1.9;
      // detalji agenta su u desnom sidebaru, pa robot ostaje u centru scene
    } else {
      focusTarget.set(0.3, 1.1, 0.3); zoomTarget = 1;
      if (wide && opts.offsetForIntro) focusTarget.addScaledVector(camRight, -2.6);
      
    }
    focus.lerp(focusTarget, 0.07);
    camera.zoom += (zoomTarget - camera.zoom) * 0.07; camera.updateProjectionMatrix();
    camera.position.copy(focus).add(OFFSET);
    camera.lookAt(focus);
    renderer.render(scene, camera);
  };
  drawTV(0);
  let alive = true;
  const redrawLabels = () => { if (alive) { drawSign(); drawBen(); labelDraws.forEach(f => f()); } };
  document.fonts?.ready.then(redrawLabels);
  document.fonts?.load('700 150px Outfit').then(redrawLabels, () => {});
  frame();

  return {
    select(i) { selected = i; },
    destroy() {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      beads.dispose(); clamps.dispose(); leds.dispose(); binders.dispose();
      disposables.forEach(d => d.dispose());
      renderer.dispose();
    },
  };
}
