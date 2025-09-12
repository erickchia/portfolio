"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print-hide"
      style={{
        padding: "10px 14px", borderRadius: 10, border: "1px solid #334155",
        background: "#0f172a", color: "white", cursor: "pointer", marginBottom: 16
      }}
    >
      Download PDF
    </button>
  );
}
