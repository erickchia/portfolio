'use client';
import { cv } from "../../data/cv";
import PrintButton from "./PrintButton";

/* === Lightweight preview data (instant, CORS-safe) ===
   If you want to change the text, just edit the snippets below. */
const companyLinks = {
  "PT Intertama Trikencana Bersinar": "https://www.linkedin.com/company/pt-intertama-trikencana-bersinar/about/",
  "PT Djaja Harapan": "https://www.linkedin.com/company/pt-djaja-harapan-m/?originalSubdomain=id",
  "PT Astra Honda Motor": "https://www.astra-honda.com/corporate",
  "PT Aneka Makmur Sejahtera": "https://www.dnb.com/business-directory/company-profiles.pt_aneka_makmur_sejahtera.195a5284519ba3d51900f02731ebfb03.html",
  "PD Murah Makmur": "https://www.semuabis.com/pd-murah-makmur-0857-7928-1198",
  "Fingerspot": "https://fingerspot.com/about-us",
};
const companyPreview = {
  "PT Intertama Trikencana Bersinar":
    "PT Intertama Trikencana Bersinar adalah perusahaan manufaktur yang fokus pada peternakan unggas khususnya ayam, selain itu perusahaan ini fokus pada produksi maklon dan produksi makanan siap saji dan frozen food.",
  "PT Djaja Harapan":
    "PT Djaja Harapan adalah perusahaan distribusi/ritel di Indonesia untuk sparepart otomatif khususnya bearing. Informasi publik menggambarkan fokus pada pengadaan dan pemasaran berbagai produk kebutuhan.",
  "PT Astra Honda Motor":
    "PT Astra Honda Motor (AHM) adalah produsen sepeda motor Honda di Indonesia, perusahaan patungan Astra International dan Honda Motor Co., Ltd.",
  "PT Aneka Makmur Sejahtera":
    "PT Aneka Makmur Sejahtera disebut dalam direktori bisnis sebagai entitas perdagangan/pendukung distribusi dengan aktivitas komersial di Indonesia, yang secara garis besar berfokus pada distribusi seperti produk sepeda motor Yamaha dan eskrim Walls di Kalimantan Barat.",
  "PD Murah Makmur":
    "PD Murah Makmur merupakan usaha perdagangan yang melayani distribusi barang khususnya material bahan bangunan di Kota Bogor.",
  "Fingerspot":
    "Fingerspot adalah penyedia solusi absensi dan keamanan biometrik (fingerprint/RFID) untuk bisnis dan organisasi di Indonesia.",
};
function resolveCompany(fullText = "") {
  const lower = fullText.toLowerCase();
  for (const key of Object.keys(companyLinks)) {
    if (lower.includes(key.toLowerCase())) return key;
  }
  return null;
}

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
              src="profile.jpg"
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
              {cv.experience.map((e, i) => {
                const key = resolveCompany(e.company);
                const link = key ? companyLinks[key] : null;
                const snippet = key ? companyPreview[key] : null;

                return (
                  <li className="xp" key={i}>
                    <div className="xp-date">
                      <span>({e.start}–{e.end})</span>
                    </div>

                    <div className="xp-body">
                      <div className="xp-head">
                        <div className="xp-title">
                          <strong className="xp-role">{e.role}</strong>
                          <div className="xp-company">
                            {e.company}
                            {/* Wikipedia-like preview card */}
                            {link && (
                              <div className="wiki-card" role="dialog" aria-label={`About ${e.company}`}>
                                <div className="wiki-inner">
                                  <div className="wiki-title">{e.company}</div>
                                  {snippet ? (
                                    <p className="wiki-snippet">{snippet}</p>
                                  ) : (
                                    <p className="wiki-snippet">Reference information for this company.</p>
                                  )}
                                  <a className="wiki-open" href={link} target="_blank" rel="noreferrer">
                                    Open reference ↗
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {e.bullets?.length ? (
                        <div className="xp-tasks">
                          <ul className="xp-bullets">
                            {e.bullets.map((b, bi) => (
                              <li key={bi}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
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
              <ul className="edu-list" style={{ marginTop: 6, paddingLeft: 18 }}>
                {cv.education.map((ed, i) => (
                  <li key={i}>
                    {ed.degree}, {ed.school} {ed.year ? `(${ed.year})` : ""}
                  </li>
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
          @media screen and (min-width: 1200px) { .split { grid-template-columns: 3fr 2fr !important; } }

          /* Skills grid */
          .skills {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px; margin-top: 6px;
          }
          .chip {
            display: inline-block; font-size: 12px; padding: 6px 10px;
            border: 1px solid #e5e7eb; border-radius: 999px; background: #f8fafc; white-space: nowrap;
          }

          /* ===== Experience timeline ===== */
          .xp-tl { list-style: none; margin: 8px 0 0 0; padding: 0; position: relative; }
          .xp-tl::before { content: ""; position: absolute; left: 14px; top: 4px; bottom: 4px; width: 2px; background: #e5e7eb; }
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

          .xp-title { margin-bottom: 6px; }
          .xp-role { display:block; font-weight: 900; font-size: 18px; }
          .xp-company { position: relative; color:#475569; display:inline-block; }

          /* ===== Wikipedia-like preview ===== */
          .wiki-card{
            position:absolute;
            left:0; top: calc(100% + 8px);
            width:min(520px, 62ch);
            background:#fff; border:1px solid #e5e7eb; border-radius:8px;
            box-shadow:0 16px 36px rgba(16,24,40,.12);
            opacity:0; transform: translateY(6px);
            transition: opacity .18s ease, transform .18s ease;
            pointer-events:none; z-index: 5;
          }
          /* arrow notch */
          .wiki-card::before{
            content:""; position:absolute; top:-7px; left:14px;
            width:12px; height:12px; background:#fff; border-left:1px solid #e5e7eb; border-top:1px solid #e5e7eb;
            transform: rotate(45deg);
          }
          .wiki-inner{ padding:12px 14px; }
          .wiki-title{ font-weight:800; margin:0 0 4px 0; }
          .wiki-snippet{ margin:0; color:#334155; line-height:1.45; }
          .wiki-open{
            display:block; margin-top:8px; font-size:12px; color:#0b1220; text-decoration:none;
          }
          .wiki-open:hover{ text-decoration:underline; }
          /* show on hover */
          .xp-company:hover .wiki-card,
          .xp-company:focus-within .wiki-card{ opacity:1; transform: translateY(0); pointer-events:auto; }

          /* Tasks container (soft bg) */
          .xp-tasks{
            background:#f8fafc; border:1px solid #e5e7eb; border-radius:10px;
            padding:10px 12px; margin-top:6px; font-size: 0.95rem;
          }

          /* Bullets → emoji badge dgn pixel radius */
          .xp-bullets { list-style: none; padding: 0; margin: 0; }
          .xp-bullets li {
            position: relative; padding-left: 32px; margin-bottom: 6px;
          }
          .xp-bullets li::before {
            content: "🗒️";
            position: absolute; left: 0; top: 1px;
            width: 22px; height: 22px;
            display: inline-flex; align-items: center; justify-content: center;
            border: 1px solid #e5e7eb; background: #f8fafc; border-radius: 6px; /* pixel radius */
            font-size: 12px; line-height: 1;
          }

          /* Education bullets → 🎓 */
          .edu-list{ list-style: none; padding-left: 0; }
          .edu-list li{ position: relative; padding-left: 26px; margin-bottom: 6px; }
          .edu-list li::before{
            content: "🎓";
            position: absolute; left: 0; top: 0;
            width: 20px; height: 20px; display: inline-flex; align-items:center; justify-content:center;
            border:1px solid #e5e7eb; background:#f8fafc; border-radius:6px; font-size:12px;
          }

          @media (max-width: 900px) {
            .split { grid-template-columns: 1fr !important; }
            .cv { width: 100% !important; padding: 16px; border-radius: 10px; }
            .skills { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
            .chip { font-size: 11px; padding: 5px 9px; }
            .xp { grid-template-columns: 120px 1fr; }
            .wiki-card{ width:min(88vw, 520px); }
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
            .xp-tasks{ background:#f3f4f6; border-color:#d1d5db; }
            .xp-bullets li::before { border-color: #d1d5db; background: #f3f4f6; }
            .wiki-card{ display:none !important; }
            @page { size: A4; margin: 0; }
          }
        `}</style>
      </main>
    </>
  );
}
