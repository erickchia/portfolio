"use client";

import { useEffect, useRef } from "react";

export default function NumericRail() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  // tuning
  const DENSITY = 1200;        // smaller = more digits
  const MAX_TILT_X = 6;
  const MAX_TILT_Y = 10;
  const LOCK_BP = 980;

  const S = useRef({
    particles: [],
    dpr: 1,
    align: 0,
    alignTarget: 0,
    lastTop: 0,
    lastScrollAt: 0,
    cols: 0, rows: 0, W: 0, H: 0,
    tiltX: 0, tiltY: 0, tiltTX: 0, tiltTY: 0,
  });

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  useEffect(() => {
    const rail = wrapRef.current;
    const cvs  = canvasRef.current;
    if (!rail || !cvs) return;
    const ctx = cvs.getContext("2d");
    S.current.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      const { clientWidth: W, clientHeight: H } = rail;
      S.current.W = W; S.current.H = H;

      cvs.width  = Math.floor(W * S.current.dpr);
      cvs.height = Math.floor(H * S.current.dpr);
      cvs.style.width = W + "px";
      cvs.style.height = H + "px";

      const colW = 14, rowH = 16;
      S.current.cols = Math.floor(W / colW);
      S.current.rows = Math.floor(H / rowH);

      const count = Math.floor((W * H) / DENSITY);
      const parts = [];
      for (let i = 0; i < count; i++) {
        const x = rand(-20, W + 20);
        const y = rand(-20, H + 20);
        const d = Math.floor(Math.random() * 10);
        const gx = Math.floor(Math.random() * S.current.cols) * colW + colW * 0.5;
        const gy = Math.floor(Math.random() * S.current.rows) * rowH + rowH * 0.65;
        parts.push({ x, y, vx: rand(-0.2, 0.2), vy: rand(-0.2, 0.2), d, gx, gy, w: rand(0.8, 1.4) });
      }
      S.current.particles = parts;
    };

    seed();
    const ro = new ResizeObserver(seed);
    ro.observe(rail);

    const onRailScroll = () => {
      const top = rail.scrollTop;
      const delta = Math.abs(top - S.current.lastTop);
      S.current.lastTop = top;
      S.current.lastScrollAt = performance.now();
      S.current.alignTarget = clamp(S.current.alignTarget + Math.min(0.35, delta / 200), 0, 1);
    };
    rail.addEventListener("scroll", onRailScroll, { passive: true });

    // route wheel to rail (desktop)
    const onWheel = (e) => {
      if (window.innerWidth >= LOCK_BP) {
        e.preventDefault();
        rail.scrollTop += e.deltaY || e.deltaX || 0;
      }
    };
    document.addEventListener("wheel", onWheel, { passive: false });

    // keyboard scroll to rail
    const onKey = (e) => {
      if (window.innerWidth < LOCK_BP) return;
      const step = (e.key === "PageDown" || e.key === "PageUp") ? rail.clientHeight * 0.9 : 80;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault(); rail.scrollTop += step;
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault(); rail.scrollTop -= step;
      } else if (e.key === "Home") { e.preventDefault(); rail.scrollTop = 0; }
      else if (e.key === "End")   { e.preventDefault(); rail.scrollTop = rail.scrollHeight; }
    };
    document.addEventListener("keydown", onKey);

    // parallax
    const onMove = (e) => {
      const r = rail.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      S.current.tiltTY = -nx * MAX_TILT_Y;
      S.current.tiltTX =  ny * MAX_TILT_X;
    };
    const onLeave = () => { S.current.tiltTX = 0; S.current.tiltTY = 0; };
    rail.addEventListener("mousemove", onMove, { passive: true });
    rail.addEventListener("mouseleave", onLeave);

    const loop = () => {
      const { dpr, W, H, particles } = S.current;
      const t = performance.now() * 0.001;

      if (performance.now() - S.current.lastScrollAt > 350) S.current.alignTarget *= 0.96;
      S.current.align = lerp(S.current.align, S.current.alignTarget, 0.08);

      S.current.tiltX = lerp(S.current.tiltX, S.current.tiltTX, 0.08);
      S.current.tiltY = lerp(S.current.tiltY, S.current.tiltTY, 0.08);
      cvs.style.transform = `translateZ(0) rotateX(${S.current.tiltX}deg) rotateY(${S.current.tiltY}deg)`;

      const ctx = cvs.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#eef2fb"); g.addColorStop(1, "#e7ecf7");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillStyle = "rgba(149,162,185,0.40)";
      const align = S.current.align;

      for (let p of particles) {
        const windX = Math.sin((p.y * 0.04) + t * 0.9) * 0.25 + Math.cos((p.x * 0.03) - t * 0.6) * 0.15;
        const windY = Math.cos((p.x * 0.035) + t * 0.7) * 0.22;
        p.vx += (1 - align) * windX * 0.08 * p.w;
        p.vy += (1 - align) * windY * 0.08 * p.w;
        p.vx += (p.gx - p.x) * (0.02 * align);
        p.vy += (p.gy - p.y) * (0.02 * align);
        p.vx *= 0.96; p.vy *= 0.96;
        p.x += p.vx; p.y += p.vy;

        if (p.x < -24) p.x += W + 48;
        if (p.x > W + 24) p.x -= W + 48;
        if (p.y < -24) p.y += H + 48;
        if (p.y > H + 24) p.y -= H + 48;

        ctx.fillText(p.d, p.x, p.y);
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      rail.removeEventListener("scroll", onRailScroll);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKey);
      rail.removeEventListener("mousemove", onMove);
      rail.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className="rail">
      <div style={{ height: "300vh" }} aria-hidden="true" />
      <canvas ref={canvasRef} className="layer" />
      <style jsx>{`
        .rail{
          height:100vh; position:relative;
          overflow-y:auto; overflow-x:hidden;      /* <- vertical only */
          background:linear-gradient(180deg,#eef2fb 0%,#e7ecf7 100%);
          border-left:1px solid #e9eef5;
          perspective:900px;
        }
        .layer{
          position:absolute; inset:0; display:block;
          will-change:transform; pointer-events:none;
        }
      `}</style>
    </div>
  );
}
