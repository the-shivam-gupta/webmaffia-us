"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Matches webmaffia.com homepage GSAP (inline script on production).
 */
export function useHomeScrollAnimations(mainHorizontalRef, serviceSwiperRef) {
  useEffect(() => {
    const el = mainHorizontalRef.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            pin: true,
            start: "top top",
            end: "3000",
            scrub: 2,
            invalidateOnRefresh: true,
            snap: {
              snapTo: "labels",
              duration: { min: 0.3, max: 0.8 },
              delay: 0.2,
              directional: true,
              inertia: false,
            },
          },
        });

        tl.to(".hs1", { left: "-62vw", duration: 0.5, ease: "none" })
          .addLabel("firstSection")
          .to(
            ".ourService-swiper .swiper-slide",
            {
              right: "0",
              duration: 0.5,
              ease: "none",
              onComplete: function onSlideIn() {
                const swiper = serviceSwiperRef.current;
                if (swiper?.autoplay && !tl.reversed()) {
                  swiper.autoplay.start();
                }
              },
              onReverseComplete: function onSlideOut() {
                const swiper = serviceSwiperRef.current;
                if (swiper?.autoplay) {
                  swiper.autoplay.stop();
                }
              },
            },
            "<"
          )
          .addLabel("secondSection");

        ScrollTrigger.refresh();

        return () => tl.scrollTrigger?.kill();
      });
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [mainHorizontalRef, serviceSwiperRef]);
}
