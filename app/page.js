'use client';

import { useEffect } from "react";
import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  useEffect(() => {
    document.body.classList.add("lock-scroll");
    return () => document.body.classList.remove("lock-scroll");
  }, []);

  return (
    <>
      <main className="layout">
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
      </main>

      {/* Right rail — fixed but doesn't block the page */}
      <aside className="right">
        <div className="rail">
          <NumericRail scrollTargetId="left-scroll" />
        </div>
      </aside>

      {/* ===== GLOBAL (scoped via class) ===== */}
      <style jsx global>{`
        html, body, #__next { height: 100%; }
        body.lock-scroll { overflow: hidden; overscroll-behavior: none; }
        :root { --rail-w: 320px; }
      `}</style>

      {/* ===== LAYOUT & INTERACTION FIX ===== */}
      <style jsx>{`
        .layout {
          height: 100dvh;
          display: grid;
          grid-template-columns: 1fr;
        }
        @supports (-webkit-touch-callout: none) {
          .layout { height: -webkit-fill-available; }
        }
        .layout, .left, .container { min-height: 0; min-width: 0; }

        .left {
          height: 100%;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          scrollbar-width: none;
        }
        .left::-webkit-scrollbar { width: 0; height: 0; }

        /* Reserve space so content never sits under the rail */
        @media (min-width: 1024px) {
          .layout { padding-right: var(--rail-w); }  /* <— key line */
        }

        /* Rail doesn't steal clicks outside its box */
        .right {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: var(--rail-w);
          pointer-events: none;             /* <— container ignores clicks */
          z-index: 40;
        }
        .right .rail { pointer-events: auto; }  /* <— only rail is interactive */

        @media (max-width: 1023px) {
          .right { display: none; }
        }
      `}</style>
    </>
  );
}
