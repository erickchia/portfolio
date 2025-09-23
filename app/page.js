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

      {/* ===== Scroll lock khusus halaman ini + sembunyikan scrollbar ===== */}
      <style jsx global>{`
        /* Kunci halaman: tidak bisa scroll dokumen */
        html, body {
          height: 100vh !important;
          overflow: hidden !important;
          overscroll-behavior: none;
        }
        /* Sembunyikan track di semua browser */
        html::-webkit-scrollbar,
        body::-webkit-scrollbar { display: none; }
        html, body { scrollbar-width: none; }
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

        /* Jaga-jaga: kalau ada browser yang tetap render scrollbar pada .left */
        .left::-webkit-scrollbar { display: none; }
        .left { scrollbar-width: none; }
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

      {/* Pastikan kolom kiri juga tidak punya scroll internal */}
      <style jsx>{`
        .left { overflow: hidden !important; }
      `}</style>
</>
);
}
