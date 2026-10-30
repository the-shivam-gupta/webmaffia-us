"use client";

import Image from "next/image";
import Link from "@/components/SiteLink";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

// TODO: placeholder - replace with the real USA office address.
const USA_OFFICE_ADDRESS = "123 Main Street, New York, NY 10001, United States";

// Fallback for offices that have no map link set in the CMS.
const mapsSearchUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

// Email + phone shown under an office address, like the main office has.
// One contact email for every office in the footer.
const CONTACT_EMAIL = "hello@webmaffia.com";
const USA_OFFICE_CONTACT = { email: CONTACT_EMAIL, phone: "+1 866-984-9786" };
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
      {email && phone ? <span aria-hidden="true"> | </span> : null}
      {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>}
    </div>
  ) : null;

const Footer = ({ footerData, campaignSlugs = [] }) => {
  const pathname = usePathname();
  const slugMatch = pathname?.match(/^\/case-study\/([^/]+)$/);
  const isCampaignPage =
    slugMatch?.[1] != null && campaignSlugs.includes(slugMatch[1]);
  const showContactIllustration = Boolean(slugMatch) && !isCampaignPage;

  const socialLinks = (footerData?.socialLinks ?? []).filter(
    ({ platform }) => platform !== "X"
  );
  const navLinks = footerData?.navLinks ?? [];
  // App Store Optimization and Influencer Marketing are not listed in the footer.
  const HIDDEN_SERVICES = /app[\s-]*store|influencer/i;
  const services = (footerData?.services ?? []).filter(
    ({ href, label }) => !HIDDEN_SERVICES.test(`${label} ${href}`)
  );
  const offices = footerData?.offices ?? [];
  const copyright = footerData?.copyright;

  const officeText = (office) => `${office.city} ${office.address}`;
  const mumbaiOffice = offices.find((o) => /mumbai/i.test(officeText(o)));
  const bengaluruOffice = offices.find((o) => /bangaluru|bengaluru/i.test(officeText(o)));
  const dubaiOffice = offices.find((o) => /dubai/i.test(officeText(o)));
  const indiaOffices = [mumbaiOffice, bengaluruOffice].filter(Boolean);

  const copyrightText = copyright?.description || copyright?.brand || null;

  return (
    <footer>
      {showContactIllustration ? (
        <div className="footer_contact_illustration_layer" aria-hidden="true">
          <Image
            src="/assets/images/hands.svg"
            alt=""
            width={871}
            height={767}
            className="footer_contact_illustration"
          />
        </div>
      ) : null}

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

            <div className="footer_pixtop_logo">
              <Image src="/assets/images/pixtop-logo.svg" alt="Pixtop Logo" width={100} height={50} />
              <p>PIXTOP MEDIA SOLUTIONS PVT LTD</p>
            </div>

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

            <div className="footer_connect_details">
              {/* TODO: placeholder - replace with the real USA office address. */}
              <div className="footer_connect_office footer_connect_usa">
                <address>
                  <div className="footer_connect_region_head">
                    <span className="footer_connect_usa_label">USA</span>
                    <span className="footer_connect_usa_colon" aria-hidden="true">
                      :
                    </span>
                  </div>
                  <a
                    href={mapsSearchUrl(`USA ${USA_OFFICE_ADDRESS}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {USA_OFFICE_ADDRESS}
                  </a>
                </address>
                <OfficeContact {...USA_OFFICE_CONTACT} />
              </div>

              {/* India: Mumbai and Bengaluru under one heading. */}
              {indiaOffices.length > 0 && (
                <div className="footer_connect_office footer_connect_region">
                  <div className="footer_connect_region_head">
                    <span className="footer_connect_usa_label">India</span>
                    <span className="footer_connect_usa_colon" aria-hidden="true">
                      :
                    </span>
                  </div>
                  <div className="footer_connect_region_items">
                    {indiaOffices.map((office) => (
                      <div
                        className="footer_connect_region_item"
                        key={office.id || office.city}
                      >
                        <address>
                          <a
                            href={office.addressLink || mapsSearchUrl(`${office.city} ${office.address}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {officeLabel(office)}
                          </a>
                        </address>
                        <OfficeContact
                          email={contactFor(office)?.email || CONTACT_EMAIL}
                          phone={contactFor(office)?.phone || office.phone}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* UAE: "Dubai :" before the address, like the USA block. */}
              {dubaiOffice && (
                <div className="footer_connect_office footer_connect_usa footer_connect_dubai">
                  <address>
                    <div className="footer_connect_region_head">
                      <span className="footer_connect_usa_label">Dubai</span>
                      <span className="footer_connect_usa_colon" aria-hidden="true">
                        :
                      </span>
                    </div>
                    <a
                      href={dubaiOffice.addressLink || mapsSearchUrl(`${dubaiOffice.city} ${dubaiOffice.address}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {dubaiOffice.address}
                    </a>
                  </address>
                  <OfficeContact
                    email={contactFor(dubaiOffice)?.email || CONTACT_EMAIL}
                    phone={contactFor(dubaiOffice)?.phone || dubaiOffice.phone}
                  />
                </div>
              )}
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
            <Link href="/services" className="footer_col_title" target="_blank" rel="noopener noreferrer">
              Our Services
            </Link>
            <ul className="footer_links footer_links--services">
              {services.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="link" target="_blank" rel="noopener noreferrer">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* <div className="footer_logo_divider" aria-hidden="true" /> */}

      <Link
        href="https://www.webmaffia.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="footer_logo"
      >
        <Image
          src="/assets/images/maffia-logo.webp"
          alt="Webmaffia"
          width={1318}
          height={210}
        />
      </Link>

      {copyrightText && (
        <div className="footer_copyright">{copyrightText}</div>
      )}
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
