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

          {/* RIGHT: kolom sendiri; overlay dekor dimatikan */}
          <aside className="right" data-no-decor>
            <div className="rail-ui">
              <NumericRail scrollTargetId="left-scroll" />
            </div>
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
        /* Viewport wrapper supaya nggak perlu kunci html/body */
        .viewport {
          height: 100dvh;
          overflow: hidden; /* outer page tidak scroll */
        }
        @supports (-webkit-touch-callout: none) {
          .viewport { height: -webkit-fill-available; }
        }

        /* Grid: mobile 1 kolom, desktop 2 kolom */
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

        /* Biar child bisa shrink -> area scroll jalan */
        .layout, .left, .container { min-height: 0; min-width: 0; }

        /* Left column scroll */
        .left {
          height: 100%;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          scrollbar-width: none;
          position: relative;
          z-index: 2; /* pastikan selalu di atas dekor */
        }
        .left::-webkit-scrollbar { width: 0; height: 0; }

        /* Right column: sticky di desktop, hidden di mobile */
        .right { display: none; }
        @media (min-width: 1024px) {
          .right {
            display: block;
            position: sticky;
            top: 0;
            height: 100dvh;
            overflow: hidden;          /* clip apapun yang coba keluar */
            isolation: isolate;        /* stack context baru */
            position: sticky;
            background: var(--bg, #f3f4f6);
          }
        }

        /* ====== BUANG OVERLAY DEKOR ======
           - Tutup semua dekor pakai layer polos
           - Rail UI tetap interaktif di atasnya
        */
        .right[data-no-decor]::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--bg, #f3f4f6); /* plain */
          z-index: 1;
          pointer-events: none;
        }
        .rail-ui { position: relative; z-index: 2; }

        /* Matikan elemen dekor umum di dalam NumericRail */
        .right[data-no-decor] :global(.decor),
        .right[data-no-decor] :global(.numbers),
        .right[data-no-decor] :global(.bg),
        .right[data-no-decor] :global([data-decor]),
        .right[data-no-decor] :global([data-bg="numbers"]),
        .right[data-no-decor] :global(.noise) {
          display: none !important;
          pointer-events: none !important;
        }
        /* Kalau dekor pakai <canvas> absolut/fixed, nonaktifkan interaksinya */
        .right[data-no-decor] :global(canvas[style*="position: absolute"]),
        .right[data-no-decor] :global(canvas[style*="position:fixed"]) {
          pointer-events: none !important;
          opacity: 0 !important;
        }
      `}</style>
    </>
  );
}
