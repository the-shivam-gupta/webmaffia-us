"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import Banner from "@/components/Banner";
import StatisticsBar from "@/components/StatisticsBar";
import KlaviyoFormEmbed from "@/components/KlaviyoFormEmbed";

// Where the "Book a 20-min call" button goes (set NEXT_PUBLIC_BOOK_CALL_URL to
// a calendar link, e.g. Calendly / Cal.com; falls back to the contact page).
const BOOK_CALL_URL = process.env.NEXT_PUBLIC_BOOK_CALL_URL || "/contact";

const CALENDAR_ICON =
  '<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';

// Klaviyo renders the form (and its Submit button) asynchronously, outside
// React, so the call button is added next to Submit by watching the form box
// and re-adding it whenever Klaviyo re-renders.
function BookCallButton() {
  useEffect(() => {
    const container = document.querySelector(".banner_media__form");
    if (!container) return undefined;

    const place = () => {
      const submit = container.querySelector("button.klaviyo-form-button");
      if (!submit || submit.parentElement.querySelector(".banner_book_call")) {
        return;
      }
      const link = document.createElement("a");
      link.className = "banner_book_call";
      link.href = BOOK_CALL_URL;
      link.innerHTML = `${CALENDAR_ICON}<span>Book a 20-min call</span>`;
      submit.insertAdjacentElement("afterend", link);
    };

    place();
    const observer = new MutationObserver(place);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

// Renders CMS text, turning line breaks into <br />.
function Lines({ text }) {
  return String(text ?? "")
    .split("\n")
    .map((line, index) => (
      <Fragment key={index}>
        {index > 0 && <br />}
        {line}
      </Fragment>
    ));
}

function SectionHead({ tagline, title }) {
  return (
    <>
      {tagline ? <h2 className="sub_title">{tagline}</h2> : null}
      {title ? (
        <div className="sub_heading">
          <Lines text={title} />
        </div>
      ) : null}
    </>
  );
}

function ServicesSection({ section }) {
  if (!section.cards.length) return null;

  return (
    <section data-section="services" className="services_grid">
      <div className="services_intro">
        <SectionHead tagline={section.tagline} title={section.title} />
        {section.description ? (
          <p className="section_description">{section.description}</p>
        ) : null}
      </div>

      <div className="services_list">
        {section.cards.map((card, index) => (
          <article className="services_item" key={card.id}>
            {card.image ? (
              <Image
                src={card.image.url}
                alt={card.image.alt || card.tagline}
                width={card.image.width}
                height={card.image.height}
                className="dark_img services_item_img"
              />
            ) : null}
            <h3 className="services_item_label">
              {String(index + 1).padStart(2, "0")} / {card.tagline}
            </h3>
            <div className="services_item_heading">
              <Lines text={card.title} />
            </div>
            <p>{card.description}</p>
            {card.button ? (
              <Link href={card.button.href} className="link services_item_link">
                {card.button.title}
              </Link>
            ) : null}
          </article>
        ))}
      </div>

      {section.button ? (
        <div className="services_more">
          <CtaText button={section.button} struckWords={2} />
        </div>
      ) : null}
    </section>
  );
}

function ProjectsSection({ section }) {
  const featuresRef = useRef(null);

  // Reveal the featured-work cards (staggered via --i) once the section
  // scrolls into view. Cards stay visible if IntersectionObserver is missing.
  useEffect(() => {
    const el = featuresRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;

    el.classList.add("reveal_ready");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is_inview");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  if (!section.cards.length) return null;

  return (
    <section data-section="features" className="features" ref={featuresRef}>
      <div className="features_head">
        <div className="features_title">
          <SectionHead tagline={section.tagline} title={section.title} />
        </div>
        {section.description ? (
          <p className="section_description">{section.description}</p>
        ) : null}
      </div>

      <div className="features_grid">
        {section.cards.map((card, index) => (
          <Link
            href={card.button?.href || "/case-study"}
            className="feature_card"
            key={card.id}
            style={{ "--i": index }}
          >
            {card.image ? (
              <Image
                src={card.image.url}
                alt=""
                fill
                sizes="(max-width: 540px) 100vw, 40vw"
                className="feature_card_img"
              />
            ) : null}
            <span className="feature_card_shade" aria-hidden="true" />
            <div className="feature_card_content">
              {card.tags.length ? (
                <ul className="feature_card_tags">
                  {card.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
              <h3 className="feature_card_title">{card.title}</h3>
              <p>{card.description}</p>
              {card.button ? (
                <span className="feature_card_link">
                  {card.button.title} <i aria-hidden="true">&rarr;</i>
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      {section.button ? (
        <div className="features_more">
          <Link href={section.button.href} className="link features_all">
            {section.button.title}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

// "View All Clients" -> View All <span>Clients</span>. `struckWords` is how
// many trailing words get the strike-through (blogs: "View <span>All Blog</span>").
function CtaText({ button, struckWords = 1 }) {
  const words = button.title.split(" ");
  const split = Math.max(words.length - struckWords, 0);

  return (
    <Link href={button.href} className="cta_text">
      {split > 0 ? `${words.slice(0, split).join(" ")} ` : null}
      <span>{words.slice(split).join(" ")}</span>
    </Link>
  );
}

// Logo grid shared by the "clients" and "trophies" sections.
function LogoGridSection({ section }) {
  if (!section.cards.length) return null;

  const isClients = section.type === "clients";

  return (
    <section
      data-section={isClients ? "our_work" : "awards"}
      className={isClients ? "our_work" : "our_work awards"}
    >
      <SectionHead tagline={section.tagline} title={section.title} />
      {section.description ? (
        <p className="section_description">{section.description}</p>
      ) : null}
      <div className="work_box">
        {section.cards.map((card) =>
          isClients ? (
            <Link href="/clients" key={card.id}>
              <Image
                src={card.image.url}
                alt={card.image.alt}
                width={127}
                height={88}
              />
            </Link>
          ) : (
            <div className="awards_work" key={card.id}>
              <Image
                src={card.image.url}
                alt={card.image.alt}
                width={127}
                height={88}
              />
            </div>
          )
        )}
      </div>
      {section.button ? (
        <div className="cta_box">
          <CtaText button={section.button} struckWords={isClients ? 1 : 2} />
        </div>
      ) : null}
    </section>
  );
}

// Photos are intentionally blank placeholders for now.
const TEAM_MEMBERS = [
  { role: "Co Founder", name: "Veera Roy" },
  { role: "Co Founder", name: "Prasad Devadiga" },
  { role: "CTO", name: "Ankit Tomer" },
  { role: "CCO", name: "Prasanna Devadiga" },
];

function TeamSection() {
  return (
    <section data-section="team" className="team_section">
      <SectionHead tagline="Team" title="The brains behind the breakthroughs." />
      <div className="team_grid">
        {TEAM_MEMBERS.map(({ role, name }) => (
          <div className="team_member" key={name}>
            <div className="team_photo" />
            <div className="team_role">{role}</div>
            <div className="team_name">{name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IndustriesSection({ section }) {
  if (!section.cards.length) return null;

  return (
    <section data-section="industries" className="home_industries">
      <div className="home_industries_head">
        <SectionHead tagline={section.tagline} title={section.title} />
        {section.description ? (
          <p className="section_description">{section.description}</p>
        ) : null}
      </div>
      <div className="home_industries_grid">
        {section.cards.map((card) => {
          const content = (
            <>
              <h3 className="home_industries_name">{card.title}</h3>
              {card.subtitle ? (
                <p className="home_industries_clients">{card.subtitle}</p>
              ) : null}
              {card.button ? (
                <span className="home_industries_cta">
                  <span className="home_industries_cta_label">
                    {card.button.title}
                  </span>
                  <i className="home_industries_arrow" aria-hidden="true">
                    &rarr;
                  </i>
                </span>
              ) : null}
            </>
          );

          if (!card.button) {
            return (
              <div className="home_industries_cell" key={card.id}>
                {content}
              </div>
            );
          }

          const isExternal = /^https?:\/\//i.test(card.button.href);

          return isExternal ? (
            <a
              className="home_industries_cell"
              key={card.id}
              href={card.button.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          ) : (
            <Link
              className="home_industries_cell"
              key={card.id}
              href={card.button.href}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Time each testimonial stays before the slider advances.
const TESTIMONIAL_INTERVAL_MS = 4000;

function TestimonialsSection({ section, testimonials }) {
  if (!testimonials.length) return null;

  return (
    <section data-section="testimonial" className="testimonial">
      <div className="testimonial_top">
        <div>
          <SectionHead tagline={section.tagline} title={section.title} />
          {section.description ? (
          <p className="section_description">{section.description}</p>
        ) : null}
        </div>
        <Image
          src="/assets/images/testimonial_img.webp"
          alt="Testimonials"
          width={678}
          height={877}
          className="dark_img"
        />
      </div>

      <Swiper
        modules={[Autoplay]}
        className="testimonial_grid"
        loop={testimonials.length > 3}
        speed={700}
        spaceBetween={40}
        slidesPerView={1}
        autoplay={{
          delay: TESTIMONIAL_INTERVAL_MS,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{ 541: { slidesPerView: 3 } }}
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <figure className="testimonial_card">
              <blockquote className="testimonial_quote">{t.quote}</blockquote>
              <figcaption className="testimonial_person">
                {t.logo ? (
                  <Image
                    src={t.logo.src}
                    alt={t.author}
                    width={t.logo.w}
                    height={t.logo.h}
                    className="testimonial_photo"
                  />
                ) : null}
                <div>
                  <div className="name">{t.author}</div>
                  {t.role ? <div className="work">{t.role}</div> : null}
                </div>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function BlogsSection({ section, blogs }) {
  if (!blogs.length) return null;

  return (
    <section data-section="blogs" className="home_blogs">
      <SectionHead tagline={section.tagline} title={section.title} />
      {section.description ? (
        <p className="section_description">{section.description}</p>
      ) : null}
      <div className="other_blogs">
        {blogs.map((post) => (
          <div className="blog_item" key={post.id}>
            <Link href={post.href}>
              <div className="blog_item_image">
                {post.image ? (
                  <Image
                    src={post.image.url}
                    alt={post.image.alt || post.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                    className="blog_item_img"
                  />
                ) : null}
              </div>
            </Link>
            <div>
              <Link href={post.href}>
                <div className="h5 blog_item_title">{post.title}</div>
                {post.excerpt ? (
                  <p className="home_blogs_excerpt">{post.excerpt}</p>
                ) : null}
                <div className="blog_para">
                  <div className="blogs_date">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {section.button ? (
        <div className="cta_box">
          <CtaText button={section.button} struckWords={2} />
        </div>
      ) : null}
    </section>
  );
}

// "Let's talk" — same Klaviyo form as /contact. The `contact_us` class pulls in
// that page's form styling (labels, inputs, custom select, dark mode).
function ContactSection() {
  return (
    <section data-section="contact" className="home_contact">
      <div className="home_contact_info">
        <h2 className="sub_title">LET&apos;S TALK</h2>
        <div className="sub_heading">
          Let&apos;s make <br />
          you an offer.
        </div>
        <p className="section_description">
          Tell us what you&apos;re building. Within 2 business days,
          we&apos;ll come back with a plan you&apos;ll find very hard to refuse.
        </p>
        <div className="home_contact_details">
          <div className="home_contact_item">
            <span className="home_contact_label">EMAIL</span>
            <a href="mailto:veera@webmaffia.com">veera@webmaffia.com</a>
          </div>
          <div className="home_contact_item">
            <span className="home_contact_label">INDIA · UAE</span>
            <span>
              <a href="tel:+919867625909">+91 98676 25909</a>
              {" · "}
              <a href="tel:+971562722998">+971 56 272 2998</a>
            </span>
          </div>
        </div>
      </div>

      <div className="home_contact_form">
        <KlaviyoFormEmbed formId="Rq3tfh" />
      </div>
    </section>
  );
}

export default function HomePage({
  bannerData = null,
  sections = [],
  testimonials = [],
  blogs = [],
  locations = [],
}) {
  return (
    <main className="wrapper home_wrapper opacity_0">
      <div className="ml-setter">
        {bannerData ? (
          <Banner data={bannerData} mediaOverlay={
            <>
              <p className="banner_media__form_title">Lets talk</p>
              <KlaviyoFormEmbed formId="Rq3tfh" />
              <BookCallButton />
            </>
          }
          />
        ) : null}

        {sections.map((section) => {
          switch (section.type) {
            case "statistics":
              return (
                <StatisticsBar
                  key={section.key}
                  locations={locations}
                  stats={section.stats}
                />
              );
            case "services":
              return <ServicesSection key={section.key} section={section} />;
            case "projects":
              return <ProjectsSection key={section.key} section={section} />;
            case "clients":
              return <LogoGridSection key={section.key} section={section} />;
            case "trophies":
              return (
                <Fragment key={section.key}>
                  <LogoGridSection section={section} />
                  <TeamSection />
                </Fragment>
              );
            case "industries":
              return <IndustriesSection key={section.key} section={section} />;
            case "testimonials":
              return (
                <TestimonialsSection
                  key={section.key}
                  section={section}
                  testimonials={testimonials}
                />
              );
            case "blogs":
              return (
                <BlogsSection key={section.key} section={section} blogs={blogs} />
              );
            default:
              return null;
          }
        })}

        <ContactSection />
      </div>
    </main>
  );
}
