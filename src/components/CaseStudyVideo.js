"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Floating "watch the summary" card on the right edge of a case-study page.
// The card shows a still frame (and a muted preview on hover); clicking it
// opens the video centred in a lightbox and plays it with sound.
export default function CaseStudyVideo({ src, title, label = "Watch the summary" }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ratio, setRatio] = useState(16 / 9);
  const previewRef = useRef(null);
  const closeRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Lightbox: lock page scroll, close on Escape, move focus to the close button.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    previewRef.current?.pause();
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const onMeta = (event) => {
    const { videoWidth, videoHeight } = event.currentTarget;
    if (videoWidth && videoHeight) setRatio(videoWidth / videoHeight);
  };

  const playPreview = () => previewRef.current?.play().catch(() => {});
  const stopPreview = () => {
    const video = previewRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0.5;
  };

  if (dismissed && !open) return null;

  return (
    <>
      <div className="cs_video_widget" style={{ "--cs-video-ratio": ratio }}>
        <button
          type="button"
          className="cs_video_close_mini"
          aria-label="Hide video"
          onClick={() => setDismissed(true)}
        >
          &times;
        </button>
        <button
          type="button"
          className="cs_video_card"
          aria-label={`${label}: ${title}`}
          onClick={() => setOpen(true)}
          onMouseEnter={playPreview}
          onMouseLeave={stopPreview}
          onFocus={playPreview}
          onBlur={stopPreview}
        >
          <video
            ref={previewRef}
            className="cs_video_card_media"
            src={`${src}#t=0.5`}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={onMeta}
            tabIndex={-1}
          />
          <span className="cs_video_card_play" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="cs_video_card_text">
            <span className="cs_video_card_label">{label}</span>
          </span>
        </button>
      </div>

      {/* `open` only becomes true from a click, so `document` always exists
          here (no server render of the portal). */}
      {open
        ? createPortal(
            <div
              className="cs_video_modal"
              role="dialog"
              aria-modal="true"
              aria-label={title}
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <div className="cs_video_modal_inner" style={{ "--cs-video-ratio": ratio }}>
                <button
                  type="button"
                  className="cs_video_modal_close"
                  aria-label="Close video"
                  ref={closeRef}
                  onClick={close}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <video
                  className="cs_video_modal_media"
                  src={src}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  controlsList="nodownload"
                  onLoadedMetadata={onMeta}
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
