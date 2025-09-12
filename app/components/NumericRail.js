"use client";

import { useEffect, useRef } from "react";

/** Windy digits that align while scrolling, then gently break apart. */
export default function NumericRail() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  // mutable sim state
  const state = useRef({
    particles: [],
    dpr: 1,
    align: 0,          // 0 = chaotic, 1 = tidy grid
    alignTarget: 0,
    lastTop: 0,
    lastScrollAt: 0,
    cols: 0,
    rows: 0,
    W: 0,
    H: 0,
  });

  // helpers
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // size + particles
  useEffect(() => {
    const el = wrapRef.current;
    const c = canvasRef.current;
    if (!el || !c) return;

    const ctx = c.getContext("2d");
    state.current.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { clientWidth: W, clientHeight: H } = el;
      state.current.W = W;
      state.current.H = H;

      c.width = Math.floor(W * state.current.dpr);
      c.height = Math.floor(H * state.current.dpr);
      c.style.width = W + "px";
      c.style.height = H + "px";

      // grid for "tidy" state
      const colW = 14, rowH = 16;
      state.current.cols = Math.floor(W / colW);
      state.current.rows = Math.floor(H / rowH);

      // (re)seed particles
      const targetCount = Math.floor((W * H) / 2200); // density
      const parts = [];
      for (let i = 0; i < targetCount; i++) {
        const x = rand(-20, W + 20);
        const y = rand(-20, H + 20);
        const d = Math.floor(Math.random() * 10);
        const gx = Math.floor(Math.random() * state.current.cols) * colW + colW * 0.5;
        const gy = Math.floor(Math.random() * state.current.rows) * rowH + rowH * 0.65;
        parts.push({ x, y, vx: rand(-0.2, 0.2), vy: rand(-0.2, 0.2), d, gx, gy, w: rand(0.8, 1.4) });
      }
      state.current.particles = parts;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onScroll = () => {
      const top = el.scrollTop;
      const delta = Math.abs(top - state.current.lastTop);
      state.current.lastTop = top;
      state.current.lastScrollAt = performance.now();
      // stronger scroll => stronger tidy target
      state.current.alignTarget = clamp(state.current.alignTarget + Math.min(0.35, delta / 200), 0, 1);
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    // animation
    const tick = () => {
      const { dpr, W, H, particles } = state.current;
      const t = performance.now() * 0.001;

      // relax target back to chaos when idle
      if (performance.now() - state.current.lastScrollAt > 350) {
        state.current.alignTarget *= 0.96; // decay
      }
      state.current.align = lerp(state.current.align, state.current.alignTarget, 0.08);
      const align = state.current.align;

      // draw
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // soft wash background (keeps perf good and adds glow)
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#eef2fb");
      g.addColorStop(1, "#e7ecf7");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      // subtle 3D tilt
      ctx.translate(W * 0.02, H * 0.02);
      // font
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(149,162,185,0.38)";

      for (let p of particles) {
        // wind (reduced as we align)
        const windX = Math.sin((p.y * 0.04) + t * 0.9) * 0.25 + Math.cos((p.x * 0.03) - t * 0.6) * 0.15;
        const windY = Math.cos((p.x * 0.035) + t * 0.7) * 0.22;

        p.vx += (1 - align) * windX * 0.08 * p.w;
        p.vy += (1 - align) * windY * 0.08 * p.w;

        // attraction to grid (tidy)
        const ax = (p.gx - p.x) * (0.02 * align);
        const ay = (p.gy - p.y) * (0.02 * align);
        p.vx += ax;
        p.vy += ay;

        // friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        // integrate
        p.x += p.vx;
        p.y += p.vy;

        // wrap edges
        if (p.x < -24) p.x += W + 48;
        if (p.x > W + 24) p.x -= W + 48;
        if (p.y < -24) p.y += H + 48;
        if (p.y > H + 24) p.y -= H + 48;

        // draw digit
        ctx.fillText(p.d, p.x, p.y);
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className="rail">
      {/* spacer makes the rail itself scrollable while page stays locked */}
      <div style={{ height: "220vh" }} aria-hidden="true" />
      <canvas ref={canvasRef} className="layer" />
      <style jsx>{`
        .rail{
          height:100vh; overflow:auto; position:relative;
          background:linear-gradient(180deg,#eef2fb 0%,#e7ecf7 100%);
          border-left:1px solid #e9eef5;
          perspective:900px;
        }
        .layer{position:absolute; inset:0; display:block}
      `}</style>
    </div>
  );
}
