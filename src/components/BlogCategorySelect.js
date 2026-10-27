"use client";

import { useEffect, useRef, useState } from "react";

export default function BlogCategorySelect({ categories, value = "" }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === "keydown" ? e.key === "Escape" : !rootRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const options = [{ slug: "", title: "All categories" }, ...categories];
  const current = options.find((item) => item.slug === selected) ?? options[0];

  const choose = (slug) => {
    setSelected(slug);
    setOpen(false);
    // let the hidden input pick up the new value, then run the search
    requestAnimationFrame(() => inputRef.current?.form?.requestSubmit());
  };

  return (
    <div className={`blog_search_select${open ? " open" : ""}`} ref={rootRef}>
      <input type="hidden" name="category" value={selected} ref={inputRef} />
      <button
        type="button"
        className="blog_search_select_btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{current.title}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul className="blog_search_menu" role="listbox">
          {options.map((item) => (
            <li
              key={item.slug || "all"}
              role="option"
              aria-selected={item.slug === selected}
              className={item.slug === selected ? "active" : ""}
              onClick={() => choose(item.slug)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
