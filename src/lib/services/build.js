// Turns a static service's plain content (src/lib/services/<slug>.js) into the
// section list ServiceDetailPage renders. Keeps the per-service files to just
// the copy from the supplied HTML.

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const number = (i) => `${String(i + 1).padStart(2, "0")} /`;

const STATS = [
  { value: "4.9", label: "Ratings" },
  { value: "600+", label: "Satisfied clients" },
  { value: "03", label: "Global offices" },
  { value: "30+", label: "Industry awards" },
];

export function buildStaticService(raw) {
  return {
    slug: raw.slug,
    headingTitle: raw.headingTitle,
    metadata: raw.metadata,
    hero: {
      title: raw.hero.title,
      description: raw.hero.description,
      // Two or more paragraphs use the same banner variant as the CMS pages.
      heroClassName: raw.hero.description.length > 1 ? "banner_para" : undefined,
      cta: { text: "Contact Us", href: "/contact" },
      secondaryCta: { text: "Call Us", href: "tel:+919867625909" },
    },
    stats: STATS,
    sections: [
      {
        type: "introduction",
        dataSection: "service_introduction_0",
        heading: raw.intro.heading,
        description: raw.intro.paragraphs.map((p) => `<p>${esc(p)}</p>`).join(""),
      },
      {
        type: "features",
        dataSection: "service_features_1",
        heading: raw.offerings.heading,
        features: raw.offerings.items.map((item, i) => ({
          number: number(i),
          title: item.title,
          description: item.description,
        })),
      },
      {
        type: "industries",
        dataSection: "service_industries_2",
        // Shared across services: replaced with the SEO page's section at render time.
        shared: true,
      },
      {
        type: "tools",
        dataSection: "service_tools_3",
        heading: raw.tools.heading,
        groups: raw.tools.groups,
      },
      {
        type: "whyChooseUs",
        dataSection: "service_why_choose_4",
        heading: raw.why.heading,
        description: `<ul>${raw.why.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`,
        cta: { text: "About Us", href: "/about" },
      },
      {
        type: "process",
        dataSection: "service_process_5",
        heading: raw.process.heading,
        description: `<ul>${raw.process.items
          .map(({ title, text }) => `<li>${esc(title)} - ${esc(text)}</li>`)
          .join("")}</ul>`,
      },
      {
        type: "blogs",
        dataSection: "service_blogs_6",
        heading: "Blog",
        categories: raw.blogCategories,
      },
      {
        type: "faqs",
        dataSection: "service_faqs_7",
        tagline: "FAQ",
        heading: raw.faqHeading || "Frequently asked questions",
        items: raw.faqs.map(({ question, answer }, i) => ({
          id: `faq-${i}`,
          question,
          answer: `<p>${esc(answer)}</p>`,
        })),
      },
    ],
    otherServices: {
      heading: "Our Other Services",
      items: raw.otherServices,
    },
  };
}
