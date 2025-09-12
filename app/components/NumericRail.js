'use client';
import { useEffect, useRef } from "react";

/**
 * Right rail numbers
 * - Scroll/wheel: queue capture → lock 1 digit per frame ke grid mulai dari kiri-atas
 * - Idle: release 1 digit per interval → balik berantakan
 * - Hover: repel halus (±3px)
 */
export default function NumericRail({ scrollTargetId }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    const ctx = c.getContext("2d", { alpha: true });

    // --- sizing ---
    let w = wrap.clientWidth, h = wrap.clientHeight;
    c.width = w; c.height = h;

    // --- particles ---
    const COUNT = 220;
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      v: 0.25 + Math.random() * 0.55,
      d: Math.random() * Math.PI * 2,
      n: Math.floor(Math.random() * 10),
      tx: null, ty: null,
      lockedIndex: -1,
    }));

    // --- grid (row-major from top-left) ---
    let cellX = 22, cellY = 18, padding = 10;
    let grid = [];
    function rebuildGrid() {
      grid = [];
      const cols = Math.max(1, Math.floor((w - padding * 2) / cellX));
      const rows = Math.max(1, Math.floor((h - padding * 2) / cellY));
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          grid.push({ x: padding + col * cellX, y: padding + r * cellY });
        }
      }
    }
    rebuildGrid();

    // --- interaction state ---
    let rafId, prevTs = performance.now();
    let hovered = false, cursorX = 0, cursorY = 0;
    const REPEL_R = 80, REPEL_PUSH = 3;

    // queue-based capture
    let captured = 0;            // berapa yang sudah terkunci
    let captureQueue = 0;        // antrian untuk ditangkap (naik saat scroll)
    let lastScrollAt = 0;
    let releaseAccum = 0;        // timer untuk lepas satuan

    const CAPTURE_BURST = 12;    // nambah queue tiap event (speed)
    const RELEASE_MS = 90;       // lepas 1 angka tiap X ms saat idle

    function assignTargets(count) {
      // sort by near top-left (x+y)
      const sorted = [...dots].sort((a, b) => (a.x + a.y) - (b.x + b.y));
      const N = Math.min(count, grid.length, dots.length);
      // lock first N to grid[0..N-1], others free
      for (let i = 0; i < sorted.length; i++) {
        const d = sorted[i];
        if (i < N) {
          const g = grid[i];
          d.tx = g.x; d.ty = g.y; d.lockedIndex = i;
        } else {
          d.tx = null; d.ty = null; d.lockedIndex = -1;
        }
      }
    }

    function tick(now) {
      const dt = Math.min(40, now - prevTs); // ms
      prevTs = now;

      // consume queue → 1 capture per frame (biar 1/1 tapi cepat)
      if (captureQueue > 0 && captured < Math.min(grid.length, dots.length)) {
        captured += 1;
        captureQueue -= 1;
        assignTargets(captured);
      }

      // release one-by-one when idle
      if (Date.now() - lastScrollAt > 250 && captured > 0) {
        releaseAccum += dt;
        if (releaseAccum >= RELEASE_MS) {
          releaseAccum = 0;
          captured -= 1;
          assignTargets(captured);
        }
      } else {
        releaseAccum = 0;
      }

      // draw
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(30,64,175,.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';

      for (const o of dots) {
        // move
        if (o.tx != null) {
          // fast snap toward grid
          const k = 0.28; // kecepatan menuju slot
          o.x += (o.tx - o.x) * k;
          o.y += (o.ty - o.y) * k;
        } else {
          // free drift
          o.x += Math.cos(o.d) * o.v + (Math.random() - 0.5) * 0.2;
          o.y += Math.sin(o.d) * o.v + (Math.random() - 0.5) * 0.2;
        }

        // hover repel (max ~3px)
        if (hovered) {
          const dx = o.x - cursorX, dy = o.y - cursorY;
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

      rafId = requestAnimationFrame(tick);
    }

    // listeners
    const onResize = () => {
      w = wrap.clientWidth; h = wrap.clientHeight;
      c.width = w; c.height = h;
      rebuildGrid();
      assignTargets(captured); // remap ke grid baru
    };

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      cursorX = e.clientX - r.left;
      cursorY = e.clientY - r.top;
    };

    const bump = (burst = CAPTURE_BURST) => {
      lastScrollAt = Date.now();
      captureQueue = Math.min(
        captureQueue + burst,
        Math.min(grid.length, dots.length) - captured
      );
    };

    // scroll isinya nambah queue (page scroll tetap jalan di container utama)
    const scroller = scrollTargetId ? document.getElementById(scrollTargetId) : window;
    const onScroll = () => bump(CAPTURE_BURST);
    const onWheel = (e) => { // kalau mau hard-lock page scroll, uncomment preventDefault:
      // e.preventDefault();
      bump(CAPTURE_BURST);
    };

    wrap.addEventListener("mouseenter", () => (hovered = true));
    wrap.addEventListener("mouseleave", () => (hovered = false));
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("wheel", onWheel, { passive: true });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    assignTargets(captured);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [scrollTargetId]);

  return (
    <div ref={wrapRef} className="rail-wrap">
      <canvas ref={canvasRef} />
      <style jsx>{`
        .rail-wrap{ position:absolute; inset:0; overflow:hidden }
        canvas{ position:absolute; inset:0; width:100%; height:100% }
      `}</style>
    </div>
  );
}
