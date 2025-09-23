'use client';

import { useEffect } from "react";
import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  // Scope scroll lock to this page only
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

          {/* RIGHT: its own column; no overlay, no click stealing */}
          <aside className="right">
            <NumericRail scrollTargetId="left-scroll" />
          </aside>
        </main>
      </div>

      {/* ===== GLOBAL (scoped via class) ===== */}
      <style jsx global>{`
        :root { --rail-w: 320px; }
        html, body, #__next { height: 100%; }
        body.lock-scroll { overflow: hidden; overscroll-behavior: none; }
      `}</style>

      {/* ===== LAYOUT & SCROLL SAFETY ===== */}
      <style jsx>{`
        /* Viewport wrapper so we don't have to globally lock <html>/<body> */
        .viewport {
          height: 100dvh;
          overflow: hidden; /* outer page doesn't scroll */
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

        /* Critical: let children shrink so the scroll area actually scrolls */
        .layout, .left, .container { min-height: 0; min-width: 0; }

        /* Scrollable left column */
        .left {
          height: 100%;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          scrollbar-width: none;
        }
        .left::-webkit-scrollbar { width: 0; height: 0; }

        /* Right column lives in its own grid cell (no overlay).
           Sticky keeps it visible while left scrolls. */
        .right {
          display: none; /* hide on mobile */
        }
        @media (min-width: 1024px) {
          .right {
            display: block;
            position: sticky;
            top: 0;
            height: 100dvh;
          }
        }
      `}</style>
    </>
  );
}
