"use client";

import Image from "next/image";
import Link from "@/components/SiteLink";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const USA_OFFICE_ADDRESS = "30 N Gould St, STE R, Sheridan, WY 82801, USA";

// Fallback for offices that have no map link set in the CMS.
const mapsSearchUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

// Email + phone shown under an office address, like the main office has.
// One contact email for every office in the footer.
const CONTACT_EMAIL = "hello@webmaffia.com";
const USA_OFFICE_CONTACT = { email: CONTACT_EMAIL, phone: "+1 (866) 984-9786" };
const OFFICE_CONTACTS = [
  { match: /dubai/i, email: CONTACT_EMAIL, phone: "+971 544949429" },
  { match: /bangaluru|bengaluru/i, email: CONTACT_EMAIL, phone: "+91 9867625909" },
];

const contactFor = (office) =>
  OFFICE_CONTACTS.find(({ match }) => match.test(`${office.city} ${office.address}`));

// "Mumbai (India) 403 A Wing..." -> "Mumbai 403 A Wing..." (the country is the
// heading). The CMS splits the text oddly, so join it first, then drop "(India)".
const officeLabel = (office) =>
  `${office.city ?? ""} ${office.address ?? ""}`
    .replace(/\s*\(\s*India\s*\)/i, "")
    .replace(/\s+/g, " ")
    .trim();

const OfficeContact = ({ email, phone }) =>
  email || phone ? (
    <div className="footer_connect_office_contact">
      {email && <a href={`mailto:${email}`}>{email}</a>}
      {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>}
    </div>
  ) : null;

// "India - Mumbai": the country is bright, the city dimmer; "USA"/"Dubai" fully bright.
const RegionHead = ({ label }) => {
  const m = String(label).match(/^(.+?)(\s+-\s+.+)$/);
  return (
    <div className="footer_connect_region_head">
      <span className="footer_connect_usa_label">
        <span className="footer_connect_label_strong">{m ? m[1] : label}</span>
        {m ? m[2] : null}
      </span>
    </div>
  );
};

const Footer = ({ footerData, campaignSlugs = [], privacyUrl = "/privacy-policy" }) => {
  const pathname = usePathname();
  // Already on the home page: linking to "/" does not move the page, so scroll
  // to the top ourselves. From other pages the normal navigation handles it.
  const handleLogoClick = (event) => {
    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const socialLinks = (footerData?.socialLinks ?? []).filter(
    ({ platform }) => platform !== "X"
  );
  const navLinks = footerData?.navLinks ?? [];
  // App Store Optimization and Influencer Marketing are not listed in the footer.
  const HIDDEN_SERVICES = /app[\s-]*store|influencer/i;
  // The CMS links services as /<slug> on the live site; they live here under
  // /services/<slug>.
  const serviceHref = (href) => {
    const path = String(href ?? "").replace(
      /^https?:\/\/(www\.)?webmaffia\.com(?=\/)/i,
      ""
    );
    if (path.startsWith("/services/")) return path;
    return `/services${path.startsWith("/") ? "" : "/"}${path}`;
  };
  const services = (footerData?.services ?? [])
    .filter(({ href, label }) => !HIDDEN_SERVICES.test(`${label} ${href}`))
    .map((service) => ({ ...service, href: serviceHref(service.href) }));
  const offices = footerData?.offices ?? [];
  const copyright = footerData?.copyright;

  const officeText = (office) => `${office.city} ${office.address}`;
  const mumbaiOffice = offices.find((o) => /mumbai/i.test(officeText(o)));
  const bengaluruOffice = offices.find((o) => /bangaluru|bengaluru/i.test(officeText(o)));
  const dubaiOffice = offices.find((o) => /dubai/i.test(officeText(o)));

  // USA first, then India (Mumbai, Bengaluru), then Dubai. Each is its own block.
  const officeBlock = (office, label, address) => ({
    key: office.id || office.city,
    label,
    address,
    href: office.addressLink || mapsSearchUrl(officeText(office)),
    email: contactFor(office)?.email || CONTACT_EMAIL,
    phone: contactFor(office)?.phone || office.phone,
  });
  const blocks = [
    {
      key: "usa",
      label: "USA",
      address: USA_OFFICE_ADDRESS,
      href: mapsSearchUrl(USA_OFFICE_ADDRESS),
      ...USA_OFFICE_CONTACT,
    },
    mumbaiOffice &&
      officeBlock(mumbaiOffice, "India - Mumbai", officeLabel(mumbaiOffice).replace(/^mumbai\s*/i, "")),
    bengaluruOffice &&
      officeBlock(bengaluruOffice, "India - Bengaluru", officeLabel(bengaluruOffice).replace(/^(bangaluru|bengaluru)\s*/i, "")),
    dubaiOffice && officeBlock(dubaiOffice, "Dubai", dubaiOffice.address),
  ].filter(Boolean);

  // The CMS copyright line still names Pixtop; show Webmaffia LLC instead.
  const copyrightText = (copyright?.description || copyright?.brand || "")
    .replace(/pixtop media solutions(?:\s+(?:pvt\.?\s*ltd\.?|private limited))?/i, "Webmaffia LLC") || null;

  return (
    <footer>
      <div className="footer_nav">
        <div className="footer_col footer_col--connect">
          <div className="footer_col_content">
            <div className="footer_col_title footer_col_title--connect">
              Connect With Us
            </div>
            <p className="footer_connect_subtext">
              Follow our social channels to get a glimpse of Webmaffia
            </p>

            {/* <div className="footer_connect_divider" aria-hidden="true" /> */}

            <div className="footer_social_icons">
              {socialLinks.map(({ platform, url, iconSrc, iconAlt }) =>
                iconSrc ? (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={iconAlt}
                  >
                    <Image src={iconSrc} alt={iconAlt} width={28} height={28} />
                  </a>
                ) : null
              )}
            </div>

            {/* <div className="footer_connect_divider" aria-hidden="true" /> */}

            <div className="footer_iso_certificate_wrap">
              <a
                href="https://cms.webmaffia.com/uploads/ISO_certificate_9e1dbc303c.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="footer_iso_certificate"
                aria-label="ISO/IEC 27001:2022 Certification"
              >
                <Image
                  src="/assets/images/footer/ISO-icon.svg"
                  alt="ISO/IEC 27001:2022 Certification"
                  width={40}
                  height={40}
                />
                <span className="footer_iso_certificate_text">
                  <strong>ISO/IEC 27001:2022</strong>
                  <em>Certificate No. SG/IAS/IS/202402 | Valid until 11/12/2028</em>
                </span>
              </a>
            </div>

            {/* Not shown in the footer any more, but the blog article page uses
                the same Google "preferred source" button and needs this script. */}
            <Script
              src="https://news.google.com/swg/js/v1/publisher.js"
              strategy="lazyOnload"
            />
          </div>
        </div>

        <div className="footer_col footer_col--work">
          <div className="footer_col_content">
            <ul className="footer_links footer_links--nav">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="link" target="_blank" rel="noopener noreferrer">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer_col footer_col--services">
          <div className="footer_col_content">
            <NextLink href="/services" className="footer_col_title">
              Our Services
            </NextLink>
            <ul className="footer_links footer_links--services">
              {services.map(({ href, label }) => (
                <li key={href}>
                  <NextLink href={href} className="link">
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer_connect_details">
        {blocks.map(({ key, label, address, href, email, phone }) => (
          <div className="footer_connect_office footer_connect_usa" key={key}>
            <address>
              <RegionHead label={label} />
              <a href={href} target="_blank" rel="noopener noreferrer">
                {address}
              </a>
            </address>
            <OfficeContact email={email} phone={phone} />
          </div>
        ))}
      </div>

      {/* <div className="footer_logo_divider" aria-hidden="true" /> */}

      {/* Stays on this site (SiteLink would send "/" to the live domain). */}
      <NextLink href="/" className="footer_logo" onClick={handleLogoClick}>
        <Image
          src="/assets/images/maffia-logo.webp"
          alt="Webmaffia"
          width={1318}
          height={210}
        />
      </NextLink>

      <div className="footer_bottom">
        {copyrightText && (
          <div className="footer_copyright">{copyrightText}</div>
        )}
        <div className="footer_legal">
          <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

export const FeatureSwiper = ({ slides }) => (
  <Swiper
    modules={[Autoplay]}
    loop={true}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    className="feature_swiper"
  >
    {slides.map((slide, i) => (
      <SwiperSlide key={i}>{slide}</SwiperSlide>
    ))}
  </Swiper>
);

export const TestimonialSwiper = ({ slides }) => (
  <Swiper
    modules={[Navigation]}
    loop={true}
    navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
    className="testimonial-swiper"
  >
    {slides.map((slide, i) => (
      <SwiperSlide key={i}>{slide}</SwiperSlide>
    ))}
  </Swiper>
);

export const ServiceSwiper = ({ slides }) => (
  <Swiper
    modules={[Autoplay]}
    loop={true}
    autoplay={{ delay: 5000, disableOnInteraction: false }}
    className="service-swiper"
  >
    {slides.map((slide, i) => (
      <SwiperSlide key={i}>{slide}</SwiperSlide>
    ))}
  </Swiper>
);
