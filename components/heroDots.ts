// Hero "B. znak" efekat: tačkice u bojama tri brenda lebde oko velikog B.
// - Miš/prst: tačkice bježe od kursora, a cijeli oblak se blago pomjera na suprotnu stranu (parallax).
// - Skrol: dolje ubrzava kruženje, gore ga okreće unazad; bez skrola normalan, spor tok.
// Canvas 2D (bez three.js), crta samo dok je hero vidljiv; uz reduced-motion je mirno.
import { getScrollY, onScroll } from '../lib/scroller';

export interface DotsHandle { destroy(): void; setPaused(p: boolean): void }

const COLORS = ['#F58426', '#009D9A', '#592ADA', '#3cc9c5', '#a88bff', '#f9a15e'];

interface Dot { a: number; r: number; z: number; size: number; color: string; wob: number; ox: number; oy: number; vx: number; vy: number }

export function startDots(canvas: HTMLCanvasElement, opts: { reduce: boolean }): DotsHandle {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0;
  const dots: Dot[] = [];
  const N = 70;
  for (let i = 0; i < N; i++) {
    const z = Math.random(); // dubina: bliže = veće i brže reaguje
    dots.push({
      a: Math.random() * Math.PI * 2,
      r: 0.32 + Math.pow(Math.random(), 0.7) * 0.68, // udaljenost od centra (dio poluprečnika)
      z,
      size: 2.5 + z * 6.5,
      color: COLORS[i % COLORS.length],
      wob: Math.random() * Math.PI * 2,
      ox: 0, oy: 0, vx: 0, vy: 0,
    });
  }

  const fit = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    cx = W / 2; cy = H / 2; R = Math.min(W, H) * 0.48;
    draw(0);
  };

  // kursor (relativno na canvas); null kad je van
  let mx = -9999, my = -9999, px = 0, py = 0, tpx = 0, tpy = 0;
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
    // parallax: oblak ide suprotno od kursora (normalizovano -1..1)
    tpx = -((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    tpy = -((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
    tpx = Math.max(-1, Math.min(1, tpx)); tpy = Math.max(-1, Math.min(1, tpy));
    wake();
  };
  const onLeave = () => { mx = my = -9999; tpx = tpy = 0; };
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerleave', onLeave);

  let paused = opts.reduce, scrollV = 0, lastScroll = getScrollY(), t = 0;

  function draw(dt: number) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    px += (tpx - px) * Math.min(1, dt * 3);
    py += (tpy - py) * Math.min(1, dt * 3);
    const flow = (paused ? 0 : 0.06) + scrollV * 0.5;
    for (const d of dots) {
      d.a += flow * (0.4 + d.z) * dt;
      d.wob += dt * (0.5 + d.z * 0.6);
      const rr = d.r * R + Math.sin(d.wob) * 6;
      const shift = 26 + d.z * 34; // bliže tačke se više pomjeraju (dubina)
      const bx = cx + Math.cos(d.a) * rr * 1.08 + px * shift;
      const by = cy + Math.sin(d.a) * rr + py * shift * 0.7;
      // bježanje od kursora + opruga nazad
      const dx = bx + d.ox - mx, dy = by + d.oy - my;
      const dist = Math.hypot(dx, dy), rad = 150;
      if (dist < rad && dist > 0.1) {
        const f = (1 - dist / rad) * 900 * (0.5 + d.z);
        d.vx += (dx / dist) * f * dt; d.vy += (dy / dist) * f * dt;
      }
      d.vx += -d.ox * 9 * dt; d.vy += -d.oy * 9 * dt;
      d.vx *= Math.pow(0.02, dt); d.vy *= Math.pow(0.02, dt);
      d.ox += d.vx * dt; d.oy += d.vy * dt;
      ctx.globalAlpha = 0.45 + d.z * 0.5;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(bx + d.ox, by + d.oy, d.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0, running = false, visible = true, last = 0;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now; t += dt;
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
  const ro = new ResizeObserver(fit); ro.observe(canvas);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(raf); running = false; last = 0; } });
  io.observe(canvas);
  const offScroll = onScroll(() => wake());
  fit(); wake();

  return {
    setPaused(p) { paused = p || opts.reduce; wake(); },
    destroy() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); offScroll();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerleave', onLeave);
    },
  };
}
