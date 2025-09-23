'use client';

import { useEffect } from "react";
import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  // Scope the body scroll lock to THIS page
  useEffect(() => {
    document.body.classList.add("lock-scroll");
    return () => document.body.classList.remove("lock-scroll");
  }, []);

  return (
    <>
      <main className="layout">
        <section className="left" id="left-scroll">
          <div className="container">
            {/* Toggle tema di pojok kanan atas area 2/3 */}
            <div className="topbar">
              <ThemeToggle />
            </div>

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
                          {p.tags.map((t) => (
                            <span key={t} className="chip">{t}</span>
                          ))}
                        </div>
                      )}

                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn--ghost"
                        >
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
      </main>

      {/* fixed right rail – biarin di desktop */}
      <aside className="right">
        <NumericRail scrollTargetId="left-scroll" />
      </aside>

      {/* ===== GLOBAL (scoped via class) ===== */}
      <style jsx global>{`
        html, body, #__next { height: 100%; }
        body.lock-scroll {
          overflow: hidden;              /* lock outer page only here */
          overscroll-behavior: none;
        }
        /* Optional: hide outer scrollbar if it appears */
        body.lock-scroll::-webkit-scrollbar { display: none; }
        body.lock-scroll { scrollbar-width: none; }
      `}</style>

      {/* ===== LAYOUT & MOBILE SCROLL FIX ===== */}
      <style jsx>{`
        .layout {
          height: 100dvh;                 /* reliable viewport height on mobile */
          display: grid;
          grid-template-columns: 1fr;     /* stack on mobile */
        }
        /* iOS Safari fallback for dynamic address bar */
        @supports (-webkit-touch-callout: none) {
          .layout { height: -webkit-fill-available; }
        }

        /* Allow scroll child to size properly inside grid */
        .layout, .left, .container { min-height: 0; min-width: 0; }

        /* Scrollable column */
        .left {
          height: 100%;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;            /* make vertical swipes scroll */
          scrollbar-width: none;
        }
        .left::-webkit-scrollbar { width: 0; height: 0; }

        /* Right rail fixed on desktop, hidden on mobile to avoid stealing touches */
        .right {
          position: fixed;
          right: 0; top: 0; bottom: 0;
          width: 320px;
        }
        @media (max-width: 1023px) {
          .right { display: none; }
        }
      `}</style>
    </>
  );
}
