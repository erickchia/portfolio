'use client';

import { useEffect } from "react";
import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  // Scope scroll lock ke halaman ini doang
  useEffect(() => {
    document.body.classList.add("lock-scroll");
    return () => document.body.classList.remove("lock-scroll");
  }, []);

  return (
    <>
      <div className="viewport">
        <main className="layout">
          {/* LEFT: scrollable content */}
          <section className="left" id="left-scroll">
            <div className="container">
              <div className="topbar"><ThemeToggle /></div>

              <header className="hero">
                <h1>Erick</h1>
                <p className="tagline">
                  Finance & accounting analyst who turns manual chaos into streamlined systems —
                  reporting pipelines, data processing, and automation that actually ships.
                </p>
                <div className="cta">
                  <a href="/cv" className="btn btn--ghost">Lihat CV</a>
                  <a href="mailto:erickchia2@gmail.com" className="btn btn--ghost">Email</a>
                </div>
              </header>

              <section>
                <h2 className="section-title">Projects</h2>
                <ul className="grid">
                  {projects.map((p, i) => (
                    <li key={i} className="card">
                      <article>
                        <h3 className="card-title">{p.name}</h3>
                        <p className="card-desc">{p.description}</p>

                        {p.tags?.length > 0 && (
                          <div className="chips">
                            {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                          </div>
                        )}

                        {p.url && (
                          <a href={p.url} target="_blank" rel="noreferrer" className="btn btn--ghost">
                            View
                          </a>
                        )}
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </section>

          {/* RIGHT: kolom sendiri; dekor tidak bisa nyolong klik */}
          <aside className="right">
            <div className="rail-ui">
              <NumericRail scrollTargetId="left-scroll" />
            </div>
          </aside>
        </main>

        {/* Top-most click-through shield (blocks rogue overlays from eating clicks) */}
        <div className="pe-shield" aria-hidden="true" />
      </div>

      {/* ===== GLOBAL (scoped via class) ===== */}
      <style jsx global>{`
        :root { --rail-w: 320px; }
        html, body, #__next { height: 100%; }
        body.lock-scroll { overflow: hidden; overscroll-behavior: none; }
      `}</style>

      {/* ===== LAYOUT & INTERACTION SAFETY ===== */}
      <style jsx>{`
        /* Viewport wrapper so we don't touch html/body scroll globally */
        .viewport {
          height: 100dvh;
          overflow: hidden; /* outer page doesn't scroll */
          position: relative;
        }
        @supports (-webkit-touch-callout: none) {
          .viewport { height: -webkit-fill-available; }
        }

        /* Two-column grid on desktop, single on mobile */
        .layout {
          height: 100%;
          display: grid;
          grid-template-columns: 1fr; /* mobile */
        }
        @media (min-width: 1024px) {
          .layout {
            grid-template-columns: minmax(0, 1fr) var(--rail-w);
          }
        }

        /* Allow the scroll area to actually scroll */
        .layout, .left, .container { min-height: 0; min-width: 0; }

        /* Left column scroll */
        .left {
          position: relative;
          z-index: 2;
          height: 100%;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          scrollbar-width: none;
        }
        .left::-webkit-scrollbar { width: 0; height: 0; }

        /* Right column: sticky on desktop; can't steal clicks */
        .right { display: none; }
        @media (min-width: 1024px) {
          .right {
            display: block;
            position: sticky;
            top: 0;
            height: 100dvh;
            overflow: hidden;
            z-index: 1;
            /* kill all pointer events in the right column by default */
            pointer-events: none;
            background: var(--bg, #f3f4f6);
          }
        }

        /* Re-enable interaction ONLY for the actual rail UI */
        .rail-ui, .rail-ui * { pointer-events: auto; position: relative; z-index: 2; }

        /* Nuke rogue decorative layers (canvas/svg/div) inside the right column */
        .right :is(canvas, svg, video, picture, img, .decor, .numbers, .bg, .noise, [data-decor], [data-bg="numbers"]) {
          pointer-events: none !important;
          opacity: 0 !important;
        }
        /* If they use fixed/absolute backgrounds, disable them too */
        .right [style*="position:fixed"],
        .right [style*="position: absolute"] {
          pointer-events: none !important;
        }

        /* Click-through shield: sits ABOVE everything but lets events pass */
        .pe-shield {
          position: fixed;
          inset: 0;
          z-index: 999999;   /* highest */
          pointer-events: none; /* events go to real content below */
        }
      `}</style>
    </>
  );
}
