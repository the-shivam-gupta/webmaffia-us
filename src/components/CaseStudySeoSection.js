"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const SEO_SLIDER_SIZES = "(max-width: 769px) 100vw, 80rem";
const SEO_SLIDER_CSS_MODE_QUERY = "(max-width: 769px)";

function normalizeSlide(slide, chartAlt) {
  if (typeof slide === "string") {
    return { src: slide, alt: chartAlt, width: 1672, height: 941 };
  }

  return {
    alt: chartAlt,
    width: 1672,
    height: 941,
    ...slide,
  };
}

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

function ChartSlideImage({ slide, priority = false }) {
  if (!slide?.src) return null;

  return (
    <div className="seo_slider_media">
      <img
        src={slide.src}
        srcSet={slide.srcSet}
        sizes={slide.srcSet ? SEO_SLIDER_SIZES : undefined}
        alt={slide.alt}
        width={slide.width ?? 1672}
        height={slide.height ?? 941}
        className="seo_slider_img"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}

export default function CaseStudySeoSection({
  heading,
  subHeading,
  description,
  chartSlides,
  chartAlt = "SEO growth chart",
}) {
  const [cssMode, setCssMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(SEO_SLIDER_CSS_MODE_QUERY);
    const syncCssMode = () => setCssMode(mediaQuery.matches);

    syncCssMode();
    mediaQuery.addEventListener("change", syncCssMode);

    return () => mediaQuery.removeEventListener("change", syncCssMode);
  }, []);

  return (
    <section data-section="seo_section" className="seo_section">
      <div>
        <SectionTitle heading={heading} className="challenge_content__title" />
        {subHeading ? <h4>{subHeading}</h4> : null}
        {description ? <p>{description}</p> : null}
      </div>
      <div className="seo_slider">
        <Swiper
          key={cssMode ? "seo-slider-css" : "seo-slider-js"}
          modules={[Navigation]}
          className="seo_slider_swiper"
          slidesPerView={1}
          speed={400}
          cssMode={cssMode}
          roundLengths
          navigation={{
            prevEl: ".seo_slider .seo_slider_prev",
            nextEl: ".seo_slider .seo_slider_next",
          }}
        >
          {chartSlides.map((slide, index) => {
            const normalizedSlide = normalizeSlide(slide, chartAlt);

            return (
              <SwiperSlide key={normalizedSlide.src}>
                <ChartSlideImage
                  slide={normalizedSlide}
                  priority={index === 0}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <nav className="seo_slider_nav" aria-label="Chart navigation">
          <button type="button" className="seo_slider_prev cta_text">
            <span>Previous</span>
          </button>
          <button type="button" className="seo_slider_next cta_text">
            <span>Next</span>
          </button>
        </nav>
      </div>
    </section>
  );
}
