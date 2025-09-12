"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = saved || system;
    setTheme(initial);
    root.dataset.theme = initial;

    // live-update with system changes while user hasn’t manually chosen
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (!localStorage.getItem("theme")) {
        const t = e.matches ? "dark" : "light";
        setTheme(t);
        root.dataset.theme = t;
      }
    };
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      <span className="icon sun" aria-hidden>☀️</span>
      <span className="icon moon" aria-hidden>🌙</span>

      <style jsx>{`
        .theme-toggle{
          position:relative;width:44px;height:44px;border-radius:12px;
          border:1px solid var(--border);background:var(--card);
          display:grid;place-items:center;cursor:pointer;
          transition:transform .15s ease, background .2s ease, border-color .2s ease;
        }
        .theme-toggle:hover{ transform: translateY(-1px); }
        .icon{ position:absolute;font-size:20px;
               transition: transform .35s cubic-bezier(.2,.7,.2,1), opacity .25s ease; }
        .sun{  opacity:1; transform: rotate(0)   scale(1); }
        .moon{ opacity:0; transform: rotate(-45deg) scale(.5); }
        .theme-toggle[aria-pressed="true"] .sun  { opacity:0; transform: rotate(90deg)  scale(.4); }
        .theme-toggle[aria-pressed="true"] .moon { opacity:1; transform: rotate(0)      scale(1); }
      `}</style>
    </button>
  );
}
