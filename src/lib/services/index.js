import { getHome, getServiceTechBySlug } from "@/lib/strapiPage";
import { buildSections } from "@/lib/homeSections";
import { buildServiceHero, buildServiceSections } from "@/lib/serviceContent";
import digitalStrategy from "@/lib/services/digital-strategy";
import websiteDesign from "@/lib/services/website-design-development-services";
import socialMedia from "@/lib/services/social-media-marketing-strategy";
import influencer from "@/lib/services/influencer-marketing";
import contentMarketing from "@/lib/services/content-marketing-strategy";
import appStoreOptimization from "@/lib/services/app-store-optimization";
import aiPowered from "@/lib/services/ai-powered-solutions-services";
import TOOL_ICONS from "@/lib/services/tool-icons";

// "Industries We Serve" and the tool logos are common to every service; they
// are read from this CMS entry.
const SHARED_SECTIONS_SOURCE = "search-engine-optimization-services";

// Services whose page content is static. Any slug not listed here (e.g.
// search-engine-optimization-services) keeps rendering from the CMS.
const STATIC_SERVICES = Object.fromEntries(
  [
    digitalStrategy,
    websiteDesign,
    socialMedia,
    influencer,
    contentMarketing,
    appStoreOptimization,
    aiPowered,
  ].map((service) => [service.slug, service])
);

// Tool name (as written in the HTML) -> title of the existing CMS logo, for
// names that do not already match a logo title once punctuation is ignored.
const normalize = (text) => String(text ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
const TOOL_ICON_ALIASES = Object.fromEntries(
  Object.entries({
    Semrush: "semrush-icon",
    Ahrefs: "ahref",
    "Google Search Console": "google-search-console-icon",
    "Looker Studio": "data-studio",
    GA4: "Google Analytics 4",
  }).map(([name, title]) => [normalize(name), normalize(title)])
);

export const STATIC_SERVICE_SLUGS = Object.keys(STATIC_SERVICES);

export function getStaticService(slug) {
  return STATIC_SERVICES[slug] ?? null;
}

/**
 * Builds the config ServiceDetailPage expects from a static service. The
 * banner image (desktop + mobile) and the banner subtitle are deliberately
 * read from the existing CMS entry so the current banner artwork is kept; the
 * statistics icons are borrowed from the CMS statistics bar in the same order.
 */
export async function getStaticServiceConfig(service) {
  const [cms, seo, home] = await Promise.all([
    getServiceTechBySlug(service.slug),
    getServiceTechBySlug(SHARED_SECTIONS_SOURCE),
    getHome(),
  ]);
  const seoTools = buildServiceSections(seo?.sections).find((s) => s.type === "tools");
  const iconByTitle = new Map(
    (seoTools?.items ?? [])
      .flatMap((group) => group.icons)
      .map((icon) => [normalize(icon.title), icon])
  );
  const sharedIndustries = buildServiceSections(seo?.sections).find(
    (s) => s.type === "industries"
  );
  const cmsHero = buildServiceHero(cms?.banner);
  // Same statistics bar as the homepage (14+ years, 175+ brands, 03 offices,
  // 30+ awards, ISO badge), read from the home CMS entry. The service's own
  // static stats are only a fallback if the home entry cannot be loaded.
  const homeStats = buildSections(home?.sections).find(
    (s) => s.type === "statistics"
  )?.stats;

  const cmsStats =
    buildServiceSections(cms?.sections).find((s) => s.type === "statistics")?.stats ?? [];

  const stats = homeStats?.length
    ? homeStats
    : service.stats.map((stat, i) => ({
        id: `stat-${i}`,
        ...stat,
        icon: cmsStats[i]?.icon ?? null,
      }));

  const sections = [
    { type: "statistics", dataSection: "service_statistics_0", stats },
    ...service.sections.flatMap((section) => {
      if (section.type === "tools") {
        // Logos only: keep each tool that has a logo in the CMS, drop the rest.
        const items = section.groups
          .map((group) => ({
            title: group.title,
            // CMS logo first, then our own icon (brand mark or generic glyph);
            // a name-only chip is the last resort.
            icons: [
              ...new Map(
                group.tools.map((tool) => {
                  const key = normalize(tool.name);
                  const icon =
                    iconByTitle.get(TOOL_ICON_ALIASES[key] ?? key) ??
                    (TOOL_ICONS[key]
                      ? { url: TOOL_ICONS[key], title: tool.name, alt: tool.name, width: 75, height: 75 }
                      : { url: null, title: tool.name, alt: tool.name });
                  return [icon.url ?? key, icon];
                })
              ).values(),
            ],
          }))
          .filter((group) => group.icons.length);
        return items.length ? [{ ...section, items }] : [];
      }
      if (!section.shared) return [section];
      return sharedIndustries
        ? [{ ...sharedIndustries, dataSection: section.dataSection }]
        : [];
    }),
  ];

  return {
    hero: {
      ...service.hero,
      subtitle: cmsHero.subtitle,
      image: cmsHero.image,
      imageWidth: cmsHero.imageWidth,
      imageHeight: cmsHero.imageHeight,
      mobileImage: cmsHero.mobileImage,
    },
    sections,
    otherServices: service.otherServices,
  };
}
