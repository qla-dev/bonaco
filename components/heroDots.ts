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

  const dots: Dot[] = [];
  for (let i = 0; i < 70; i++) {
    const z = Math.random();
    dots.push({
      a: Math.random() * Math.PI * 2,
      r: 0.34 + Math.sqrt(Math.random()) * 0.62, // ravnomjerno po disku, ostavlja prostor oko B.
      z, size: 2.5 + z * 6, color: COLORS[i % COLORS.length],
      wob: Math.random() * Math.PI * 2, ox: 0, oy: 0, vx: 0, vy: 0,
    });
  }
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
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);

  let paused = opts.reduce, scrollV = 0, lastScroll = getScrollY();

  function draw(dt: number) {
    px += (tpx - px) * Math.min(1, dt * 3);
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
    const shiftX = px * 14, shiftY = py * 10; // cijeli krug se pomjera zajedno: ostaje okrugao
    for (const d of dots) {
      d.a += flow * (0.4 + d.z) * dt;
      d.wob += dt * (0.5 + d.z * 0.6);
      const rr = d.r * R * (1 + Math.sin(d.wob) * 0.03); // blago disanje
      let x = cx + shiftX + Math.cos(d.a) * rr;
      let y = cy + shiftY + Math.sin(d.a) * rr;
      // bježanje od kursora + opruga nazad
      const dx = x + d.ox - mx, dy = y + d.oy - my;
      const dist = Math.hypot(dx, dy), rad = 130;
      if (dist < rad && dist > 0.1) {
        const f = (1 - dist / rad) * 650 * (0.5 + d.z);
        d.vx += (dx / dist) * f * dt; d.vy += (dy / dist) * f * dt;
      }
      d.vx += -d.ox * 10 * dt; d.vy += -d.oy * 10 * dt;
      d.vx *= Math.pow(0.015, dt); d.vy *= Math.pow(0.015, dt);
      d.ox += d.vx * dt; d.oy += d.vy * dt;
      x += d.ox; y += d.oy;
      // ostani u krugu: najviše malo preko ruba (meka granica)
      const ex = x - (cx + shiftX), ey = y - (cy + shiftY), er = Math.hypot(ex, ey), max = R * 1.06;
      if (er > max) { x = cx + shiftX + (ex / er) * max; y = cy + shiftY + (ey / er) * max; }
      ctx.globalAlpha = 0.55 + d.z * 0.45;
      ctx.fillStyle = d.color;
      ctx.beginPath(); ctx.arc(x, y, d.size, 0, Math.PI * 2); ctx.fill();
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
      document.removeEventListener('pointerleave', onLeave);
    },
  };
}
