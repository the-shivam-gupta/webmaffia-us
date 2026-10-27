import { DEFAULT_LOCALE, LOCALES, localizePath, normalizeLocale } from "@/lib/i18n";

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const FALLBACK_IMAGE = "/assets/images/blogs/blog_list_1.webp";

const MONTHS = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function getStrapiApiBaseUrl() {
    const raw = process.env.STRAPI_API_URL?.trim();
    if (!raw) return "";

    try {
        const url = new URL(raw);
        return url.origin;
    } catch {
        return raw.replace(/\/admin(?:\/.*)?$/i, "").replace(/\/$/, "");
    }
}

function getStrapiPublicBaseUrl() {
    const publicUrl =
        process.env.NEXT_PUBLIC_STRAPI_URL?.trim() ||
        process.env.STRAPI_PUBLIC_URL?.trim() ||
        getStrapiApiBaseUrl();

    return publicUrl.replace(/\/$/, "");
}

function normalizeStrapiAssetUrl(url) {
    if (!url) return "";

    const publicBase = getStrapiPublicBaseUrl();
    const localAssetPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;

    if (localAssetPattern.test(url) && publicBase) {
        try {
            const parsed = new URL(url);
            return `${publicBase}${parsed.pathname}${parsed.search}`;
        } catch {
            return url;
        }
    }

    if (url.startsWith("http")) return url;

    if (publicBase) {
        return `${publicBase}${url.startsWith("/") ? url : `/${url}`}`;
    }

    return url;
}

export function rewriteStrapiHtmlUrls(html) {
    if (!html) return html;

    const publicBase = getStrapiPublicBaseUrl();
    if (!publicBase) return html;

    return html.replace(
        /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/[^"'\s>]*)/gi,
        `${publicBase}$1`
    );
}

function slugify(text) {
    return String(text)
        .toLowerCase()
        .replace(/['']/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function resolveSlug(post) {
    const slug = post.slug?.trim();
    if (slug) return slug;
    return slugify(post.heading ?? "");
}

export function parseBlogDate(dateStr) {
    if (!dateStr) return 0;

    const match = String(dateStr).trim().match(/^(\d{1,2})\s+([A-Za-z]+)['']?(\d{2})$/);
    if (!match) {
        const parsed = Date.parse(dateStr);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    const [, day, monthStr, yearShort] = match;
    const month = MONTHS[monthStr.slice(0, 3).toLowerCase()];
    if (month === undefined) return 0;

    return new Date(2000 + Number(yearShort), month, Number(day)).getTime();
}

export function formatBlogDate(dateStr) {
    if (!dateStr) return "";
    return String(dateStr).trim();
}

export function getFirstParagraph(description) {
    if (!description) return "";

    const match = description.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const raw = match ? match[1] : description;

    return raw
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeBlogPost(post) {
    return {
        ...post,
        slug: resolveSlug(post),
        excerpt: post.excerpt ?? getFirstParagraph(post.description),
        readTime: post.readTime ?? post.timeToRead,
        description: rewriteStrapiHtmlUrls(post.description),
        image: post.image
            ? {
                ...post.image,
                url: normalizeStrapiAssetUrl(post.image.url),
            }
            : post.image,
    };
}

const BLOG_PAGE_SIZE = 100;

async function fetchBlogsPage(page, locale) {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(
        `${strapiBaseUrl}/api/blogs?populate=*&locale=${encodeURIComponent(locale)}&pagination[page]=${page}&pagination[pageSize]=${BLOG_PAGE_SIZE}`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(STRAPI_FETCH_TIMEOUT_MS),
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch blogs");
    }
    return response.json();
}

async function fetchBlogsRaw(locale) {
    const firstPage = await fetchBlogsPage(1, locale);
    const entries = firstPage.data ?? [];
    const pageCount = firstPage.meta?.pagination?.pageCount ?? 1;

    if (pageCount <= 1) {
        return entries;
    }

    const remainingPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
            fetchBlogsPage(index + 2, locale)
        )
    );

    for (const page of remainingPages) {
        entries.push(...(page.data ?? []));
    }

    return entries;
}

function sortedBlogPosts(entries) {
    return entries
        .map(normalizeBlogPost)
        .sort((a, b) => parseBlogDate(b.date) - parseBlogDate(a.date));
}

/**
 * Blogs for `locale`, plus whether they are English content served in place of
 * an empty translation. A non-English request with no entries falls back to English.
 */
export async function getBlogWithMeta(locale = DEFAULT_LOCALE) {
    const lang = normalizeLocale(locale);
    try {
        let entries = await fetchBlogsRaw(lang);
        let isFallback = false;

        if (!entries.length && lang !== DEFAULT_LOCALE) {
            entries = await fetchBlogsRaw(DEFAULT_LOCALE);
            isFallback = true;
        }

        return { posts: sortedBlogPosts(entries), isFallback };
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        return { posts: [], isFallback: false };
    }
}

export async function getBlog(locale = DEFAULT_LOCALE) {
    return (await getBlogWithMeta(locale)).posts;
}

/**
 * Blogs that really exist in each locale (no English fallback), keyed by locale.
 * Used for hreflang, the sitemap and static params.
 */
export async function getBlogsByLocale() {
    const result = {};
    await Promise.all(
        LOCALES.map(async (lang) => {
            try {
                result[lang] = sortedBlogPosts(await fetchBlogsRaw(lang));
            } catch (error) {
                console.error(`Failed to fetch ${lang} blogs:`, error);
                result[lang] = [];
            }
        })
    );
    return result;
}

function matchesBlogSlug(post, slug) {
    return post.slug === slug || post.documentId === slug;
}

/**
 * A post by slug in `locale`. If that locale has no translation of it, the
 * English post is returned instead with `isFallback: true`.
 */
export async function getBlogBySlug(slug, locale = DEFAULT_LOCALE) {
    const lang = normalizeLocale(locale);
    const { posts, isFallback } = await getBlogWithMeta(lang);
    const found = posts.find((post) => matchesBlogSlug(post, slug));
    if (found) return { ...found, isFallback };

    if (lang !== DEFAULT_LOCALE && !isFallback) {
        const english = (await getBlog(DEFAULT_LOCALE)).find((post) =>
            matchesBlogSlug(post, slug)
        );
        if (english) return { ...english, isFallback: true };
    }

    return null;
}

export function getRelatedStrapiPosts(slug, count = 2, locale = DEFAULT_LOCALE) {
    const lang = normalizeLocale(locale);
    return getBlog(lang).then((posts) =>
        posts
            .filter((post) => post.slug !== slug)
            .slice(0, count)
            .map((post) => ({
                href: localizePath(lang, `/blog/${post.slug}`),
                title: post.heading?.replace(/\n/g, " ") ?? "",
                excerpt: post.excerpt,
                date: formatBlogDate(post.date),
                readTime: post.readTime,
                image: getStrapiImageUrl(post.image),
                imageAlt: post.image?.alternativeText || "",
                category: getBlogCategories(post)[0] ?? null,
            }))
    );
}

function normalizeAuthor(author) {
    const blogs = (author.blogs ?? [])
        .map(normalizeBlogPost)
        .sort((a, b) => parseBlogDate(b.date) - parseBlogDate(a.date));

    return {
        ...author,
        slug: author.slug?.trim() || slugify(author.name ?? ""),
        profileImage: author.profileImage
            ? {
                ...author.profileImage,
                url: normalizeStrapiAssetUrl(author.profileImage.url),
            }
            : null,
        blogs,
    };
}

export async function getAuthors() {
    try {
        const strapiBaseUrl = getStrapiApiBaseUrl();
        if (!strapiBaseUrl) {
            throw new Error("STRAPI_API_URL is not configured");
        }

        const response = await fetch(
            `${strapiBaseUrl}/api/authors?populate[profileImage]=true&populate[blogs][populate]=image&pagination[pageSize]=100`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_TOKEN}`,
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
                signal: AbortSignal.timeout(STRAPI_FETCH_TIMEOUT_MS),
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch authors (${response.status})`);
        }

        const data = await response.json();
        return (data.data ?? []).map(normalizeAuthor);
    } catch (error) {
        console.error("Failed to fetch authors:", error);
        return [];
    }
}

export async function getAuthorBySlug(slug) {
    const authors = await getAuthors();
    return authors.find((author) => author.slug === slug) ?? null;
}

/** First author linked to a blog post, as `{ name, slug, designation }`. */
export function getPostAuthor(post) {
    const author = post?.authors?.[0];
    if (!author?.name) return null;

    return {
        name: author.name,
        slug: author.slug?.trim() || slugify(author.name),
        designation: author.designation ?? "",
    };
}

export function getStrapiAssetUrl(asset) {
    if (!asset?.url) return "";

    return normalizeStrapiAssetUrl(asset.url) || "";
}

export function getStrapiImageUrl(image) {
    if (!image) return FALLBACK_IMAGE;

    const url = image.url;
    if (!url) return FALLBACK_IMAGE;

    return normalizeStrapiAssetUrl(url) || FALLBACK_IMAGE;
}

/**
 * Maps a CMS `banner` component's `button`/`href` fields onto the
 * `{ text, href }` shape Banner.js expects, shared across every page that
 * renders a CMS-driven banner (services, about, awards, career, clients,
 * case studies). Only returns a value when both fields are populated, so
 * Banner.js can decide to render the CTA button or omit it entirely.
 */
export function buildBannerCta(rawBanner) {
    const text = rawBanner?.button?.trim();
    const href = rawBanner?.href?.trim();
    return text && href ? { text, href } : undefined;
}

/**
 * Same as buildBannerCta, for the CMS banner's `secondaryButton` component
 * (`title` + `href`).
 */
export function buildBannerSecondaryCta(rawBanner) {
    const text = rawBanner?.secondaryButton?.title?.trim();
    const href = rawBanner?.secondaryButton?.href?.trim();
    return text && href ? { text, href } : undefined;
}

/**
 * Both banner CTAs as `{ cta, secondaryCta }`, ready to spread into the
 * data object passed to <Banner>.
 */
export function buildBannerCtas(rawBanner) {
    return {
        cta: buildBannerCta(rawBanner),
        secondaryCta: buildBannerSecondaryCta(rawBanner),
    };
}

/**
 * Splits a banner title into `{ line1, line2?, line3? }`, honouring explicit
 * newlines and otherwise balancing words across up to `maxLines` lines.
 */
export function splitBannerTitle(text, maxLines = 3) {
    const explicit = String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    if (explicit.length > 1) {
        return {
            line1: explicit[0],
            line2: explicit[1],
            ...(explicit[2] ? { line3: explicit.slice(2).join(" ") } : {}),
        };
    }

    const words = String(text || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return { line1: "" };

    const totalLen = words.reduce((sum, word, i) => sum + word.length + (i ? 1 : 0), 0);
    const targetPerLine = totalLen / Math.min(maxLines, words.length);

    const lines = [];
    let current = [];
    let currentLen = 0;

    for (const word of words) {
        const wordLen = word.length + (current.length ? 1 : 0);
        if (
            current.length &&
            currentLen + wordLen > targetPerLine &&
            lines.length < maxLines - 1
        ) {
            lines.push(current.join(" "));
            current = [];
            currentLen = 0;
        }
        currentLen += wordLen;
        current.push(word);
    }
    if (current.length) lines.push(current.join(" "));

    return {
        line1: lines[0] || "",
        ...(lines[1] ? { line2: lines[1] } : {}),
        ...(lines[2] ? { line3: lines[2] } : {}),
    };
}

const HOME_POPULATE = [
    "populate[banner][populate]=*",
    "populate[sections][on][services.statistics-bar][populate][statisticsBar][populate]=*",
    "populate[sections][on][services.services][populate][cards][populate]=*",
    "populate[sections][on][services.services][populate][button]=*",
    "populate[sections][on][services.work][populate][cards][populate]=*",
    "populate[sections][on][services.work][populate][button]=*",
    "populate[sections][on][services.projects][populate][cards][populate]=*",
    "populate[sections][on][services.projects][populate][button]=*",
    "populate[sections][on][services.industries][populate][cards][populate]=*",
    "populate[sections][on][services.testimonial][populate]=*",
    "populate[sections][on][services.trophies][populate][cards][populate]=*",
    "populate[sections][on][services.trophies][populate][button]=*",
    "populate[sections][on][services.blogs][populate][button]=*",
].join("&");

async function fetchHomeRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(
        `${strapiBaseUrl}/api/homepage?${HOME_POPULATE}`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(STRAPI_FETCH_TIMEOUT_MS),
        }
    );

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch home (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getHome() {
    try {
        return await fetchHomeRaw();
    } catch (error) {
        console.error("Failed to fetch home:", error);
        return null;
    }
}

/**
 * Reads the CMS `seo` component (`metaTitle`, `metaDescription`, `canonical`,
 * `keyword`) into trimmed values; any empty field comes back `undefined` so
 * callers can fall back with `??`.
 */
export function getSeoFields(seo) {
    const clean = (value) => value?.trim() || undefined;

    return {
        title: clean(seo?.metaTitle),
        description: clean(seo?.metaDescription),
        canonical: clean(seo?.canonical),
        keywords: clean(seo?.keyword),
    };
}

const CASE_STUDY_POPULATE = [
    "populate[banner][populate]=*",
    "populate[contentBlock][populate][image][populate]=*",
    "populate[showcase][populate]=*",
    "populate[testimonial][populate]=*",
    "populate[thumbnail][populate]=*",
    "populate[sections][on][case-study.seo][populate][graphs][populate]=*",
    "populate[sections][on][case-study.creatives][populate][reels][populate]=*",
    "populate[sections][on][case-study.creatives][populate][posts][populate][media][populate]=*",
    "populate[sections][on][case-study.creatives][populate][button]=*",
].join("&");

const CASE_STUDY_PAGE_SIZE = 100;
const STRAPI_FETCH_TIMEOUT_MS = 8000;

async function fetchCaseStudiesPage(page) {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(
        `${strapiBaseUrl}/api/case-studies?${CASE_STUDY_POPULATE}&pagination[page]=${page}&pagination[pageSize]=${CASE_STUDY_PAGE_SIZE}`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(STRAPI_FETCH_TIMEOUT_MS),
        }
    );

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch case studies (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    return response.json();
}

async function fetchCaseStudiesRaw() {
    const firstPage = await fetchCaseStudiesPage(1);
    const entries = firstPage.data ?? [];
    const pageCount = firstPage.meta?.pagination?.pageCount ?? 1;

    if (pageCount <= 1) {
        return entries;
    }

    const remainingPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
            fetchCaseStudiesPage(index + 2)
        )
    );

    for (const page of remainingPages) {
        entries.push(...(page.data ?? []));
    }

    return entries;
}

export async function getCaseStudies() {
    try {
        return await fetchCaseStudiesRaw();
    } catch (error) {
        console.error("Failed to fetch case studies:", error);
        return [];
    }
}

const CASE_STUDY_THUMBNAIL_POPULATE = "populate[thumbnail][populate]=*";

async function fetchCaseStudyThumbnailsPage(page) {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(
        `${strapiBaseUrl}/api/case-studies?${CASE_STUDY_THUMBNAIL_POPULATE}&pagination[page]=${page}&pagination[pageSize]=${CASE_STUDY_PAGE_SIZE}`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 300 },
            signal: AbortSignal.timeout(STRAPI_FETCH_TIMEOUT_MS),
        }
    );

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch case study thumbnails (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    return response.json();
}

/**
 * Lightweight alternative to getCaseStudies() for listing/preview use cases
 * (e.g. the /case-study grid, "Latest work" on service pages) that only need
 * the thumbnail + slug, not the full detail-page payload (banner, sections,
 * testimonial, showcase, contentBlock, ...).
 */
export async function getCaseStudyThumbnails() {
    const firstPage = await fetchCaseStudyThumbnailsPage(1);
    const entries = firstPage.data ?? [];
    const pageCount = firstPage.meta?.pagination?.pageCount ?? 1;

    if (pageCount <= 1) {
        return entries;
    }

    const remainingPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
            fetchCaseStudyThumbnailsPage(index + 2)
        )
    );

    for (const page of remainingPages) {
        entries.push(...(page.data ?? []));
    }

    return entries;
}

export async function getCaseStudyBySlug(slug) {
    const caseStudies = await getCaseStudies();
    return (
        caseStudies.find(
            (entry) => entry.slug === slug || entry.documentId === slug
        ) ?? null
    );
}

function mapTestimonial(entry) {
    const name = entry.name?.trim() ?? "";
    const icon = entry.icon;

    return {
        id: entry.documentId ?? String(entry.id),
        quote: entry.description?.trim() ?? "",
        author: name,
        role: entry.designation?.trim() ?? "",
        speaker: name.split(/\s+/)[0]?.toUpperCase() ?? "",
        logo: icon?.url
            ? {
                src: getStrapiImageUrl(icon),
                w: icon.width || 114,
                h: icon.height || 114,
            }
            : null,
    };
}

async function fetchTestimonialsRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(
        `${strapiBaseUrl}/api/testimonials?populate=*&sort=createdAt:asc`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
        }
    );

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch testimonials (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getTestimonials() {
    try {
        const entries = await fetchTestimonialsRaw();
        return entries.map(mapTestimonial).filter((entry) => entry.quote);
    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        return [];
    }
}

async function fetchCampaignsRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(`${strapiBaseUrl}/api/campaigns?populate[seo]=true&populate[poster][populate]=*&populate[video][populate]=*&populate[recognition][populate]=*`, {
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch campaigns (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getCampaigns() {
    return fetchCampaignsRaw();
}

export async function getCampaignBySlug(slug) {
    const campaigns = await getCampaigns();
    return (
        campaigns.find(
            (entry) => entry.slug === slug || entry.documentId === slug
        ) ?? null
    );
}

async function fetchAwardsRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(`${strapiBaseUrl}/api/award?populate[banner][populate]=*&populate[card][populate]=*`, {
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch awards (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getAwards() {
    try {
        return await fetchAwardsRaw();
    } catch (error) {
        console.error("Failed to fetch awards:", error);
        return null;
    }
}

async function fetchAboutUsRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(`${strapiBaseUrl}/api/about-us?populate[banner][populate]=*&populate[whoWeAre][populate]=*`, {
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch about us (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getAboutUs() {
    try {
        return await fetchAboutUsRaw();
    } catch (error) {
        console.error("Failed to fetch about us:", error);
        return null;
    }
}

async function fetchServicesPageRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(
        `${strapiBaseUrl}/api/service?populate[banner][populate]=*`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
        }
    );

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch services page (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getServicesPage() {
    try {
        return await fetchServicesPageRaw();
    } catch (error) {
        console.error("Failed to fetch services page:", error);
        return null;
    }
}

const SERVICES_TECH_POPULATE = [
    "populate[banner][populate]=*",
    "populate[sections][on][services-tech.features][populate][designFeature][populate]=*",
    "populate[sections][on][services-tech.technology][populate][Items][populate][icon][populate]=*",
    "populate[sections][on][services-tech.introduction][populate]=*",
    "populate[sections][on][services-tech.why-choose-us][populate][cta][populate]=*",
    "populate[sections][on][services-tech.awards][populate][awardsList][populate]=*",
    "populate[sections][on][services-tech.our-process][populate]=*",
    "populate[sections][on][services-tech.industries-we-serve][populate][lists][populate][icons][populate]=*",
    "populate[sections][on][services-tech.tools-we-use][populate][lists][populate][icons][populate]=*",
    "populate[sections][on][services-tech.blogs][populate][blogTitle][populate]=*",
    "populate[sections][on][services-tech.fa-qs][populate]=*",
    "populate[otherServices][populate][services][populate]=*",
    "populate[workTitle][populate]=*",
    "populate[seo][populate]=*",
].join("&");
const SERVICES_TECH_PAGE_SIZE = 100;

async function fetchServicesTechRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(
        `${strapiBaseUrl}/api/services-teches?${SERVICES_TECH_POPULATE}&pagination[pageSize]=${SERVICES_TECH_PAGE_SIZE}`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(STRAPI_FETCH_TIMEOUT_MS),
        }
    );

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch services tech (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data ?? [];
}

/**
 * Service detail entries from Strapi collection `services-teches`
 * (banner content per service, keyed by `slug`, e.g. "digital-strategy").
 */
export async function getServicesTech() {
    try {
        return await fetchServicesTechRaw();
    } catch (error) {
        console.error("Failed to fetch services tech:", error);
        return [];
    }
}

export async function getServiceTechBySlug(slug) {
    const entries = await getServicesTech();
    return entries.find((entry) => entry.slug === slug) ?? null;
}

async function fetchCareerRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(`${strapiBaseUrl}/api/career?populate[banner][populate]=*&populate[career][populate]=*`, {
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch career (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getCareer() {
    try {
        return await fetchCareerRaw();
    } catch (error) {
        console.error("Failed to fetch career:", error);
        return null;
    }
}

async function fetchClientsRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const allClients = [];
    let page = 1;
    let pageCount = 1;

    while (page <= pageCount) {
        const response = await fetch(
            `${strapiBaseUrl}/api/clients?pLevel=10&populate=*&pagination[page]=${page}&pagination[pageSize]=100`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_TOKEN}`,
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            const errorBody = await response.text().catch(() => "");
            throw new Error(
                `Failed to fetch clients (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
            );
        }

        const data = await response.json();
        allClients.push(...data.data);
        pageCount = data.meta?.pagination?.pageCount ?? 1;
        page += 1;
    }

    return allClients;
}

export async function getClients() {
    try {
        return await fetchClientsRaw();
    } catch (error) {
        console.error("Failed to fetch clients:", error);
        return null;
    }
}

async function fetchClientBannerRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(
        `${strapiBaseUrl}/api/client-banner?populate[banner][populate]=*`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
        }
    );

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch client banner (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getClientBanner() {
    try {
        return await fetchClientBannerRaw();
    } catch (error) {
        console.error("Failed to fetch client banner:", error);
        return null;
    }
}

async function fetchFooterRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(`${strapiBaseUrl}/api/footer?populate=*`, {
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch footer (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

export async function getFooter() {
    try {
        const raw = await fetchFooterRaw();
        if (!raw) return null;

        const SOCIAL_ICON_MAP = {
            X: { src: "/assets/images/footer/X.svg", alt: "X" },
            Facebook: { src: "/assets/images/footer/facebook.svg", alt: "Facebook" },
            Instagram: { src: "/assets/images/footer/instagram.svg", alt: "Instagram" },
            Youtube: { src: "/assets/images/footer/yt.svg", alt: "YouTube" },
            LinkedIn: { src: "/assets/images/footer/linkedIn.svg", alt: "LinkedIn" },
        };

        if (raw.socialLinks) {
            raw.socialLinks = raw.socialLinks.map((link) => {
                const icon = SOCIAL_ICON_MAP[link.platform];
                if (!icon) return link;
                return { ...link, iconSrc: icon.src, iconAlt: icon.alt };
            });
        }

        return raw;
    } catch (error) {
        console.error("Failed to fetch footer:", error);
        return null;
    }
}

async function fetchCitiesRaw() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    if (!strapiBaseUrl) {
        throw new Error("STRAPI_API_URL is not configured");
    }

    const response = await fetch(`${strapiBaseUrl}/api/city?populate=*`, {
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Failed to fetch cities (${response.status})${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`
        );
    }

    const data = await response.json();
    return data.data;
}

/**
 * Location entries from Strapi single-type `city`.
 * @returns {Promise<Array<{ id: number, name: string, citySlug: string }>>}
 */
export async function getCities() {
    try {
        const raw = await fetchCitiesRaw();
        const cities = raw?.city;
        if (!Array.isArray(cities)) return [];

        return cities
            .filter((city) => city?.name && city?.citySlug)
            .map((city) => ({
                id: city.id,
                name: String(city.name).trim(),
                citySlug: String(city.citySlug).trim().replace(/^\/+|\/+$/g, ""),
            }));
    } catch (error) {
        console.error("Failed to fetch cities:", error);
        return [];
    }
}

/** URL-safe slug for a blog category name, used in /blog?category=<slug>. */
export function categorySlug(title) {
    return String(title ?? "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** Category titles of a blog post (from its CMS `workTitle` tags). */
export function getBlogCategories(post) {
    return (post?.workTitle ?? [])
        .map((tag) => tag?.title?.trim())
        .filter(Boolean)
        .map((title) => ({ title, slug: categorySlug(title) }));
}

/** Every blog category with its post count, most-used first. */
export async function getAllBlogCategories(locale = DEFAULT_LOCALE) {
    const posts = await getBlog(locale);
    const counts = new Map();
    for (const post of posts) {
        for (const { title, slug } of getBlogCategories(post)) {
            const entry = counts.get(slug) ?? { title, slug, count: 0 };
            entry.count += 1;
            counts.set(slug, entry);
        }
    }
    return [...counts.values()].sort(
        (a, b) => b.count - a.count || a.title.localeCompare(b.title)
    );
}
