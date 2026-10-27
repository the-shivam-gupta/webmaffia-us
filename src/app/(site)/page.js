import HomePage from "@/components/HomePage";
import JsonLd from "@/components/JsonLd";
import {
  buildBannerCtas,
  formatBlogDate,
  getBlog,
  getFooter,
  getHome,
  getStrapiImageUrl,
  getTestimonials,
  splitBannerTitle,
} from "@/lib/strapiPage";
import { ORGANIZATION_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";

export const metadata = {
  alternates: {
    canonical: "https://www.webmaffia.com/",
  },
};

// Returns null when the CMS banner is missing or has no title; HomePage then
// renders no banner.
function buildHomeBannerData(rawBanner) {
  if (!rawBanner?.subHeading?.trim()) return null;

  let images;
  if (rawBanner.desktopImage?.url) {
    images = {
      banner: {
        url: getStrapiImageUrl(rawBanner.desktopImage),
        alt: rawBanner.desktopImage.alternativeText || "",
        width: rawBanner.desktopImage.width || 788,
        height: rawBanner.desktopImage.height || 693,
      },
    };
    if (rawBanner.mobileImage?.url) {
      images.bannerMobile = {
        url: getStrapiImageUrl(rawBanner.mobileImage),
        alt: rawBanner.mobileImage.alternativeText || "",
      };
    }
  }

  return {
    imagePosition: rawBanner.imagePosition || "right",
    overlay: rawBanner.overlay ?? undefined,
    overlayColor: rawBanner.overlayColor || undefined,
    subheading: rawBanner.heading
      ? { enabled: true, text: rawBanner.heading }
      : undefined,
    title: splitBannerTitle(rawBanner.subHeading),
    description: rawBanner.description || undefined,
    priority: true,
    ...buildBannerCtas(rawBanner),
    ...(images ? { images } : {}),
  };
}

function mapMedia(media, fallbackAlt = "") {
  if (!media?.url) return null;
  return {
    url: getStrapiImageUrl(media),
    alt: media.alternativeText || fallbackAlt,
    width: media.width || 100,
    height: media.height || 100,
  };
}

function mapButton(button) {
  const title = button?.title?.trim();
  const href = button?.href?.trim();
  return title && href ? { title, href } : null;
}

function mapHead(section) {
  return {
    tagline: section.tagline?.trim() || "",
    title: section.title?.trim() || "",
    description: section.description?.trim() || "",
  };
}

function mapStatistics(section) {
  return (section.statisticsBar ?? [])
    .map((stat) => ({
      id: stat.id,
      value: stat.value?.trim() || "",
      label: stat.label?.trim() || "",
      icon: mapMedia(stat.icon, stat.label),
    }))
    .filter((stat) => stat.value || stat.icon || stat.label);
}

// Turns the CMS dynamic zone into plain, serialisable section objects, in the
// order the editor arranged them. Unknown components are skipped.
function buildSections(rawSections) {
  return (rawSections ?? [])
    .map((section) => {
      const key = `${section.__component}-${section.id}`;

      switch (section.__component) {
        case "services.statistics-bar":
          return { key, type: "statistics", stats: mapStatistics(section) };
        case "services.services":
          return {
            key,
            type: "services",
            ...mapHead(section),
            button: mapButton(section.button),
            cards: (section.cards ?? []).map((card) => ({
              id: card.id,
              tagline: card.tagline?.trim() || "",
              title: card.title?.trim() || "",
              description: card.description?.trim() || "",
              image: mapMedia(card.image, card.tagline),
              button: mapButton(card.button),
            })),
          };
        case "services.projects":
          return {
            key,
            type: "projects",
            ...mapHead(section),
            button: mapButton(section.button),
            cards: (section.cards ?? []).map((card) => ({
              id: card.id,
              title: card.title?.trim() || "",
              description: card.description?.trim() || "",
              tags: (card.tags ?? []).map((tag) => tag.title).filter(Boolean),
              image: mapMedia(card.image, card.title),
              button: mapButton(card.button),
            })),
          };
        case "services.work":
        case "services.trophies":
          return {
            key,
            type: section.__component === "services.work" ? "clients" : "trophies",
            ...mapHead(section),
            button: mapButton(section.button),
            cards: (section.cards ?? [])
              .map((card) => ({
                id: card.id,
                label: card.label?.trim() || "",
                image: mapMedia(card.image, card.label),
              }))
              .filter((card) => card.image),
          };
        case "services.industries":
          return {
            key,
            type: "industries",
            ...mapHead(section),
            cards: (section.cards ?? []).map((card) => ({
              id: card.id,
              title: card.title?.trim() || "",
              subtitle: card.subtitle?.trim() || "",
              button: mapButton(card.button),
            })),
          };
        case "services.testimonial":
          return { key, type: "testimonials", ...mapHead(section) };
        case "services.blogs":
          return {
            key,
            type: "blogs",
            ...mapHead(section),
            button: mapButton(section.button),
          };
        default:
          return null;
      }
    })
    .filter(Boolean);
}

function mapBlogCard(post) {
  return {
    id: post.documentId ?? String(post.id),
    href: `/blog/${post.slug}`,
    title: post.heading?.replace(/\s*\n\s*/g, " ") ?? "",
    excerpt: post.excerpt?.trim() || "",
    date: formatBlogDate(post.date),
    readTime: post.readTime ?? "",
    image: mapMedia(post.image, post.heading),
  };
}

// "Mumbai (India)" -> "Mumbai", "Bangaluru Brigade" -> "Bangaluru"
function buildOfficeLocations(offices) {
  return (offices ?? [])
    .map((office) => office.city?.trim().split(/\s+/)[0])
    .filter(Boolean);
}

export default async function Home() {
  const [testimonials, home, footer, blogs] = await Promise.all([
    getTestimonials(),
    getHome(),
    getFooter(),
    getBlog(),
  ]);
  const bannerData = buildHomeBannerData(home?.banner);
  const sections = buildSections(home?.sections);
  const locations = buildOfficeLocations(footer?.offices);
  // getBlog() is already sorted newest-first.
  const latestBlogs = blogs.slice(0, 3).map(mapBlogCard);

  return (
    <>
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />
      <HomePage
        bannerData={bannerData}
        sections={sections}
        testimonials={testimonials}
        blogs={latestBlogs}
        locations={locations}
      />
    </>
  );
}
