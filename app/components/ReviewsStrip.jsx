'use client';
import { useEffect, useState } from 'react';

export default function ReviewsStrip() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/reviews?status=approved', { cache: 'no-store' });
        setReviews(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="reviews-strip">
      <div className="reviews-head">
        <h2 className="section-title">What clients say</h2>
        <button className="btn btn--ghost btn--sm" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Close' : 'Leave a testimonial'}
        </button>
      </div>

      {/* Submit dialog (MVP) */}
      {showForm && (
        <form
          className="review-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true); setError("");
            const fd = new FormData(e.currentTarget);
            const payload = {
              name: fd.get('name') || '',
              censor: fd.get('censor') === 'on',
              role: fd.get('role') || '',
              company: fd.get('company') || '',
              projectId: fd.get('projectId') || '',
              quote: fd.get('quote') || '',
              before: fd.get('before') || '',
              after: fd.get('after') || '',
              metric: { label: fd.get('metricLabel') || '', value: fd.get('metricValue') || '', unit: fd.get('metricUnit') || '' }
            };
            try {
              const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (!res.ok) throw new Error(await res.text());
              e.currentTarget.reset();
              setShowForm(false);
              alert('Thanks! Your review is pending approval.'); // MVP UX
            } catch (err) {
              setError(String(err?.message || err));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="grid-2">
            <input name="name" placeholder="Name" className="i" />
            <label className="chk"><input type="checkbox" name="censor" /> Censor my name</label>
            <input name="role" placeholder="Role (e.g., Head of Ops)" className="i" />
            <input name="company" placeholder="Company" className="i" />
            <input name="projectId" placeholder="Project (optional)" className="i" />
          </div>
          <textarea name="before" placeholder="Before (what was the problem?)" className="i" rows={2} />
          <textarea name="after" placeholder="After (what changed?)" className="i" rows={2} />
          <div className="grid-3">
            <input name="metricLabel" placeholder="Metric (e.g., Time saved)" className="i" />
            <input name="metricValue" placeholder="Value (e.g., 6)" className="i" />
            <input name="metricUnit" placeholder="Unit (e.g., minutes)" className="i" />
          </div>
          <textarea name="quote" placeholder="Short quote (120–180 chars)" className="i" rows={3} />
          {error && <p className="err">❌ {error}</p>}
          <button className="btn btn--ghost btn--sm" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      )}

      {/* Cards */}
      <div className="reviews-row">
        {loading ? (
          <div className="skeleton-row" />
        ) : reviews.length === 0 ? (
          <p className="muted">No reviews yet. Be the first.</p>
        ) : (
          reviews.slice(0, 3).map((r) => (
            <article key={r.id} className="review-card">
              <div className="review-name">
                <span className="name">{r.name || 'Anonymous'}</span>
                {r.censor && <span className="censor" aria-hidden="true" />}
              </div>
              <div className="review-meta">
                {(r.role ? r.role + ' — ' : '') + (r.company || 'Private')}
              </div>
              <p className="review-quote">{r.quote || `${r.after || ''}`.trim()}</p>
            </article>
          ))
        )}
      </div>

      <style jsx>{`
        .reviews-head { display:flex; align-items:center; justify-content:space-between; margin: 8px 0 16px; }
        .muted { color: var(--muted); }
        .review-form { background: var(--card); border:1px solid var(--ring); border-radius:14px; padding:12px; margin: 0 0 14px; }
        .grid-2 { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:10px; }
        .grid-3 { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:10px; }
        .i { width:100%; border:1px solid var(--ring); background:var(--card); color:var(--ink); border-radius:10px; padding:10px; }
        .chk { display:flex; align-items:center; gap:8px; }
        .err { color: #ef4444; margin: 8px 0 0; }

        .reviews-row { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:16px; }
        @media (max-width:1023px){ .reviews-row { grid-template-columns: 1fr; } }

        .review-card {
          background: var(--card);
          border: 1px solid var(--ring);
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(16,24,40,.05);
        }
        .review-name { position:relative; font-weight:700; }
        .review-name .name { position:relative; z-index:1; }
        .review-meta { color: var(--muted); font-size: 13px; margin: 4px 0 10px; }
        .review-quote { margin:0; line-height:1.45; }

        /* Censor layer — simple MVP (we'll do number-smoke later) */
        .censor {
          position:absolute; inset:0;
          background: linear-gradient(90deg, rgba(2,6,23,.12), rgba(2,6,23,.28), rgba(2,6,23,.12));
          border-radius: 6px;
          animation: flicker 1.6s ease-in-out infinite;
        }
        @keyframes flicker { 0%,100% { opacity:.7 } 50% { opacity:.35 } }
        @media (prefers-reduced-motion: reduce) { .censor { animation: none; opacity: .6; } }
      `}</style>
    </section>
  );
}
