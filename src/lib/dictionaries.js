import { DEFAULT_LOCALE, normalizeLocale } from "@/lib/i18n";

/**
 * Static UI strings for the localized sections (blog + author).
 * Only English is filled in for now; add translations to hi / mr / ar below.
 * Missing keys fall back to English.
 */
const dictionaries = {
  en: {
    "meta.blog.title": "Blog | Webmaffia",
    "meta.blog.description":
      "Insights on digital marketing, SEO, web development, AI, and brand strategy from the Webmaffia team.",
    "meta.authors.title": "Authors | Webmaffia",
    "meta.authors.description":
      "Meet the Webmaffia experts behind our articles on digital marketing, SEO, web development, AI, and brand strategy.",

    "breadcrumb.home": "Home",
    "breadcrumb.blog": "Blog",
    "breadcrumb.authors": "Authors",

    "lang.switcherLabel": "Language",

    "blog.banner.subheading": "OUR BLOGS",
    "blog.banner.title1": "Creating a",
    "blog.banner.title2": "platform for your",
    "blog.banner.title3": "purpose",
    "blog.banner.description":
      "Transforming visions into captivating digital landscapes,\nwe crafts tailored solutions that elevate brands and engage\naudiences. With a focus on innovation and precision, we\nbring your online presence to life, delivering seamless user\nexperiences that resonate and inspire.",
    "blog.featuredAlt": "Featured blog post",
    "blog.postAlt": "Blog post",
    "blog.readMore": "READ MORE",

    "blog.pagination.label": "Blog pagination",
    "blog.pagination.prev": "PREV",
    "blog.pagination.next": "NEXT",

    "blog.detail.by": "By",
    "blog.detail.servicesTitle": "Services that\nwe cater",
    "blog.detail.relatedTitle":
      "You might also like the\nfollowing blog articles.",
    "blog.detail.fallbackTitle": "Blog",
    "blog.services.digitalStrategy": "Digital Strategy",
    "blog.services.design": "Design & development",
    "blog.services.seo": "SEO",
    "blog.services.social": "Social media",
    "blog.services.content": "Content marketing",
    "blog.services.influencer": "Influencer marketing",

    "author.label": "AUTHOR",
    "author.listLabel": "OUR AUTHORS",
    "author.listTitle": "Meet the minds behind our blogs",
    "author.metaTitle": "{name} - Author at Webmaffia",
    "author.metaFallbackTitle": "Author | Webmaffia",
    "author.metaDescription":
      "Read articles by {name}, {role}, on digital marketing, SEO, web development and brand strategy.",
    "author.roleAtWebmaffia": "{designation} at Webmaffia",
    "author.roleDefault": "Webmaffia",
    "author.articleOne": "Article",
    "author.articleMany": "Articles",
    "author.articleOneUpper": "ARTICLE",
    "author.articleManyUpper": "ARTICLES",
    "author.postsTitle": "Articles by {name}",
    "author.emptyBefore": "No articles published yet. Browse all",
    "author.emptyLink": "our blogs",
  },
  hi: {},
  mr: {},
  ar: {},
};

/**
 * Looks up a UI string for `lang`, falling back to English, then to the key.
 * `{name}`-style placeholders are filled from `vars`.
 */
export function t(lang, key, vars) {
  const dict = dictionaries[normalizeLocale(lang)];
  const template = dict?.[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}
