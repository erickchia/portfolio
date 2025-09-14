'use client';
import { cv } from "../../data/cv";
import PrintButton from "./PrintButton";

export default function CVPage() {
  return (
    <>
      {/* Unlock scroll HANYA untuk halaman CV */}
      <style jsx global>{`
        html, body { height: auto !important; overflow-y: auto !important; overscroll-behavior: auto !important; }
        @media (min-width: 980px){ html, body { height: auto !important; overflow-y: auto !important; } }
      `}</style>

      <main style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
        <article
          className="cv"
          style={{
            width: "260mm",
            minHeight: "297mm",
            background: "#fff",
            color: "#0b1220",
            boxShadow: "0 10px 30px rgba(0,0,0,.08)",
            padding: "18mm",
            borderRadius: 12,
          }}
        >
          {/* Back button (sticky di kiri atas, hidden saat print) */}
          <div className="print-hide back-wrap">
            <a href="/" className="back-btn" aria-label="Back to portfolio">
              <span className="emoji hi" aria-hidden>👋</span>
              <span className="emoji back" aria-hidden>🔙</span>
            </a>
          </div>

          {/* Header */}
          <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
            <img
              src="../images/picUser.jpeg"
              alt="Profile"
              width={84}
              height={84}
              style={{ borderRadius: 12, objectFit: "cover", background: "#eee" }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{cv.name}</h1>
              <div style={{ opacity: .75 }}>{cv.role}</div>
              <div style={{ opacity: .75, fontSize: 14, marginTop: 4 }}>
                {cv.location} · <a href={`mailto:${cv.email}`}>{cv.email}</a>
                {cv.website ? <> · <a href={cv.website} target="_blank" rel="noreferrer">Website</a></> : null}
              </div>
            </div>
          </header>

          {/* Summary | Skills */}
          <section className="split" style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr", gap: 18 }}>
            <div>
              <h2 className="sec">Summary</h2>
              <p style={{ marginTop: 6, lineHeight: 1.55 }}>{cv.summary}</p>
            </div>

            <aside>
              <h2 className="sec">Skills</h2>
              <div className="skills">
                {cv.skills.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </aside>
          </section>

          {/* Experience (timeline + tanggal kolom kiri) */}
          <section style={{ marginTop: 14 }}>
            <h2 className="sec">Experience</h2>

            <ol className="xp-tl">
              {cv.experience.map((e, i) => (
                <li className="xp" key={i}>
                  <div className="xp-date">
                    <span>({e.start}–{e.end})</span>
                  </div>
                  <div className="xp-body">
                    <div className="xp-title">
                      <strong>{e.role}</strong> — {e.company}
                    </div>
                    {e.bullets?.length ? (
                      <ul className="xp-bullets">
                        {e.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Projects */}
          {cv.projects?.length ? (
            <section style={{ marginTop: 14 }}>
              <h2 className="sec">Projects</h2>
              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                {cv.projects.map((p, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>
                    <strong>{p.name}</strong>
                    {p.link ? <> — <a href={p.link} target="_blank" rel="noreferrer">{p.link}</a></> : null}
                    {p.bullets?.length ? (
                      <ul style={{ margin: "4px 0 0 18px" }}>
                        {p.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Education */}
          {cv.education?.length ? (
            <section style={{ marginTop: 14 }}>
              <h2 className="sec">Education</h2>
              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                {cv.education.map((ed, i) => (
                  <li key={i}>{ed.degree}, {ed.school} {ed.year ? `(${ed.year})` : ""}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Certificates */}
          {cv.certificates?.length ? (
            <section style={{ marginTop: 14 }}>
              <h2 className="sec">Certificates</h2>
              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                {cv.certificates.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </section>
          ) : null}

          {/* Download PDF */}
          <div className="print-hide" style={{ marginTop: 18 }}>
            <PrintButton />
          </div>
        </article>

        {/* Styles khusus halaman ini */}
        <style>{`
          /* Lebarkan preview desktop (print tetap 210mm) */
          @media screen and (min-width: 1100px) { .cv { width: min(1380px, 88vw); } }
          @media screen and (min-width: 1400px) { .cv { width: min(1600px, 86vw); } }
          @media screen and (min-width: 1800px) { .cv { width: min(1720px, 82vw); } }

          /* Back button */
          .back-wrap{ position: sticky; top: 0; z-index: 20; margin: -6px 0 6px -6px; }
          .back-btn{
            position: relative;
            display:inline-flex; align-items:center; justify-content:center;
            width:42px; height:42px; border-radius:12px;
            border:1px solid #e5e7eb; background:#fff; color:#0b1220;
            text-decoration:none; box-shadow:0 8px 24px rgba(16,24,40,.06);
            transition: background .2s ease, border-color .2s ease, transform .2s ease;
            overflow:hidden;
          }
          .back-btn:hover{ background:#0b1220; border-color:#0b1220; transform: translateY(-1px); }
          .back-btn:focus-visible{ outline:2px solid #2563eb; outline-offset:2px; }
          .back-btn .emoji{ position:absolute; font-size:20px; line-height:1; transition: opacity .3s ease, transform .3s ease; }
          .back-btn .back{ opacity:0; transform: translateY(6px) scale(.9); }
          .back-btn:hover .back{ opacity:1; transform: translateY(0) scale(1); }
          .back-btn:hover .hi{ opacity:0; transform: translateY(-6px) scale(.9) rotate(-8deg); }

          /* Perbesar kolom SKILLS di desktop */
          @media screen and (min-width: 1200px) {
            .split { grid-template-columns: 3fr 2fr !important; }
          }

          /* Skills grid */
          .skills {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin-top: 6px;
          }
          .chip {
            display: inline-block;
            font-size: 12px;
            padding: 6px 10px;
            border: 1px solid #e5e7eb;
            border-radius: 999px;
            background: #f8fafc;
            white-space: nowrap;
          }

          /* ===== Experience timeline ===== */
          .xp-tl { list-style: none; margin: 8px 0 0 0; padding: 0; position: relative; }
          .xp-tl::before {
            content: ""; position: absolute; left: 14px; top: 4px; bottom: 4px; width: 2px; background: #e5e7eb;
          }
          .xp {
            position: relative;
            display: grid;
            grid-template-columns: 160px 1fr; column-gap: 14px;
            padding: 10px 0 16px 28px;
          }
          .xp::before {
            content: ""; position: absolute; left: 8px; top: 16px;
            width: 10px; height: 10px; border-radius: 50%;
            background: #fff; border: 2px solid #94a3b8;
          }
          .xp-date { color: #64748b; font-size: 13px; line-height: 1.4; white-space: nowrap; }
          .xp-title { font-weight: 700; }
          .xp-bullets { margin: 6px 0 0 18px; }

          @media (max-width: 900px) {
            .split { grid-template-columns: 1fr !important; }
            .cv { width: 100% !important; padding: 16px; border-radius: 10px; }
            .skills { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
            .chip { font-size: 11px; padding: 5px 9px; }
            .xp { grid-template-columns: 120px 1fr; }
          }

          .sec { margin: 0; font-size: 14px; font-weight: 800; letter-spacing: .02em; text-transform: uppercase; color: #334155; }

          /* Print tetap A4 */
          @media print {
            body { background: white; }
            .print-hide { display: none !important; }
            .cv {
              box-shadow: none !important; border-radius: 0 !important;
              width: 210mm !important; min-height: 297mm; padding: 18mm;
            }
            .xp-tl::before { background: #ddd; }
            .xp::before { background: #fff; border-color: #bbb; }
            @page { size: A4; margin: 0; }
          }
        `}</style>
      </main>
    </>
  );
}
