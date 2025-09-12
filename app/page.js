import { projects } from "../data/projects";

export const metadata = { title: "Portofolio Erick" };

export default function Home() {
  return (
    <main className="container">
      <header className="hero">
        <h1>Portofolio Erick</h1>
        <p>
          I’m a finance & accounting analyst who turns manual chaos into streamlined systems —
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
                    {p.tags.map(t => (
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

      {/* tiny CSS – no dependency, responsive, and print-friendly */}
      <style>{`
        .container{max-width:1000px;margin:56px auto;padding:0 20px}
        .hero h1{font-size:32px;line-height:1.2;margin:0 0 8px}
        .hero p{margin:0 0 16px;color:#475569}
        .cta{display:flex;gap:8px;margin-bottom:24px}

        .section-title{font-size:18px;margin:0 0 12px;color:#0f172a}

        .grid{list-style:none;padding:0;margin:0;
              display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}

        .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px;
              box-shadow:0 1px 2px rgba(0,0,0,.03)}
        .card-title{margin:0 0 6px;font-weight:700}
        .card-desc{margin:0 0 10px;color:#475569}

        .chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
        .chip{font-size:12px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:999px;padding:4px 8px}

        .btn{display:inline-block;border-radius:10px;border:1px solid #0f172a;padding:8px 12px;
             text-decoration:none;transition:all .15s ease}
        .btn:hover{background:#0f172a;color:#fff}
        .btn--ghost{border-color:#e5e7eb;color:#0f172a}
        .btn--sm{padding:6px 10px;font-size:13px}

        /* nice in dark mode too */
        @media (prefers-color-scheme: dark) {
          .section-title{color:#e5e7eb}
          .hero p,.card-desc{color:#94a3b8}
          .card{background:#0f172a;border-color:#1f2937}
          .chip{background:#111827;border-color:#1f2937;color:#e5e7eb}
          .btn--ghost{border-color:#334155;color:#e5e7eb}
        }
      `}</style>
    </main>
  );
}
