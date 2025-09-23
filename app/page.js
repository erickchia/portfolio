'use client';

import { useEffect } from "react";
import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  // Lock outer scroll only for this page
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

          {/* RIGHT: own grid column (no overlay). Add data-clean to trigger “no-decor” rules */}
          <aside className="right" data-clean>
            <div className="rail-ui">
              <NumericRail scrollTargetId="left-scroll" />
            </div>
          </aside>
        </main>
      </div>

      {/* ===== GLOBAL (scoped via class) ===== */}
      <style jsx global>{`
        /* tweak width/height ratio here */
        :root { --rail-w: clamp(220px, 22vw, 340px); } /* <— edit this */

        html, body, #__next { height: 100%; }
        body.lock-scroll { overflow: hidden; overscroll-behavior: none; }
      `}</style>

      {/* ===== LAYOUT & INTERACTION SAFETY ===== */}
      <style jsx>{`
        .viewport {
          height: 100dvh;
          overflow: hidden;       /* outer page doesn't scroll */
          position: relative;
        }
        @supports (-webkit-touch-callout: none) {
          .viewport { height: -webkit-fill-available; }
        }

        .layout {
          height: 100%;
          display: grid;
          grid-template-columns: 1fr;     /* mobile */
        }
        @media (min-width: 1024px) {
          .layout {
            grid-template-columns: minmax(0, 1fr) var(--rail-w);
          }
        }

        .layout, .left, .container { min-height: 0; min-width: 0; }

        .left {
          z-index: 2;
          height: 100%;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          scrollbar-width: none;
        }
        .left::-webkit-scrollbar { width: 0; height: 0; }

        /* Right column: sticky on desktop, hidden on mobile */
        .right { display: none; }
        @media (min-width: 1024px) {
          .right {
            display: block;
            position: sticky;
            top: 0;
            height: 100dvh;
            overflow: hidden;
            z-index: 1;
            background: var(--bg, #f3f4f6);
          }
        }

        /* Keep only the rail UI; nuke any decorative layers inside .right */
        /* 1) hide everything under .right ... */
        :global(.right[data-clean] *){
          display: none !important;
          pointer-events: none !important;
        }
        /* 2) ...then re-enable ONLY the rail-ui subtree */
        :global(.right[data-clean] .rail-ui),
        :global(.right[data-clean] .rail-ui *){
          display: revert !important;      /* bring back natural display */
          pointer-events: auto !important; /* interactive again */
          position: relative;
          z-index: 2;
        }
      `}</style>
    </>
  );
}
