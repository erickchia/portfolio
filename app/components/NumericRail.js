'use client';
import { useEffect, useRef } from "react";

/**
 * NumericRail v3
 * - Scroll: radius penataan (dari pojok kiri atas) membesar; digit yg jatuh ke radius
 *   dikunci ke slot grid terdekat (snap halus), 1-per-frame (stepwise).
 * - Hover: repel halus (≤ ~3px).
 * - Idle ≥1s: ledakkan—semua target lepas & dapat impuls keluar dari cluster terpadat.
 */
export default function NumericRail({ scrollTargetId }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");

    // ---- sizing ----
    let w = wrap.clientWidth, h = wrap.clientHeight;
    c.width = w; c.height = h;

    // ---- digits (particles) ----
    const COUNT = 230;
    const digits = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      n: Math.floor(Math.random() * 10),
      tx: null, ty: null, // target (grid)
      locked: false,
    }));

    // ---- grid (mulai dari pojok kiri-atas) ----
    const PADDING = 10, cellX = 22, cellY = 18;
    let grid = [];
    let gridSorted = [];
    function rebuildGrid() {
      grid = [];
      const cols = Math.max(1, Math.floor((w - PADDING * 2) / cellX));
      const rows = Math.max(1, Math.floor((h - PADDING * 2) / cellY));
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          grid.push({ x: PADDING + col * cellX, y: PADDING + r * cellY });
        }
      }
      // sort by distance ke TL (0,0) → sebenarnya ke (PADDING,PADDING)
      gridSorted = grid
        .map((g, i) => ({ ...g, i, d: (g.x - PADDING) + (g.y - PADDING) }))
        .sort((a, b) => a.d - b.d);
    }
    rebuildGrid();

    // ---- interaction state ----
    // radius penataan naik saat scroll; target center = pojok kiri atas
    let radius = 24; // start kecil
    let radiusVel = 0; // momentum radius (biar smooth)
    const RMAX = Math.hypot(w, h);
    let queue = 0;        // “antrian capture” → 1 slot/ frame
    let capturedCount = 0;
    let lastScrollAt = 0;
    let explodedAt = 0;

    // hover repel (≤ 3px)
    let hovered = false, mx = 0, my = 0;
    const REPEL_R = 80, REPEL_PUSH = 3;

    // helper
    const distTL = (p) => (p.x - PADDING) + (p.y - PADDING);

    // Assign target ke digit yang berada di dalam radius
    function reassignTargets(limitCount) {
      // kandidat = yang sudah locked + yang posisinya dalam radius dari TL
      const eligible = digits.filter(d => d.locked ||
        Math.hypot(d.x - PADDING, d.y - PADDING) <= radius);

      // sort kandidat by kedekatan TL → supaya yang terdekat diambil dulu
      eligible.sort((a, b) => distTL(a) - distTL(b));

      // jumlah slot yg boleh dipakai: min(limitCount, grid, eligible)
      const want = Math.min(limitCount, gridSorted.length, eligible.length);

      // reset semua dulu
      digits.forEach(d => { d.tx = null; d.ty = null; d.locked = false; });

      // assign 1:1 urut ke slot grid terawal
      for (let i = 0; i < want; i++) {
        const d = eligible[i];
        const g = gridSorted[i];
        d.tx = g.x; d.ty = g.y; d.locked = true;
      }
      capturedCount = want;
    }

    // Explosion (idle ≥ 1s): cari cluster terpadat & kasih impuls keluar
    function explode() {
      // heatmap kasar 16x10
      const COLS = 16, ROWS = 10;
      const bw = w / COLS, bh = h / ROWS;
      const bins = Array.from({ length: COLS * ROWS }, () => 0);
      digits.forEach(d => {
        const cx = Math.min(COLS - 1, Math.max(0, Math.floor(d.x / bw)));
        const cy = Math.min(ROWS - 1, Math.max(0, Math.floor(d.y / bh)));
        bins[cy * COLS + cx] += 1;
      });
      let best = 0, bi = 0;
      for (let i = 0; i < bins.length; i++) if (bins[i] > best) { best = bins[i]; bi = i; }
      const bc = { x: (bi % COLS + 0.5) * bw, y: (Math.floor(bi / COLS) + 0.5) * bh };

      // lepas semua target + kasih impuls keluar dari bc
      digits.forEach(d => {
        d.tx = null; d.ty = null; d.locked = false;
        const dx = d.x - bc.x, dy = d.y - bc.y;
        const L = Math.hypot(dx, dy) || 1;
        const kick = 2.5 + Math.random() * 2.5; // 2.5–5
        d.vx += (dx / L) * kick;
        d.vy += (dy / L) * kick;
      });

      queue = 0; capturedCount = 0;
      radius = 24; radiusVel = 0;
      explodedAt = Date.now();
    }

    // ---- listeners ----
    const onResize = () => {
      w = wrap.clientWidth; h = wrap.clientHeight;
      c.width = w; c.height = h;
      rebuildGrid();
      // remap yg terkunci
      reassignTargets(capturedCount);
    };

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };

    // Scroll / wheel → tambah antrian + tambah radius
    const scroller = scrollTargetId ? document.getElementById(scrollTargetId) : window;
    const onScroll = () => {
      lastScrollAt = Date.now();
      queue += 10;                    // 10 “slot” yang nanti dikonsumsi 1/frame
      radiusVel += 40;                // percepat pembesaran radius
    };
    const onWheel = (e) => { lastScrollAt = Date.now(); queue += 10; radiusVel += 40; };

    wrap.addEventListener("mouseenter", () => (hovered = true));
    wrap.addEventListener("mouseleave", () => (hovered = false));
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("wheel", onWheel, { passive: true });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // ---- loop ----
    let rafId, prev = performance.now();
    function frame(now) {
      const dt = Math.min(40, now - prev); prev = now;

      // grow radius (ease-out sedikit)
      radiusVel *= 0.88;
      radius = Math.min(RMAX, radius + (radiusVel * dt) / 1000);

      // konsumsi queue satu-per-frame → tambah capturedCount 1 demi 1
      if (queue > 0) {
        queue -= 1;
        reassignTargets(capturedCount + 1);
      }

      // jika idle ≥ 1000ms → boom (sekali)
      if (Date.now() - lastScrollAt > 1000 && Date.now() - explodedAt > 1200) {
        explode();
      }

      // physics + draw
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(30,64,175,.42)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';

      for (const d of digits) {
        // attract ke target
        if (d.tx != null) {
          const ax = (d.tx - d.x) * 0.25;
          const ay = (d.ty - d.y) * 0.25;
          d.vx = d.vx * 0.6 + ax; // damping biar snap halus
          d.vy = d.vy * 0.6 + ay;
        } else {
          // drift chaos + sedikit noise
          d.vx += (Math.random() - 0.5) * 0.03;
          d.vy += (Math.random() - 0.5) * 0.03;
          d.vx *= 0.995; d.vy *= 0.995; // friction ringan
        }

        // hover repel (maks ~3px shift)
        if (hovered) {
          const dx = d.x - mx, dy = d.y - my;
          const L = Math.hypot(dx, dy) || 1;
          if (L < REPEL_R) {
            const push = ((REPEL_R - L) / REPEL_R) * REPEL_PUSH;
            d.vx += (dx / L) * push * 0.05;
            d.vy += (dy / L) * push * 0.05;
          }
        }

        d.x += d.vx; d.y += d.vy;

        // wrap
        if (d.x < -10) d.x = w + 10; if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10; if (d.y > h + 10) d.y = -10;

        ctx.fillText(String(d.n), d.x, d.y);
      }

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

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
      <canvas ref={canvasRef}/>
      <style jsx>{`
        .rail-wrap{ position:absolute; inset:0; overflow:hidden }
        canvas{ position:absolute; inset:0; width:100%; height:100% }
      `}</style>
    </div>
  );
}
