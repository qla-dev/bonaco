// Pozadina heroja: mreža čestica (canvas 2D) koja reaguje na miš, sa šest čvorova agenata
// povezanih s Benom; kroz veze putuju impulsi (Bonexis kao CRM mreža).
export interface ParticleOptions { agents: string[]; benAnchor: () => { x: number; y: number; w?: number; h?: number } | null }

export function startParticles(canvas: HTMLCanvasElement, opts: ParticleOptions) {
  const ctx = canvas.getContext('2d')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
  const mouse = { x: -9999, y: -9999, on: false };

  type P = { x: number; y: number; vx: number; vy: number; r: number };
  let pts: P[] = [];
  const hubs = opts.agents.map((name, i) => ({ name, i, x: 0, y: 0, phase: Math.random() * 6.28, pulse: Math.random() }));

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(150, Math.round((w * h) / 11000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: 0.8 + Math.random() * 1.6,
    }));
  };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);

  const host = canvas.parentElement!;
  const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; };
  const onLeave = () => { mouse.on = false; mouse.x = mouse.y = -9999; };
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerleave', onLeave);

  let t = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    t += reduce ? 0 : 0.016;
    ctx.clearRect(0, 0, w, h);

    // Ben (sidro na chat prozoru) i čvorovi agenata u luku oko njega
    const ben = opts.benAnchor() ?? { x: w * 0.72, y: h * 0.5 };
    // čvorovi u luku uz lijevu stranu Ben prozora (ne prelaze preko teksta lijevo)
    const box = opts.benAnchor ? opts.benAnchor() : null;
    const rx = box ? Math.max(170, box.w ?? 0) : Math.min(w, h) * 0.32;
    const ry = box ? Math.max(180, box.h ?? 0) : Math.min(w, h) * 0.32;
    hubs.forEach((hb, i) => {
      const a = (Math.PI * 100) / 180 + (i / (hubs.length - 1)) * ((Math.PI * 160) / 180) + Math.sin(t * 0.3 + hb.phase) * 0.03;
      // superelipsa: prati pravougaoni oblik prozora, pa čvorovi ostaju van njegovih uglova
      const c = Math.cos(a), sn = Math.sin(a), k = 0.35;
      hb.x = ben.x + Math.sign(c) * Math.pow(Math.abs(c), k) * rx * (1 + Math.sin(t * 0.5 + hb.phase) * 0.02);
      hb.y = ben.y - Math.sign(sn) * Math.pow(Math.abs(sn), k) * ry;
    });

    // čestice
    for (const p of pts) {
      if (!reduce) { p.x += p.vx; p.y += p.vy; }
      if (mouse.on) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140 && d2 > 1) { const f = (1 - Math.sqrt(d2) / 140) * 0.6; p.x += (dx / Math.sqrt(d2)) * f; p.y += (dy / Math.sqrt(d2)) * f; }
      }
      if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;
    }
    // veze između čestica
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 110 * 110) {
          ctx.strokeStyle = `rgba(217,163,133,${(1 - Math.sqrt(d2) / 110) * 0.16})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      if (mouse.on) {
        const dx = a.x - mouse.x, dy = a.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 170 * 170) {
          ctx.strokeStyle = `rgba(240,200,170,${(1 - Math.sqrt(d2) / 170) * 0.45})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.fillStyle = 'rgba(232,200,178,0.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }

    // Ben -> agenti: linije i impulsi
    hubs.forEach(hb => {
      const grad = ctx.createLinearGradient(ben.x, ben.y, hb.x, hb.y);
      grad.addColorStop(0, 'rgba(217,163,133,0.5)'); grad.addColorStop(1, 'rgba(217,163,133,0.08)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.2; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(ben.x, ben.y); ctx.lineTo(hb.x, hb.y); ctx.stroke(); ctx.setLineDash([]);
      hb.pulse = (hb.pulse + (reduce ? 0 : 0.006)) % 1;
      const px = ben.x + (hb.x - ben.x) * hb.pulse, py = ben.y + (hb.y - ben.y) * hb.pulse;
      const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
      g.addColorStop(0, 'rgba(255,220,195,0.95)'); g.addColorStop(1, 'rgba(255,220,195,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 10, 0, 6.283); ctx.fill();
      // čvor agenta
      const near = mouse.on && Math.hypot(hb.x - mouse.x, hb.y - mouse.y) < 60;
      ctx.fillStyle = near ? '#d9a385' : 'rgba(30,22,18,0.92)';
      ctx.strokeStyle = 'rgba(217,163,133,0.9)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(hb.x, hb.y, near ? 24 : 20, 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.fillStyle = near ? '#1b1715' : '#f4ede8';
      ctx.font = '700 15px Syne, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(hb.name[0], hb.x, hb.y + 1);
      ctx.fillStyle = 'rgba(244,237,232,0.75)'; ctx.font = '500 12px Poppins, sans-serif';
      ctx.fillText(hb.name, hb.x, hb.y + (near ? 38 : 34));
    });
  };
  frame();

  return () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
  };
}
