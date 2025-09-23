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

      {/* fixed right rail – biarin */}
      <aside className="right">
        <NumericRail scrollTargetId="left-scroll" />
      </aside>

{/* ===== Global: tetap tanpa scrollbar di dokumen ===== */}
<style jsx global>{`
  html, body {
    height: 100%;
    overflow: hidden;            /* outer page tidak scroll */
    overscroll-behavior: none;
  }
  /* (opsional) sembunyikan scrollbar outer kalau ada */
  html::-webkit-scrollbar,
  body::-webkit-scrollbar { display: none; }
  html, body { scrollbar-width: none; }
`}</style>

{/* ===== Kolom kiri: boleh scroll, scrollbar disembunyikan ===== */}
<style jsx>{`
  .left {
    overflow-y: auto !important;          /* aktifkan lagi scroll di kolom kiri */
    -webkit-overflow-scrolling: touch;    /* smooth di iOS */
  }
  .left::-webkit-scrollbar { width: 0; height: 0; }
  .left { scrollbar-width: none; }
`}</style>

  {/* ===== Mobile: bisa scroll & diperkecil biar muat ===== */}
<style jsx>{`
  @media (max-width: 1023px) {
    /* 1) Aktifkan scroll di kolom kiri (container scroll) */
    .left {
      height: 100svh;                 /* viewport aman di mobile */
      overflow-y: auto !important;    /* re-enable scroll */
      -webkit-overflow-scrolling: touch;
    }

    /* 2) Sembunyikan right rail di mobile (karena di luar .left, nggak bisa discroll) */
    .right { display: none; }

    /* 3) Kencengin layout biar gak kebesaran */
    .container { padding: 16px; gap: 12px; }

    .hero h1 {
      margin: 0;
      font-size: clamp(22px, 7vw, 32px);
      letter-spacing: -0.02em;
    }

    .tagline {
      margin: 0;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;          /* maksimal 2 baris di mobile */
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-width: 60ch;
      font-size: clamp(12px, 3.6vw, 14px);
    }

    /* Grid cards lebih rapat di mobile */
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      align-content: start;
    }

    .card {
      padding: 12px;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      background: #fff;
      min-width: 0;
    }

    .card-title {
      font-size: 14px;
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-desc {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Biar nggak crowded */
    .chips { display: none; }

    .btn { border: 1px solid #e5e7eb; border-radius: 999px; padding: 8px 12px; font-size: 12px; }
  }
`}</style>
    </>
  );
}
