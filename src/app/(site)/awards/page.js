import { Fragment } from "react";
import Image from "next/image";
import Banner from "@/components/Banner";
import JsonLd from "@/components/JsonLd";
import { buildBannerCta, getAwards, getStrapiImageUrl } from "@/lib/strapiPage";
import { buildBreadcrumbSchema } from "@/lib/schema";

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Awards", path: "/awards" },
]);

const FALLBACK_CARD_IMAGES = [
  "/assets/images/awards/award-1.webp",
  "/assets/images/awards/award-1.webp",
  "/assets/images/awards/award-1.webp",
  "/assets/images/awards/award-1.webp",
  "/assets/images/awards/award-2.webp",
  "/assets/images/awards/award-3.webp",
];

const FALLBACK_CARDS = [
  { image: FALLBACK_CARD_IMAGES[0], title: "Abby awards", year: "2014", type: "Silver", description: "Best use of Animation\nfor AM / NS India" },
  { image: FALLBACK_CARD_IMAGES[1], title: "Abby awards", year: "2014", type: "Bronze", description: "Best use of Animation\nfor AM / NS India" },
  { image: FALLBACK_CARD_IMAGES[2], title: "Abby awards", year: "2015", type: "Bronze", description: "Best use of Animation\nfor AM / NS India" },
  { image: FALLBACK_CARD_IMAGES[3], title: "Abby awards", year: "2015", type: "Bronze", description: "Best use of Animation\nfor AM / NS India" },
  { image: FALLBACK_CARD_IMAGES[4], title: "Digital crest awards", year: "2015", type: "Gold", description: "Best Website Corporate / Brand" },
  { image: FALLBACK_CARD_IMAGES[5], title: "Kyoorius creative awards", year: "2015", type: "Gold", description: "Best use of Animation\nfor AM / NS India" },
];

function parseAwardDetails(details) {
  const lines = (details || "").split("\n").map((s) => s.trim());
  const nonEmpty = lines.filter(Boolean);
  return {
    year: nonEmpty[0] || "",
    type: nonEmpty[1] || "",
    description: nonEmpty.slice(2).join("\n"),
  };
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

function buildAwardsBannerData(rawBanner) {
  if (!rawBanner) return null;

  const subHeading = rawBanner.subHeading || "";
  const lastSpace = subHeading.lastIndexOf(" ");

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
    priority: true,
    subheading: rawBanner.heading
      ? { enabled: true, text: rawBanner.heading }
      : undefined,
    title: {
      line1: lastSpace > 0 ? subHeading.slice(0, lastSpace) : subHeading,
      ...(lastSpace > 0 ? { line2: subHeading.slice(lastSpace + 1) } : {}),
    },
    description: (rawBanner.description || "").trim(),
    cta: buildBannerCta(rawBanner),
    ...(images ? { images } : {}),
  };
}

export async function generateMetadata() {
  const data = await getAwards();
  const slug = data?.slug || "awards";
  return {
    title: "Webmaffia Awards and Recognition - Digital Marketing Excellence",
    description:
      "Discover Webmaffia's journey of digital marketing excellence through prestigious awards. Celebrating innovation, creativity & success in the industry.",
    alternates: {
      canonical: `https://www.webmaffia.com/${slug}`,
    },
  };
}

export default async function AwardsPage() {
  const data = await getAwards();

  const bannerData = data?.banner
    ? buildAwardsBannerData(data.banner)
    : {
        imagePosition: "right",
        priority: true,
        subheading: { enabled: true, text: "AWARDS" },
        title: { line1: "Glory in", line2: "Achievement" },
        description:
          "Transforming visions into captivating digital landscapes,\nwe crafts tailored solutions that elevate brands and engage\naudiences. With a focus on innovation and precision, we\nbring your online presence to life, delivering seamless user\nexperiences that resonate and inspire.",
      };

  const awardsCards = data?.card?.length
    ? data.card.map((card, index) => {
        const { year, type, description } = parseAwardDetails(card.details);
        return {
          image: card.image
            ? getStrapiImageUrl(card.image)
            : FALLBACK_CARD_IMAGES[index % FALLBACK_CARD_IMAGES.length],
          title: card.name,
          year,
          type,
          description,
        };
      })
    : FALLBACK_CARDS;

  return (
    <main className="wrapper">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <div className="ml-setter awards_page">
        <Banner data={bannerData} />

        <section className="award_section">
          <div className="awards_box">
            {awardsCards.map((award, index) => (
              <div className="awards_item" key={`${award.year}-${award.type}-${index}`}>
                <Image
                  src={award.image}
                  alt=""
                  width={410}
                  height={267}
                  className="dark_img"
                />
                <h2 className="h3">{award.title}</h2>
                <div className="award_date">{award.year}</div>
                <div className="award_type">{award.type}</div>
                <div className="about_award">{renderMultiline(award.description)}</div>
              </div>
            ))}
          </div>
          <Image
            src="/assets/images/award_vector.webp"
            alt=""
            className="award_vector dark_img"
            width={340}
            height={491}
          />
        </section>
      </div>
    </main>
  );
}
