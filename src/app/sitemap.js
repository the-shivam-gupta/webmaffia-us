import {
  getAllServiceEntries,
  getAllServiceLocationPaths,
} from "@/lib/serviceLocations";
import {
  getAuthors,
  getBlogsByLocale,
  getCampaigns,
  getCaseStudies,
} from "@/lib/strapiPage";
import { DEFAULT_LOCALE, LOCALES, localizePath } from "@/lib/i18n";

const SITE_URL = "https://www.webmaffia.com";

/** Core pages that rarely change. */
const STATIC_PAGES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "weekly" },
  { path: "/case-study", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/career", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/awards", priority: 0.8, changeFrequency: "monthly" },
  { path: "/clients", priority: 0.8, changeFrequency: "monthly" },
];

function toUrl(path) {
  const normalized = path === "/" ? "" : path.replace(/\/$/, "");
  return `${SITE_URL}${normalized}`;
}

function entry(path, { priority = 0.64, changeFrequency = "weekly", lastModified, languages } = {}) {
  return {
    url: toUrl(path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
    ...(languages ? { alternates: { languages } } : {}),
  };
}

/** hreflang map for a localized path, limited to the given locales (2+ only). */
function hreflangMap(locales, path) {
  if (locales.length < 2) return undefined;
  const languages = {};
  for (const lang of locales) languages[lang] = toUrl(localizePath(lang, path));
  if (locales.includes(DEFAULT_LOCALE)) {
    languages["x-default"] = toUrl(localizePath(DEFAULT_LOCALE, path));
  }
  return languages;
}

async function safeFetch(label, fn) {
  try {
    return await fn();
  } catch (error) {
    console.error(`[sitemap] Failed to load ${label}:`, error);
    return [];
  }
}

export default async function sitemap() {
  const [blogsByLocale, authors, caseStudies, campaigns, services, locationPaths] = await Promise.all([
    safeFetch("blogs", getBlogsByLocale),
    safeFetch("authors", getAuthors),
    safeFetch("case studies", getCaseStudies),
    safeFetch("campaigns", getCampaigns),
    safeFetch("services", getAllServiceEntries),
    safeFetch("service locations", getAllServiceLocationPaths),
  ]);

  // safeFetch falls back to [] on failure; normalise to a locale map.
  const postsByLocale = Array.isArray(blogsByLocale) ? {} : blogsByLocale;
  const blogLocales = LOCALES.filter((lang) => (postsByLocale[lang] ?? []).length > 0);

  const servicePages = services.map((service) => `/services/${service.slug}`);

  const staticEntries = [
    ...STATIC_PAGES.filter(({ path }) => path !== "/blog").map(
      ({ path, priority, changeFrequency }) =>
        entry(path, { priority, changeFrequency })
    ),
    // Blog index: one entry per locale that has posts, cross-linked via hreflang.
    ...blogLocales.map((lang) =>
      entry(localizePath(lang, "/blog"), {
        priority: 0.8,
        changeFrequency: "daily",
        languages: hreflangMap(blogLocales, "/blog"),
      })
    ),
    ...servicePages.map((path) =>
      entry(path, { priority: 0.8, changeFrequency: "monthly" })
    ),
    ...locationPaths.map(({ serviceLocation }) =>
      entry(`/services/${serviceLocation}`, {
        priority: 0.7,
        changeFrequency: "monthly",
      })
    ),
  ];

  // Blog posts: one entry per locale the post actually exists in (no fallback copies).
  const slugLocales = new Map();
  for (const lang of LOCALES) {
    for (const post of postsByLocale[lang] ?? []) {
      if (!post?.slug) continue;
      slugLocales.set(post.slug, [...(slugLocales.get(post.slug) ?? []), lang]);
    }
  }

  const blogEntries = LOCALES.flatMap((lang) =>
    (postsByLocale[lang] ?? [])
      .filter((post) => post?.slug)
      .map((post) =>
        entry(localizePath(lang, `/blog/${post.slug}`), {
          priority: 0.64,
          changeFrequency: "weekly",
          lastModified: post.updatedAt || post.publishedAt || post.createdAt,
          languages: hreflangMap(slugLocales.get(post.slug), `/blog/${post.slug}`),
        })
      )
  );

  const authorEntries = authors
    .filter((author) => author?.slug)
    .map((author) =>
      entry(`/author/${author.slug}`, {
        priority: 0.5,
        changeFrequency: "weekly",
        lastModified: author.updatedAt || author.publishedAt || author.createdAt,
      })
    );

  const caseStudySlugs = new Set();
  const caseStudyEntries = [];

  for (const study of caseStudies) {
    if (!study?.slug || study.thumbnail?.externalLink) continue;
    caseStudySlugs.add(study.slug);
    caseStudyEntries.push(
      entry(`/case-study/${study.slug}`, {
        priority: 0.64,
        changeFrequency: "monthly",
        lastModified: study.updatedAt || study.publishedAt || study.createdAt,
      })
    );
  }

  for (const campaign of campaigns) {
    if (!campaign?.slug || caseStudySlugs.has(campaign.slug)) continue;
    caseStudyEntries.push(
      entry(`/case-study/${campaign.slug}`, {
        priority: 0.64,
        changeFrequency: "monthly",
        lastModified:
          campaign.updatedAt || campaign.publishedAt || campaign.createdAt,
      })
    );
  }

  return [...staticEntries, ...blogEntries, ...authorEntries, ...caseStudyEntries];
}
