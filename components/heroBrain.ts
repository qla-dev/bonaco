// Neuronska mreža u heroju: Ben u centru, agenti na unutrašnjem prstenu,
// manji neuroni na vanjskom prstenu s dugim repovima (aksonima). Impulsi putuju po vezama.

export interface P { x: number; y: number }

/** Normalizovane koordinate (jedinica = širina mreže) -> pikseli u kontejneru. */
export const brainMap = (w: number, h: number) => {
  const S = Math.min(w * 0.82, h * 1.05);
  return { S, px: (p: P) => ({ x: w / 2 + p.x * S, y: h / 2 + p.y * S }) };
};

// deterministički "slučajni" brojevi: isti raspored pri svakom učitavanju
const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** Agenti oko Bena, namjerno nepravilno (različiti uglovi i udaljenosti). */
export const agentRing = (n: number): P[] => {
  const r = seeded(11), out: P[] = [];
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 60; k++) {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + (r() - 0.5) * 0.5;
      const d = 0.26 + r() * 0.14;
      const p = { x: Math.cos(a) * d * 1.1, y: Math.sin(a) * d * 0.88 };
      if (out.every(q => Math.hypot(q.x - p.x, q.y - p.y) > 0.2) || k === 59) { out.push(p); break; }
    }
  }
  return out;
};

export interface BrainHandle { fire: (agent: number) => void; destroy: () => void }

type Edge = { a: P; b: P; bend: number; strong?: boolean };

export function startBrain(canvas: HTMLCanvasElement, opts: { agents: P[]; ben: P }): BrainHandle {
  const ctx = canvas.getContext('2d')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, raf = 0, visible = true;
  const mouse = { x: -9999, y: -9999, on: false };

  // Okolni neuroni: nepravilno raspoređeni, s repovima različite dužine
  const r = seeded(29);
  type N = P & { a: number; ph: number; len: number; dend: number[]; size: number };
  const outer: N[] = [];
  const SECTORS = 22;
  for (let tries = 0; outer.length < SECTORS && tries < 4000; tries++) {
    // ravnomjerno po sektorima oko Bena (svaki sektor jedan neuron), uz malo odstupanje
    const sector = outer.length, a = (sector / SECTORS) * Math.PI * 2 + (r() - 0.5) * 0.22, d = 0.44 + r() * 0.2;
    const p = { x: Math.cos(a) * d * 1.05, y: Math.sin(a) * d * 0.82 };
    const clash = [...outer, ...opts.agents, opts.ben].some(q => Math.hypot(q.x - p.x, q.y - p.y) < 0.11);
    if (clash) continue;
    outer.push({ ...p, a: a + (r() - 0.5) * 0.6, ph: r() * 6.28, len: 0.12 + r() * 0.22, dend: Array.from({ length: 1 + Math.floor(r() * 3) }, () => (r() - 0.5) * 2.6), size: 2.4 + r() * 2 });
  }

  const edges: Edge[] = [];
  const dist = (p: P, q: P) => Math.hypot(p.x - q.x, p.y - q.y);
  outer.forEach((o, i) => {
    const ag = [...opts.agents].sort((p, q) => dist(o, p) - dist(o, q))[0];
    edges.push({ a: o, b: ag, bend: 0 });                           // prema najbližem agentu
    // do dva najbliža susjeda (svaka linija završava neuronom, bez slobodnih repova)
    outer.map((q, j) => ({ q, j })).filter(x => x.j > i).sort((x, y) => dist(o, x.q) - dist(o, y.q)).slice(0, 2)
      .forEach(nb => { if (dist(o, nb.q) < 0.3) edges.push({ a: o, b: nb.q, bend: 0 }); });
  });
  const nEdgesOuter = edges.length;
  opts.agents.forEach(ag => edges.push({ a: opts.ben, b: ag, bend: 0, strong: true })); // Ben -> agenti

  const ctrl = (e: Edge, A: P, B: P) => ({ x: (A.x + B.x) / 2 - (B.y - A.y) * e.bend, y: (A.y + B.y) / 2 + (B.x - A.x) * e.bend });
  const on = (A: P, Q: P, B: P, t: number) => ({ x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * Q.x + t * t * B.x, y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * Q.y + t * t * B.y });

  type Pulse = { e: number; t: number; big?: boolean };
  const pulses: Pulse[] = [];

  let hw = 0, hh = 0, ox = 0, oy = 0; // veličina kutije i pomak kutije unutar canvasa
  const resize = () => {
    const r = canvas.getBoundingClientRect(), hr = canvas.parentElement!.getBoundingClientRect();
    hw = hr.width; hh = hr.height; ox = hr.left - r.left; oy = hr.top - r.top;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const ro = new ResizeObserver(resize); ro.observe(canvas); ro.observe(canvas.parentElement!); resize();
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
  const host = canvas.parentElement!;
  const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; };
  const onLeave = () => { mouse.on = false; };
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerleave', onLeave);

  let t = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    t += reduce ? 0 : 0.016;
    const m = brainMap(hw, hh), px = (p: P) => { const q = m.px(p); return { x: q.x + ox, y: q.y + oy }; };
    ctx.clearRect(0, 0, w, h);
    const near = (p: P) => (mouse.on ? Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / 140) : 0);

    // veze
    edges.forEach(e => {
      const A = px(e.a), B = px(e.b), Q = ctrl(e, A, B), glow = Math.max(near(A), near(B));
      ctx.strokeStyle = e.strong ? `rgba(240,195,165,${0.45 + glow * 0.4})` : `rgba(217,163,133,${0.18 + glow * 0.45})`;
      ctx.lineWidth = e.strong ? 1.6 : 1.1;
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.quadraticCurveTo(Q.x, Q.y, B.x, B.y); ctx.stroke();
    });

    // okolni neuroni s repovima različite dužine
    outer.forEach(o => {
      const p = px(o), g = near(p);
      const r = o.size + g * 2 + Math.sin(t * 2 + o.ph) * 0.4;
      const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
      gr.addColorStop(0, `rgba(250,220,200,${0.5 + g * 0.4})`); gr.addColorStop(1, 'rgba(250,220,200,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, r * 3, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#f4d7c3'; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.283); ctx.fill();
    });

    // impulsi
    if (!reduce && pulses.length < 14 && Math.random() < 0.08) pulses.push({ e: Math.floor(Math.random() * nEdgesOuter), t: 0 });
    for (let k = pulses.length - 1; k >= 0; k--) {
      const pu = pulses[k], e = edges[pu.e];
      pu.t += pu.big ? 0.02 : 0.012;
      const A = px(e.a), B = px(e.b), Q = ctrl(e, A, B), p = on(A, Q, B, Math.min(1, pu.t)), r = pu.big ? 12 : 7;
      const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      gr.addColorStop(0, 'rgba(255,232,214,1)'); gr.addColorStop(1, 'rgba(255,232,214,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.283); ctx.fill();
      if (pu.t >= 1) pulses.splice(k, 1);
    }

    // Ben jezgra
    const B = px(opts.ben), pulse = 1 + Math.sin(t * 2.2) * 0.12;
    const bg = ctx.createRadialGradient(B.x, B.y, 0, B.x, B.y, 80 * pulse);
    bg.addColorStop(0, 'rgba(217,163,133,0.5)'); bg.addColorStop(1, 'rgba(217,163,133,0)');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(B.x, B.y, 80 * pulse, 0, 6.283); ctx.fill();
  };
  frame();

  return {
    // Ben -> agent: veliki impuls po glavnoj vezi
    fire: (agent: number) => { if (!reduce) pulses.push({ e: nEdgesOuter + agent, t: 0, big: true }); },
    destroy: () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    },
  };
}
