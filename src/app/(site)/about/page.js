import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/Banner";
import JsonLd from "@/components/JsonLd";
import { buildBannerCta, getAboutUs, getStrapiImageUrl } from "@/lib/strapiPage";
import {
  buildBreadcrumbSchema,
  ORGANIZATION_SCHEMA,
  LOCAL_BUSINESS_SCHEMA,
} from "@/lib/schema";

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
]);

const ABOUT_AWARDS = [
  { src: "/assets/images/awards/img-1.webp", alt: "Award 1" },
  { src: "/assets/images/awards/img-2.webp", alt: "Award 2" },
  { src: "/assets/images/awards/arvind.png", alt: "Award 3" },
  { src: "/assets/images/awards/img-4.webp", alt: "Award 4" },
  { src: "/assets/images/awards/img-5.webp", alt: "Award 5" },
  { src: "/assets/images/awards/img-6.webp", alt: "Award 6" },
  { src: "/assets/images/awards/img-7.webp", alt: "Award 7" },
  { src: "/assets/images/awards/img-8.webp", alt: "Award 8" },
];

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
    cta: buildBannerCta(rawBanner),
    ...(images ? { images } : {}),
  };
}

export async function generateMetadata() {
  const data = await getAboutUs();
  const slug = data?.slug || "about";
  return {
    title: "About Webmaffia - Taking Marketing to Another Level",
    description:
      data?.banner?.description
        ? splitParagraphs(data.banner.description)[0]?.replace(/\n/g, " ").slice(0, 160) || ""
        : "An award-winning digital agency with a strong foothold in creative thinking & execution, Webmaffia is growing in creative strength with every passing year.",
    alternates: {
      canonical: `https://www.webmaffia.com/${slug}`,
    },
  };
}

export default async function AboutPage() {
  const raw = await getAboutUs();

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

  return (
    <main className="wrapper about_wrapper">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />
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

        <div className="about_award">
          <section data-section="awards" className="our_work awards">
            <h2 className="sub_heading">
              Latest <br /> wins
            </h2>
            <div className="work_box">
              {ABOUT_AWARDS.map((award) => (
                <Link href="/awards" key={award.src}>
                  <Image
                    src={award.src}
                    alt={award.alt}
                    width={150}
                    height={130}
                  />
                </Link>
              ))}
            </div>
          </section>
          <div className="about_cta">
            <Link href="/services" className="cta_text">
              Next up <span>Services</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
