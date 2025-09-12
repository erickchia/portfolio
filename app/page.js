'use client';

import { useEffect, useState } from 'react';
import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";

/* === Small inline component: Sun/Moon theme toggle === */
function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // init dari localStorage atau prefers-color-scheme
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <>
      <button
        className="theme-toggle"
        onClick={toggle}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        title={theme === 'light' ? 'Dark mode' : 'Light mode'}
      >
        <span className="emoji" aria-hidden="true">
          {theme === 'light' ? '🌞' : '🌙'}
        </span>
      </button>

      {/* styles khusus tombol */}
      <style jsx>{`
        .theme-toggle{
          display:inline-flex;align-items:center;justify-content:center;
          width:40px;height:40px;border-radius:999px;
          border:1px solid var(--border, #e5e7eb);
          background: var(--card, #fff);
          box-shadow: 0 6px 20px rgba(0,0,0,.10);
          cursor:pointer;
          transition: transform .2s ease, background .2s ease, border-color .2s ease;
        }
        .theme-toggle:hover{ transform: translateY(-1px) scale(1.03); }
        .emoji{ font-size:20px; line-height:1; transform: rotate(0deg); transition: transform .35s ease; }
        :global([data-theme="dark"]) .theme-toggle{
          border-color:#334155; background:#0f172a;
        }
        :global([data-theme="dark"]) .theme-toggle .emoji{
          transform: rotate(-20deg) scale(1.05);
        }
      `}</style>
    </>
  );
}

/* ===================== PAGE ===================== */
export default function Home() {
  return (
    <>
      <main className="layout">
        <section className="left" id="left-scroll">
          <div className="container">

            {/* top-right toggle di area 2/3 (kolom kiri) */}
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
                        <a href={p.url} target="_blank" rel="noreferrer" className="btn btn--sm">
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

      {/* fixed right rail — biarkan seperti sekarang */}
      <aside className="right">
        <NumericRail scrollTargetId="left-scroll" />
      </aside>

      {/* ===== Global theme tokens + transisi warna (ringan) ===== */}
      <style jsx global>{`
        :root{
          --bg: #f6f7fb;
          --text: #0b1220;
          --muted: #475569;
          --card: #ffffff;
          --border: #e5e7eb;
        }
        [data-theme="dark"]{
          --bg: #0b1220;
          --text: #e5e7eb;
          --muted: #94a3b8;
          --card: #0f172a;
          --border: #1f2937;
        }
        html, body{
          background: var(--bg);
          color: var(--text);
          transition: background-color .35s ease, color .35s ease;
        }
      `}</style>

      {/* ===== Minimal posisi & polish agar toggle nempel kanan-atas kolom kiri ===== */}
      <style jsx>{`
        .left{ position: relative; }
        .topbar{
          position: sticky;    /* selalu terlihat saat kolom kiri discroll */
          top: 12px;
          z-index: 5;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 8px;
        }
      `}</style>
    </>
  );
}
