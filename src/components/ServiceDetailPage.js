import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/Banner";
import BlogListItem from "@/components/BlogListItem";
import JsonLd from "@/components/JsonLd";
import ServiceFaqAccordion from "@/components/ServiceFaqAccordion";
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
            <h2
              className={
                feature.influencerTitle
                  ? "feature_title influencer_title"
                  : "feature_title"
              }
              data-sf-number={feature.number}
            >
              {feature.title}
            </h2>
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

function WhyChooseUsSection({ section }) {
  return (
    <>
      {section.heading ? <h2 className="h2">{section.heading}</h2> : null}
      <RichText html={section.description} />
      {section.cta ? (
        <Link href={section.cta.href} className="cta_text">
          <span>{section.cta.text}</span>
        </Link>
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
          <BlogListItem post={post} key={post.slug} />
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
        {section.items.map((item, index) => (
          <div className="industries_cell" key={`${item.title}-${index}`}>
            {item.logo ? (
              <Image
                className="industries_icon"
                src={item.logo.url}
                alt={item.logo.alt}
                width={item.logo.width ?? 110}
                height={item.logo.height ?? 135}
              />
            ) : null}
            <h3 className="industries_name">{item.title}</h3>
          </div>
        ))}
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
                  <Image
                    src={icon.url}
                    title={icon.title}
                    alt={icon.alt}
                    width={icon.width ?? 110}
                    height={icon.height ?? 110}
                  />
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
      return <ServiceFaqAccordion heading={section.heading} items={section.items} />;
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
      <h2 className="h2">Latest work</h2>
      <div className="workspace">
        {latestWork.map((item) => (
          <div className="service_item" key={item.name}>
            <Link href={item.url || "#"} className="service_img">
              <Image src={item.image} alt="" width={821} height={601} />
            </Link>
            <Link href={item.url || "#"}>
              <h3 className="service_name">{item.name}</h3>
              <div className="service_type">{item.type}</div>
            </Link>
          </div>
        ))}
      </div>
      <div className="cta_work">
        <Link href="/case-study" className="cta_text">
          View All <span>Work</span>
        </Link>
      </div>
    </section>
  );
}

function OtherServicesSection({ otherServices }) {
  if (!otherServices?.items?.length) return null;

  // Exactly the blog sidebar's "Services that we cater" box
  // (.aside_title/.service_text, blog-detail.scss) — same narrow vertical
  // list, just fed from the CMS otherServices data instead of a hardcoded
  // array.
  return (
    <div className="other_services">
      <div className="aside_title">{otherServices.heading}</div>
      <div className="other_services_list">
        {otherServices.items.map((item, index) => (
          <Link
            href={item.href}
            className="other_services_item"
            data-service={String(index + 1).padStart(2, "0")}
            key={item.href}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

function FaqsWithOtherServices({ section, otherServices }) {
  const hasOtherServices = Boolean(otherServices?.items?.length);

  return (
    <div className={`faqs_with_other_services${hasOtherServices ? "" : " faqs_with_other_services--solo"}`}>
      <div className="faqs_col">
        <ServiceFaqAccordion heading={section.heading} items={section.items} />
      </div>
      {hasOtherServices && (
        <div className="other_services_col">
          <OtherServicesSection otherServices={otherServices} />
        </div>
      )}
    </div>
  );
}

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
                  alt=""
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
  const dynamicLatestWork = await getLatestWorkItems(2, workCategories ?? []);
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

  const bannerData = {
    imagePosition: "right",
    priority: true,
    cta: hero.cta,
    subheading: {
      enabled: true,
      text: hero.subtitle,
      link: "/services",
      current: breadcrumbs?.length ? breadcrumbs[breadcrumbs.length - 1].name : null,
    },
    title: {
      line1: hero.title,
    },
    images: {
      banner: {
        url: hero.image,
        alt: "",
        width: hero.imageWidth ?? 871,
        height: hero.imageHeight ?? 767,
      },
      bannerMobile: {
        url: hero.mobileImage || "/assets/images/hero-mobile.webp",
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
        <Banner data={bannerData} className={heroClass}>
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

          return (
            <div className="services_parent">
              {resolvedSections.map((section) => {
                const showLatestWorkAfter = section.type === "features" && !insertedLatestWork;
                if (showLatestWorkAfter) insertedLatestWork = true;

                // "Other services" sits beside the first FAQ section rather
                // than as its own row — see FaqsWithOtherServices.
                const pairOtherServicesHere = section.type === "faqs" && !insertedOtherServices;
                if (pairOtherServicesHere) insertedOtherServices = true;

                return (
                  <Fragment key={section.dataSection}>
                    <section
                      data-section={section.dataSection}
                      className={SECTION_CLASS_NAMES[section.type] ?? "service_features"}
                    >
                      {pairOtherServicesHere ? (
                        <FaqsWithOtherServices section={section} otherServices={otherServices} />
                      ) : (
                        renderSectionBody(section)
                      )}
                    </section>
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
          </>
        )}
      </div>
    </main>
  );
}
