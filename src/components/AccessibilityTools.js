"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "wm_a11y_prefs";
const DEFAULTS = {
  text: 0, // 0..3 -> body zoom steps
  contrast: false,
  grayscale: false,
  links: false,
  font: false,
  spacing: false,
  motion: false,
  cursor: false,
};

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return DEFAULTS;
  }
}

function apply(p) {
  const root = document.documentElement;
  root.setAttribute("data-a11y-text", String(p.text));
  const flags = {
    contrast: "a11y-contrast",
    grayscale: "a11y-grayscale",
    links: "a11y-links",
    font: "a11y-font",
    spacing: "a11y-spacing",
    motion: "a11y-motion",
    cursor: "a11y-cursor",
  };
  Object.entries(flags).forEach(([k, cls]) => root.classList.toggle(cls, !!p[k]));
}

const TOGGLES = [
  { key: "contrast", label: "High Contrast" },
  { key: "grayscale", label: "Grayscale" },
  { key: "links", label: "Highlight Links" },
  { key: "font", label: "Readable Font" },
  { key: "spacing", label: "Text Spacing" },
  { key: "motion", label: "Pause Animations" },
  { key: "cursor", label: "Large Cursor" },
];

export default function AccessibilityTools() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULTS);
  const wrapRef = useRef(null);

  useEffect(() => {
    const p = load();
    setPrefs(p);
    apply(p);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const update = (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const reset = () => update({ ...DEFAULTS });

  return (
    <div className="a11y" ref={wrapRef}>
      {open && (
        <div className="a11y__panel" role="dialog" aria-label="Accessibility tools">
          <div className="a11y__head">
            <h2 className="a11y__title">Accessibility Tools</h2>
            <button
              type="button"
              className="a11y__close"
              aria-label="Close accessibility tools"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>

          <div className="a11y__row">
            <span className="a11y__label">Text Size</span>
            <div className="a11y__size">
              <button
                type="button"
                aria-label="Decrease text size"
                disabled={prefs.text <= 0}
                onClick={() => update({ text: Math.max(0, prefs.text - 1) })}
              >
                A&minus;
              </button>
              <span aria-live="polite">{100 + prefs.text * 10}%</span>
              <button
                type="button"
                aria-label="Increase text size"
                disabled={prefs.text >= 3}
                onClick={() => update({ text: Math.min(3, prefs.text + 1) })}
              >
                A+
              </button>
            </div>
          </div>

          <div className="a11y__grid">
            {TOGGLES.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`a11y__toggle${prefs[t.key] ? " is-on" : ""}`}
                aria-pressed={!!prefs[t.key]}
                onClick={() => update({ [t.key]: !prefs[t.key] })}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button type="button" className="a11y__reset" onClick={reset}>
            Reset All
          </button>
        </div>
      )}

      <button
        type="button"
        className="a11y__btn"
        aria-label="Accessibility tools"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="4" r="2" />
          <path d="M20 8.5H4a1 1 0 0 0 0 2h5.5V13l-2 7a1 1 0 0 0 1.9.6L11 15h2l1.6 5.6a1 1 0 0 0 1.9-.6l-2-7v-2.5H20a1 1 0 0 0 0-2z" />
        </svg>
      </button>
    </div>
  );
}
