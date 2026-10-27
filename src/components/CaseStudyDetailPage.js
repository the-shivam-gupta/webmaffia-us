"use client";

import Image from "next/image";
import Banner from "@/components/Banner";
import CaseStudyCreativeSection from "@/components/CaseStudyCreativeSection";
import CaseStudySeoSection from "@/components/CaseStudySeoSection";
import ContactFormSection from "@/components/ContactFormSection";
import {
  isRichTextDescription,
  isSolutionBlock,
  parseSimpleBulletItems,
  parseTitledBulletItems,
} from "@/lib/case-study-helpers";

function SectionTitle({ heading, className }) {
  const text = String(heading ?? "").trim();
  if (!text) return null;

  const words = text.split(/\s+/);
  if (words.length <= 1) {
    return <h2 className={className}>{text}</h2>;
  }

  const lastWord = words.pop();

  return (
    <h2 className={className}>
      {words.join(" ")}
      <br />
      {lastWord}
    </h2>
  );
}

function ContentBlockImage({ image }) {
  if (!image?.src) return null;

  return (
    <picture className="detail_section_media">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width ?? 684}
        height={image.height ?? 835}
        className="dark_img detail_section_img"
        unoptimized={image.unoptimized}
      />
    </picture>
  );
}

function ContentBlockSection({
  block,
  index,
}) {
  const isSolution = isSolutionBlock(block, index);
  const sectionClass = isSolution ? "detail_solution flex" : "detail_challenge flex";
  const description = String(block.description ?? "").trim();
  const isRichText = isRichTextDescription(description);
  const { intro, items, outro: simpleOutro } = parseSimpleBulletItems(description);
  const { items: titledItems, outro: titledOutro } = parseTitledBulletItems(
    description
  );
  const useTitledList =
    !isRichText && isSolution && titledItems.some((item) => item.body);
  const outro = useTitledList ? titledOutro : simpleOutro;
  const hasBulletList = useTitledList
    ? titledItems.length > 0
    : items.length > 0;

  return (
    <section
      data-section={isSolution ? "detail_solution" : "detail_challenge"}
      className={sectionClass}
    >
      <div>
        {block.tagLine ? <div className="sub_title">{block.tagLine}</div> : null}
        <SectionTitle heading={block.heading} className="challenge_content__title" />
        {block.subHeading ? (
          isSolution ? (
            <h4>{block.subHeading}</h4>
          ) : (
            <p className="challenge_content__para">{block.subHeading}</p>
          )
        ) : null}
        {isRichText ? (
          <div
            className="challenge_content__rich_text"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <>
            {intro && hasBulletList && !useTitledList ? (
              <h3 className="challenge_content__title_2">{intro}</h3>
            ) : null}
            {useTitledList && titledItems.length > 0 ? (
              <ul className="jashList2">
                {titledItems.map((item) => (
                  <li key={item.title}>
                    <h5>{item.title}</h5>
                    {item.body ? <p>{item.body}</p> : null}
                  </li>
                ))}
              </ul>
            ) : items.length > 0 ? (
              <ul className="jashList">
                {items.map((item) => (
                  <li key={item}>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            ) : !block.subHeading && description ? (
              <p className="challenge_content__para">{description}</p>
            ) : null}
            {outro ? <p className="challenge_content__para">{outro}</p> : null}
          </>
        )}
      </div>
      <ContentBlockImage image={block.image} />
    </section>
  );
}

export default function CaseStudyDetailPage({ caseStudy }) {
  const {
    slug,
    banner,
    contentBlocks,
    showcase,
    testimonial,
    sections,
  } = caseStudy;

  return (
    <main className="wrapper">
      <div className="ml-setter case_study_detail">
        {banner ? <Banner data={banner} /> : null}

        {contentBlocks.length > 0 || showcase ? (
          <div className="case_study_container">
            <div className="detail_sections">
            {contentBlocks.map((block, index) => (
              <ContentBlockSection
                key={`${block.heading}-${index}`}
                block={block}
                index={index}
              />
            ))}

            {showcase?.desktopImage ? (
              <div className="case_study_showcase_wrapper">
                <picture className="case_study_showcase">
                  {showcase.mobileImage?.src ? (
                    <source
                      media="(max-width: 540px)"
                      srcSet={showcase.mobileImage.src}
                    />
                  ) : null}
                  <Image
                    src={showcase.desktopImage.src}
                    alt={showcase.desktopImage.alt}
                    width={showcase.desktopImage.width ?? 1920}
                    height={showcase.desktopImage.height ?? 981}
                    className="dark_img"
                  />
                </picture>
                {showcase.button?.href ? (
                  <button type="button" className="visit_website_button">
                    <a
                      href={showcase.button.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {showcase.button.title || "Check the website"}
                    </a>
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
          </div>
        ) : null}

        {sections.map((section, index) => {
          if (section.type === "seo" && section.chartSlides.length > 0) {
            return (
              <CaseStudySeoSection
                key={`seo-${index}`}
                heading={section.heading}
                subHeading={section.subHeading}
                description={section.description}
                chartSlides={section.chartSlides}
              />
            );
          }

          if (
            section.type === "creatives" &&
            (section.posts.length > 0 || section.reels.length > 0)
          ) {
            return (
              <CaseStudyCreativeSection
                key={`creatives-${index}`}
                instagramUrl={section.instagramUrl}
                instagramLinkText={section.instagramLinkText}
                posts={section.posts}
                reels={section.reels}
              />
            );
          }

          return null;
        })}

        {testimonial ? (
          <section data-section="client_work" className="client_work">
            <h2 className="client_work__title">
              Don&apos;t just take our <br />
              word for it
            </h2>
            <div className="client_para">Read what our client have to say</div>
            <div className="client_testimonial">
              <div className="testimonial_wrapper">
                <div className="swiper-slide">
                  <div className="testimonial_content">
                    {testimonial.description}
                  </div>
                  <div className="company">
                    {testimonial.icon ? (
                      <Image
                        src={testimonial.icon.src}
                        alt={testimonial.icon.alt}
                        width={91}
                        height={91}
                      />
                    ) : null}
                    <div>
                      <div className="name">{testimonial.name}</div>
                      <div className="work">{testimonial.designation}</div>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src="/assets/images/testimonial_img.webp"
                alt=""
                className="client_img"
                width={678}
                height={877}
              />
            </div>
          </section>
        ) : null}

        <section data-section="contact_section" className="case_study_contact_section">
          <ContactFormSection variant="light" />
        </section>
      </div>
    </main>
  );
}
