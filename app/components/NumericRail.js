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

    const COUNT = 180; // lebih rame dikit
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      v: 0.2 + Math.random() * 0.6,
      d: Math.random() * Math.PI * 2,
      n: Math.floor(Math.random() * 10)
    }));

    let rafId;
    let align = 0;           // 0..1  (1 = teratur)
    let tiltX = 0, tiltY = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(30,64,175,.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';

      for (const o of dots) {
        // drift angin
        o.x += Math.cos(o.d) * o.v + (Math.random() - 0.5) * 0.2;
        o.y += Math.sin(o.d) * o.v + (Math.random() - 0.5) * 0.2;

        // parallax tilt
        o.x += tiltX * 0.08;
        o.y += tiltY * 0.08;

        // wrap
        if (o.x < -10) o.x = w + 10; if (o.x > w + 10) o.x = -10;
        if (o.y < -10) o.y = h + 10; if (o.y > h + 10) o.y = -10;

        // rapihin ke grid pas align > 0
        if (align > 0) {
          const gx = Math.round(o.x / 22) * 22;
          const gy = Math.round(o.y / 18) * 18;
          o.x += (gx - o.x) * 0.08 * align;
          o.y += (gy - o.y) * 0.08 * align;
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

    // mouse tilt
    const onMouseMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      tiltX = mx * 2;
      tiltY = my * 2;
    };

    // scroll listener → dengerin LEMBAR KIRI
    const scroller = scrollTargetId ? document.getElementById(scrollTargetId) : window;
    const onScroll = () => {
      align = 1;
      clearTimeout(onScroll._t);
      onScroll._t = setTimeout(() => { align = 0; }, 300);
    };

    // wheel di rail → jangan scroll page, cuma trigger rapihin
    const onWheel = (e) => {
      e.preventDefault();
      align = 1;
      clearTimeout(onWheel._t);
      onWheel._t = setTimeout(() => { align = 0; }, 300);
    };

    wrap.addEventListener("mousemove", onMouseMove);
    wrap.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    draw();

    return () => {
      cancelAnimationFrame(rafId);
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
        .rail-wrap{ position:absolute; inset:0; overflow:hidden }
        canvas{ position:absolute; inset:0; width:100%; height:100% }
      `}</style>
    </div>
  );
}
