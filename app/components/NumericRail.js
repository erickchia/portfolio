'use client';
import { useEffect, useRef } from "react";

/**
 * NumericRail
 * - Scroll in the right rail => numbers progressively pack into a tidy grid
 *   starting at top-left (row-major order).
 * - Idle => slowly unpacks back to chaos.
 * - Hover => gentle repel around cursor (3px push).
 */
export default function NumericRail({ scrollTargetId }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    const ctx = c.getContext("2d", { alpha: true });

    let w = wrap.clientWidth, h = wrap.clientHeight;
    c.width = w; c.height = h;

    // ---------- particles ----------
    const COUNT = 200; // lebih rame dikit
    const dots = Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * w,
      y: Math.random() * h,
      v: 0.25 + Math.random() * 0.55,
      d: Math.random() * Math.PI * 2,
      n: Math.floor(Math.random() * 10),
      tx: null, ty: null // target (grid) saat "rapi"
    }));

    // ---------- grid (tujuan rapi) ----------
    let cellX = 22, cellY = 18, padding = 10;
    let grid = [];
    function rebuildGrid() {
      grid = [];
      const cols = Math.max(1, Math.floor((w - padding * 2) / cellX));
      const rows = Math.max(1, Math.floor((h - padding * 2) / cellY));
      // urut kiri->kanan, atas->bawah
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          grid.push({
            x: padding + col * cellX,
            y: padding + r * cellY
          });
        }
      }
    }
    rebuildGrid();

    // ---------- interaction state ----------
    let rafId;
    let lastScrollAt = 0;
    let tiltX = 0, tiltY = 0;
    let hovered = false;
    let cursorX = 0, cursorY = 0;

    // seberapa banyak yang “dirapikan” (0..1)
    let fillLevel = 0;            // target (naik saat scroll, turun saat idle)
    let fillLevelActual = 0;      // eased value untuk animasi halus

    // hover repel
    const REPEL_R = 80;
    const REPEL_PUSH = 3; // max ~3px

    // assign target grid untuk N dots pertama
    function assignTargets() {
      // urut dot berdasarkan kedekatan ke pojok kiri-atas (x+y terkecil)
      const sortedDots = [...dots].sort((a, b) => (a.x + a.y) - (b.x + b.y));
      const N = Math.min(sortedDots.length, grid.length, Math.floor(fillLevelActual * sortedDots.length));
      for (let i = 0; i < sortedDots.length; i++) {
        const d = sortedDots[i];
        if (i < N) {
          const g = grid[i]; // cell ke-i (row-major dari kiri-atas)
          d.tx = g.x;
          d.ty = g.y;
        } else {
          d.tx = null; d.ty = null; // kembali bebas
        }
      }
    }

    function draw() {
      // ease fill level → target
      fillLevelActual += (fillLevel - fillLevelActual) * 0.12;

      // update target map ketika berubah banyak
      assignTargets();

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(30,64,175,.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';

      for (const o of dots) {
        // if punya target -> gerak ke target (rapi), else -> drift
        if (o.tx != null && o.ty != null) {
          const k = 0.18 + fillLevelActual * 0.22; // makin kencang saat fill tinggi
          o.x += (o.tx - o.x) * k;
          o.y += (o.ty - o.y) * k;
        } else {
          // chaos drift
          o.x += Math.cos(o.d) * o.v + (Math.random() - 0.5) * 0.2 + tiltX * 0.08;
          o.y += Math.sin(o.d) * o.v + (Math.random() - 0.5) * 0.2 + tiltY * 0.08;
        }

        // repel (di kedua mode)
        if (hovered) {
          const dx = o.x - cursorX;
          const dy = o.y - cursorY;
          const dist = Math.hypot(dx, dy) || 1e-6;
          if (dist < REPEL_R) {
            const push = ((REPEL_R - dist) / REPEL_R) * REPEL_PUSH;
            o.x += (dx / dist) * push;
            o.y += (dy / dist) * push;
          }
        }

        // wrap
        if (o.x < -10) o.x = w + 10; if (o.x > w + 10) o.x = -10;
        if (o.y < -10) o.y = h + 10; if (o.y > h + 10) o.y = -10;

        ctx.globalAlpha = 0.60;
        ctx.fillText(String(o.n), o.x, o.y);
      }

      // kalau idle > 250ms, turunkan fill pelan (lepas rapi → buyar)
      if (Date.now() - lastScrollAt > 250) {
        fillLevel = Math.max(0, fillLevel * 0.97);
      }

      rafId = requestAnimationFrame(draw);
    }

    // ---------- listeners ----------
    const onResize = () => {
      w = wrap.clientWidth; h = wrap.clientHeight;
      c.width = w; c.height = h;
      rebuildGrid();
    };

    const onMouseMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      tiltX = mx * 2;
      tiltY = my * 2;
      cursorX = e.clientX - r.left;
      cursorY = e.clientY - r.top;
    };
    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };

    // scroll di panel kanan: tingkatkan fillLevel (packing dari kiri-atas)
    const scroller = scrollTargetId ? document.getElementById(scrollTargetId) : window;
    const bump = (strength = 0.25) => {
      lastScrollAt = Date.now();
      fillLevel = Math.min(1, fillLevel + strength); // tambah isi grid
    };
    const onScroll = () => bump(0.18);
    const onWheel = (e) => { e.preventDefault(); bump(0.25); }; // lock page scroll di rail

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    wrap.addEventListener("mousemove", onMouseMove);
    wrap.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      wrap.removeEventListener("mousemove", onMouseMove);
      wrap.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [scrollTargetId]);

  return (
    <div ref={wrapRef} className="rail-wrap">
      <canvas ref={canvasRef} />
      <style jsx>{`
        .rail-wrap{ position:absolute; inset:0; overflow:hidden; cursor:default }
        canvas{ position:absolute; inset:0; width:100%; height:100% }
      `}</style>
    </div>
  );
}
