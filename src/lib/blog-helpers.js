function stripHtml(text) {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(text) {
  return stripHtml(text)
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueHeadingId(base, usedIds) {
  let id = base || "section";
  let suffix = 2;

  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
}

function parseStickyLinksFromHtml(html) {
  const links = [];
  const blockRegex =
    /<div class="blog_detail_wrapper" id="([^"]+)">([\s\S]*?)(?=<div class="blog_detail_wrapper"|$)/g;
  let match = blockRegex.exec(html);

  while (match) {
    const id = match[1];
    const block = match[2];
    const headingMatch = block.match(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/);
    const label = headingMatch ? stripHtml(headingMatch[1]) : id;

    if (label) {
      links.push({ href: `#${id}`, label });
    }
    match = blockRegex.exec(html);
  }

  return links;
}

export function prepareStrapiArticleHtml(html) {
  if (!html) return { html: "", stickyLinks: [] };

  const wrapperLinks = parseStickyLinksFromHtml(html);
  if (wrapperLinks.length > 0) {
    return {
      html: html.trim(),
      stickyLinks: wrapperLinks,
    };
  }

  const usedIds = new Set();
  const stickyLinks = [];

  const processed = html.replace(
    /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi,
    (match, attrs, content) => {
      const label = stripHtml(content);
      if (!label) return match;

      const existingId = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
      const id = existingId || uniqueHeadingId(slugifyHeading(label), usedIds);

      stickyLinks.push({ href: `#${id}`, label });

      if (existingId) return match;

      const trimmedAttrs = attrs.trim();
      const attrPrefix = trimmedAttrs ? ` ${trimmedAttrs}` : "";
      return `<h2${attrPrefix} id="${id}">${content}</h2>`;
    }
  );

  return { html: processed.trim(), stickyLinks };
}

export function getBlogStickyLinksFromHtml(html) {
  if (!html) return [];
  try {
    return prepareStrapiArticleHtml(html).stickyLinks;
  } catch {
    return [];
  }
}

/**
 * Isolates a blog post's "Frequently Asked Questions" block — an <h2>
 * heading matching that phrase, up to (but not including) the next <h2> —
 * from the rest of the article HTML. Returns "" when the post has no such
 * section.
 */
function extractFaqSectionHtml(html) {
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const matches = [...html.matchAll(h2Regex)];
  const faqIndex = matches.findIndex((m) => /frequently asked questions/i.test(stripHtml(m[1])));
  if (faqIndex === -1) return "";

  const faqMatch = matches[faqIndex];
  const start = faqMatch.index + faqMatch[0].length;
  const end = faqIndex + 1 < matches.length ? matches[faqIndex + 1].index : html.length;
  return html.slice(start, end);
}

/**
 * Splits an FAQ section's HTML into { question, answer } pairs by treating
 * every <h3> as a question and all the markup up to the next <h3> (or the
 * end of the section) as that question's answer — same convention as the
 * services-tech.fa-qs dynamic-zone component (see serviceContent.js). Both
 * are stripped to plain text, since schema.org's Question/Answer `name`
 * and `text` fields expect plain text, not markup.
 */
function parseFaqQaPairs(sectionHtml) {
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  const matches = [...sectionHtml.matchAll(h3Regex)];

  return matches
    .map((match, index) => {
      const question = stripHtml(match[1]);
      const start = match.index + match[0].length;
      const end = index + 1 < matches.length ? matches[index + 1].index : sectionHtml.length;
      const answer = stripHtml(sectionHtml.slice(start, end));
      return question && answer ? { question, answer } : null;
    })
    .filter(Boolean);
}

/**
 * Builds a schema.org FAQPage JSON-LD object from a blog post's
 * "Frequently Asked Questions" section, for search engines/AI crawlers to
 * pick up as rich results. Returns null when the post has no FAQ section
 * (or no valid Q&A pairs in it), so callers can skip rendering the schema
 * entirely rather than emitting an empty FAQPage.
 */
export function buildFaqPageSchema(html) {
  if (!html) return null;

  const sectionHtml = extractFaqSectionHtml(html);
  if (!sectionHtml) return null;

  const items = parseFaqQaPairs(sectionHtml);
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
