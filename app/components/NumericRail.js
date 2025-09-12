"use client";

import { useEffect, useRef } from "react";

/** ====== TUNABLES ====== */
const CELL = 18;                 // jarak grid rapi (px)
const PAD = 16;                  // padding dari tepi canvas
const BASE_DENSITY = 0.9;        // 0..1, seberapa padat angka
const GAIN_SCROLL = 0.18;        // seberapa cepat radius nambah dari scroll halaman
const GAIN_WHEEL  = 0.30;        // seberapa cepat radius nambah dari wheel di kanvas
const CAPTURE_ACCEL = 0.14;      // kecepatan transisi “ingin menangkap” -> “sudah tertangkap”
const PULL_STRENGTH = 0.022;     // gaya tarik menuju sel target
const FRICTION = 0.76;           // redaman saat ditarik
const IDLE_EXPLODE_MS = 1000;    // diam berapa lama baru meledak
const HOVER_REPEL_R = 60;        // radius repel kursor (px)
const HOVER_REPEL_FORCE = 0.35;  // gaya repel

/** urut ring berdasarkan jarak manhattan dari (0,0) */
function spiralOrder(cols, rows) {
  const cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ring = x + y; // manhattan from origin
      cells.push({ x, y, ring });
    }
  }
  // sort by ring → kiri-atas dulu, lalu melebar
  cells.sort((a, b) => a.ring - b.ring || a.y - b.y || a.x - b.x);
  return cells;
}

export default function NumericRail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let dpr = Math.min(2, window.devicePixelRatio || 1);

    // state simpen di closure
    let W = 0, H = 0;
    let particles = [];
    let targets = [];      // posisi grid untuk tiap angka (urut spiral)
    let wantCaptured = 0;  // "energi" → berapa sel boleh dirapikan (float)
    let haveCaptured = 0;  // state smooth → berapa sel yg beneran lagi narik (float)
    let holdCaptured = 0;  // maksimum ring yg sudah tercapai (persist, gak turun)
    let lastScrollY = window.scrollY;
    let lastMoveTs = performance.now();
    let raf;
    const mouse = { x: -9999, y: -9999, inside: false };

    function setup() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = Math.floor(rect.width);
      H = Math.floor(rect.height);

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // build grid target (spiral from top-left)
      const cols = Math.max(1, Math.floor((W - PAD * 2) / CELL));
      const rows = Math.max(1, Math.floor((H - PAD * 2) / CELL));
      const order = spiralOrder(cols, rows);
      const count = Math.min(
        order.length,
        Math.floor(cols * rows * BASE_DENSITY)
      );

      targets = [];
      for (let i = 0; i < count; i++) {
        const c = order[i];
        targets.push({ x: PAD + c.x * CELL, y: PAD + c.y * CELL, ring: c.ring });
      }

      // spawn angka random
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          char: String((Math.random() * 10) | 0),
        });
      }

      // reset capture state tapi jangan bikin “radius stuck kecil”
      wantCaptured = Math.max(wantCaptured, 0);
      haveCaptured = Math.max(haveCaptured, holdCaptured);
    }

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      setup();
    }

    // Energi dari wheel di kanvas (PC)
    function onWheel(e) {
      wantCaptured += Math.abs(e.deltaY) * GAIN_WHEEL;
      wantCaptured = Math.min(wantCaptured, targets.length);
      lastMoveTs = performance.now();
    }

    // Energi dari scroll halaman (PC & mobile)
    function onScroll() {
      const dy = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      if (dy > 0) {
        wantCaptured += dy * GAIN_SCROLL;
        wantCaptured = Math.min(wantCaptured, targets.length);
        lastMoveTs = performance.now();
      }
    }

    function onMouseMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = mouse.x >= 0 && mouse.x <= W && mouse.y >= 0 && mouse.y <= H;
    }
    function onMouseLeave() {
      mouse.inside = false;
    }

    function explode() {
      // ledakkan: lepas semua, random velocity
      holdCaptured = 0;
      haveCaptured = 0;
      wantCaptured = 0;
      for (const p of particles) {
        p.vx = (Math.random() - 0.5) * 4;
        p.vy = (Math.random() - 0.5) * 4;
      }
    }

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("wheel", onWheel, { passive: true });
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    resize();

    function tick(t) {
      // Smooth approach → ring makin besar
      haveCaptured += (wantCaptured - haveCaptured) * CAPTURE_ACCEL;
      // persist ring terbesar yg pernah dicapai (biar gak mundur)
      holdCaptured = Math.max(holdCaptured, Math.floor(haveCaptured));

      // idle → explode
      if (t - lastMoveTs > IDLE_EXPLODE_MS) {
        explode();
        lastMoveTs = t + 9e9; // supaya gak meledak terus-terusan
      }

      ctx.clearRect(0, 0, W, H);
      ctx.font = "12px ui-sans-serif, system-ui, Inter, Roboto";
      ctx.fillStyle = "rgba(2,6,23,.38)";

      const Ncap = Math.min(targets.length, Math.max(holdCaptured, Math.floor(haveCaptured)));

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (i < Ncap) {
          // angka i punya target i (urut spiral → kiri-atas dulu)
          const g = targets[i];
          // tarik ke grid
          const dx = g.x - p.x;
          const dy = g.y - p.y;
          p.vx += dx * PULL_STRENGTH;
          p.vy += dy * PULL_STRENGTH;
          p.vx *= FRICTION;
          p.vy *= FRICTION;
        } else {
          // angka liar (floating)
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
        }

        // repel halus saat mouse di atas kanvas (kesan “lebih renggang”)
        if (mouse.inside) {
          const mx = p.x - mouse.x;
          const my = p.y - mouse.y;
          const d2 = mx * mx + my * my;
          if (d2 < HOVER_REPEL_R * HOVER_REPEL_R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = ((HOVER_REPEL_R - d) / HOVER_REPEL_R) * HOVER_REPEL_FORCE;
            p.vx += (mx / d) * f;
            p.vy += (my / d) * f;
          }
        }

        // update & wrap
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        ctx.fillText(p.char, p.x, p.y);
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
