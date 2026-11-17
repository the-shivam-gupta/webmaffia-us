import { Fragment } from "react";
import {
  buildBannerCtas,
  getServicesTech,
  getServiceTechBySlug,
  getStrapiImageUrl,
} from "@/lib/strapiPage";

/**
 * Builds the render-ready `{ hero, sections }` shape ServiceDetailPage
 * expects, entirely from Strapi's `services-teches` collection (banner +
 * `services-tech.features` / `services-tech.technology` components). There
 * is no static fallback content — a service without a CMS entry yet simply
 * renders an empty hero/sections until it's added in Strapi.
 */

function splitParagraphs(text) {
  if (!text) return [];
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

function formatFeatureNumber(index) {
  return `${String(index + 1).padStart(2, "0")} /`;
}

function toParagraphNode(paragraph, key) {
  const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <Fragment key={key}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </Fragment>
  );
}

/**
 * Maps a CMS `services-tech.technology` block (heading + Items[].icon[].icon)
 * onto the `{ title, groups: [{ label, icons: [{ src, title }] }] }` shape
 * ServiceDetailPage's TechnologyBlock expects.
 */
function buildTechnologyGroups(technologyBlock) {
  if (!technologyBlock) return undefined;

  const groups = (technologyBlock.Items ?? [])
    .map((item) => ({
      label: item.title?.trim() || undefined,
      icons: (item.icon ?? [])
        .map((wrapper) => wrapper.icon)
        .filter(Boolean)
        .map((media) => ({
          src: getStrapiImageUrl(media),
          title: media.alternativeText || media.name?.replace(/\.[^.]+$/, "") || "",
        })),
    }))
    .filter((group) => group.icons.length);

  if (!groups.length) return undefined;

  return {
    title: technologyBlock.heading?.trim(),
    groups,
  };
}

/**
 * Builds the hero shape from the CMS `banner` component. `heroClassName` is
 * derived automatically (not hand-configured): a banner whose description
 * has multiple blank-line-separated paragraphs gets the "banner_para"
 * layout variant, matching the one service (content-marketing-strategy)
 * that previously hardcoded it for that reason.
 */
export function buildServiceHero(banner) {
  if (!banner) return {};

  const paragraphs = splitParagraphs(banner.description);
  const description = paragraphs.length
    ? paragraphs.map((paragraph, index) => toParagraphNode(paragraph, index))
    : undefined;

  return {
    subtitle: banner.heading?.trim(),
    title: banner.subHeading?.trim(),
    description,
    heroClassName: paragraphs.length > 1 ? "banner_para" : undefined,
    image: getStrapiImageUrl(banner.desktopImage),
    imageWidth: banner.desktopImage?.width,
    imageHeight: banner.desktopImage?.height,
    mobileImage: banner.mobileImage ? getStrapiImageUrl(banner.mobileImage) : undefined,
    // { cta, secondaryCta } from the banner's button + secondaryButton
    ...buildBannerCtas(banner),
  };
}

/**
 * Splits a `services-tech.fa-qs` `description` HTML blob into individual
 * Q&A items by treating every `<h3>` as a question and everything up to the
 * next `<h3>` (or the end of the string) as that question's answer HTML.
 * Content authors sometimes forget to heading-tag a follow-up question (it
 * ends up as a stray `<p>`) — that text is simply kept as part of the
 * previous answer rather than guessed at.
 */
function parseFaqItems(html) {
  if (!html) return [];

  const headingRegex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  const matches = [...html.matchAll(headingRegex)];

  return matches
    .map((match, index) => {
      const question = match[1].replace(/<[^>]+>/g, "").trim();
      const start = match.index + match[0].length;
      const end = index + 1 < matches.length ? matches[index + 1].index : html.length;
      const answer = html.slice(start, end).trim();
      return question ? { id: `faq-${index}`, question, answer } : null;
    })
    .filter(Boolean);
}

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

/**
 * Converts a CMS FAQ answer to HTML. Answers written in the Strapi rich-text
 * (markdown) editor become paragraphs, lists, bold/italic and links; answers
 * that already contain HTML tags are used as-is.
 */
function answerToHtml(answer) {
  const text = String(answer ?? "").replace(/\r\n?/g, "\n").trim();
  if (!text) return "";
  if (/<[a-z][\s\S]*>/i.test(text)) return text;

  return text
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        return `<ul>${lines.map((line) => `<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
        return `<ol>${lines.map((line) => `<li>${inlineMarkdown(line.replace(/^\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
      }
      return `<p>${lines.map(inlineMarkdown).join("<br>")}</p>`;
    })
    .join("");
}

/**
 * Maps the `services-tech.fa-qs` `faqs` repeatable ({ question, answer })
 * onto accordion items.
 */
function buildFaqItems(faqs) {
  return (faqs ?? [])
    .map((faq, index) => {
      const question = faq.question?.trim();
      const answer = answerToHtml(faq.answer);
      return question && answer ? { id: `faq-${index}`, question, answer } : null;
    })
    .filter(Boolean);
}

/**
 * Maps a `services-tech.awards` `awardsList` (title + logo media) onto the
 * `{ url, alt, width, height }` shape the awards logo grid expects,
 * dropping any entry that has no logo image attached yet.
 */
function buildAwardItems(awardsList) {
  return (awardsList ?? [])
    .map((award) => {
      if (!award.logo) return null;
      return {
        title: award.title?.trim() || "",
        logo: {
          url: getStrapiImageUrl(award.logo),
          alt: award.logo.alternativeText || award.title?.trim() || "",
          width: award.logo.width ?? 128,
          height: award.logo.height ?? 111,
        },
      };
    })
    .filter(Boolean);
}

/**
 * Maps the industries-we-serve `lists` repeatable onto
 * `{ title, href, logo: { url, alt, width, height } | null }` tiles. The CMS entry
 * now carries an `icons` repeatable of `{ logo }` media (same shape as
 * tools-we-use), so the first icon is used as the tile's logo; a legacy
 * single `logo` is still honoured. Entries with a title but no icon yet are
 * kept as title-only tiles so the section doesn't vanish.
 */
function buildLogoTitleItems(lists) {
  return (lists ?? [])
    .map((item) => {
      const title = item.title?.trim() || "";
      if (!title) return null;

      const media = item.logo ?? item.icons?.find((entry) => entry.logo)?.logo;
      // Page the tile links to: the CMS `url` set on the icon entry (or on the
      // tile itself), e.g. "/real-estate". Empty means the tile is not a link.
      const rawUrl = (
        item.url ?? item.icons?.find((entry) => entry.url?.trim())?.url ?? ""
      ).trim();
      const href = !rawUrl
        ? null
        : /^(https?:|mailto:|tel:|\/)/i.test(rawUrl)
          ? rawUrl
          : `/${rawUrl}`;
      return {
        title,
        href,
        logo: media
          ? {
              url: getStrapiImageUrl(media),
              alt: media.alternativeText || title,
              width: media.width,
              height: media.height,
            }
          : null,
      };
    })
    .filter(Boolean);
}

/**
 * Maps the `tools-we-use` `lists` repeatable — each entry a `title` plus an
 * `icons` repeatable of `{ logo }` media — onto `{ title, icons: [{ url,
 * alt, width, height, title }] }` rows, dropping icons with no image and
 * rows left with no icons.
 */
function buildToolGroups(lists) {
  return (lists ?? [])
    .map((item) => ({
      title: item.title?.trim() || "",
      icons: (item.icons ?? [])
        .map((entry) => entry.logo)
        .filter(Boolean)
        .map((media) => {
          const name =
            media.alternativeText || media.name?.replace(/\.[^.]+$/, "") || "";
          return {
            url: getStrapiImageUrl(media),
            alt: name,
            title: name,
            width: media.width,
            height: media.height,
          };
        }),
    }))
    .filter((group) => group.icons.length);
}

/**
 * Builds the `sections` array from the CMS `sections` dynamic zone. Most
 * components map 1:1 to a render-ready section object (tagged by `type`);
 * `services-tech.technology` is the one exception — it has no section of
 * its own and is instead attached as the `technologies` field of whichever
 * `features` section precedes it.
 *
 * `influencerTitle` (the title-only, no-description feature styling used on
 * the influencer-marketing page) is derived automatically from whether the
 * card has a description, rather than hardcoded per service.
 */
export function buildServiceSections(cmsSections) {
  if (!cmsSections?.length) return [];

  const merged = [];

  cmsSections.forEach((section, index) => {
    switch (section.__component) {
      case "services-tech.technology": {
        const technologies = buildTechnologyGroups(section);
        const lastFeatureSection = [...merged].reverse().find((s) => s.type === "features");
        if (technologies && lastFeatureSection) {
          lastFeatureSection.technologies = technologies;
        }
        return;
      }

      case "services-tech.features": {
        const designFeature = section.designFeature;
        if (!designFeature) return;
        const cards = designFeature.card ?? [];
        merged.push({
          type: "features",
          dataSection: `service_features_${index}`,
          heading: designFeature.heading?.trim(),
          intro: designFeature.subheading?.trim(),
          features: cards.map((card, cardIndex) => ({
            number: formatFeatureNumber(cardIndex),
            title: card.heading?.trim(),
            description: card.description?.trim(),
            influencerTitle: !card.description?.trim(),
          })),
        });
        return;
      }

      case "services.statistics-bar": {
        const stats = (section.statisticsBar ?? [])
          .map((stat) => ({
            id: stat.id,
            value: stat.value?.trim() || "",
            label: stat.label?.trim() || "",
            icon: stat.icon?.url
              ? {
                  url: getStrapiImageUrl(stat.icon),
                  alt: stat.icon.alternativeText || stat.label?.trim() || "",
                  width: stat.icon.width || 100,
                  height: stat.icon.height || 100,
                }
              : null,
          }))
          .filter((stat) => stat.value || stat.icon || stat.label);
        if (!stats.length) return;
        merged.push({
          type: "statistics",
          dataSection: `service_statistics_${index}`,
          stats,
        });
        return;
      }

      case "services-tech.introduction": {
        if (!section.description?.trim()) return;
        merged.push({
          type: "introduction",
          dataSection: `service_introduction_${index}`,
          heading: section.heading?.trim(),
          description: section.description.trim(),
        });
        return;
      }

      case "services-tech.why-choose-us": {
        if (!section.description?.trim()) return;
        merged.push({
          type: "whyChooseUs",
          dataSection: `service_why_choose_${index}`,
          heading: section.heading?.trim(),
          description: section.description.trim(),
          cta:
            section.cta?.title?.trim() && section.cta?.href?.trim()
              ? { text: section.cta.title.trim(), href: section.cta.href.trim() }
              : undefined,
        });
        return;
      }

      case "services-tech.awards": {
        const items = buildAwardItems(section.awardsList);
        if (!items.length) return;
        merged.push({
          type: "awards",
          dataSection: `service_awards_${index}`,
          heading: section.heading?.trim() || "Awards",
          items,
        });
        return;
      }

      case "services-tech.industries-we-serve": {
        const items = buildLogoTitleItems(section.lists);
        if (!items.length) return;
        merged.push({
          type: "industries",
          dataSection: `service_industries_${index}`,
          heading: section.heading?.trim() || "Industries We Serve",
          items,
        });
        return;
      }

      case "services-tech.tools-we-use": {
        const items = buildToolGroups(section.lists);
        if (!items.length) return;
        merged.push({
          type: "tools",
          dataSection: `service_tools_${index}`,
          heading: section.heading?.trim() || "Tools We Use",
          items,
        });
        return;
      }

      case "services-tech.our-process": {
        if (!section.description?.trim()) return;
        merged.push({
          type: "process",
          dataSection: `service_process_${index}`,
          heading: section.heading?.trim(),
          description: section.description.trim(),
        });
        return;
      }

      case "services-tech.blogs": {
        const categories = (section.blogTitle ?? [])
          .map((tag) => tag.title?.trim())
          .filter(Boolean);
        if (!categories.length) return;
        merged.push({
          type: "blogs",
          dataSection: `service_blogs_${index}`,
          heading: section.heading?.trim() || "Blog",
          categories,
        });
        return;
      }

      case "services-tech.fa-qs": {
        // Current CMS shape: tagline + title + `faqs` repeatable. Older entries
        // used a heading + HTML `description` blob split on <h3>.
        const items = section.faqs?.length
          ? buildFaqItems(section.faqs)
          : parseFaqItems(section.description);
        if (!items.length) return;
        merged.push({
          type: "faqs",
          dataSection: `service_faqs_${index}`,
          tagline: section.tagline?.trim() || "",
          heading:
            section.title?.trim() ||
            section.heading?.trim() ||
            "Frequently Asked Questions",
          items,
        });
        return;
      }

      default:
        return;
    }
  });

  return merged;
}

function cleanServiceHeading(banner, pageName) {
  const raw = banner?.subHeading?.trim() || pageName?.trim() || "";
  return raw.replace(/\s*\n\s*/g, " ").trim();
}

/**
 * `otherServices.services` only stores each pick as free text (e.g.
 * "Digital Strategy") rather than a relation, so it has to be matched
 * against the live services-teches list by heading to find a slug to link
 * to. Tries an exact case-insensitive match first (covers the common case),
 * then falls back to a substring match either way (covers minor wording
 * differences, e.g. "Social Media" vs. a banner subHeading of "Social
 * media marketing"). Entries with no match are dropped rather than
 * rendered as a dead link.
 */
function buildOtherServicesSection(otherServicesRaw, allEntries, currentSlug) {
  const picks = otherServicesRaw?.services ?? [];
  if (!picks.length) return null;

  const candidates = allEntries
    .filter((entry) => entry.slug !== currentSlug)
    .map((entry) => ({
      slug: entry.slug,
      heading: cleanServiceHeading(entry.banner, entry.pageName),
    }))
    .filter((entry) => entry.heading);

  const items = picks
    .map((pick) => {
      const label = pick.services?.trim();
      if (!label) return null;

      const match =
        candidates.find((c) => c.heading.toLowerCase() === label.toLowerCase()) ??
        candidates.find(
          (c) =>
            c.heading.toLowerCase().includes(label.toLowerCase()) ||
            label.toLowerCase().includes(c.heading.toLowerCase())
        );

      return match ? { title: match.heading, href: `/services/${match.slug}` } : null;
    })
    .filter(Boolean);

  if (!items.length) return null;

  return {
    heading: otherServicesRaw.heading?.trim() || "Our Other Services",
    items,
  };
}

/**
 * Fetches and transforms the `services-teches` entry for `slug` into the
 * `{ hero, sections, otherServices }` shape ServiceDetailPage expects.
 * Returns empty hero/sections (not null) when the CMS has no entry yet for
 * this slug, so callers can render without special-casing a missing
 * service.
 */
export async function getServiceRenderConfig(slug) {
  const [serviceTech, allEntries] = await Promise.all([
    getServiceTechBySlug(slug),
    getServicesTech(),
  ]);

  return {
    hero: buildServiceHero(serviceTech?.banner),
    sections: buildServiceSections(serviceTech?.sections),
    otherServices: buildOtherServicesSection(serviceTech?.otherServices, allEntries, slug),
  };
}
