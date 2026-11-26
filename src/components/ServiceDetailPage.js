import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/Banner";
import BlogListItem from "@/components/BlogListItem";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/ContactSection";
import ServiceTeamFaq from "@/components/ServiceTeamFaq";
import StatisticsBar from "@/components/StatisticsBar";
import KlaviyoFormEmbed from "@/components/KlaviyoFormEmbed";
import BookCallButton from "@/components/BookCallButton";
import ServiceWorkSlider from "@/components/ServiceWorkSlider";
import { TestimonialsSection } from "@/components/HomePage";
import { getTestimonials } from "@/lib/strapiPage";
import { industryHref, mainDomainHref } from "@/lib/homeSections";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import { getLatestBlogItems, getLatestWorkItems } from "@/lib/case-study-helpers";

function RichText({ className, html }) {
  if (!html) return null;
  return (
    <div
      className={`service_rich_text${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function FeaturesSection({ section }) {
  return (
    <>
      {section.heading ? <h2 className="h2">{section.heading}</h2> : null}
      {section.intro ? <p>{section.intro}</p> : null}
      <div className="feature_type">
        {(section.features ?? []).map((feature, index) => (
          <div
            className="feature_box"
            key={`${section.dataSection}-${feature.number}-${index}`}
          >
            <h3
              className={
                feature.influencerTitle
                  ? "feature_title influencer_title"
                  : "feature_title"
              }
              data-sf-number={feature.number}
            >
              {feature.title}
            </h3>
            {Array.isArray(feature.description) ? (
              feature.description.map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>{feature.description}</p>
            )}
          </div>
        ))}
      </div>
      <TechnologyBlock technologies={section.technologies} />
    </>
  );
}

function IntroductionSection({ section }) {
  return (
    <>
      {section.heading ? <h2 className="h2">{section.heading}</h2> : null}
      <RichText html={section.description} />
    </>
  );
}

// Pages that live in this project stay on-site; every other site path (e.g.
// /about) lives on the main site, so it points at MAIN_DOMAIN in a new tab.
function CtaLink({ href, ...props }) {
  const onSite = /^\/(services|case-study)(\/|$|\?|#)/.test(href ?? "");
  if (!href || onSite || !href.startsWith("/")) {
    return <Link href={href} {...props} />;
  }
  const external = mainDomainHref(href);
  return external === href ? (
    <Link href={href} {...props} />
  ) : (
    <a href={external} target="_blank" rel="noopener noreferrer" {...props} />
  );
}

// Banner buttons to pages outside this project (e.g. /contact) go to MAIN_DOMAIN.
function mainDomainCta(cta) {
  if (!cta?.href?.startsWith("/")) return cta;
  if (/^\/(services|case-study)(\/|$|\?|#)/.test(cta.href)) return cta;
  return { ...cta, href: mainDomainHref(cta.href) };
}

function WhyChooseUsSection({ section }) {
  return (
    <>
      {section.heading ? <h2 className="h2">{section.heading}</h2> : null}
      <RichText html={section.description} />
      {section.cta ? (
        <CtaLink href={section.cta.href} className="cta_text">
          <span>{section.cta.text}</span>
        </CtaLink>
      ) : null}
    </>
  );
}

function ProcessSection({ section }) {
  return (
    <>
      {section.heading ? <h2 className="h2">{section.heading}</h2> : null}
      <RichText html={section.description} />
    </>
  );
}

function AwardsMarqueeRow({ items, reverse }) {
  // The item list is duplicated so translateX(-50%) loops seamlessly.
  const track = [...items, ...items];

  return (
    <div className={`award_marquee_track${reverse ? " award_marquee_track--reverse" : ""}`}>
      {track.map((award, index) => (
        <div
          className="award_marquee_item"
          key={`${reverse ? "r" : "f"}-${award.logo.url}-${index}`}
          aria-hidden={index >= items.length}
        >
          <Image
            src={award.logo.url}
            alt={index < items.length ? award.logo.alt : ""}
            width={award.logo.width}
            height={award.logo.height}
          />
        </div>
      ))}
    </div>
  );
}

function AwardsSection({ section }) {
  // Continuous two-row marquee, unique to the services page (doesn't touch
  // the /awards archive or the homepage/about "Latest wins" grid, which
  // reuse .our_work/.awards_work — this section renders its own markup
  // instead). Both rows show the same award list, scrolling in opposite
  // directions; hovering anywhere in the viewport pauses both.
  return (
    <div className="award_marquee">
      <h2 className="h2">{section.heading}</h2>
      <div className="award_marquee_viewport">
        <AwardsMarqueeRow items={section.items} />
        <AwardsMarqueeRow items={section.items} reverse />
      </div>
    </div>
  );
}

function BlogsSection({ section }) {
  if (!section.posts?.length) return null;

  return (
    <>
      <h2 className="h2">{section.heading}</h2>
      <div className="other_blogs">
        {section.posts.map((post) => (
          <BlogListItem post={post} key={post.slug} TitleTag="h3" />
        ))}
      </div>
    </>
  );
}

function IndustriesSection({ section }) {
  // Rigid divided matrix — hairline-separated tiles that invert to solid
  // black on hover. Deliberately the opposite feel of ToolsSection's soft
  // pills so the two logo sections never read as the same component.
  return (
    <>
      {section.heading ? <h2 className="h2">{section.heading}</h2> : null}
      <div className="industries_grid">
        {section.items.map((rawItem, index) => {
          // Industry pages live on the main site (MAIN_DOMAIN).
          const item = { ...rawItem, href: industryHref(rawItem.title, rawItem.href) };
          const content = (
            <>
              {item.logo ? (
                <Image
                  className="industries_icon"
                  src={item.logo.url}
                  alt={item.logo.alt}
                  width={item.logo.width ?? 110}
                  height={item.logo.height ?? 135}
                />
              ) : null}
              <h3 className="industries_name">
                {item.title}
                {item.href ? (
                  <svg
                    className="industries_arrow"
                    viewBox="0 0 24 12"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M0 6H22.5M17 0.8L22.7 6L17 11.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="miter"
                      strokeLinecap="butt"
                    />
                  </svg>
                ) : null}
              </h3>
            </>
          );
          const key = `${item.title}-${index}`;

          // A tile links to its industry page when the CMS gives it a url.
          return item.href ? (
            <a
              href={item.href}
              className="industries_cell"
              key={key}
              {...(/^https?:/i.test(item.href)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {content}
            </a>
          ) : (
            <div className="industries_cell" key={key}>
              {content}
            </div>
          );
        })}
      </div>
    </>
  );
}

function ToolsSection({ section }) {
  return (
    <>
      {section.heading ? <h2 className="h2">{section.heading}</h2> : null}
      <div className="tools_list">
        {section.items.map((item, index) => (
          <div className="tools_row" key={`${item.title}-${index}`}>
            <h4>{item.title}</h4>
            <div className="tools_img">
              {item.icons.map((icon, iconIndex) => (
                <div key={`${item.title}-${iconIndex}-${icon.url}`}>
                  {icon.url ? (
                    <Image
                      src={icon.url}
                      title={icon.title}
                      alt={icon.alt}
                      width={icon.width ?? 110}
                      height={icon.height ?? 110}
                    />
                  ) : (
                    <span className="tool_name">{icon.title}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function renderSectionBody(section) {
  switch (section.type) {
    case "introduction":
      return <IntroductionSection section={section} />;
    case "whyChooseUs":
      return <WhyChooseUsSection section={section} />;
    case "process":
      return <ProcessSection section={section} />;
    case "awards":
      return <AwardsSection section={section} />;
    case "industries":
      return <IndustriesSection section={section} />;
    case "tools":
      return <ToolsSection section={section} />;
    case "blogs":
      return <BlogsSection section={section} />;
    case "faqs":
      return <ServiceTeamFaq tagline={section.tagline || "FAQ"} heading="Got questions? We’ve got answers." items={section.items} />;
    case "features":
    default:
      return <FeaturesSection section={section} />;
  }
}

const SECTION_CLASS_NAMES = {
  features: "service_features",
  introduction: "service_introduction",
  whyChooseUs: "service_why_choose",
  process: "service_process",
  awards: "service_awards",
  industries: "service_industries",
  tools: "service_tools",
  blogs: "service_blogs",
  faqs: "service_faqs_section",
};

function LatestWorkSection({ latestWork }) {
  if (!latestWork?.length) return null;

  return (
    <section data-section="services_work" className="services_work">
      <ServiceWorkSlider items={latestWork} title="Latest work" />
      <div className="cta_work">
        <Link href="/case-study" className="cta_text">
          View All <span>Work</span>
        </Link>
      </div>
    </section>
  );
}

// Last fold of every service page: the homepage "Let's talk" block with
// service-specific copy and without the email / phone rows.
function ServiceContact() {
  return (
    <ContactSection
      id="contact"
      heading={
        <>
          Your brand deserves <br />
          solutions as <br />
          exceptional as you are.
        </>
      }
      description="Tell us about your goals and we’ll show you how Webmaffia can help you reach them."
      showDetails={false}
    />
  );
}

// Services Webmaffia no longer offers: never listed as an "other service".
const DISCONTINUED_SERVICE_HREFS = [
  "/services/app-store-optimization",
  "/services/influencer-marketing",
];

function OtherServicesSection({ otherServices }) {
  const items = (otherServices?.items ?? []).filter(
    (item) => !DISCONTINUED_SERVICE_HREFS.includes(item.href)
  );
  if (!items.length) return null;
  otherServices = { ...otherServices, items };

  // Full-width list below the FAQ: service name and an arrow per pill.
  return (
    <div className="svc_other">
      <h2 className="svc_other_title">{otherServices.heading}</h2>
      <div className="svc_other_list">
        {otherServices.items.map((item) => (
          <Link href={item.href} className="svc_other_item" key={item.href}>
            <h3 className="svc_other_name h3_plain">
              {item.title.replace(/development/, "Development")}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Same testimonials slider as the homepage, placed above the blog section.
const TESTIMONIAL_HEAD = {
  tagline: "Word on the street",
  title: "Don't take our\nword for it",
  description:
    "Approvals, compliance, investors, dealers, plant heads. We've sat in those meetings, so your project moves faster.",
};

function TechnologyBlock({ technologies }) {
  if (!technologies) return null;

  return (
    <div className="technologies">
      <h2 className="feature_title">{technologies.title}</h2>
      {technologies.groups.map((group, index) => (
        <div
          className="technology_items"
          key={group.label ?? `${technologies.title}-${index}`}
        >
          {group.label ? <h4 className="h4">{group.label}</h4> : null}
          <div className="technology_img">
            {group.icons.map((icon, iconIndex) => (
              <div key={`${group.label ?? "icon"}-${iconIndex}-${icon.src}`}>
                <Image
                  src={icon.src}
                  title={icon.title}
                  alt={icon.title || group.label || "Technology icon"}
                  width={75}
                  height={75}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ServiceDetailPage({ config, breadcrumbs }) {
  const { hero, sections, workCategories, otherServices, latestWork: fallbackLatestWork } = config;
  const testimonials = await getTestimonials();
  // Every relevant project (not just two) — they go in a slider.
  const dynamicLatestWork = await getLatestWorkItems(
    Infinity,
    workCategories ?? [],
    undefined,
    true
  );
  const latestWork = dynamicLatestWork.length > 0 ? dynamicLatestWork : fallbackLatestWork;

  // "blogs" sections only carry category tags from the CMS — resolve the
  // actual posts to show here, alongside the other section types, so
  // ServiceDetailPage stays a single await-then-render pass.
  const resolvedSections = await Promise.all(
    (sections ?? []).map(async (section) => {
      if (section.type !== "blogs") return section;
      const posts = await getLatestBlogItems(2, section.categories);
      return { ...section, posts };
    })
  );
  const heroClass = hero.heroClassName
    ? `hero_section flex ${hero.heroClassName}`
    : "hero_section flex";

  const descriptions = Array.isArray(hero.description)
    ? hero.description
    : [hero.description];

  // One FAQPage schema per page, merging every "faqs" section's items
  // (Google expects at most one per URL).
  const faqItems = resolvedSections
    .filter((section) => section.type === "faqs")
    .flatMap((section) => section.items ?? []);

  // Service name sent along with the enquiry form (last breadcrumb is the
  // page's own name, e.g. "Digital Strategy").
  const serviceName = breadcrumbs?.length
    ? breadcrumbs[breadcrumbs.length - 1].name
    : hero.subtitle;

  const bannerData = {
    imagePosition: "right",
    priority: true,
    // "Contact Us" jumps to the contact form in the last fold of this page;
    // "Call Us" dials the US number.
    cta: /contact/i.test(hero.cta?.text ?? "")
      ? { ...hero.cta, href: "#contact" }
      : mainDomainCta(hero.cta),
    secondaryCta: /call/i.test(hero.secondaryCta?.text ?? "")
      ? { ...hero.secondaryCta, href: "tel:+18669849786" }
      : mainDomainCta(hero.secondaryCta),
    subheading: {
      enabled: true,
      text: hero.subtitle,
      link: "/services",
      current: breadcrumbs?.length ? breadcrumbs[breadcrumbs.length - 1].name : null,
    },
    title: {
      line1: hero.title,
    },
    // Same artwork as the home banner (it has the card the enquiry form sits
    // on), on every service page — a static asset, not the CMS banner image.
    images: {
      banner: {
        url: "/assets/images/home-banner-form.png",
        alt: "",
        width: 3159,
        height: 2803,
      },
      bannerMobile: {
        url: "/assets/images/home-banner-form.png",
        alt: "",
      },
    },
  };

  return (
    <main className="wrapper">
      {breadcrumbs?.length > 0 && (
        <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
      )}
      {faqItems.length > 0 && <JsonLd data={buildFaqSchema(faqItems)} />}
      <div className="ml-setter service_detail">
        <Banner
          data={bannerData}
          className={heroClass}
          mediaOverlay={
            <>
              <p className="banner_media__form_title">Let&apos;s Connect</p>
              <KlaviyoFormEmbed formId="Rq3tfh" service={serviceName} />
              <BookCallButton />
            </>
          }
        >
          {descriptions.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </Banner>

        {resolvedSections?.length > 0 && (() => {
          // "Latest work" sits right below the Features section — not at
          // the very end of the page — so it renders inline the first time
          // a "features" section is reached. Services with no features
          // section (shouldn't normally happen, but CMS content varies)
          // still get it at the end as a fallback so it's never dropped.
          const hasFeatures = resolvedSections.some((s) => s.type === "features");
          const hasFaqs = resolvedSections.some((s) => s.type === "faqs");
          let insertedLatestWork = false;
          let insertedOtherServices = false;
          const hasBlogs = resolvedSections.some((s) => s.type === "blogs");

          return (
            <div className="services_parent">
              {resolvedSections.map((section) => {
                const showLatestWorkAfter = section.type === "features" && !insertedLatestWork;
                if (showLatestWorkAfter) insertedLatestWork = true;

                // "Other services" gets its own horizontal row right below
                // the first FAQ section.
                const showOtherServicesAfter = section.type === "faqs" && !insertedOtherServices;
                if (showOtherServicesAfter) insertedOtherServices = true;

                // The statistics bar renders its own <section> (same markup as
                // the homepage), so it skips the generic wrapper below.
                if (section.type === "statistics") {
                  return (
                    <StatisticsBar
                      key={section.dataSection}
                      locations={[]}
                      stats={section.stats}
                    />
                  );
                }

                return (
                  <Fragment key={section.dataSection}>
                    {section.type === "blogs" && (
                      <TestimonialsSection
                        section={TESTIMONIAL_HEAD}
                        testimonials={testimonials}
                      />
                    )}
                    <section
                      data-section={section.dataSection}
                      className={SECTION_CLASS_NAMES[section.type] ?? "service_features"}
                    >
                      {renderSectionBody(section)}
                    </section>
                    {showOtherServicesAfter && otherServices?.items?.length > 0 && (
                      <section data-section="other_services">
                        <OtherServicesSection otherServices={otherServices} />
                      </section>
                    )}
                    {showLatestWorkAfter && <LatestWorkSection latestWork={latestWork} />}
                  </Fragment>
                );
              })}
              {!hasFeatures && <LatestWorkSection latestWork={latestWork} />}
              {/* A service with otherServices data but no FAQ section to pair
                  it with still gets it, on its own, at the end. */}
              {!hasFaqs && otherServices?.items?.length > 0 && (
                <section data-section="other_services">
                  <OtherServicesSection otherServices={otherServices} />
                </section>
              )}
              {!hasBlogs && (
                <TestimonialsSection
                  section={TESTIMONIAL_HEAD}
                  testimonials={testimonials}
                />
              )}
              <ServiceContact />
            </div>
          );
        })()}

        {/* Sectionless services (no CMS `sections` at all) still get
            "Latest work" and "Other services" — the branch above only
            covers when sections exist. */}
        {!(resolvedSections?.length > 0) && (
          <>
            <LatestWorkSection latestWork={latestWork} />
            {otherServices?.items?.length > 0 && (
              <section data-section="other_services">
                <OtherServicesSection otherServices={otherServices} />
              </section>
            )}
            <TestimonialsSection
              section={TESTIMONIAL_HEAD}
              testimonials={testimonials}
            />
            <ServiceContact />
          </>
        )}
      </div>
    </main>
  );
}
