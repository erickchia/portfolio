import { cv } from "../../data/cv";
import PrintButton from "./PrintButton";

export const metadata = {
  title: `${cv.name} — CV`,
  description: `${cv.name} · ${cv.role}`,
};

export default function CVPage() {
  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <article
        className="cv"
        style={{
          width: "210mm",
          minHeight: "297mm",
          background: "white",
          color: "#0b1220",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          padding: "18mm",
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
          <img
            src="/images/picUser.jpeg"
            alt="Profile"
            width={84}
            height={84}
            style={{ borderRadius: 12, objectFit: "cover", background: "#eee" }}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{cv.name}</h1>
            <div style={{ opacity: 0.75 }}>{cv.role}</div>
            <div style={{ opacity: 0.75, fontSize: 14, marginTop: 4 }}>
              {cv.location} · <a href={`mailto:${cv.email}`}>{cv.email}</a>
              {cv.website ? (
                <>
                  {" "}
                  ·{" "}
                  <a href={cv.website} target="_blank" rel="noreferrer">
                    Website
                  </a>
                </>
              ) : null}
            </div>
          </div>
        </header>

        {/* Summary | Skills split */}
        <section className="split" style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr", gap: 18 }}>
          {/* Summary */}
          <div>
            <h2 className="sec">Summary</h2>
            <p style={{ marginTop: 6, lineHeight: 1.55 }}>{cv.summary}</p>
          </div>

          {/* Skills */}
          <aside>
            <h2 className="sec">Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {cv.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: 12,
                    padding: "4px 8px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 999,
                    background: "#f8fafc",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </aside>
        </section>

        {/* Experience */}
        <section style={{ marginTop: 14 }}>
          <h2 className="sec">Experience</h2>
          <ul style={{ marginTop: 6, paddingLeft: 18 }}>
            {cv.experience.map((e, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>
                  {e.role} — {e.company}{" "}
                  <span style={{ opacity: 0.6, fontWeight: 400 }}>
                    ({e.start}–{e.end})
                  </span>
                </div>
                <ul style={{ margin: "6px 0 0 18px" }}>
                  {e.bullets.map((b, bi) => (
                    <li key={bi} style={{ marginBottom: 4 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Projects */}
        {cv.projects?.length ? (
          <section style={{ marginTop: 14 }}>
            <h2 className="sec">Projects</h2>
            <ul style={{ marginTop: 6, paddingLeft: 18 }}>
              {cv.projects.map((p, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <strong>{p.name}</strong>
                  {p.link ? (
                    <>
                      {" "}
                      —{" "}
                      <a href={p.link} target="_blank" rel="noreferrer">
                        {p.link}
                      </a>
                    </>
                  ) : null}
                  {p.bullets?.length ? (
                    <ul style={{ margin: "4px 0 0 18px" }}>
                      {p.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
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
              {cv.certificates.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Download PDF button moved to bottom */}
        <div className="print-hide" style={{ marginTop: 18 }}>
          <PrintButton />
        </div>
      </article>

      {/* styles */}
      <style>{`
        @media (max-width: 900px) {
          .split { grid-template-columns: 1fr !important; }
        }

        .sec { margin: 0; font-size: 14px; font-weight: 800; letter-spacing: .02em; text-transform: uppercase; color: #334155; }

        @media print {
          body { background: white; }
          .print-hide { display: none !important; }
          .cv { box-shadow: none !important; border-radius: 0 !important; width: 210mm; min-height: 297mm; padding: 18mm; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </main>
  );
}
