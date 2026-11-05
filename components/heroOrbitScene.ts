// Hero 3D: tri rotirajuća prstena (kao armilarna sfera) sa projektima kao kružnim "sferama".
// Prevlačenjem se okreće cijela sfera (uz inerciju), klik na projekat otvara studiju slučaja.
// Učitava se dinamički (three.js je zaseban chunk), crta samo dok je hero vidljiv.
import * as THREE from 'three';

export interface OrbitItem { src: string; href: string | null; label: string }
export interface OrbitHandle { destroy(): void; setPaused(p: boolean): void }
interface Opts { accent: string; reduce: boolean; onPick(href: string): void; onHover?(label: string | null): void; /** HTML element u sredini ("B.") preko kojeg logotipi ne smiju prelaziti */ obstacle?: HTMLElement | null }

const R = 3.2;

/** Kružni medaljon s logotipom klijenta (contain, bez izrezivanja) na tamnoj podlozi. */
function circleTexture(src: string, done: () => void): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    const ctx = c.getContext('2d')!;
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    ctx.fillStyle = '#1b1b1b'; ctx.fill();
    const box = size * 0.6, k = Math.min(box / img.width, box / img.height);
    const w = img.width * k, h = img.height * k;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2); ctx.stroke();
    tex.needsUpdate = true;
    done();
  };
  img.src = src;
  return tex;
}

export function startOrbit(canvas: HTMLCanvasElement, items: OrbitItem[], opts: Opts): OrbitHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  // Kostur sfere je uvijek u istom, savršenom položaju (atom); kreću se samo logotipi po prstenovima.
  const root = new THREE.Group();
  scene.add(root);
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T) => { disposables.push(x); return x; };

  // Blago lebdeće čestice u pozadini (nezavisne od sfere)
  const P = 260;
  const pPos = new Float32Array(P * 3), pCol = new Float32Array(P * 3), pVel = new Float32Array(P);
  const accentCol = new THREE.Color(opts.accent);
  for (let i = 0; i < P; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 22;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pPos[i * 3 + 2] = -2 - Math.random() * 8;
    pVel[i] = 0.08 + Math.random() * 0.22;
    const c = Math.random() < 0.18 ? accentCol : new THREE.Color(0xffffff);
    pCol.set([c.r, c.g, c.b], i * 3);
  }
  const pGeo = track(new THREE.BufferGeometry());
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const pMat = track(new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false, sizeAttenuation: true }));
  scene.add(new THREE.Points(pGeo, pMat));
  let pT = 0;
  const driftParticles = (dt: number) => {
    pT += dt;
    for (let i = 0; i < P; i++) {
      let y = pPos[i * 3 + 1] + pVel[i] * dt;
      if (y > 7) y = -7;
      pPos[i * 3 + 1] = y;
      pPos[i * 3] += Math.sin(pT * 0.4 + i) * 0.0015;
    }
    pGeo.attributes.position.needsUpdate = true;
  };

  // Jedva vidljiva mreža sfere
  const sphereGeo = track(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(R * 0.985, 2)));
  const sphereMat = track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.035, depthWrite: false }));
  root.add(new THREE.LineSegments(sphereGeo, sphereMat));

  const circlePts = Array.from({ length: 160 }, (_, i) => {
    const a = (i / 160) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R, 0);
  });
  const ringGeo = track(new THREE.BufferGeometry().setFromPoints(circlePts));
  const dotGeo = track(new THREE.SphereGeometry(0.045, 12, 12));
  const dotMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));

  // Tri aktivna prstena (nose projekte) razmaknuta ~110° kao kod atoma, a između njih tri tanka
  // neaktivna prstena. Orijentacija se zadaje normalom ravni prstena.
  const N = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize();
  const A1 = N(0, 0.95, 0.3), A2 = N(0.82, -0.47, 0.3), A3 = N(-0.82, -0.47, 0.3);
  const between = (a: THREE.Vector3, b: THREE.Vector3) => a.clone().add(b).normalize();
  const RINGS = [
    { n: A1, speed: 0.16, color: opts.accent, opacity: 0.95, active: true },
    { n: A2, speed: -0.12, color: '#ffffff', opacity: 0.4, active: true },
    { n: A3, speed: 0.1, color: '#ffffff', opacity: 0.4, active: true },
    { n: between(A1, A2), speed: 0.05, color: '#ffffff', opacity: 0.1, active: false },
    { n: between(A2, A3), speed: -0.04, color: '#ffffff', opacity: 0.1, active: false },
    { n: between(A3, A1), speed: 0.045, color: '#ffffff', opacity: 0.1, active: false },
  ];
  const Z = new THREE.Vector3(0, 0, 1);
  const spinners: { g: THREE.Group; speed: number }[] = [];
  const active: THREE.Group[] = [];
  const activeMats: THREE.LineBasicMaterial[] = [];
  const sprites: THREE.Sprite[] = [];
  let pending = items.length;
  const rerender = () => { pending--; if (!running) render(); };

  RINGS.forEach((r, k) => {
    const holder = new THREE.Group();
    holder.quaternion.setFromUnitVectors(Z, r.n);
    const spin = new THREE.Group();
    holder.add(spin);
    root.add(holder);
    const mat = track(new THREE.LineBasicMaterial({ color: r.color, transparent: true, opacity: r.opacity, depthWrite: false }));
    spin.add(new THREE.LineLoop(ringGeo, mat));
    if (r.active) {
      // sitne tačke na aktivnom prstenu
      [0.6, 2.2, 4.1].forEach(a => {
        const d = new THREE.Mesh(dotGeo, dotMat);
        d.position.set(Math.cos(a + k) * R, Math.sin(a + k) * R, 0);
        spin.add(d);
      });
      active.push(spin);
      activeMats.push(mat);
    }
    spinners.push({ g: spin, speed: r.speed });
  });

  // Logotipi klijenata: ravnomjerno raspoređeni po aktivnim prstenovima
  const perRing = Math.ceil(items.length / active.length);
  items.forEach((it, i) => {
    const ring = i % active.length;
    const slot = Math.floor(i / active.length);
    const a = (slot / perRing) * Math.PI * 2 + ring * 0.7;
    const tex = track(circleTexture(it.src, rerender));
    const mat = track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    const s = new THREE.Sprite(mat);
    s.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
    s.userData = { href: it.href, label: it.label, base: 1.25 };
    s.scale.setScalar(1.25);
    active[ring].add(s);
    sprites.push(s);
  });

  // ---- Interakcija: prevlačenje okreće sferu, klik otvara projekat ----
  let paused = opts.reduce;
  // prevlačenje lijevo/desno ubrzava ili okreće tok logotipa (boost), kostur ostaje miran
  let dragging = false, moved = 0, lastX = 0, lastY = 0, boost = 0;
  let hovered: THREE.Sprite | null = null;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  const pick = (e: PointerEvent): THREE.Sprite | null => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    // skriveni (preklopljeni) logotipi se ne mogu kliknuti
    const hit = ray.intersectObjects(sprites, false).find(h => (h.object as THREE.Sprite).userData.shown > 0.5);
    return (hit?.object as THREE.Sprite) ?? null;
  };
  const onDown = (e: PointerEvent) => {
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('dragging');
    wake();
  };
  const onMove = (e: PointerEvent) => {
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      boost = THREE.MathUtils.clamp(boost + dx * 0.04, -6, 6);
      wake();
      return;
    }
    if (e.pointerType !== 'mouse') return;
    const s = pick(e);
    if (s !== hovered) {
      hovered = s;
      canvas.style.cursor = s?.userData.href ? 'pointer' : '';
      opts.onHover?.(s ? s.userData.label : null);
      wake();
    }
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('dragging');
    if (moved < 8) { const s = pick(e); if (s?.userData.href) opts.onPick(s.userData.href); }
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', () => { if (hovered) { hovered = null; canvas.style.cursor = ''; opts.onHover?.(null); } });

  // ---- Veličina: sfera stane u kadar (i na uskom telefonu) ----
  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const vw = vh * camera.aspect;
    const base = w < 640 ? 1.05 : 1.0;
    // cijela sfera zajedno s diskovima projekata mora stati u kadar
    root.scale.setScalar(Math.min(1.15, (0.96 * Math.min(vw, vh)) / (2 * R + base)));
    sprites.forEach(s => { s.userData.base = base; });
    render();
  };
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);

  // ---- Petlja: radi samo kad je hero vidljiv i tab aktivan ----
  // Bez preklapanja: logotipi se poredaju od najbližeg prema najdaljem; onaj koji bi na ekranu
  // prekrio bližeg (ili "B." u sredini) postepeno nestaje i vraća se kad se oslobodi mjesto.
  const tmp = new THREE.Vector3();
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  let fading = false;
  function render() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const placed: { x: number; y: number; r: number }[] = [];
    const ob = opts.obstacle?.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
    if (ob && ob.width) placed.push({ x: ob.left + ob.width / 2 - cr.left, y: ob.top + ob.height / 2 - cr.top, r: Math.max(ob.width, ob.height) * 0.5 });
    const list = sprites.map(s => {
      s.getWorldPosition(tmp);
      const z = tmp.z;
      const px = (h / 2) / (tanHalf * (camera.position.z - z));
      const rad = (s.scale.x * root.scale.x / 2) * px;
      tmp.project(camera);
      return { s, z, x: (tmp.x + 1) / 2 * w, y: (1 - tmp.y) / 2 * h, r: rad };
    }).sort((a, b) => b.z - a.z);
    fading = false;
    list.forEach(({ s, z, x, y, r }) => {
      const free = placed.every(p => Math.hypot(p.x - x, p.y - y) > (p.r + r) * 1.04);
      if (free) placed.push({ x, y, r });
      const depth = THREE.MathUtils.clamp((z + R) / (2 * R), 0, 1);
      const want = free ? 1 : 0;
      const shown = THREE.MathUtils.lerp(s.userData.shown ?? want, want, 0.18);
      s.userData.shown = Math.abs(shown - want) < 0.01 ? want : shown;
      if (s.userData.shown !== want) fading = true;
      s.visible = s.userData.shown > 0.01;
      // potpuno neprozirni; providnost samo kratko dok se logotip skriva/vraća zbog preklapanja
      (s.material as THREE.SpriteMaterial).opacity = s.userData.shown;
      void depth;
      // ista veličina na ekranu bez obzira na dubinu: poništi perspektivu
      const flat = (camera.position.z - z) / camera.position.z;
      const target = s.userData.base * (s === hovered ? 1.15 : 1) * flat;
      s.scale.setScalar(s.scale.x === s.userData.base && !s.userData.init ? target : THREE.MathUtils.lerp(s.scale.x, target, 0.35));
      s.userData.init = true;
    });
    renderer.render(scene, camera);
  }
  let raf = 0, running = false, visible = true, last = 0;
  let hl = 0, hlT = 0;
  const orange = new THREE.Color(opts.accent), white = new THREE.Color(0xffffff);
  const frame = (t: number) => {
    const dt = Math.min(0.05, (t - (last || t)) / 1000);
    last = t;
    if (!dragging) boost *= Math.pow(0.12, dt); // tok se nakon prevlačenja vraća na normalnu brzinu
    const flow = paused ? 0 : 1;
    spinners.forEach(s => { s.g.rotation.z += (s.speed * flow + Math.sign(s.speed) * boost * 0.25) * dt; });
    if (!paused) driftParticles(dt);
    // svakih ~4,5 s narandžasta prelazi na sljedeći aktivni prsten (glatki prelaz boje)
    if (!paused) hlT += dt;
    if (hlT > 4.5) { hlT = 0; hl = (hl + 1) % activeMats.length; }
    activeMats.forEach((m, i) => {
      const on = i === hl;
      m.color.lerp(on ? orange : white, 1 - Math.pow(0.02, dt));
      m.opacity = THREE.MathUtils.lerp(m.opacity, on ? 0.95 : 0.4, 1 - Math.pow(0.02, dt));
    });
    render();
    const settled = paused && !dragging && Math.abs(boost) < 1e-3 && !hovered;
    if (settled && !fading && pending <= 0) { running = false; last = 0; return; }
    raf = requestAnimationFrame(frame);
  };
  function wake() {
    if (running || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible) wake(); else { cancelAnimationFrame(raf); running = false; last = 0; }
  });
  io.observe(canvas);
  const onVis = () => { if (document.hidden) { cancelAnimationFrame(raf); running = false; last = 0; } else wake(); };
  document.addEventListener('visibilitychange', onVis);
  fit();
  wake();

  return {
    setPaused(p: boolean) { paused = p || opts.reduce; wake(); },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      disposables.forEach(d => d.dispose());
      renderer.dispose();
    },
  };
}
