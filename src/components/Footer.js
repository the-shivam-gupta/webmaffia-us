"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

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
  const services = footerData?.services ?? [];
  const offices = footerData?.offices ?? [];
  const copyright = footerData?.copyright;

  const primaryOffice = offices[0];
  const secondaryOffices = offices.slice(1);

  const primaryEmail = primaryOffice?.email || null;
  const primaryPhone = primaryOffice?.phone || null;

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
              {primaryOffice && (
                <div className="footer_connect_primary">
                  <a
                    href={primaryOffice.addressLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer_connect_primary_address"
                  >
                    {primaryOffice.city} {primaryOffice.address}
                  </a>
                  {(primaryEmail || primaryPhone) && (
                    <div className="footer_connect_primary_contact">
                      {primaryEmail && (
                        <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>
                      )}
                      {primaryEmail && primaryPhone ? (
                        <span aria-hidden="true"> | </span>
                      ) : null}
                      {primaryPhone && (
                        <a href={`tel:${primaryPhone.replace(/\s/g, "")}`}>
                          {primaryPhone}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {secondaryOffices.length > 0 && (
                <div className="footer_connect_offices">
                  {secondaryOffices.map((office) => (
                    <div className="footer_connect_office" key={office.id || office.city}>
                      <address>
                        <a
                          href={office.addressLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {office.city} {office.address}
                        </a>
                      </address>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Script
              src="https://news.google.com/swg/js/v1/publisher.js"
              strategy="lazyOnload"
            />
            <div className="footer_google_source_wrap">
              {/* Google's script only scans the DOM once, so render both
                  themes up front and toggle visibility with CSS. */}
              <div
                className="footer_google_source_light"
                google-add-preferred-source-btn=""
                data-theme="light"
              />
              <div
                className="footer_google_source_dark"
                google-add-preferred-source-btn=""
                data-theme="dark"
              />
            </div>
          </div>
        </div>

        <div className="footer_col footer_col--work">
          <div className="footer_col_content">
            <ul className="footer_links footer_links--nav">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer_col footer_col--services">
          <div className="footer_col_content">
            <Link href="/services" className="footer_col_title">Our Services</Link>
            <ul className="footer_links footer_links--services">
              {services.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="link">
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
