import Image from "next/image";
import Banner from "@/components/Banner";
import JsonLd from "@/components/JsonLd";
import KlaviyoFormEmbed from "@/components/KlaviyoFormEmbed";
import {
  buildBreadcrumbSchema,
  ORGANIZATION_SCHEMA,
  LOCAL_BUSINESS_SCHEMA,
} from "@/lib/schema";

export const metadata = {
  alternates: {
    canonical: "https://www.webmaffia.com/contact",
  },
};

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
]);

const bannerData = {
  imagePosition: "right",
  subheading: {
    enabled: true,
    text: "CONTACT",
  },
  title: {
    line1: "Start reaching",
    line2: "your digital",
    line3: "goals",
  },
  images: {
    banner: {
      url: "/assets/images/contact-banner.svg",
      alt: "",
      width: 871,
      height: 767,
    },
    bannerMobile: {
      url: "/assets/images/hero-mobile.webp",
      alt: "",
    },
  },
};

export default function ContactPage() {
  return (
    <main className="wrapper">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />
      <div className="ml-setter contact_us">
        <Banner data={bannerData}>
          <p>
            We&apos;re excited to work with you soon! Please drop <br />
            an email with your details & requirements to
            <br />
            <a href="mailto:veera@webmaffia.com">veera@webmaffia.com</a>
          </p>
          <p>
            You can also fill this form & we&apos;ll get back in 2 <br />
            business days.
          </p>
        </Banner>

        <div className="form">
          <KlaviyoFormEmbed />
        </div>

        <section className="contact_address">
          <div>
            <div>
              <div className="h2">Address</div>
              <div className="country_container">
                <div className="country_region">
                  <div className="region_text">Mumbai (India)</div>
                  <address>
                    <a
                      href="https://maps.app.goo.gl/iPvLshVht1xP6hT1A"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      403 A Wing, Cello Triumph, <br />
                      IB Patel Rd, Jay Prakash Nagar, <br />
                      Goregaon (E) , Mumbai - 400063
                    </a>
                  </address>
                  <div className="contact_info">
                    <a href="mailto:veera@webmaffia.com">veera@webmaffia.com</a>
                    <a href="tel:+919867625909">+91 9867625909</a>
                  </div>
                </div>
                <div className="country_region">
                  <div className="region_text">Bangaluru</div>
                  <address>
                    <a
                      href="https://maps.app.goo.gl/iPvLshVht1xP6hT1A"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Brigade Exotica - Burgundy <br />
                      Unit 2503, <br />
                      Old Madras Road, <br />
                      Bengaluru - 560049
                    </a>
                  </address>
                  <div className="contact_info">
                    <a href="mailto:veera@webmaffia.com">veera@webmaffia.com</a>
                    <a href="tel:+919867625909">+91 9867625909</a>
                  </div>
                </div>
                <div className="country_region">
                  <div className="region_text">Dubai (UAE)</div>
                  <address>
                    <div className="contact_persons_row">
                    <div className="contact_info">
                      <span className="contact_person">Veera Ghyara Roy <br />Co-Founder</span>
                        <a href="mailto:veera@webmaffia.com">veera@webmaffia.com</a>
                        <a href="tel:+971562722998">+971 56 272 2998</a>
                      </div>
                      <div className="contact_info">
                      <span className="contact_person">Sheetal Gandhi <br />Regional Expansion Lead</span>
                        <a href="mailto:sheetal.gandhi@webmaffia.com">sheetal.gandhi@webmaffia.com</a>
                        <a href="tel:+971544949429">+971 544949429</a>
                      </div>
                    </div>
                  </address>
                </div>
              </div>
            </div>
            <div className="follow_us">
              <div className="h2">Follow us</div>
              <div>
                <a
                  href="https://www.facebook.com/Webmaffia/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/images/icons/fb.webp"
                    alt="Facebook"
                    width={50}
                    height={50}
                  />
                </a>
                <a
                  href="https://in.linkedin.com/company/webmaffia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/images/icons/linkedin.webp"
                    alt="LinkedIn"
                    width={50}
                    height={50}
                  />
                </a>
                <a
                  href="https://www.instagram.com/webmaffia/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/images/icons/insta.webp"
                    alt="Instagram"
                    width={50}
                    height={50}
                  />
                </a>
              </div>
            </div>
          </div>
          <Image
            src="/assets/images/testimonial_img.webp"
            alt=""
            width={678}
            height={877}
            className="dark_img"
          />
        </section>
      </div>
    </main>
  );
}
