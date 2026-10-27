import { getCities, getServicesTech } from "@/lib/strapiPage";

const SITE_URL = "https://www.webmaffia.com";

function cleanHeadingTitle(banner, pageName) {
  const raw = banner?.subHeading?.trim() || pageName?.trim() || "";
  return raw.replace(/\s*\n\s*/g, " ").trim();
}

/**
 * Builds the service registry entry (`slug`, `headingTitle`,
 * `workCategories`, SEO `metadata`) from a `services-teches` CMS entry, so a
 * new service just needs to be created in Strapi — no code change needed
 * for it to get a working /services/<slug> page. `workTitle` and `seo` are
 * CMS fields (see getServiceRenderConfig for the rest of the page content).
 */
function buildServiceEntry(entry) {
  const headingTitle = cleanHeadingTitle(entry.banner, entry.pageName);
  const workCategories = (entry.workTitle ?? [])
    .map((tag) => tag.title?.trim())
    .filter(Boolean);

  return {
    slug: entry.slug,
    headingTitle,
    workCategories,
    metadata: {
      title: entry.seo?.metaTitle?.trim() || `${headingTitle} | Webmaffia`,
      description: entry.seo?.metaDescription?.trim() || "",
    },
  };
}

/**
 * Live list of services (for /services listing metadata, routing,
 * sitemap). Sourced from Strapi's `services-teches` collection rather than
 * a hardcoded array — a service only shows up here once it's published in
 * the CMS.
 */
export async function getAllServiceEntries() {
  const entries = await getServicesTech();
  return entries.map(buildServiceEntry);
}

export async function getServiceEntryBySlug(slug) {
  const services = await getAllServiceEntries();
  return services.find((service) => service.slug === slug) ?? null;
}

export function formatCityDisplayName(name) {
  return String(name)
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function buildServiceLocationPath(serviceSlug, citySlug) {
  return `${serviceSlug}-${citySlug}`;
}

export function resolveServiceLocation(slug, services, cities) {
  if (!slug || !Array.isArray(cities) || cities.length === 0) return null;

  const sortedServices = [...services].sort(
    (a, b) => b.slug.length - a.slug.length
  );

  for (const service of sortedServices) {
    for (const city of cities) {
      const path = buildServiceLocationPath(service.slug, city.citySlug);
      if (path === slug) {
        return { service, city };
      }
    }
  }

  return null;
}

export function withCityInHeading(config, headingTitle, cityName) {
  const cityLabel = formatCityDisplayName(cityName);

  return {
    ...config,
    hero: {
      ...config.hero,
      title: `${headingTitle} in ${cityLabel}`,
    },
  };
}

export async function getServiceLocationMatch(slug) {
  const [services, cities] = await Promise.all([
    getAllServiceEntries(),
    getCities(),
  ]);
  return resolveServiceLocation(slug, services, cities);
}

export async function getAllServiceLocationPaths() {
  const [services, cities] = await Promise.all([
    getAllServiceEntries(),
    getCities(),
  ]);
  const paths = [];

  for (const service of services) {
    for (const city of cities) {
      paths.push({
        serviceLocation: buildServiceLocationPath(service.slug, city.citySlug),
        serviceSlug: service.slug,
        citySlug: city.citySlug,
        cityName: city.name,
      });
    }
  }

  return paths;
}

export function buildServiceLocationMetadata(service, city, path) {
  const cityLabel = formatCityDisplayName(city.name);
  const baseTitle = service.metadata?.title ?? `${service.headingTitle} | Webmaffia`;
  const title = baseTitle.includes(cityLabel)
    ? baseTitle
    : `${service.headingTitle} in ${cityLabel} | Webmaffia`;

  const baseDescription = service.metadata?.description ?? "";
  const description = baseDescription
    ? `${baseDescription} Serving ${cityLabel}.`
    : `${service.headingTitle} services in ${cityLabel}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${path}`,
    },
  };
}

export { SITE_URL };
