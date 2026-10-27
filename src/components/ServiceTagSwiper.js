"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function ServiceTagSwiper({ items }) {
  if (!items?.length) return null;

  return (
    <Swiper
      modules={[Autoplay]}
      className="service-swiper"
      loop={items.length > 1}
      slidesPerView={1}
      spaceBetween={0}
      speed={600}
      autoplay={
        items.length > 1
          ? { delay: 5000, disableOnInteraction: false, waitForTransition: true }
          : false
      }
      watchSlidesProgress
    >
      {items.map((label, index) => (
        <SwiperSlide key={`${label}-${index}`}>
          <div className="sliderBox">
            <div className="swiper-item">{label}</div>
            <div className="lineLoader" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
