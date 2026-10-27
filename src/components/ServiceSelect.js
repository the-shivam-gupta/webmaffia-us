"use client";

import { useEffect, useRef, useState } from "react";

export const SERVICE_OPTIONS = [
  "Web Design & Development",
  "Social Media Management",
  "AI Services",
  "Digital Strategy",
  "Search Engine Optimization",
  "Video Content"
];

export default function ServiceSelect({
  id,
  name = "service",
  value,
  onChange,
  placeholder = "Services Interested In",
  required = false,
  hasError = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMenuStyle(null);
      return;
    }

    updateMenuPosition();

    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);

    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [isOpen]);

  const handleSelect = (service) => {
    onChange({ target: { name, value: service } });
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className={`form_service_select${isOpen ? " is-open" : ""}${
        hasError ? " has-error" : ""
      }`}
    >
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={`form_service_select__trigger${
          value ? "" : " form_service_select__trigger--placeholder"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{value}</span>
        <span className="form_service_select__chevron" aria-hidden="true" />
      </button>
      {isOpen && menuStyle ? (
        <ul
          className="form_service_select__menu"
          role="listbox"
          aria-labelledby={id}
          style={{
            top: menuStyle.top,
            left: menuStyle.left,
            width: menuStyle.width,
          }}
        >
          {SERVICE_OPTIONS.map((service) => (
            <li key={service} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === service}
                className={value === service ? "is-selected" : undefined}
                onClick={() => handleSelect(service)}
              >
                {service}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
