'use client';

import { useEffect } from 'react';
import { projects } from '../data/projects';
import NumericRail from './components/NumericRail';
import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  // Lock outer scroll only for this page
  useEffect(() => {
    document.body.classList.add('lock-scroll');
    return () => document.body.classList.remove('lock-scroll');
  }, []);

  const hasMore = projects.length > 3; // for mobile "See all"

  return (
    <>
      <div className="viewport">
        <main className="layout">
          {/* LEFT: single-screen on mobile, scrollable on desktop */}
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
                            {(p.tags || []).slice(0, 3).map((t) => (
                              <span key={t} className="chip">{t}</span>
                            ))}
                          </div>
                        )}

                        {p.url && (
                          <a href={p.url} target="_blank" rel="noreferrer" className="btn btn--ghost btn--view">
                            View
                          </a>
                        )}
                      </article>
                    </li>
                  ))}
                </ul>

                {/* Mobile-only: tiny link; no extra scrolling */}
                {hasMore && (
                  <div className="see-all">
                    <a className="btn btn--tiny" href="/projects">See all projects</a>
                  </div>
                )}
              </section>
            </div>
          </section>

          {/* RIGHT: sticky on desktop, hidden on mobile (data-clean keeps only the rail) */}
          <aside className="right" data-clean>
            <div className="rail-ui">
              <NumericRail scrollTargetId="left-scroll" />
            </div>
          </aside>
        </main>
      </div>

      {/* ===== GLOBAL (scoped via class) ===== */}
      <style jsx global>{`
        :root { --rail-w: clamp(220px, 22vw, 340px); }
        html, body, #__next { height: 100%; }
        body.lock-scroll { overflow: hidden; overscroll-behavior: none; }
      `}</style>

      {/* ===== LAYOUT & INTERACTION SAFETY ===== */}
      <style jsx>{`
        .viewport {
          height: 100svh; /* better mobile viewport behavior */
          height: 100dvh; /* fallback */
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
          overflow-y: hidden; /* 🔒 no scroll on mobile by default */
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          scrollbar-width: none;
        }
        .left::-webkit-scrollbar { width: 0; height: 0; }
        @media (min-width: 1024px) {
          .left { overflow-y: auto; } /* desktop can scroll */
        }

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
        :global(.right[data-clean] *){
          display: none !important;
          pointer-events: none !important;
        }
        :global(.right[data-clean] .rail-ui),
        :global(.right[data-clean] .rail-ui *){
          display: revert !important;      /* bring back natural display */
          pointer-events: auto !important; /* interactive again */
          position: relative;
          z-index: 2;
        }

        /* ===== CONTAINER SIZING (forces single screen on mobile) ===== */
        .container {
          height: 100%;
          display: grid;
          grid-template-rows: auto auto 1fr; /* topbar, hero, projects */
          align-content: start;
          gap: 12px;
          padding: 16px;
        }
        @media (min-width: 768px) {
          .container { gap: 20px; padding: 24px; }
        }

        .topbar { display: flex; justify-content: flex-end; }

        .hero { display: grid; gap: 8px; }
        .hero h1 { margin: 0; font-size: clamp(24px, 8vw, 36px); letter-spacing: -0.02em; }
        .tagline {
          margin: 0;
          line-height: 1.35;
          display: -webkit-box;            /* 2-line clamp on mobile */
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 60ch;
          font-size: clamp(12px, 3.6vw, 14px);
        }
        .cta { display: flex; gap: 8px; flex-wrap: wrap; }

        .btn { border: 1px solid var(--line, #e5e7eb); border-radius: 999px; padding: 8px 12px; font-size: 12px; text-decoration: none; color: inherit; }
        .btn--ghost { background: transparent; }
        .btn--view { margin-top: 6px; }
        .btn--tiny { padding: 6px 10px; font-size: 12px; }

        .projects { display: grid; grid-template-rows: auto 1fr auto; min-height: 0; }
        .section-title { font-size: 14px; margin: 0 0 6px; }

        /* Grid: 2 cols on mobile to fit more without scroll; cards are compact */
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; align-content: start; }
        @media (min-width: 480px) and (max-width: 767px) {
          .grid { gap: 12px; }
        }
        @media (min-width: 768px) {
          .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        }

        /* Mobile hard cap: only show first 3 items (no scroll needed) */
        @media (max-width: 1023px) {
          .grid > li:nth-child(n+4) { display: none; }
        }

        .card { background: var(--card, #fff); border: 1px solid var(--line, #e5e7eb); border-radius: 14px; padding: 12px; min-width: 0; }
        .card-title { font-size: 14px; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-desc { margin: 0; font-size: 12px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .chips { margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap; }
        .chip { border: 1px solid var(--line, #e5e7eb); border-radius: 999px; padding: 4px 8px; font-size: 11px; }

        /* Desktop: allow full tagline */
        @media (min-width: 1024px) { .tagline { display: block; -webkit-line-clamp: unset; overflow: visible; } }

        /* Mobile: keep it tight */
        @media (max-width: 767px) {
          .chips { display: none; } /* hide tag cloud on small screens */
        }

        .see-all { margin-top: 8px; display: block; }
        @media (min-width: 1024px) { .see-all { display: none; } }
      `}</style>
    </>
  );
}
