// Bonexis 3D office: izometrijska kancelarija sa AI agentima (three.js).
// React upravlja panelom i dugmadima; ova scena javlja hover/klik i prima odabir preko select().
import * as THREE from 'three';

export interface OfficeOptions {
  agentNames: string[];
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
};
const GREEN = '#7fc79a', RED = '#e07a6a', CU = '#d9a385', MUTED = '#8f817a', TXT = '#f4ede8';
const SW = 360, SH = 230;

type Ctx = CanvasRenderingContext2D;
const mark = (ctx: Ctx, x: number, y: number, ok: boolean) => {
  ctx.fillStyle = ok ? GREEN : RED; ctx.font = '700 16px Poppins, sans-serif'; ctx.fillText(ok ? '✓' : '✗', x, y);
};

// Animacije na ekranima agenata, po redu kao u data/bonexis.ts
const DRAW: ((ctx: Ctx, t: number) => void)[] = [
  (ctx, t) => { // Visual Audit
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
    ctx.fillText(`Pregledano ${Math.round((done / n) * 80)}/80`, 18, 196);
    ctx.fillStyle = CU; ctx.fillText(`Za odobrenje: ${[...bad].filter(b => b < scan).length}`, 210, 196);
  },
  (ctx, t) => { // Blog & SEO
    const p = (t * 0.25) % 1;
    ctx.fillStyle = 'rgba(244,237,232,0.16)';
    [150, 130, 155, 90].forEach((w, i) => ctx.fillRect(18, 56 + i * 16, Math.min(w, Math.max(0, p * 600 - i * 150)), 7));
    ctx.fillStyle = TXT; ctx.font = '600 14px Poppins, sans-serif'; ctx.fillText('„digitalni marketing“', 192, 54);
    const pos = Math.max(3, 18 - Math.floor(p * 18));
    ctx.fillStyle = GREEN; ctx.font = '700 30px Syne, sans-serif'; ctx.fillText(`#${pos}`, 192, 76);
    ctx.fillStyle = MUTED; ctx.font = '500 13px Poppins, sans-serif'; ctx.fillText('na Googleu', 250, 88);
    ctx.strokeStyle = CU; ctx.lineWidth = 3; ctx.beginPath();
    const pts = 24;
    for (let i = 0; i <= pts * p; i++) {
      const x = 18 + i * (320 / pts), y = 200 - (i / pts) * 70 - Math.sin(i * 1.3) * 8;
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.stroke();
  },
  (ctx, t) => { // Leads
    const names = ['Hotel Sarajevo', 'Tech d.o.o.', 'Klinika Ilidža', 'Auto centar'];
    const scores = [0.92, 0.74, 0.58, 0.85];
    names.forEach((nm, i) => {
      const y = 54 + i * 38, prog = Math.min(1, Math.max(0, (t * 0.6 - i * 0.35) % 3));
      ctx.fillStyle = 'rgba(244,237,232,0.12)'; ctx.beginPath(); ctx.arc(32, y + 14, 12, 0, 7); ctx.fill();
      ctx.fillStyle = TXT; ctx.font = '600 14px Poppins, sans-serif'; ctx.fillText(nm, 54, y + 4);
      ctx.fillStyle = 'rgba(244,237,232,0.1)'; ctx.fillRect(190, y + 8, 100, 8);
      const s = scores[i] * prog; ctx.fillStyle = s > 0.8 ? GREEN : CU; ctx.fillRect(190, y + 8, 100 * s, 8);
      if (prog >= 1) { ctx.fillStyle = scores[i] > 0.8 ? GREEN : CU; ctx.font = '600 12px Poppins, sans-serif'; ctx.fillText(scores[i] > 0.8 ? 'VRUĆ' : 'TOPAO', 300, y + 4); }
    });
  },
  (ctx, t) => { // Capacity Planner
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
  (ctx, t) => { // Delivery Control
    ctx.fillStyle = MUTED; ctx.font = '600 13px Poppins, sans-serif';
    ctx.fillText('DOGOVORENO', 18, 52); ctx.fillText('URAĐENO', 200, 52);
    const rows = ['12 objava', '4 reelsa', 'SEO izvještaj', 'Kampanja'];
    const state = [1, 1, 0, 2];
    const k = Math.floor(t * 1.2) % (rows.length + 3);
    rows.forEach((r, i) => {
      const y = 76 + i * 30;
      ctx.fillStyle = TXT; ctx.font = '500 14px Poppins, sans-serif'; ctx.fillText(r, 18, y);
      if (i >= k) return;
      if (state[i] === 1) { ctx.fillStyle = GREEN; ctx.fillText('✓ isporučeno', 200, y); }
      if (state[i] === 0) { ctx.fillStyle = RED; ctx.fillText('! kasni 3 dana', 200, y); }
      if (state[i] === 2) { ctx.fillStyle = CU; ctx.fillText('+ van ponude', 200, y); }
    });
  },
  (ctx, t) => { // AI Sekretarica
    const c = t % 10;
    if (c < 2.5) {
      const ph = (c * 2) % 1;
      ctx.strokeStyle = `rgba(127,199,154,${1 - ph})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(70, 125, 22 + ph * 26, 0, 7); ctx.stroke();
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(70, 125, 22, 0, 7); ctx.fill();
      ctx.fillStyle = '#16100d'; ctx.font = '700 22px Poppins, sans-serif'; ctx.fillText('☎', 59, 112);
      ctx.fillStyle = TXT; ctx.font = '600 18px Poppins, sans-serif'; ctx.fillText('Pozivam: Hotel Sarajevo', 120, 100);
      ctx.fillStyle = MUTED; ctx.font = '500 14px Poppins, sans-serif'; ctx.fillText('lead iz AI Leads', 120, 128);
    } else if (c < 7) {
      const sec = Math.floor((c - 2.5) * 6);
      ctx.fillStyle = GREEN; ctx.font = '600 14px Poppins, sans-serif'; ctx.fillText(`● U razgovoru 00:${String(sec).padStart(2, '0')}`, 18, 50);
      for (let k = 0; k < 28; k++) {
        const h = 6 + Math.abs(Math.sin(t * 9 + k * 0.7) * Math.sin(t * 3 + k)) * 34;
        ctx.fillStyle = CU; ctx.fillRect(18 + k * 11.5, 100 - h / 2, 6, h);
      }
      const lines: [string, string][] = [['Klijent', 'Koliko košta vođenje mreža?'], ['AI', 'Zavisi od paketa, mogu vam zakazati…'], ['Klijent', 'Može utorak ujutro.']];
      lines.forEach(([who, txt], k) => {
        if (c - 2.5 <= k * 1.3) return;
        ctx.fillStyle = who === 'AI' ? CU : MUTED; ctx.font = '600 13px Poppins, sans-serif'; ctx.fillText(who + ':', 18, 132 + k * 22);
        ctx.fillStyle = TXT; ctx.font = '500 13px Poppins, sans-serif'; ctx.fillText(txt, 80, 132 + k * 22);
      });
    } else {
      ctx.fillStyle = GREEN; ctx.font = '700 40px Poppins, sans-serif'; ctx.fillText('✓', 24, 70);
      ctx.fillStyle = TXT; ctx.font = '700 22px Syne, sans-serif'; ctx.fillText('Termin zakazan', 76, 70);
      ctx.fillStyle = MUTED; ctx.font = '500 15px Poppins, sans-serif'; ctx.fillText('Utorak, 10:00 · Hotel Sarajevo', 76, 102);
      ctx.fillStyle = CU; ctx.fillText('Sažetak poslan na email', 76, 132);
    }
  },
];

const DESKS = [
  { x: -1.6, z: -3.8, ry: 0 },
  { x: 2.2, z: -3.8, ry: 0 },
  { x: -4.0, z: -0.4, ry: Math.PI / 2 },
  { x: -0.6, z: 0.6, ry: 0 },
  { x: -4.0, z: 3.4, ry: Math.PI / 2 },
  { x: 3.4, z: -0.4, ry: 0 },
];

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

  scene.add(new THREE.HemisphereLight(0xfff1e6, 0x3a2a20, 1.25));
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
  const geo = <T extends THREE.BufferGeometry>(g: T) => { disposables.push(g); return g; };
  function box(w: number, h: number, d: number, material: number | THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = world) {
    const m = new THREE.Mesh(geo(new THREE.BoxGeometry(w, h, d)), typeof material === 'number' ? mat(material) : material);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function canvasTex(w: number, h: number) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d')!;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; disposables.push(tex);
    return { ctx, tex };
  }

  // Prostorija
  const S = 12;
  box(S, 0.3, S, C.floor, 0, -0.15, 0);
  box(S + 0.3, 0.06, 0.08, C.copper, 0.15, 0.03, S / 2 + 0.04);
  box(0.08, 0.06, S, C.copper, S / 2 + 0.04, 0.03, 0);
  box(S, 4, 0.25, C.wall, 0, 2, -S / 2 - 0.125);
  box(0.25, 4, S + 0.25, C.wall2, -S / 2 - 0.125, 2, -0.125);
  const winMat = new THREE.MeshBasicMaterial({ color: 0xffe9cf }); disposables.push(winMat);
  box(0.05, 1.8, 3.6, winMat, -S / 2 + 0.01, 2.2, 1.2).castShadow = false;
  for (const dz of [-1.2, 0, 1.2]) box(0.08, 1.8, 0.06, C.woodDark, -S / 2 + 0.05, 2.2, 1.2 + dz);
  box(0.08, 0.06, 3.6, C.woodDark, -S / 2 + 0.05, 2.2, 1.2);
  box(5.5, 0.03, 3.6, 0x3d2b21, 1.8, 0.015, 2.6);

  // Natpis
  const sign = canvasTex(1024, 256);
  const drawSign = () => {
    const ctx = sign.ctx; ctx.clearRect(0, 0, 1024, 256);
    ctx.font = '800 150px Syne, sans-serif'; ctx.textBaseline = 'middle';
    const tw = ctx.measureText('BONEXIS').width, s = Math.min(1, 900 / (tw + 80));
    ctx.save(); ctx.translate(30, 0); ctx.scale(s, 1);
    ctx.fillStyle = '#f4ede8'; ctx.fillText('BONEXIS', 0, 136);
    ctx.fillStyle = '#936149'; ctx.beginPath(); ctx.arc(tw + 34, 172, 24, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); sign.tex.needsUpdate = true;
  };
  drawSign(); document.fonts?.ready.then(drawSign);
  const signMat = new THREE.MeshBasicMaterial({ map: sign.tex, transparent: true }); disposables.push(signMat);
  const signMesh = new THREE.Mesh(geo(new THREE.PlaneGeometry(4.4, 1.1)), signMat);
  signMesh.position.set(1.5, 3.1, -S / 2 + 0.02); world.add(signMesh);

  // Biljke
  const plant = (x: number, z: number, s = 1) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); world.add(g);
    const pot = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 16)), mat(C.copper, { roughness: 0.5 }));
    pot.position.y = 0.25; pot.castShadow = true; g.add(pot);
    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(geo(new THREE.IcosahedronGeometry(0.32 - i * 0.04, 0)), mat(C.plant, { flatShading: true }));
      leaf.position.set(Math.sin(i * 2.1) * 0.15, 0.75 + i * 0.25, Math.cos(i * 2.1) * 0.15); leaf.castShadow = true; g.add(leaf);
    }
  };
  plant(-5.2, -5.2, 1.3); plant(5.2, -5.2); plant(-5.2, 4.8);

  // Sofa kutak
  const sofa = new THREE.Group(); sofa.position.set(3.8, 0, 4.4); world.add(sofa);
  box(2.4, 0.45, 0.9, 0x5a3d2d, 0, 0.3, 0, sofa); box(2.4, 0.6, 0.25, 0x5a3d2d, 0, 0.75, 0.33, sofa);
  box(0.25, 0.6, 0.9, 0x4d3426, -1.2, 0.45, 0, sofa); box(0.25, 0.6, 0.9, 0x4d3426, 1.2, 0.45, 0, sofa);
  box(1.2, 0.08, 0.7, C.wood, 3.8, 0.42, 3.1); box(0.08, 0.4, 0.08, C.woodDark, 3.3, 0.2, 3.1); box(0.08, 0.4, 0.08, C.woodDark, 4.3, 0.2, 3.1);
  box(0.2, 0.18, 0.2, C.robot, 3.6, 0.55, 3.1);

  // AI jezgra (server)
  const server = new THREE.Group(); server.position.set(-4.3, 0, -4.3); world.add(server);
  box(1.3, 2.4, 1.0, C.metal, 0, 1.2, 0, server);
  const ledMat = new THREE.MeshBasicMaterial({ color: C.copperLight }); disposables.push(ledMat);
  const ledGeo = geo(new THREE.BoxGeometry(0.12, 0.05, 0.02));
  const leds: THREE.Mesh[] = [];
  for (let r = 0; r < 7; r++) for (let k = 0; k < 4; k++) {
    const led = new THREE.Mesh(ledGeo, ledMat); led.position.set(-0.4 + k * 0.27, 0.45 + r * 0.28, 0.51); server.add(led); leds.push(led);
  }
  const brain = new THREE.Mesh(geo(new THREE.IcosahedronGeometry(0.45, 1)),
    mat(0x2a1a12, { emissive: C.copper, emissiveIntensity: 1.4, flatShading: true, metalness: 0.6, roughness: 0.3 }));
  brain.position.y = 3.0; server.add(brain);
  const wireMat = new THREE.MeshBasicMaterial({ color: C.copperLight, wireframe: true, transparent: true, opacity: 0.4 }); disposables.push(wireMat);
  const brainWire = new THREE.Mesh(geo(new THREE.IcosahedronGeometry(0.62, 1)), wireMat);
  brainWire.position.y = 3.0; server.add(brainWire);
  const brainLight = new THREE.PointLight(C.copperLight, 8, 6); brainLight.position.y = 3; server.add(brainLight);

  // Radna mjesta
  const count = Math.min(opts.agentNames.length, DESKS.length);
  const stations = DESKS.slice(0, count).map((d, i) => {
    const g = new THREE.Group(); g.position.set(d.x, 0, d.z); g.rotation.y = d.ry; world.add(g);
    box(2.0, 0.08, 0.95, C.wood, 0, 0.78, 0, g);
    for (const [lx, lz] of [[-0.92, -0.4], [0.92, -0.4], [-0.92, 0.4], [0.92, 0.4]]) box(0.07, 0.78, 0.07, C.woodDark, lx, 0.39, lz, g);
    box(0.08, 0.3, 0.08, C.metal, 0, 0.97, -0.3, g);
    const scr = canvasTex(SW, SH);
    box(1.1, 0.68, 0.05, C.metal, 0, 1.38, -0.32, g);
    const faceMat = new THREE.MeshBasicMaterial({ map: scr.tex }); disposables.push(faceMat);
    const face = new THREE.Mesh(geo(new THREE.PlaneGeometry(1.02, 0.6)), faceMat);
    face.position.set(0, 1.38, -0.29); g.add(face);
    box(0.6, 0.03, 0.2, C.metal, -0.1, 0.835, 0.15, g);
    const chair = new THREE.Group(); chair.position.set(0, 0, 0.85); g.add(chair);
    box(0.6, 0.09, 0.55, C.chair, 0, 0.5, 0, chair); box(0.6, 0.6, 0.08, C.chair, 0, 0.85, 0.27, chair);
    box(0.06, 0.45, 0.06, C.metal, 0, 0.23, 0, chair);
    const robot = new THREE.Group(); robot.position.set(0, 0.55, 0.8); robot.rotation.y = Math.PI; g.add(robot);
    const rMat = mat(C.robot, { roughness: 0.35, metalness: 0.2 });
    const body = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.22, 0.32, 6, 16)), rMat); body.position.y = 0.38; body.castShadow = true; robot.add(body);
    const head = new THREE.Group(); head.position.y = 0.9; robot.add(head);
    const skull = new THREE.Mesh(geo(new THREE.SphereGeometry(0.22, 24, 16)), rMat); skull.castShadow = true; head.add(skull);
    const visor = new THREE.Mesh(geo(new THREE.BoxGeometry(0.3, 0.12, 0.1)), mat(0x15100d, { roughness: 0.2 })); visor.position.set(0, 0.01, 0.17); head.add(visor);
    const eyeMat = new THREE.MeshBasicMaterial({ color: C.copperLight }); disposables.push(eyeMat);
    for (const ex of [-0.07, 0.07]) { const e = new THREE.Mesh(geo(new THREE.BoxGeometry(0.05, 0.035, 0.02)), eyeMat); e.position.set(ex, 0.01, 0.225); head.add(e); }
    const antMat = new THREE.MeshBasicMaterial({ color: C.copper }); disposables.push(antMat);
    const ant = new THREE.Mesh(geo(new THREE.SphereGeometry(0.035, 8, 8)), antMat); ant.position.y = 0.3; head.add(ant);
    box(0.02, 0.1, 0.02, C.metal, 0, 0.23, 0, head);
    const arms = [-1, 1].map(s => {
      const pivot = new THREE.Group(); pivot.position.set(0.26 * s, 0.55, 0); robot.add(pivot);
      const arm = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.055, 0.28, 4, 8)), rMat); arm.position.y = -0.17; arm.castShadow = true; pivot.add(arm);
      pivot.rotation.x = 0.9; return pivot;
    });
    if (opts.agentNames[i] === 'AI Sekretarica') { // slušalice + telefon
      const hsMat = mat(0x1d1714, { roughness: 0.4 });
      const band = new THREE.Mesh(geo(new THREE.TorusGeometry(0.235, 0.025, 8, 24, Math.PI)), hsMat);
      band.rotation.y = Math.PI / 2; head.add(band);
      for (const s of [-1, 1]) { const cup = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16)), mat(C.copper, { roughness: 0.4 })); cup.rotation.z = Math.PI / 2; cup.position.x = 0.235 * s; head.add(cup); }
      const boom = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 6)), hsMat);
      boom.rotation.x = Math.PI / 2; boom.rotation.z = 0.5; boom.position.set(0.2, -0.08, 0.1); head.add(boom);
      box(0.28, 0.06, 0.18, C.metal, 0.65, 0.85, 0.05, g);
      box(0.3, 0.05, 0.08, C.copper, 0.65, 0.9, 0.05, g);
    }
    const glow = new THREE.PointLight(C.copperLight, 0, 2.5); glow.position.set(0, 1.4, 0.1); g.add(glow);
    const padMat = new THREE.MeshBasicMaterial({ color: C.copper, transparent: true, opacity: 0, depthWrite: false }); disposables.push(padMat);
    const pad = new THREE.Mesh(geo(new THREE.PlaneGeometry(2.6, 2.4)), padMat);
    pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.02, 0.4); g.add(pad);
    g.traverse(o => { o.userData.station = i; });
    return { g, scr, robot, head, arms, eyeMat, glow, padMat, rest: Math.PI, yaw: Math.PI, phase: Math.random() * 6 };
  });
  const pickables: THREE.Object3D[] = [];
  stations.forEach(s => s.g.traverse(o => { if ((o as THREE.Mesh).isMesh) pickables.push(o); }));

  // Paketi podataka
  const pktGeo = geo(new THREE.BoxGeometry(0.14, 0.14, 0.14));
  const packets = stations.flatMap((_, i) => [0, 1, 2].map(k => {
    const m = new THREE.Mesh(pktGeo, new THREE.MeshBasicMaterial({ color: C.copperLight, transparent: true }));
    disposables.push(m.material as THREE.Material); world.add(m);
    return { m, i, t: k / 3 + Math.random() * 0.1 };
  }));
  const from = new THREE.Vector3(-4.3, 2.6, -4.3), to = new THREE.Vector3(), mid = new THREE.Vector3();

  // Pointer
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

  // Veličina
  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight, a = w / h;
    renderer.setSize(w, h, false);
    const f = a < 0.8 ? (15 / a) * 0.62 : 14.5;
    camera.left = (-f * a) / 2; camera.right = (f * a) / 2; camera.top = f / 2; camera.bottom = -f / 2;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(container); resize();

  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(container);

  const clock = new THREE.Clock();
  const camRight = new THREE.Vector3(1, 0, -1).normalize();
  const tmp = new THREE.Vector3();
  let lastScreen = -1, raf = 0;
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

    brain.rotation.y += dt * 0.6 * motion; brain.rotation.x += dt * 0.2 * motion;
    brainWire.rotation.y -= dt * 0.3 * motion;
    brain.position.y = brainWire.position.y = 3.0 + Math.sin(t * 1.5) * 0.08 * motion;
    leds.forEach((l, k) => { l.visible = Math.sin(t * (2 + (k % 5)) + k * 1.7) > -0.3; });

    stations.forEach((s, i) => {
      const active = i === selected, hot = i === hovered;
      if (!active) {
        s.arms[0].rotation.x = 0.95 + Math.sin(t * 14 + s.phase) * 0.12 * motion;
        s.arms[1].rotation.x = 0.95 + Math.sin(t * 14 + s.phase + 2) * 0.12 * motion;
        s.arms[1].rotation.z *= 0.85;
      } else {
        s.arms[0].rotation.x += (0.9 - s.arms[0].rotation.x) * 0.15;
        s.arms[1].rotation.x += (Math.PI - 0.3 - s.arms[1].rotation.x) * 0.15;
        s.arms[1].rotation.z = Math.sin(t * 8) * 0.35 * motion;
      }
      const toCam = Math.PI / 4 - s.g.rotation.y - world.rotation.y;
      s.yaw = lerpAngle(s.yaw, active ? toCam : s.rest, 0.08);
      s.robot.rotation.y = s.yaw;
      s.head.rotation.y = active ? 0 : Math.sin(t * 0.7 + s.phase) * 0.25 * motion;
      s.eyeMat.color.set(active || hot ? 0xfff3e8 : C.copperLight);
      s.glow.intensity += ((active ? 3 : hot ? 1.8 : 0.6) - s.glow.intensity) * 0.1;
      s.padMat.opacity += ((active ? 0.38 : hot ? 0.2 : 0) - s.padMat.opacity) * 0.15;
    });

    if (t - lastScreen > 0.08) {
      lastScreen = t;
      stations.forEach((s, i) => {
        const ctx = s.scr.ctx, on = i === selected || i === hovered;
        ctx.clearRect(0, 0, SW, SH);
        ctx.fillStyle = 'rgba(22,16,13,0.94)'; ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(2, 2, SW - 4, SH - 4, 16); else ctx.rect(2, 2, SW - 4, SH - 4);
        ctx.fill();
        ctx.strokeStyle = on ? CU : 'rgba(217,163,133,0.45)'; ctx.lineWidth = on ? 4 : 2; ctx.stroke();
        ctx.fillStyle = CU; ctx.font = '700 22px Syne, sans-serif'; ctx.textBaseline = 'top'; ctx.fillText(opts.agentNames[i], 18, 14);
        ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(SW - 24, 26, 6, 0, 7); ctx.fill();
        DRAW[i]?.(ctx, t * motion + i * 1.3);
        s.scr.tex.needsUpdate = true;
      });
    }

    packets.forEach(p => {
      p.t = (p.t + dt * 0.35 * motion * (p.i === selected ? 2.2 : 1)) % 1;
      stations[p.i].g.getWorldPosition(to); world.worldToLocal(to); to.y = 1.6;
      mid.copy(from).add(to).multiplyScalar(0.5); mid.y += 1.8;
      const u = p.t, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
      p.m.position.set(a * from.x + b * mid.x + c * to.x, a * from.y + b * mid.y + c * to.y, a * from.z + b * mid.z + c * to.z);
      p.m.rotation.set(t * 2, t * 3, 0);
      (p.m.material as THREE.MeshBasicMaterial).opacity = Math.sin(u * Math.PI) * (selected < 0 || p.i === selected ? 1 : 0.25);
    });

    if (selected >= 0) {
      stations[selected].g.getWorldPosition(tmp);
      focusTarget.copy(tmp).add(new THREE.Vector3(0, 1.0, 0));
      zoomTarget = wide ? 2.3 : 1.9;
      if (wide) focusTarget.addScaledVector(camRight, (2.4 / zoomTarget) * 1.6); else focusTarget.y -= 1.2;
    } else {
      focusTarget.set(0.3, 0.2, 0.3); zoomTarget = 1;
      if (wide && opts.offsetForIntro) focusTarget.addScaledVector(camRight, -2.6);
      if (!wide) { focusTarget.y += 1.2; zoomTarget = 1.05; }
    }
    focus.lerp(focusTarget, 0.07);
    camera.zoom += (zoomTarget - camera.zoom) * 0.07; camera.updateProjectionMatrix();
    camera.position.copy(focus).add(OFFSET);
    camera.lookAt(focus);
    renderer.render(scene, camera);
  };
  frame();

  return {
    select(i) { selected = i; },
    destroy() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      disposables.forEach(d => d.dispose());
      renderer.dispose();
    },
  };
}
