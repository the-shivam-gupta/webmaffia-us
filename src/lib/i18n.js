/** Locales served for the localized sections (blog + author). */
export const LOCALES = ["en", "hi", "mr", "ar"];
export const DEFAULT_LOCALE = "en";

const RTL_LOCALES = new Set(["ar"]);

export const LOCALE_LABELS = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  ar: "العربية",
};

export function isLocale(value) {
  return LOCALES.includes(value);
}

/** Unknown / missing values fall back to the default locale. */
export function normalizeLocale(value) {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDir(lang) {
  return RTL_LOCALES.has(lang) ? "rtl" : "ltr";
}

/**
 * Site-relative path for a localized section (blog / author).
 * English keeps the unprefixed URL (`/blog`); other locales get `/<lang>/blog`.
 */
export function localizePath(lang, path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalizeLocale(lang) === DEFAULT_LOCALE) return normalized;
  return normalized === "/" ? `/${lang}` : `/${lang}${normalized}`;
}
