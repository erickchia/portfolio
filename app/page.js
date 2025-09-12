import { projects } from "../data/projects";

/* ---------- tiny helper to make the numeric wallpaper ---------- */
function makeDigits(len = 8000) {
  let out = "";
  for (let i = 0; i < len; i++) out += Math.floor(Math.random() * 10);
  return out;
}
const DIGITS = makeDigits(12000);

/* ---------- page ---------- */
export const metadata = { title: "Portofolio Erick" };

export default function Home() {
  return (
    <main className="layout">
      {/* LEFT — content (3/4), white background */}
      <section className="left">
        <div className="container">
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

      {/* RIGHT — numeric rail (1/4) */}
      <aside className="right">
        <div className="rail">
          <pre className="digits" aria-hidden="true">{DIGITS}</pre>
        </div>
      </aside>

      {/* styles (pure CSS, no deps) */}
      <style>{`
        /* fonts */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        :root{
          --ink:#0b1320;
          --muted:#5b6b82;
          --line:#e9eef5;
          --card:#ffffff;
          --ring:#e5e7eb;
          --accent:#7c3aed;
        }

        html,body{background:#f4f6fb;color:var(--ink);font-family:"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin:0}
        *{box-sizing:border-box}

        /* 3/4 + 1/4 layout */
        .layout{
          min-height:100vh;
          display:grid;
          grid-template-columns:minmax(0,3fr) minmax(260px,1fr);
        }
        .left{background:#fff;border-right:1px solid var(--line)}
        .right{position:relative;overflow:hidden}

        /* content container */
        .container{max-width:1100px;margin:0 auto;padding:56px 28px}

        /* hero */
        .hero h1{font-size:48px;letter-spacing:-.02em;line-height:1.05;margin:0 0 8px;font-weight:800}
        .tagline{margin:0 0 18px;color:var(--muted);font-size:18px}
        .cta{display:flex;gap:10px;margin-bottom:28px}
        .btn{display:inline-block;border-radius:12px;border:1px solid var(--ink);padding:10px 14px;text-decoration:none;transition:transform .15s ease, box-shadow .15s ease, background .15s ease, color .15s ease}
        .btn:hover{background:var(--ink);color:#fff;transform:translateY(-1px)}
        .btn--ghost{border-color:var(--ring);color:var(--ink)}
        .btn--sm{padding:8px 12px;font-size:13px}

        /* section */
        .section-title{font-size:20px;margin:0 0 14px;font-weight:700}

        /* grid + cards */
        .grid{list-style:none;padding:0;margin:0;
          display:grid;grid-template-columns:repeat(auto-fill, minmax(300px,1fr));gap:18px}
        .card{
          background:var(--card);
          border:1px solid var(--ring);
          border-radius:18px;
          padding:18px;
          box-shadow:0 8px 24px rgba(16,24,40,.04);
          transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          transform-origin:center;
        }
        .card:hover{
          transform:scale(1.02);
          box-shadow:0 18px 40px rgba(16,24,40,.10);
          border-color:#d4d8e0;
        }
        .card-title{margin:0 0 6px;font-weight:700;font-size:18px;letter-spacing:.2px}
        .card-desc{margin:0 0 12px;color:var(--muted)}
        .chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
        .chip{font-size:12px;background:#f7f9ff;border:1px solid var(--ring);border-radius:999px;padding:5px 9px}

        /* numeric rail */
        .rail{position:sticky;top:0;min-height:100vh;padding:36px 18px;background:linear-gradient(180deg,#f0f3fa 0%, #e9eef7 100%)}
        .digits{
          margin:0;white-space:pre-wrap;word-break:break-word;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size:12px;line-height:1.05;letter-spacing:1px;
          color:#9aa6bd;opacity:.28; 
          transform:rotate(-2deg) scale(1.02);
          text-rendering:optimizeLegibility;
        }
        .rail::after{
          content:""; position:absolute; inset:0;
          background:
            radial-gradient(1200px 300px at 0% 20%, rgba(255,255,255,.85), transparent 60%),
            radial-gradient(500px 500px at 100% 80%, rgba(255,255,255,.75), transparent 70%);
          pointer-events:none;
        }

        /* responsive: stack on small screens */
        @media (max-width: 980px){
          .layout{grid-template-columns:1fr}
          .right{display:none}
          .hero h1{font-size:38px}
        }
      `}</style>
    </main>
  );
}
