"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const MODAL_ANIMATION_MS = 350;

export default function CampaignHeroVideo({
  poster,
  videoSrc,
  playIcon = "/assets/icons/video-icon.svg",
}) {
  const videoRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const showModal = isOpen || isClosing;

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
    }, MODAL_ANIMATION_MS);
  }, [isClosing, isOpen]);

  const handlePlay = () => {
    if (!videoSrc || isOpen) return;
    setIsClosing(false);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen || isClosing) return;

    document.body.style.overflow = "hidden";

    const playTimer = window.setTimeout(() => {
      videoRef.current?.play();
    }, MODAL_ANIMATION_MS);

    const onKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(playTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isClosing, handleClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="campaign_hero_media">
        <Image
          src={poster}
          alt=""
          width={806}
          height={657}
          className="campaign_hero_poster dark_img"
          priority
        />
        <button
          type="button"
          className="campaign_hero_play"
          onClick={handlePlay}
          aria-label="Play campaign video"
        >
          <Image
            src={playIcon}
            alt=""
            width={118}
            height={118}
            aria-hidden="true"
          />
        </button>
      </div>

      {showModal && videoSrc && (
        <div
          className={`campaign_video_modal${isClosing ? " campaign_video_modal--closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Campaign video"
        >
          <button
            type="button"
            className="campaign_video_modal_backdrop"
            onClick={handleClose}
            aria-label="Close video"
          />
          <div className="campaign_video_modal_content">
            <button
              type="button"
              className="campaign_video_modal_close"
              onClick={handleClose}
              aria-label="Close video"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <video
              ref={videoRef}
              src={videoSrc}
              className="campaign_video_modal_player"
              controls
              playsInline
            />
          </div>
        </div>
      )}
    </>
  );
}
