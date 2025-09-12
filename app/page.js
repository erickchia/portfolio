"use client"; 
import { projects } from "../data/projects";
import ThemeToggle from "./components/ThemeToggle";

export const metadata = { title: "Portofolio Erick" };

export default function Home() {
  return (
    <main className="container">
      <header className="hero">
        <div className="hero-top">
          <h1>Erick</h1>
          <ThemeToggle />
        </div>
        <p>
          Finance & accounting analyst who turns manual chaos into streamlined systems —
          reporting pipelines, data processing, and automation that actually ships.
        </p>
        <div className="cta">
          <a href="/cv" className="btn">Lihat CV</a>
          <a href="mailto:erickchia2@gmail.com" className="btn btn--ghost">Email</a>
        </div>
      </header>

      {/* ...your Projects grid stays the same... */}

      <style jsx>{`
        .container{max-width:1000px;margin:56px auto;padding:0 20px}
        .hero-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .hero h1, .hero-top h1{font-size:42px;line-height:1.1;margin:0}
        .hero p{margin:8px 0 16px;color:var(--muted)}

        .cta{display:flex;gap:8px;margin-bottom:24px}
        .btn{display:inline-block;border-radius:10px;border:1px solid var(--accent);
             color:var(--accent); padding:8px 12px;text-decoration:none;transition:all .15s ease;
             background:transparent}
        .btn:hover{background:var(--accent);color:var(--bg)}
        .btn--ghost{border-color:var(--border);color:var(--text)}
        .btn--ghost:hover{background:var(--card);border-color:var(--accent)}

        .section-title{font-size:18px;margin:0 0 12px;color:var(--text)}

        .grid{list-style:none;padding:0;margin:0;
              display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}

        .card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;
              box-shadow:var(--shadow)}
        .card-title{margin:0 0 6px;font-weight:700}
        .card-desc{margin:0 0 10px;color:var(--muted)}

        .chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
        .chip{font-size:12px;background:var(--chip-bg);border:1px solid var(--border);
              border-radius:999px;padding:4px 8px}
      `}</style>
    </main>
  );
}
