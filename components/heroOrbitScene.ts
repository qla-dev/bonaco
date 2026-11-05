// Hero 3D: tri rotirajuća prstena (kao armilarna sfera) sa projektima kao kružnim "sferama".
// Prevlačenjem se okreće cijela sfera (uz inerciju), klik na projekat otvara studiju slučaja.
// Učitava se dinamički (three.js je zaseban chunk), crta samo dok je hero vidljiv.
import * as THREE from 'three';

export interface OrbitItem { src: string; href: string; label: string }
export interface OrbitHandle { destroy(): void; setPaused(p: boolean): void }
interface Opts { accent: string; reduce: boolean; onPick(href: string): void; onHover?(label: string | null): void }

const R = 3.2;

/** Kružna tekstura iz fotografije (cover crop) s tankim svijetlim rubom. */
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
    const s = Math.min(img.width, img.height);
    ctx.save();
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
    ctx.restore();
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

  const root = new THREE.Group();
  root.rotation.set(0.28, 0, 0);
  scene.add(root);
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T) => { disposables.push(x); return x; };

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
    }
    spinners.push({ g: spin, speed: r.speed });
  });

  // Projekti: po dva na svakom aktivnom prstenu, nasuprot jedan drugom
  items.forEach((it, i) => {
    const ring = i % active.length;
    const slot = Math.floor(i / active.length);
    const a = slot * Math.PI + ring * 0.9;
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
  let dragging = false, moved = 0, lastX = 0, lastY = 0, vx = 0, vy = 0, idle = 0;
  let hovered: THREE.Sprite | null = null;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  const pick = (e: PointerEvent): THREE.Sprite | null => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(sprites, false)[0];
    return (hit?.object as THREE.Sprite) ?? null;
  };
  const onDown = (e: PointerEvent) => {
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; vx = vy = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('dragging');
    wake();
  };
  const onMove = (e: PointerEvent) => {
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      vx = dx * 0.006; vy = dy * 0.004;
      root.rotation.y += vx;
      root.rotation.x = Math.max(-0.9, Math.min(0.9, root.rotation.x + vy));
      idle = 0;
      wake();
      return;
    }
    if (e.pointerType !== 'mouse') return;
    const s = pick(e);
    if (s !== hovered) {
      hovered = s;
      canvas.style.cursor = s ? 'pointer' : '';
      opts.onHover?.(s ? s.userData.label : null);
      wake();
    }
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('dragging');
    if (moved < 8) { const s = pick(e); if (s) opts.onPick(s.userData.href); }
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
    const base = w < 640 ? 1.35 : 1.25;
    // cijela sfera zajedno s diskovima projekata mora stati u kadar
    root.scale.setScalar(Math.min(1.15, (0.96 * Math.min(vw, vh)) / (2 * R + base)));
    sprites.forEach(s => { s.userData.base = base; });
    render();
  };
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);

  // ---- Petlja: radi samo kad je hero vidljiv i tab aktivan ----
  const tmp = new THREE.Vector3();
  function render() {
    sprites.forEach(s => {
      s.getWorldPosition(tmp);
      const depth = THREE.MathUtils.clamp((tmp.z + R) / (2 * R), 0, 1);
      (s.material as THREE.SpriteMaterial).opacity = 0.35 + 0.65 * depth;
      const target = s.userData.base * (s === hovered ? 1.15 : 1);
      s.scale.setScalar(THREE.MathUtils.lerp(s.scale.x, target, 0.25));
    });
    renderer.render(scene, camera);
  }
  let raf = 0, running = false, visible = true, last = 0;
  const frame = (t: number) => {
    const dt = Math.min(0.05, (t - (last || t)) / 1000);
    last = t;
    if (!dragging) {
      vx *= 0.94; vy *= 0.94;
      root.rotation.y += vx;
      root.rotation.x = Math.max(-0.9, Math.min(0.9, root.rotation.x + vy));
      idle += dt;
    }
    if (!paused) {
      spinners.forEach(s => { s.g.rotation.z += s.speed * dt; });
      if (!dragging && idle > 1.5) root.rotation.y += 0.06 * dt;
    }
    render();
    const settled = paused && !dragging && Math.abs(vx) < 1e-4 && Math.abs(vy) < 1e-4 && !hovered;
    if (settled && pending <= 0) { running = false; last = 0; return; }
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
