import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/Banner";
import JsonLd from "@/components/JsonLd";
import ServiceTagSwiper from "@/components/ServiceTagSwiper";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { buildBannerCta, getServicesPage, getStrapiImageUrl } from "@/lib/strapiPage";

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
]);

const FALLBACK_BANNER_DATA = {
  imagePosition: "right",
  subheading: {
    enabled: true,
    text: "OUR SERVICES",
  },
  title: {
    line1: "Creating a",
    line2: "platform for your",
    line3: "purpose",
  },
  description:
    "Transforming visions into captivating digital landscapes,\nwe crafts tailored solutions that elevate brands and engage\naudiences. With a focus on innovation and precision, we\nbring your online presence to life, delivering seamless user\nexperiences that resonate and inspire.",
};

function splitTitleLines(text, maxLines = 3) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return { line1: "" };

  const totalLen = words.reduce((sum, word, i) => sum + word.length + (i ? 1 : 0), 0);
  const targetPerLine = totalLen / Math.min(maxLines, words.length);

  const lines = [];
  let current = [];
  let currentLen = 0;

  for (const word of words) {
    const wordLen = word.length + (current.length ? 1 : 0);
    if (
      current.length &&
      currentLen + wordLen > targetPerLine &&
      lines.length < maxLines - 1
    ) {
      lines.push(current.join(" "));
      current = [];
      currentLen = 0;
    }
    currentLen += wordLen;
    current.push(word);
  }
  if (current.length) lines.push(current.join(" "));

  return {
    line1: lines[0] || "",
    ...(lines[1] ? { line2: lines[1] } : {}),
    ...(lines[2] ? { line3: lines[2] } : {}),
  };
}

function buildServicesBannerData(rawBanner) {
  if (!rawBanner) return FALLBACK_BANNER_DATA;

  let images;
  if (rawBanner.desktopImage?.url) {
    images = {
      banner: {
        url: getStrapiImageUrl(rawBanner.desktopImage),
        alt: rawBanner.desktopImage.alternativeText || "",
        width: rawBanner.desktopImage.width || 871,
        height: rawBanner.desktopImage.height || 767,
      },
    };
    if (rawBanner.mobileImage?.url) {
      images.bannerMobile = {
        url: getStrapiImageUrl(rawBanner.mobileImage),
        alt: rawBanner.mobileImage.alternativeText || "",
      };
    }
  }

  return {
    imagePosition: rawBanner.imagePosition || "right",
    overlay: rawBanner.overlay ?? undefined,
    overlayColor: rawBanner.overlayColor ?? undefined,
    subheading: rawBanner.heading
      ? { enabled: true, text: rawBanner.heading }
      : undefined,
    title: splitTitleLines(rawBanner.subHeading),
    description: rawBanner.description || undefined,
    cta: buildBannerCta(rawBanner),
    ...(images ? { images } : {}),
  };
}

const SERVICE_SECTIONS = [
  {
    imageFirst: true,
    title: (
      <>
        Digital <br />
        Strategy
      </>
    ),
    img: { src: "/assets/images/number/1.webp", alt: "Digital Strategy" },
    slides: ["Brand Positioning", "Competitive", "Brand Positioning", "Competitive"],
    body: (
      <>
        We understand that a digital marketing strategy <br />
        goes beyond the traditional approach towards strategizing <br />
        a campaign. This is why we draw our talent from agencies <br />
        specializing in digital strategy and consulting firms.
      </>
    ),
    href: "/services/digital-strategy",
  },
  {
    imageFirst: false,
    title: (
      <>
        Design & <br />
        Development
      </>
    ),
    img: { src: "/assets/images/number/2.webp", alt: "Design and Development" },
    slides: ["Development", "Hosting"],
    body: (
      <>
        We blur the lines between Design and development <br />
        to create work that inspires delight. Our web design <br />
        and development section specializes in crafting innovative <br />
        digital experiences tailored to elevate brands and <br />
        captivate audiences.
      </>
    ),
    href: "/services/website-design-development-services",
  },
  {
    imageFirst: true,
    title: <>SEO</>,
    img: { src: "/assets/images/number/3.webp", alt: "SEO" },
    slides: ["Backlinks", "On-Page"],
    body: (
      <>
        In a world where Search is the point of discovery <br />
        for almost all consumers, a solid SEO strategy is crucial <br />
        for any brand to taste digital success. Brand awareness, <br />
        increasing website traffic, generating leads, and converting them, <br />
        no matter what your objective, SEO has a crucial part to play.
      </>
    ),
    href: "/services/search-engine-optimization-services",
  },
  {
    imageFirst: false,
    title: (
      <>
        AI-Powered <br />
        Solutions
      </>
    ),
    img: { src: "/assets/images/number/4.webp", alt: "AI-Powered Solutions" },
    slides: ["Consulting", "Chatbots", "Generative AI Solutions", "Automation", "Agents"],
    body: (
      <>
        This is where things get interesting. We take AI<br /> out of the "nice to have" pile and put it to work<br /> automating the boring stuff, sharpening how customers<br /> experience your brand, and giving marketing and<br /> operations a real upgrade. No jargon, no gimmicks,<br /> just solutions that actually move the needle for your business.
      </>
    ),
    href: "/services/ai-powered-solutions-services",
  },
  {
    imageFirst: true,
    title: (
      <>
        Social <br />
        media
      </>
    ),
    img: { src: "/assets/images/number/5.webp", alt: "Social Media" },
    slides: ["Engagement", "Hashtag"],
    body: (
      <>
        Social media is the backbone of digital marketing; <br />
        for a good reason. Where else will we be able to zero <br />
        in on the perfect audience for our brand, and then customize <br />
        our message to best appeal to them? We understand it is a crucial <br />
        component of a social media agency, and we go to great lengths <br />
        to do justice to it.
      </>
    ),
    href: "/services/social-media-marketing-strategy",
  },
  {
    imageFirst: false,
    title: (
      <>
        Content <br />
        Marketing
      </>
    ),
    img: { src: "/assets/images/number/6.webp", alt: "Content Marketing" },
    slides: ["Backlinks", "On-Page"],
    body: (
      <>
        Original Content - Blog and Copywriting <br />
        Our wordsmiths create compelling ad copy, <br />
        editorial pieces and other original content <br />
        that prioritizes impact, clarity and <br />
        empathy over mere loudness. We put customer <br />
        intent behind every word we craft to drive <br />
        clicks and shares.
      </>
    ),
    href: "/services/content-marketing-strategy",
  },
  {
    imageFirst: true,
    title: (
      <>
        App Store <br />
        Optimization
      </>
    ),
    img: { src: "/assets/images/number/7.webp", alt: "App Store Optimization" },
    slides: ["Backlinks", "On-Page"],
    body: (
      <>
        Want to Dominate App Stores? Our app store <br />
        optimization services will ensure that among hundreds <br />
        of apps your users are able to find your app in your <br />
        targeted App Store. Want to improve your play store <br />
        rankings? Partner With us.
      </>
    ),
    href: "/services/app-store-optimization",
  },
];

function ServiceSection({ imageFirst, title, img, slides, body, href }) {
  const image = (
    <Image
      src={img.src}
      alt={img.alt}
      width={674}
      height={568}
      className="dark_img"
    />
  );

  const content = (
    <div>
      <h2>{title}</h2>
      <ServiceTagSwiper items={slides} />
      <p>{body}</p>
      <Link href={href} className="cta_text">
        Take a <span>Look</span>
      </Link>
    </div>
  );

  return (
    <section data-section="" className="flex">
      {imageFirst ? (
        <>
          {image}
          {content}
        </>
      ) : (
        <>
          {content}
          {image}
        </>
      )}
    </section>
  );
}

export default async function ServicesPage() {
  const servicesPage = await getServicesPage();
  const bannerData = buildServicesBannerData(servicesPage?.banner);

  return (
    <main className="wrapper">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <div className="services ml-setter">
        <Banner data={bannerData} />

        <div>
          {SERVICE_SECTIONS.map((service) => (
            <ServiceSection key={service.href} {...service} />
          ))}
        </div>
      </div>
    </main>
  );
}
