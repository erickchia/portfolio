import { projects } from "../data/projects";
import NumericRail from "./components/NumericRail";

export const metadata = { title: "Portofolio Erick" };

export default function Home() {
  return (
    <main className="layout">
      {/* LEFT — content (2/3) */}
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

      {/* RIGHT — interactive digits rail (1/3) */}
      <aside className="right">
        <NumericRail />
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        :root{
          --ink:#0b1320; --muted:#5b6b82; --line:#e9eef5; --ring:#e5e7eb; --card:#ffffff;
        }
        html,body{margin:0;background:#f2f5fb;color:var(--ink);font-family:"Plus Jakarta Sans",ui-sans-serif,system-ui}

        /* ===== HARD LOCK: page no-scroll (desktop) ===== */
        @media (min-width: 980px){
          html,body{height:100%; overflow:hidden;}
        }

        /* Full-viewport grid fixed, biar page gak ikut geser */
        .layout{
          position:fixed; inset:0;          /* <-- kunci ke viewport */
          display:grid;
          grid-template-columns:minmax(0,2fr) minmax(300px,1fr);
          min-height:100vh;
        }
        .left{background:#fff;border-right:1px solid var(--line);overflow:hidden;}
        .right{position:relative;}

        .container{max-width:1100px;margin:0 auto;padding:56px 28px}
        .hero h1{font-size:56px;letter-spacing:-.02em;line-height:1.02;margin:0 0 10px;font-weight:800}
        .tagline{margin:0 0 20px;color:var(--muted);font-size:18px}
        .cta{display:flex;gap:10px;margin-bottom:28px}
        .btn{display:inline-block;border-radius:12px;border:1px solid var(--ink);padding:10px 14px;text-decoration:none;
             transition:transform .15s ease, box-shadow .15s ease, background .15s ease, color .15s ease}
        .btn:hover{background:var(--ink);color:#fff;transform:translateY(-1px)}
        .btn--ghost{border-color:var(--ring);color:var(--ink)}
        .btn--sm{padding:8px 12px;font-size:13px}

        .section-title{font-size:20px;margin:0 0 14px;font-weight:700}

        .grid{list-style:none;padding:0;margin:0;
              display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
        .card{
          background:var(--card); border:1px solid var(--ring); border-radius:18px; padding:18px;
          box-shadow:0 8px 24px rgba(16,24,40,.05);
          transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          transform-origin:center;
        }
        .card:hover{ transform:scale(1.025); box-shadow:0 18px 40px rgba(16,24,40,.12); border-color:#d7dbe3; }
        .card-title{margin:0 0 6px;font-weight:700;font-size:18px}
        .card-desc{margin:0 0 12px;color:var(--muted)}
        .chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
        .chip{font-size:12px;background:#f7f9ff;border:1px solid var(--ring);border-radius:999px;padding:5px 9px}

        /* mobile: page kembali normal (scroll bawaan) */
        @media (max-width: 979px){
          .layout{position:static; grid-template-columns:1fr}
          .right{display:none}
          .hero h1{font-size:42px}
        }
      `}</style>
    </main>
  );
}
