import {
  getAllServiceEntries,
  getAllServiceLocationPaths,
} from "@/lib/serviceLocations";
import { getCampaigns, getCaseStudies } from "@/lib/strapiPage";

const SITE_URL = "https://www.webmaffia.com";

function toUrl(path) {
  const normalized = path === "/" ? "" : path.replace(/\/$/, "");
  return `${SITE_URL}${normalized}`;
}

function entry(path, { priority = 0.64, changeFrequency = "weekly", lastModified } = {}) {
  return {
    url: toUrl(path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
  };
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
  const [caseStudies, campaigns, services, locationPaths] = await Promise.all([
    safeFetch("case studies", getCaseStudies),
    safeFetch("campaigns", getCampaigns),
    safeFetch("services", getAllServiceEntries),
    safeFetch("service locations", getAllServiceLocationPaths),
  ]);

  const staticEntries = [
    entry("/", { priority: 1, changeFrequency: "weekly" }),
    entry("/services", { priority: 0.8, changeFrequency: "weekly" }),
    entry("/case-study", { priority: 0.8, changeFrequency: "weekly" }),
    ...services.map((s) =>
      entry(`/services/${s.slug}`, { priority: 0.8, changeFrequency: "monthly" })
    ),
    ...locationPaths.map(({ serviceLocation }) =>
      entry(`/services/${serviceLocation}`, { priority: 0.7, changeFrequency: "monthly" })
    ),
  ];

  const seen = new Set();
  const caseStudyEntries = [];
  for (const study of caseStudies) {
    if (!study?.slug || study.thumbnail?.externalLink) continue;
    seen.add(study.slug);
    caseStudyEntries.push(
      entry(`/case-study/${study.slug}`, {
        changeFrequency: "monthly",
        lastModified: study.updatedAt || study.publishedAt || study.createdAt,
      })
    );
  }
  for (const c of campaigns) {
    if (!c?.slug || seen.has(c.slug)) continue;
    caseStudyEntries.push(
      entry(`/case-study/${c.slug}`, {
        changeFrequency: "monthly",
        lastModified: c.updatedAt || c.publishedAt || c.createdAt,
      })
    );
  }

  return [...staticEntries, ...caseStudyEntries];
}
