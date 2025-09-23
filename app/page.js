'use client';

import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <>
      <main className="layout">
        <section className="left" id="left-scroll">
          <div className="container">
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

            <section className="projects">
              <h2 className="section-title">Projects</h2>
              <ul className="grid">
                {projects.map((p, i) => (
                  <li key={i} className="card">
                    <article>
                      <h3 className="card-title">{p.name}</h3>
                      <p className="card-desc">{p.description}</p>

                      {!!p.tags?.length && (
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

      {/* Sticky rail on desktop; hidden on mobile */}
      <aside className="right" data-clean>
        <div className="rail-ui">
          <NumericRail scrollTargetId="left-scroll" />
        </div>
      </aside>

      {/* ===== Global: lock page scroll & hide outer scrollbars ===== */}
      <style jsx global>{`
        :root { --rail-w: clamp(220px, 22vw, 340px); }
        html, body, #__next { height: 100%; }
        body { overflow: hidden; overscroll-behavior: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
        html, body { scrollbar-width: none; }
      `}</style>

      {/* ===== Page layout & responsive behavior ===== */}
      <style jsx>{`
        /* Layout: push content left on desktop to make room for fixed rail */
        .layout {
          min-height: 100dvh;
          margin: 0;
          padding: 0;
        }
        @media (min-width: 1024px) {
          .layout { margin-right: var(--rail-w); }
        }

        /* Left column: no scroll on mobile; scrolls on desktop */
        .left { height: 100dvh; overflow: hidden; }
        @media (min-width: 1024px) {
          .left { overflow-y: auto; -webkit-overflow-scrolling: touch; }
          .left::-webkit-scrollbar { width: 0; height: 0; }
          .left { scrollbar-width: none; }
        }

        /* Right rail: fixed on desktop, hidden on mobile */
        .right { display: none; }
        @media (min-width: 1024px) {
          .right {
            display: block;
            position: fixed;
            top: 0;
            right: 0;
            width: var(--rail-w);
            height: 100dvh;
            overflow: hidden;
            z-index: 10;
            background: var(--bg, #f3f4f6);
          }
        }
        /* Keep only the rail-ui subtree interactive */
        :global(.right[data-clean] *) { display: none !important; pointer-events: none !important; }
        :global(.right[data-clean] .rail-ui),
        :global(.right[data-clean] .rail-ui *) { display: revert !important; pointer-events: auto !important; }

        /* Container grid: topbar, hero, projects */
        .container {
          height: 100%;
          display: grid;
          grid-template-rows: auto auto 1fr;
          gap: 12px;
          padding: 16px;
        }

        .topbar { display: flex; justify-content: flex-end; }

        .hero { display: grid; gap: 8px; }
        .hero h1 { margin: 0; font-size: clamp(24px, 8vw, 36px); letter-spacing: -0.02em; }
        .tagline {
          margin: 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;           /* 2 lines on mobile */
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 60ch;
          font-size: clamp(12px, 3.6vw, 14px);
        }
        @media (min-width: 1024px) {
          .tagline { display: block; -webkit-line-clamp: unset; overflow: visible; }
        }

        .cta { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn { border: 1px solid #e5e7eb; border-radius: 999px; padding: 8px 12px; font-size: 12px; text-decoration: none; color: inherit; }
        .btn--ghost { background: transparent; }

        .projects { display: grid; grid-template-rows: auto 1fr; min-height: 0; }
        .section-title { font-size: 14px; margin: 0 0 6px; }

        /* Cards: compact and clamped to avoid overflow */
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; align-content: start; }
        @media (min-width: 768px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; } }

        /* Mobile: show only first 3 to keep one-screen fit */
        @media (max-width: 1023px) {
          .grid > li:nth-child(n+4) { display: none; }
        }

        .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 12px; min-width: 0; }
        .card-title { font-size: 14px; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-desc { margin: 0; font-size: 12px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .chips { margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap; }
        .chip { border: 1px solid #e5e7eb; border-radius: 999px; padding: 4px 8px; font-size: 11px; }
        @media (max-width: 767px) { .chips { display: none; } }
      `}</style>
    </>
  );
}
