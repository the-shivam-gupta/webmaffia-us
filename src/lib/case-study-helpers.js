import {
  buildBannerCta,
  getBlog,
  getCaseStudyThumbnails,
  getStrapiAssetUrl,
  getStrapiImageUrl,
  rewriteStrapiHtmlUrls,
} from "@/lib/strapiPage";

const FALLBACK_WORK_IMAGE = "/assets/images/work/listing/afcon_work.webp";

export function toCaseStudyItem(entry) {
  const thumb = entry.thumbnail;
  const workTitle = thumb?.workTitle?.map((t) => t.title).join(" - ") ?? "";
  const imageUrl = thumb?.image ? getStrapiImageUrl(thumb.image) : "";
  const url = thumb?.externalLink ? (thumb.link || "#") : `/case-study/${entry.slug}`;
  return {
    name: thumb?.heading ?? entry.pageName,
    title: workTitle,
    type: workTitle,
    url,
    image: imageUrl || FALLBACK_WORK_IMAGE,
  };
}

function byInternalFirst(a, b) {
  return Number(!!a.thumbnail?.externalLink) - Number(!!b.thumbnail?.externalLink);
}

// Lowest CMS rank wins; a missing / non-numeric rank goes last.
function toRank(value) {
  const n = Number(value);
  return value !== null && value !== "" && Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

// Rank of a case study for the given tag(s): the lowest `thumbnail.latestWork`
// number whose service (serviceOrder.title) is one of them.
function serviceRank(entry, wantedTags) {
  let best = Number.POSITIVE_INFINITY;
  for (const row of entry.thumbnail?.latestWork ?? []) {
    const title = row?.serviceOrder?.title?.toLowerCase();
    if (title && wantedTags.includes(title)) best = Math.min(best, toRank(row.order));
  }
  return best;
}

// Position (in the service's CMS tag order) of the first tag this case study
// carries; the earlier the tag, the higher the priority. No match -> last.
function tagPriority(entry, wantedTags) {
  const entryTags = (entry.thumbnail?.workTitle ?? [])
    .map((t) => t.title?.toLowerCase())
    .filter(Boolean);
  const index = wantedTags.findIndex((tag) => entryTags.includes(tag));
  return index === -1 ? Number.POSITIVE_INFINITY : index;
}

// Order for a service's slider. `wantedTags` is in the service's CMS tag order:
//   1. the tag it matches first (tag placement = priority),
//   2. its `latestWork` number for that tag,
//   3. the global `thumbnail.order`,
//   4. internal case studies before external ones.
function byServiceOrder(wantedTags) {
  const keyOf = (entry) => {
    const priority = tagPriority(entry, wantedTags);
    const rank =
      priority === Number.POSITIVE_INFINITY
        ? Number.POSITIVE_INFINITY
        : serviceRank(entry, [wantedTags[priority]]);
    return { priority, rank };
  };
  return (a, b) => {
    const keyA = keyOf(a);
    const keyB = keyOf(b);
    if (keyA.priority !== keyB.priority) return keyA.priority < keyB.priority ? -1 : 1;
    if (keyA.rank !== keyB.rank) return keyA.rank < keyB.rank ? -1 : 1;
    const orderA = toRank(a.thumbnail?.order);
    const orderB = toRank(b.thumbnail?.order);
    if (orderA !== orderB) return orderA < orderB ? -1 : 1;
    return byInternalFirst(a, b);
  };
}

function matchesCategory(entry, wantedTags) {
  const entryTags = (entry.thumbnail?.workTitle ?? [])
    .map((t) => t.title?.toLowerCase())
    .filter(Boolean);
  return wantedTags.some((tag) => entryTags.includes(tag));
}

/**
 * Fetches live case studies from Strapi and picks the ones most relevant to a
 * service page, so "Latest work" no longer shows the same hardcoded pair on
 * every service. `categories` comes from the service's CMS `workTitle` tags
 * and should match the case study's thumbnail workTitle tags (e.g. "Website
 * Design", "Development", "SEO", "Social Media").
 *
 * Some services' `workTitle` tags (e.g. "Content Marketing", "AI") don't
 * correspond to any real case-study tag — for those, `fallbackCategories`
 * kicks in only when `categories` matched nothing, rather than every
 * service falling through to generic "top overall" case studies.
 */
export async function getLatestWorkItems(
  limit = 2,
  categories = [],
  fallbackCategories = ["Website Design", "Development"],
  matchedOnly = false
) {
  try {
    const caseStudies = await getCaseStudyThumbnails();
    const eligible = caseStudies.filter((entry) => entry?.thumbnail?.image);

    let matched = [];
    let sortTags = [];
    if (categories.length) {
      const wantedTags = categories.map((tag) => tag.toLowerCase());
      matched = eligible.filter((entry) => matchesCategory(entry, wantedTags));
      sortTags = wantedTags;
    }

    if (!matched.length && fallbackCategories.length) {
      const fallbackTags = fallbackCategories.map((tag) => tag.toLowerCase());
      matched = eligible.filter((entry) => matchesCategory(entry, fallbackTags));
      sortTags = fallbackTags;
    }

    const compare = byServiceOrder(sortTags);
    matched.sort(compare);
    // `matchedOnly`: just the relevant projects, no generic filler after them
    // (unless nothing matched at all, so the section never renders empty).
    const rest =
      matchedOnly && matched.length
        ? []
        : eligible.filter((entry) => !matched.includes(entry)).sort(compare);

    return [...matched, ...rest].slice(0, limit).map(toCaseStudyItem);
  } catch (e) {
    console.error("Failed to fetch latest work case studies:", e);
    return [];
  }
}

function matchesBlogCategory(post, wantedTags) {
  const postTags = (post.workTitle ?? [])
    .map((t) => t.title?.toLowerCase())
    .filter(Boolean);
  return wantedTags.some((tag) => postTags.includes(tag));
}

/**
 * Fetches live blog posts and picks the ones tagged with a service's CMS
 * `blogTitle` categories (e.g. "SEO"), for the "Blog" section on
 * service pages. Mirrors getLatestWorkItems' category-matching approach.
 * Falls back to the most recent posts (any category) when nothing matches,
 * so the section never renders empty once a service opts into it.
 */
export async function getLatestBlogItems(limit = 3, categories = []) {
  try {
    const posts = await getBlog();
    const eligible = posts.filter((post) => post?.image);

    let matched = [];
    if (categories.length) {
      const wantedTags = categories.map((tag) => tag.toLowerCase());
      matched = eligible.filter((post) => matchesBlogCategory(post, wantedTags));
    }

    const rest = eligible.filter((post) => !matched.includes(post));
    return [...matched, ...rest].slice(0, limit);
  } catch (e) {
    console.error("Failed to fetch latest blog posts:", e);
    return [];
  }
}

export function isRichTextDescription(description) {
  if (!description) return false;
  return /<[a-z][\s\S]*>/i.test(String(description).trim());
}

export function splitBannerTitle(heading) {
  const text = String(heading ?? "").trim();
  if (!text) return { line1: "" };

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    return {
      line1: lines[0],
      line2: lines.slice(1).join(" "),
    };
  }

  return { line1: text };
}

export function normalizeOverlayColor(color) {
  const value = String(color ?? "").trim();
  if (!value) return "";

  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
    return value;
  }

  if (/^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
    return `${value}`;
  }

  return "";
}

export function buildCaseStudyBannerData(banner) {
  if (!banner) return null;

  const desktopImage = banner.desktopImage;
  const mobileImage = banner.mobileImage;

  return {
    imagePosition: banner.imagePosition || "background",
    overlay: Boolean(banner.overlay),
    overlayColor: normalizeOverlayColor(banner.overlayColor),
    priority: true,
    unoptimized: true,
    subheading: banner.tagLine
      ? { enabled: true, text: banner.tagLine }
      : undefined,
    title: splitBannerTitle(banner.heading),
    subtitle: banner.subHeading
      ? { enabled: true, text: banner.subHeading }
      : undefined,
    description: banner.description?.trim() ?? "",
    cta: buildBannerCta(banner),
    images: {
      banner: desktopImage
        ? {
            url: getStrapiImageUrl(desktopImage),
            alt: desktopImage.alternativeText || "",
            width: desktopImage.width ?? 1920,
            height: desktopImage.height ?? 981,
          }
        : undefined,
      bannerMobile: mobileImage
        ? {
            url: getStrapiImageUrl(mobileImage),
            alt: mobileImage.alternativeText || "",
          }
        : undefined,
    },
  };
}

export function extractTrailingOutro(content) {
  const outroMatch = content.match(/\n\s*\n(?!\s*-)([\s\S]+)$/);

  if (!outroMatch) {
    return { content, outro: "" };
  }

  return {
    content: content.slice(0, outroMatch.index).trim(),
    outro: outroMatch[1].trim(),
  };
}

export function parseSimpleBulletItems(description) {
  if (!description) return { intro: "", items: [], outro: "" };

  const { content, outro } = extractTrailingOutro(description.trim());
  const parts = content.split(/(?:^|\n)\s*-\s+/);

  if (parts.length <= 1) {
    return { intro: content, items: [], outro };
  }

  return {
    intro: parts[0].trim(),
    items: parts.slice(1).map((item) => item.trim()).filter(Boolean),
    outro,
  };
}

export function parseTitledBulletItems(description) {
  if (!description) return { items: [], outro: "" };

  const { content, outro } = extractTrailingOutro(description.trim());
  const items = content
    .split(/(?:^|\n)-\s+/)
    .slice(1)
    .map((block) => {
      const lines = block.trim().split("\n");
      const title = lines[0]?.trim() ?? "";
      const body = lines.slice(1).join(" ").trim();
      return { title, body };
    })
    .filter((item) => item.title || item.body);

  return { items, outro };
}

export function isSolutionBlock(block, index) {
  return index > 0 || /solution|result|strategy/i.test(block.heading ?? "");
}

export function mapStrapiMediaAsset(asset, fallbackAlt = "") {
  if (!asset?.url) return null;

  const mime = asset.mime ?? "";
  const ext = asset.ext ?? "";

  return {
    src: getStrapiImageUrl(asset),
    alt: asset.alternativeText || fallbackAlt,
    width: asset.width,
    height: asset.height,
    unoptimized: mime === "image/svg+xml" || ext === ".svg",
  };
}

export function mapStrapiChartSlide(asset, fallbackAlt = "SEO growth chart") {
  const mapped = mapStrapiMediaAsset(asset, fallbackAlt);
  if (!mapped) return null;

  const candidates = new Map();

  const registerCandidate = (item) => {
    if (!item?.url || !item?.width) return;

    const url = getStrapiImageUrl(item);
    if (!url) return;

    const existing = candidates.get(url);
    if (!existing || item.width > existing.width) {
      candidates.set(url, { url, width: item.width });
    }
  };

  registerCandidate(asset);
  Object.values(asset.formats ?? {}).forEach(registerCandidate);

  const srcSet = [...candidates.values()]
    .sort((a, b) => b.width - a.width)
    .map(({ url, width }) => `${url} ${width}w`)
    .join(", ");

  if (srcSet) {
    mapped.srcSet = srcSet;
  }

  return mapped;
}

export function mapCaseStudySections(sections = []) {
  return sections.map((section) => {
    if (section.__component === "case-study.seo") {
      return {
        type: "seo",
        heading: section.heading,
        subHeading: section.subHeading,
        description: section.description,
        chartSlides: (section.graphs ?? [])
          .map((graph) => mapStrapiChartSlide(graph, "SEO growth chart"))
          .filter(Boolean),
      };
    }

    if (section.__component === "case-study.creatives") {
      const instagramUrl = section.button?.href ?? "";

      return {
        type: "creatives",
        heading: section.heading,
        instagramUrl,
        instagramLinkText: section.button?.title ?? "Check the On Instagram",
        posts: (section.posts ?? [])
          .map((post, index) =>
            mapStrapiMediaAsset(
              post.media ?? post.image ?? (post.url ? post : null),
              `Creative post ${index + 1}`
            )
          )
          .filter(Boolean),
        reels: (section.reels ?? [])
          .map((reel, index) => {
            const poster = mapStrapiMediaAsset(
              reel.poster ?? reel.thumbnail ?? reel.image,
              `Creative reel ${index + 1}`
            );
            const videoUrl = getStrapiAssetUrl(reel.video ?? reel.media);

            if (!poster && !videoUrl) return null;

            return {
              src: poster?.src ?? "",
              alt: reel.title || poster?.alt || `Creative reel ${index + 1}`,
              video: videoUrl || undefined,
            };
          })
          .filter(Boolean),
      };
    }

    return null;
  }).filter(Boolean);
}

export function normalizeCaseStudy(caseStudy) {
  return {
    slug: caseStudy.slug,
    pageName: caseStudy.pageName,
    banner: buildCaseStudyBannerData(caseStudy.banner),
    contentBlocks: (caseStudy.contentBlock ?? []).map((block) => ({
      tagLine: block.tagLine,
      heading: block.heading,
      subHeading: block.subHeading,
      description: rewriteStrapiHtmlUrls(block.description),
      image: mapStrapiMediaAsset(block.image ?? block.sideImage ?? block.media),
    })),
    showcase: caseStudy.showcase
      ? {
          desktopImage: mapStrapiMediaAsset(caseStudy.showcase.desktopImage),
          mobileImage: mapStrapiMediaAsset(caseStudy.showcase.mobileImage),
          button: caseStudy.showcase.button,
        }
      : null,
    testimonial: caseStudy.testimonial
      ? {
          description: caseStudy.testimonial.description?.trim(),
          name: caseStudy.testimonial.name,
          designation: caseStudy.testimonial.designation,
          icon: mapStrapiMediaAsset(
            caseStudy.testimonial.icon,
            caseStudy.testimonial.name
          ),
        }
      : null,
    sections: mapCaseStudySections(caseStudy.sections),
  };
}
