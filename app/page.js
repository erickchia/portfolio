"use client";

import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <main className="shell">
      {/* Kolom kiri: konten utama, bisa scroll sendiri */}
      <section className="content">
        <header className="hero">
          <h1>Erick</h1>
          <ThemeToggle />
          <p>
            Finance & accounting analyst who turns manual chaos into streamlined
            systems — reporting pipelines, data processing, and automation that
            actually ships.
          </p>
          <div className="cta">
            <a href="/cv" className="btn">Lihat CV</a>
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
                      className="btn btn--sm"
                    >
                      View
                    </a>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      </section>

      {/* Kolom kanan: panel angka, sticky & full height */}
      <aside className="railWrap">
        <NumericRail />
      </aside>

      <style jsx>{`
        /* --- Grid dua kolom --- */
        .shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 33vw);
          gap: 24px;
          align-items: start;
          padding: 24px 20px 40px;
        }

        /* Konten kiri bisa scroll; halaman global TIDAK di-lock */
        .content {
          min-height: 100vh;
          overflow-y: auto;
          padding-right: 8px; /* sedikit ruang, biar scrollbar tidak nabrak */
        }

        /* Pastikan global scroll aktif */
        :global(html), :global(body) {
          height: auto;
          overflow-y: auto;
        }

        /* Panel angka kanan selalu terlihat, tidak ikut scroll body */
        .railWrap {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden; /* kanvas angka urusannya sendiri */
          border-left: 1px solid rgba(2, 6, 23, 0.06);
        }

        /* Theme toggle muncul di kanan heading */
        .hero {
          position: relative;
          padding-right: 56px;
        }
        :global(.theme-toggle) {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 5;
        }

        /* Typo & UI */
        .hero h1 { font-size: 40px; line-height: 1.1; margin: 0 0 8px; }
        .hero p  { margin: 0 0 16px; color: #475569; }
        .cta { display: flex; gap: 8px; margin-bottom: 24px; }

        .section-title { font-size: 18px; margin: 0 0 12px; color: #0f172a; }

        .grid {
          list-style: none; padding: 0; margin: 0;
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .card {
          background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px;
          box-shadow: 0 1px 2px rgba(0,0,0,.05);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .card:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 10px 30px rgba(0,0,0,.08);
        }
        .card-title { margin: 0 0 6px; font-weight: 700; }
        .card-desc  { margin: 0 0 10px; color: #475569; }
        .chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
        .chip  { font-size: 12px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 999px; padding: 4px 8px; }

        .btn { display: inline-block; border-radius: 10px; border: 1px solid #0f172a; padding: 8px 12px;
               text-decoration: none; transition: all .15s ease; color: inherit; }
        .btn:hover { background: #0f172a; color: #fff; }
        .btn--ghost { border-color: #e5e7eb; }
        .btn--sm { padding: 6px 10px; font-size: 13px; }

        /* Dark mode polish */
        @media (prefers-color-scheme: dark) {
          .section-title { color: #e5e7eb; }
          .hero p, .card-desc { color: #94a3b8; }
          .card { background: #0f172a; border-color: #1f2937; }
          .chip { background: #111827; border-color: #1f2937; color: #e5e7eb; }
          .btn--ghost { border-color: #334155; color: #e5e7eb; }
          .railWrap { border-left-color: rgba(148, 163, 184, .15); }
        }

        /* Mobile: sembunyikan panel angka, biar fokus konten */
        @media (max-width: 1024px) {
          .shell { grid-template-columns: 1fr; }
          .railWrap { display: none; }
          .content { overflow-y: visible; }
        }
      `}</style>
    </main>
  );
}
