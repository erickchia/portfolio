'use client';
import { useEffect, useRef } from "react";

export default function NumericRail({ scrollTargetId }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    const ctx = c.getContext("2d", { alpha: true });

    let w = wrap.clientWidth, h = wrap.clientHeight;
    c.width = w; c.height = h;

    // density / crowd vibes
    const COUNT = 180;
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      v: 0.2 + Math.random() * 0.6,
      d: Math.random() * Math.PI * 2,
      n: Math.floor(Math.random() * 10)
    }));

    // state for effects
    let rafId;
    let align = 0;        // actual align factor [0..1] (eases to target)
    let alignTarget = 0;  // where we want to go (based on scroll)
    let lastScrollTop = 0;
    let lastScrollAt = 0;
    let tiltX = 0, tiltY = 0;
    let hovered = false;
    let cursorX = 0, cursorY = 0;

    // cursor “repel” settings
    const REPEL_RADIUS = 80;       // area of influence
    const REPEL_MAX_PUSH = 3;      // ~3px max dorong (sesuai request)

    function draw() {
      // decay align when no scroll for a while (smooth back to chaos)
      if (Date.now() - lastScrollAt > 220) {
        alignTarget *= 0.97; // ease down
        if (alignTarget < 0.001) alignTarget = 0;
      }
      // ease current align → target
      align += (alignTarget - align) * 0.15;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(30,64,175,.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';

      for (const o of dots) {
        // drift like angin
        o.x += Math.cos(o.d) * o.v + (Math.random() - 0.5) * 0.2;
        o.y += Math.sin(o.d) * o.v + (Math.random() - 0.5) * 0.2;

        // parallax tilt
        o.x += tiltX * 0.08;
        o.y += tiltY * 0.08;

        // wrap edges
        if (o.x < -10) o.x = w + 10; if (o.x > w + 10) o.x = -10;
        if (o.y < -10) o.y = h + 10; if (o.y > h + 10) o.y = -10;

        // tidy-up (snap to grid) — stronger when align↑
        if (align > 0) {
          const gx = Math.round(o.x / 22) * 22;
          const gy = Math.round(o.y / 18) * 18;
          const k = 0.18 * align; // 0.18 for crisp snap when high align
          o.x += (gx - o.x) * k;
          o.y += (gy - o.y) * k;
        }

        // cursor repel: bikin angka-angka saling menjauh dari kursor
        if (hovered) {
          const dx = o.x - cursorX;
          const dy = o.y - cursorY;
          const dist = Math.hypot(dx, dy) || 0.0001;
          if (dist < REPEL_RADIUS) {
            // push max ~3px at center, fade to 0 at edge
            const push = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_MAX_PUSH;
            o.x += (dx / dist) * push;
            o.y += (dy / dist) * push;
          }
        }

        ctx.globalAlpha = 0.60;
        ctx.fillText(String(o.n), o.x, o.y);
      }
      rafId = requestAnimationFrame(draw);
    }

    const onResize = () => {
      w = wrap.clientWidth; h = wrap.clientHeight;
      c.width = w; c.height = h;
    };

    // mouse tilt + hover state
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

    // listen scroll dari panel kiri → semakin scroll, semakin rapi
    const scroller = scrollTargetId ? document.getElementById(scrollTargetId) : window;
    const onScroll = () => {
      const st = (scroller === window) ? window.scrollY : scroller.scrollTop;
      const dy = Math.abs(st - lastScrollTop);
      lastScrollTop = st;
      lastScrollAt = Date.now();

      // map velocity → alignTarget; clamp 0..1
      // (dy ~0..400+) → ~0..1
      const bump = Math.min(1, dy / 300);
      // ease-up quickly when scrolling, smooth overall
      alignTarget = Math.min(1, alignTarget * 0.85 + bump * 0.35);
    };

    // wheel di rail: jangan scroll page, cuma trigger “rapihin”
    const onWheel = (e) => {
      e.preventDefault();
      lastScrollAt = Date.now();
      alignTarget = Math.min(1, alignTarget * 0.85 + 0.35);
    };

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
