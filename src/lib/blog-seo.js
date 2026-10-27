import { DEFAULT_LOCALE, LOCALES, localizePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/schema";

export function absoluteLocalizedUrl(lang, path) {
  const localized = localizePath(lang, path);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
}

/** Locales (in LOCALES order) in which a post with this slug really exists. */
export function localesForSlug(postsByLocale, slug) {
  return LOCALES.filter((lang) =>
    (postsByLocale[lang] ?? []).some(
      (post) => post.slug === slug || post.documentId === slug
    )
  );
}

/** Locales that have at least one blog post. */
export function localesWithPosts(postsByLocale) {
  return LOCALES.filter((lang) => (postsByLocale[lang] ?? []).length > 0);
}

/**
 * Metadata `alternates` for a localized blog/author page.
 *
 * - A non-English page showing English fallback content canonicalises to the
 *   English URL and declares no hreflang alternates.
 * - Otherwise it is self-canonical and lists hreflang alternates only for the
 *   locales in `availableLocales` (content that really exists in Strapi), plus
 *   an `x-default` pointing at English. A single-locale page lists none.
 */
export function buildLocalizedAlternates({
  lang,
  path,
  isFallback = false,
  availableLocales = [DEFAULT_LOCALE],
}) {
  if (lang !== DEFAULT_LOCALE && isFallback) {
    return { canonical: absoluteLocalizedUrl(DEFAULT_LOCALE, path) };
  }

  const alternates = { canonical: absoluteLocalizedUrl(lang, path) };

  if (availableLocales.length > 1) {
    const languages = {};
    for (const locale of availableLocales) {
      languages[locale] = absoluteLocalizedUrl(locale, path);
    }
    if (availableLocales.includes(DEFAULT_LOCALE)) {
      languages["x-default"] = absoluteLocalizedUrl(DEFAULT_LOCALE, path);
    }
    alternates.languages = languages;
  }

  return alternates;
}
