// Hero "B. znak" efekat.
// Prednji sloj: tačkice u bojama brendova u obliku KRUGA oko B. (malo "dišu", ali krug ostaje krug).
//   Miš/prst: tačkice bježe od kursora, oblak se blago pomjera na suprotnu stranu (parallax).
// Pozadinski sloj (cijeli hero): iste tačkice, zamućene i prigušene, kao u daljini.
// Skrol: dolje ubrzava kruženje, gore ga okreće unazad; bez skrola spor, normalan tok.
// Canvas 2D (bez three.js), crta samo dok je hero vidljiv; uz reduced-motion je mirno.
import { getScrollY, onScroll } from '../lib/scroller';

export interface DotsHandle { destroy(): void; setPaused(p: boolean): void }

const COLORS = ['#F58426', '#009D9A', '#592ADA', '#3cc9c5', '#a88bff', '#f9a15e'];

interface Dot { a: number; r: number; z: number; size: number; color: string; wob: number; ox: number; oy: number; vx: number; vy: number }
interface BgDot { x: number; y: number; z: number; size: number; color: string; vy: number; ph: number }

export function startDots(canvas: HTMLCanvasElement, opts: { reduce: boolean; bg?: HTMLCanvasElement | null }): DotsHandle {
  const ctx = canvas.getContext('2d')!;
  const bg = opts.bg ?? null;
  const bctx = bg?.getContext('2d') ?? null;
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0, BW = 0, BH = 0;

  // Ravnomjeran disk (zlatni ugao): svi kruže ISTOM brzinom pa oblik ostaje pravilan krug bez rupa.
  const N = 72;
  const dots: Dot[] = [];
  for (let i = 0; i < N; i++) {
    const z = (i * 0.618034) % 1; // dubina 0 (daleko) .. 1 (blizu), ravnomjerno izmiješana
    dots.push({
      a: i * 2.399963,
      r: 0.36 + Math.sqrt((i + 0.5) / N) * 0.6,
      z, size: 1.8 + z * 7.5, color: COLORS[i % COLORS.length],
      wob: (i * 1.7) % 6.283, ox: 0, oy: 0, vx: 0, vy: 0,
    });
  }
  dots.sort((p, q) => p.z - q.z); // daleke prve, bliže preko njih
  let theta = 0;
  const bgDots: BgDot[] = [];
  for (let i = 0; i < 90; i++) {
    bgDots.push({ x: Math.random(), y: Math.random(), z: Math.random(), size: 3 + Math.random() * 9, color: COLORS[i % COLORS.length], vy: 0.004 + Math.random() * 0.01, ph: Math.random() * 6.3 });
  }

  const fit = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    cx = W / 2; cy = H / 2; R = Math.min(W, H) * 0.46;
    if (bg) {
      const b = bg.getBoundingClientRect();
      BW = b.width; BH = b.height;
      bg.width = Math.round(BW * 0.5); bg.height = Math.round(BH * 0.5); // pola rezolucije: ionako je zamućeno
    }
    draw(0);
  };

  let mx = -9999, my = -9999, px = 0, py = 0, tpx = 0, tpy = 0;
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
    tpx = Math.max(-1, Math.min(1, -((e.clientX - (r.left + r.width / 2)) / (r.width / 2))));
    tpy = Math.max(-1, Math.min(1, -((e.clientY - (r.top + r.height / 2)) / (r.height / 2))));
    wake();
  };
  const onLeave = () => { mx = my = -9999; tpx = tpy = 0; };
  // na dodir: kad se prst podigne, tačkice se vraćaju (nema trajne "rupe")
  const onUp = (e: PointerEvent) => { if (e.pointerType !== 'mouse') { mx = my = -9999; } };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointercancel', onUp, { passive: true });
  document.addEventListener('pointerleave', onLeave);

  // Nagib telefona lijevo/desno: blagi pomak oblaka (iOS traži dozvolu na prvi dodir)
  let tilt = 0, tiltOn = false;
  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.gamma == null) return;
    tiltOn = true;
    tilt = Math.max(-1, Math.min(1, e.gamma / 30));
    wake();
  };
  window.addEventListener('deviceorientation', onOrient);
  const askTilt = () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (DOE && typeof DOE.requestPermission === 'function') DOE.requestPermission().catch(() => {});
    window.removeEventListener('touchend', askTilt);
  };
  window.addEventListener('touchend', askTilt, { passive: true });

  let paused = opts.reduce, scrollV = 0, lastScroll = getScrollY();

  function draw(dt: number) {
    const targetX = tiltOn && mx < -999 ? -tilt * 0.8 : tpx;
    px += (targetX - px) * Math.min(1, dt * 3);
    py += (tpy - py) * Math.min(1, dt * 3);
    const flow = (paused ? 0 : 0.06) + scrollV * 0.5;

    // ---- pozadina: zamućene, prigušene tačkice po cijelom heroju ----
    if (bctx && bg) {
      bctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
      bctx.clearRect(0, 0, BW, BH);
      for (const d of bgDots) {
        d.y -= (d.vy * (paused ? 0 : 1) + scrollV * 0.02) * (0.4 + d.z) * dt * 6;
        if (d.y < -0.05) d.y = 1.05; if (d.y > 1.05) d.y = -0.05;
        d.ph += dt * 0.4;
        const x = d.x * BW + Math.sin(d.ph) * 10 + px * (8 + d.z * 10);
        const y = d.y * BH + py * (6 + d.z * 8);
        bctx.globalAlpha = 0.18 + d.z * 0.22;
        bctx.fillStyle = d.color;
        bctx.beginPath(); bctx.arc(x, y, d.size, 0, Math.PI * 2); bctx.fill();
      }
      bctx.globalAlpha = 1;
    }

    // ---- prednji krug oko B. ----
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    theta += flow * dt;
    for (const d of dots) {
      d.wob += dt * (0.5 + d.z * 0.6);
      const rr = d.r * R * (1 + Math.sin(d.wob) * 0.025);
      // dubina: bliže tačke se više pomjeraju (parallax), dalje manje
      const par = 6 + d.z * 26;
      const ccx = cx + px * par, ccy = cy + py * par * 0.7;
      let x = ccx + Math.cos(d.a + theta) * rr;
      let y = ccy + Math.sin(d.a + theta) * rr;
      const dx = x + d.ox - mx, dy = y + d.oy - my;
      const dist = Math.hypot(dx, dy), rad = 120;
      if (dist < rad && dist > 0.1) {
        const f = (1 - dist / rad) * 600 * (0.4 + d.z);
        d.vx += (dx / dist) * f * dt; d.vy += (dy / dist) * f * dt;
      }
      d.vx += -d.ox * 11 * dt; d.vy += -d.oy * 11 * dt;
      d.vx *= Math.pow(0.012, dt); d.vy *= Math.pow(0.012, dt);
      d.ox += d.vx * dt; d.oy += d.vy * dt;
      x += d.ox; y += d.oy;
      const ex = x - ccx, ey = y - ccy, er = Math.hypot(ex, ey), max = R * 1.05;
      if (er > max) { x = ccx + (ex / er) * max; y = ccy + (ey / er) * max; }
      const sz = d.size;
      if (d.z < 0.38) {
        // daleko: manje, prigušeno, meke ivice
        const g = ctx.createRadialGradient(x, y, 0, x, y, sz * 1.6);
        g.addColorStop(0, d.color); g.addColorStop(0.55, d.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 0.3 + d.z * 0.8;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, sz * 1.6, 0, Math.PI * 2); ctx.fill();
      } else {
        // blizu: puna, s blagim 3D sjajem
        ctx.globalAlpha = 0.7 + d.z * 0.3;
        const g = ctx.createRadialGradient(x - sz * 0.35, y - sz * 0.35, sz * 0.1, x, y, sz);
        g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(0.35, d.color); g.addColorStop(1, d.color);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0, running = false, visible = true, last = 0;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    const sy = getScrollY();
    const v = dt > 0 ? (sy - lastScroll) / dt : 0;
    lastScroll = sy;
    scrollV += (Math.max(-6, Math.min(6, v / 160)) - scrollV) * (1 - Math.pow(0.002, dt));
    draw(dt);
    const still = paused && Math.abs(scrollV) < 0.01 && mx < -999 && Math.abs(px - tpx) < 0.001;
    if (still) { running = false; last = 0; return; }
    raf = requestAnimationFrame(frame);
  };
  function wake() {
    if (running || !visible || document.hidden) return;
    running = true; raf = requestAnimationFrame(frame);
  }
  const ro = new ResizeObserver(fit); ro.observe(canvas); if (bg) ro.observe(bg);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(raf); running = false; last = 0; } });
  io.observe(bg ?? canvas);
  const offScroll = onScroll(() => wake());
  fit(); wake();

  return {
    setPaused(p) { paused = p || opts.reduce; wake(); },
    destroy() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); offScroll();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('deviceorientation', onOrient);
      window.removeEventListener('touchend', askTilt);
      document.removeEventListener('pointerleave', onLeave);
    },
  };
}
