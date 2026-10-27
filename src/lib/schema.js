const SITE_URL = "https://www.webmaffia.com";

/**
 * Builds a BreadcrumbList JSON-LD schema object.
 *
 * @param {Array<{ name: string, path: string }>} items - Breadcrumb trail in order,
 *   starting with Home. `path` is site-relative (e.g. "/", "/blog") and is resolved
 *   to an absolute URL against SITE_URL.
 */
function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "/" : item.path.replace(/\/$/, "")}`,
    })),
  };
}

/**
 * Builds a FAQPage JSON-LD schema object from ServiceFaqAccordion items.
 * Answers arrive as HTML blobs (they're rendered with dangerouslySetInnerHTML),
 * so tags are stripped and entities decoded — Google expects literal text here.
 */
function buildFaqSchema(items) {
  const toPlainText = (html) =>
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: toPlainText(item.answer ?? ""),
      },
    })),
  };
}

/** Organization JSON-LD schema shared across pages. */
const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Webmaffia",
  alternateName: "Pixtop Media Solutions Private Limited",
  url: `${SITE_URL}/`,
  logo: "https://www.webmaffia.com/_next/image?url=%2Fassets%2Fimages%2Ficons%2Fwebmaffia.webp&w=256&q=75",
  sameAs: [
    "https://www.facebook.com/Webmaffia/",
    "https://www.instagram.com/webmaffia/",
    "https://www.youtube.com/@webmaffiadigitalagency",
    "https://in.linkedin.com/company/webmaffia",
  ],
};

/** LocalBusiness JSON-LD schema shared across pages. */
const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Webmaffia",
  alternateName: "Pixtop Media Solutions Private Limited",
  image: "https://www.webmaffia.com/_next/image?url=%2Fassets%2Fimages%2Ficons%2Fwebmaffia.webp&w=256&q=75",
  "@id": `${SITE_URL}/`,
  url: `${SITE_URL}/`,
  telephone: "+91 9867625909",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "403, A wing, Cello Triumph Commercial Complex, IB Patel Rd, opp. Laghu Udyog, Jay Prakash Nagar, Goregaon (East)",
    addressLocality: "Mumbai",
    postalCode: "400063",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 19.1616461,
    longitude: 72.8560812,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:30",
    closes: "19:30",
  },
  sameAs: [
    "https://www.facebook.com/Webmaffia/",
    "https://www.instagram.com/webmaffia/",
    "https://www.youtube.com/@webmaffiadigitalagency",
    "https://in.linkedin.com/company/webmaffia",
  ],
};

export {
  SITE_URL,
  buildBreadcrumbSchema,
  buildFaqSchema,
  ORGANIZATION_SCHEMA,
  LOCAL_BUSINESS_SCHEMA,
};
