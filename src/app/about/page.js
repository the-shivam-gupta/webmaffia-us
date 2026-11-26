import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/Banner";
import JsonLd from "@/components/JsonLd";
import TeamFaq from "@/components/TeamFaq";
import { LogoGridSection } from "@/components/HomePage";
import { buildAwardCaption } from "@/lib/awards";
import { formatUpdatedAt } from "@/lib/dates";
import {
  buildBannerCta,
  getAboutUs,
  getAwards,
  getSeoFields,
  getStrapiImageUrl,
} from "@/lib/strapiPage";
import {
  buildBreadcrumbSchema,
  ORGANIZATION_SCHEMA,
  LOCAL_BUSINESS_SCHEMA,
  SITE_URL,
  buildFaqSchema,
} from "@/lib/schema";

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
]);

// Strapi `facts` component (`lists`: { heading, description }) -> table rows.
function buildAboutFacts(rawFacts) {
  return (rawFacts?.lists ?? [])
    .filter((item) => item?.heading?.trim() && item?.description?.trim())
    .map((item, index) => ({
      id: item.id ?? index,
      label: item.heading.trim(),
      value: item.description.trim(),
    }));
}

function buildAboutPageSchema(slug, dateModified) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Webmaffia",
    url: `${SITE_URL}/${slug}`,
    ...(dateModified ? { dateModified } : {}),
    publisher: { "@type": "Organization", name: "Webmaffia", url: `${SITE_URL}/` },
  };
}

// The "Latest wins" grid shows the first awards from the Strapi Awards entry
// (the same cards the /awards page lists), in the homepage's award-card design.
const MAX_ABOUT_AWARDS = 8;

function buildAboutAwardsSection(rawAwards) {
  // The Strapi list repeats an award once per year / rank (e.g. several "Abby
  // Awards"), so keep only the first card of each award name here.
  const seen = new Set();
  const cards = (rawAwards?.card ?? [])
    .filter((card) => {
      if (!card?.image?.url) return false;
      const key = (card.name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (key && seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_ABOUT_AWARDS)
    .map((card, index) => {
      const name = card.name?.trim() || "";
      return {
        id: card.id ?? index,
        label: name,
        // "year · rank" / award name / description, shown on hover.
        details: buildAwardCaption({ name, details: card.details }),
        image: {
          url: getStrapiImageUrl(card.image),
          alt: name || card.image.alternativeText || "",
          width: card.image.width || 150,
          height: card.image.height || 130,
        },
        scale: null,
      };
    });

  return cards.length
    ? {
        type: "trophies",
        tagline: "",
        title: "Latest\nwins",
        description: "",
        button: null,
        cards,
      }
    : null;
}

// Strapi `faqs` component -> { question, answer } items.
function buildAboutFaqs(rawFaqs) {
  return (rawFaqs?.faqsList ?? [])
    .filter((item) => item?.question && item?.description)
    .map((item) => ({
      question: item.question.trim(),
      answer: item.description.trim(),
    }));
}

function renderMultiline(text) {
  if (!text) return null;
  const lines = text.split("\n").filter(Boolean);
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

function splitParagraphs(text) {
  if (!text) return [];
  return text.split("\n\n").filter(Boolean).map((p) => p.trim());
}

function buildAboutBannerData(rawBanner) {
  if (!rawBanner) return null;

  const subHeading = rawBanner.subHeading || "";
  const lastSpace = subHeading.lastIndexOf(" ");

  const paragraphs = splitParagraphs(rawBanner.description);

  let images;
  if (rawBanner.desktopImage?.url) {
    images = { banner: {
      url: getStrapiImageUrl(rawBanner.desktopImage),
      alt: rawBanner.desktopImage.alternativeText || "",
      width: rawBanner.desktopImage.width || 871,
      height: rawBanner.desktopImage.height || 767,
    } };
    if (rawBanner.mobileImage?.url) {
      images.bannerMobile = {
        url: getStrapiImageUrl(rawBanner.mobileImage),
        alt: rawBanner.mobileImage.alternativeText || "",
      };
    }
  }

  return {
    imagePosition: rawBanner.imagePosition || "right",
    subheading: rawBanner.heading
      ? { enabled: true, text: rawBanner.heading }
      : undefined,
    title: {
      line1: lastSpace > 0 ? subHeading.slice(0, lastSpace) : subHeading,
      ...(lastSpace > 0 ? { line2: subHeading.slice(lastSpace + 1) } : {}),
    },
    descriptions: paragraphs.length ? paragraphs : undefined,
    // The hero image is the page's LCP element: load it eagerly at high priority.
    priority: true,
    cta: buildBannerCta(rawBanner),
    ...(images ? { images } : {}),
  };
}

export async function generateMetadata() {
  const data = await getAboutUs();
  const slug = data?.slug || "about";
  // Strapi `seo` component wins; the previous values stay as fallbacks.
  const seo = getSeoFields(data?.seo);
  return {
    title: seo.title ?? "About Webmaffia - Taking Marketing to Another Level",
    description:
      seo.description ??
      (data?.banner?.description
        ? splitParagraphs(data.banner.description)[0]?.replace(/\n/g, " ").slice(0, 160) || ""
        : "An award-winning digital agency with a strong foothold in creative thinking & execution, Webmaffia is growing in creative strength with every passing year."),
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    alternates: {
      canonical: seo.canonical ?? `https://www.webmaffia.com/${slug}`,
    },
  };
}

export default async function AboutPage() {
  const [raw, awards] = await Promise.all([getAboutUs(), getAwards()]);

  const awardsSection = buildAboutAwardsSection(awards);

  const bannerData = raw?.banner ? buildAboutBannerData(raw.banner) : null;

  const whoWeAre = raw?.whoWeAre
    ? {
        paragraphs: splitParagraphs(raw.whoWeAre.description),
        image: raw.whoWeAre.image
          ? {
              url: getStrapiImageUrl(raw.whoWeAre.image),
              alt: raw.whoWeAre.image.alternativeText || "",
              width: raw.whoWeAre.image.width || 589,
              height: raw.whoWeAre.image.height || 761,
            }
          : null,
        cta: raw.whoWeAre.contactUs
          ? { title: raw.whoWeAre.contactUs.title, href: raw.whoWeAre.contactUs.href }
          : null,
      }
    : null;

  const faqItems = buildAboutFaqs(raw?.faqs);
  const faqSchema = faqItems.length ? buildFaqSchema(faqItems) : null;
  const factItems = buildAboutFacts(raw?.facts);
  const updated = formatUpdatedAt(raw?.updatedAt);
  const aboutPageSchema = buildAboutPageSchema(raw?.slug || "about", updated?.iso);

  return (
    <main className="wrapper about_wrapper">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />
      <JsonLd data={aboutPageSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <div className="ml-setter about_us">
        {bannerData && (
          <Banner
            data={bannerData}
            dataSection="about_us"
            className="hero_section banner_para flex"
          />
        )}

        {whoWeAre && (
        <section className="about_container" data-section="">
          {whoWeAre.image && (
          <Image
            src={whoWeAre.image.url}
            alt={whoWeAre.image.alt}
            width={whoWeAre.image.width}
            height={whoWeAre.image.height}
          />
          )}
          <div className="about_content banner_para">
            {whoWeAre.paragraphs.map((para, i) => (
              <p key={i}>{renderMultiline(para)}</p>
            ))}
            {whoWeAre.cta && (
            <Link href={whoWeAre.cta.href} className="cta_text">
              {whoWeAre.cta.title} <span>Now</span>
            </Link>
            )}
          </div>
        </section>
        )}

        {factItems.length > 0 && (
        <section data-section="facts" className="about_facts">
          <div className="about_facts_head">
            {raw?.facts?.tagline && <h2 className="sub_title">{raw.facts.tagline}</h2>}
            {raw?.facts?.title && <div className="sub_heading">{raw.facts.title}</div>}
          </div>
          <table className="about_facts_table">
            <caption className="about_facts_caption">
              {raw?.facts?.title || "Webmaffia at a glance"}
            </caption>
            <tbody>
              {factItems.map((fact) => (
                <tr key={fact.id}>
                  <th scope="row">{fact.label}</th>
                  <td>{fact.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        )}

        {awardsSection && (
        <div className="about_award">
          <LogoGridSection section={awardsSection}>
            <div className="about_cta">
              <Link href="/services" className="cta_text">
                Next up <span>Services</span>
              </Link>
            </div>
          </LogoGridSection>
        </div>
        )}

        {faqItems.length > 0 && (
        <section data-section="faq" className="team_faq">
          <div className="team_faq_head">
            {raw?.faqs?.tagline && <h2 className="sub_title">{raw.faqs.tagline}</h2>}
            {raw?.faqs?.title && <div className="sub_heading">{raw.faqs.title}</div>}
            {raw?.faqs?.description?.trim() && (
              <p className="team_faq_intro">{raw.faqs.description.trim()}</p>
            )}
          </div>
          <TeamFaq items={faqItems} />
        </section>
        )}

        {updated && (
        <p className="about_last_updated">
          Last updated: <time dateTime={updated.iso}>{updated.label}</time>
        </p>
        )}
      </div>
    </main>
  );
}
