"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const MODAL_ANIMATION_MS = 350;

const CREATIVE_SWIPER_SETTINGS = {
  slidesPerView: "auto",
  slidesPerGroup: 1,
  spaceBetween: 12,
  speed: 450,
  grabCursor: true,
  watchOverflow: true,
  breakpoints: {
    541: {
      spaceBetween: 10,
    },
    1024: {
      spaceBetween: 20,
    },
    1440: {
      spaceBetween: 24,
    },
  },
};

export default function CaseStudyCreativeSection({
  instagramUrl,
  posts = [],
  reels = [],
  instagramLinkText = "Check the On Instagram",
}) {
  const videoRef = useRef(null);
  const closeTimerRef = useRef(null);
  const hasPosts = posts.length > 0;
  const hasReels = reels.length > 0;
  const [activeTab, setActiveTab] = useState(
    hasPosts ? "posts" : hasReels ? "reels" : "posts"
  );
  const [activeItem, setActiveItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isPosts = hasPosts && (!hasReels || activeTab === "posts");
  const showModal = (isOpen || isClosing) && activeItem;

  useEffect(() => {
    if (activeTab === "posts" && !hasPosts && hasReels) {
      setActiveTab("reels");
    }

    if (activeTab === "reels" && !hasReels && hasPosts) {
      setActiveTab("posts");
    }
  }, [activeTab, hasPosts, hasReels]);

  const openLightbox = (item) => {
    setActiveItem(item);
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    if (isClosing || !isOpen) return;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsClosing(true);

    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setActiveItem(null);
    }, MODAL_ANIMATION_MS);
  }, [isClosing, isOpen]);

  useEffect(() => {
    if (!isOpen || isClosing) return;

    document.body.style.overflow = "hidden";

    const playTimer =
      activeItem?.type === "reel" && activeItem.video
        ? window.setTimeout(() => {
            videoRef.current?.play();
          }, MODAL_ANIMATION_MS)
        : undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (playTimer) window.clearTimeout(playTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isClosing, activeItem, handleClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <section data-section="creative_section" className="creative_section">
        <div className="creative_section_header">
          <div className="creative_section_intro">
            <h2 className="challenge_content__title">Creatives</h2>
            {hasPosts || hasReels ? (
              <div className="creative_tabs" role="tablist" aria-label="Creative content type">
                {hasPosts ? (
                  <button
                    type="button"
                    className={`creative_tab${isPosts ? " creative_tab--active" : ""}`}
                    role="tab"
                    aria-selected={isPosts}
                    onClick={() => setActiveTab("posts")}
                  >
                    Posts
                  </button>
                ) : null}
                {hasReels ? (
                  <button
                    type="button"
                    className={`creative_tab${!isPosts ? " creative_tab--active" : ""}`}
                    role="tab"
                    aria-selected={!isPosts}
                    onClick={() => setActiveTab("reels")}
                  >
                    Reels
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              className="creative_instagram_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {instagramLinkText}
              <Image
                src="/assets/images/footer/instagram.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
            </a>
          ) : null}
        </div>

        <div key={activeTab} className="creative_content">
          {isPosts ? (
            <div className="creative_posts">
              <div className="creative_posts_viewport">
                <Swiper
                  modules={[Navigation]}
                  className="creative_posts_swiper"
                  {...CREATIVE_SWIPER_SETTINGS}
                  navigation={{
                    prevEl: ".creative_posts .creative_posts_prev",
                    nextEl: ".creative_posts .creative_posts_next",
                  }}
                >
                  {posts.map(({ src, alt }, index) => (
                    <SwiperSlide key={`${src}-${index}`}>
                      <button
                        type="button"
                        className="creative_post_card"
                        onClick={() =>
                          openLightbox({ type: "post", src, alt })
                        }
                        aria-label={`View ${alt}`}
                      >
                        <div className="creative_post_media">
                          <Image
                            src={src}
                            alt={alt}
                            fill
                            sizes="48rem"
                            className="creative_post_img"
                          />
                          {/* <span className="creative_card_fullsize" aria-hidden="true">
                            <Image
                              src="/assets/icons/full-size.png"
                              alt=""
                              width={32}
                              height={32}
                            />
                          </span> */}
                        </div>
                        <span className="creative_card_label">View Full Screen</span>
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <nav className="creative_posts_nav" aria-label="Posts navigation">
                <button type="button" className="creative_posts_prev cta_text">
                  <span>Previous</span>
                </button>
                <button type="button" className="creative_posts_next cta_text">
                  <span>Next</span>
                </button>
              </nav>
            </div>
          ) : (
            <div className="creative_reels">
              <div className="creative_reels_viewport">
                <Swiper
                  modules={[Navigation]}
                  className="creative_reels_swiper"
                  {...CREATIVE_SWIPER_SETTINGS}
                  navigation={{
                    prevEl: ".creative_reels .creative_reels_prev",
                    nextEl: ".creative_reels .creative_reels_next",
                  }}
                >
                  {reels.map(({ src, alt, video }, index) => (
                    <SwiperSlide key={`${src}-${index}`}>
                      <button
                        type="button"
                        className="creative_reel_card"
                        onClick={() =>
                          openLightbox({ type: "reel", src, alt, video })
                        }
                        aria-label={`View ${alt}`}
                      >
                        <div className="creative_reel_media">
                          {video ? (
                            <video
                              src={video}
                              className="creative_reel_video"
                              autoPlay
                              muted
                              loop
                              playsInline
                              poster={src || undefined}
                              aria-hidden="true"
                            />
                          ) : (
                            <Image
                              src={src}
                              alt={alt}
                              fill
                              sizes="48rem"
                              className="creative_reel_img"
                            />
                          )}
                          {/* <span className="creative_card_fullsize" aria-hidden="true">
                            <Image
                              src="/assets/icons/full-size.png"
                              alt=""
                              width={32}
                              height={32}
                            />
                          </span> */}
                        </div>
                        <span className="creative_card_label">View Full Screen</span>
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <nav className="creative_reels_nav" aria-label="Reels navigation">
                <button type="button" className="creative_reels_prev cta_text">
                  <span>Previous</span>
                </button>
                <button type="button" className="creative_reels_next cta_text">
                  <span>Next</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {showModal ? (
        <div
          className={`creative_lightbox${isClosing ? " creative_lightbox--closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt || "Creative preview"}
        >
          <button
            type="button"
            className="creative_lightbox_backdrop"
            onClick={handleClose}
            aria-label="Close preview"
          />
          <div
            className={`creative_lightbox_content${activeItem.type === "post" ? " creative_lightbox_content--post" : ""}`}
          >
            <button
              type="button"
              className="creative_lightbox_close"
              onClick={handleClose}
              aria-label="Close preview"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            {activeItem.type === "post" ? (
              <div className="creative_lightbox_media creative_lightbox_media--post">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  width={1200}
                  height={1200}
                  className="creative_lightbox_img"
                  unoptimized
                />
              </div>
            ) : activeItem.video ? (
              <video
                ref={videoRef}
                src={activeItem.video}
                className="creative_lightbox_video"
                controls
                playsInline
                poster={activeItem.src || undefined}
              />
            ) : (
              <div className="creative_lightbox_media creative_lightbox_media--post">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  width={480}
                  height={854}
                  className="creative_lightbox_img"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
