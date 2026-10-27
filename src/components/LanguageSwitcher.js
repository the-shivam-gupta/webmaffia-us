"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/dictionaries";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_LABELS,
  LOCALES,
  localizePath,
} from "@/lib/i18n";

// Only the blog + author sections are localized.
const LOCALIZED_SECTION = /^\/(blog|author)(\/|$)/;

/**
 * Header language dropdown. Reads the current locale from the URL, swaps the
 * leading locale segment and keeps the rest of the path (slugs are shared
 * across locales). English is the unprefixed URL. Renders nothing outside the
 * blog/author sections.
 */
export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  // Tracking the path the menu was opened on closes it automatically on navigation.
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;

  const segments = pathname.split("/").filter(Boolean);
  const hasLocale = isLocale(segments[0]);
  const lang = hasLocale ? segments[0] : DEFAULT_LOCALE;
  const restPath = `/${(hasLocale ? segments.slice(1) : segments).join("/")}`;
  const inSection = LOCALIZED_SECTION.test(restPath);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpenPath(null);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!inSection) return null;

  const label = t(lang, "lang.switcherLabel");

  return (
    <div
      className={`lang_switcher${open ? " open" : ""}`}
      ref={wrapperRef}
    >
      <button
        type="button"
        className="lang_switcher_btn"
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${LOCALE_LABELS[lang]}`}
        onClick={() => setOpenPath(open ? null : pathname)}
      >
        <svg
          className="lang_switcher_globe"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        <span className="lang_switcher_code">{lang.toUpperCase()}</span>
        <svg
          className="lang_switcher_chevron"
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <ul className="lang_switcher_list" role="listbox" aria-label={label}>
        {LOCALES.map((locale) => (
          <li key={locale} role="presentation">
            <Link
              href={localizePath(locale, restPath)}
              hrefLang={locale}
              lang={locale}
              role="option"
              aria-selected={locale === lang}
              className={locale === lang ? "active" : undefined}
              onClick={() => setOpenPath(null)}
            >
              <span className="lang_switcher_name">{LOCALE_LABELS[locale]}</span>
              <span className="lang_switcher_abbr">{locale.toUpperCase()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
