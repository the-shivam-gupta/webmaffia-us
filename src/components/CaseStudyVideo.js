"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

// Floating "watch the summary" card on the right edge of a case-study page.
// The card is a video frame (still image, muted preview on hover) over a solid
// caption bar, so the label is readable whatever the video looks like.
// Clicking it opens the video centred in a lightbox and plays it with sound.
export default function CaseStudyVideo({ src, title, label = "Watch the summary" }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [ratio, setRatio] = useState(16 / 9);
  const [duration, setDuration] = useState("");
  // Large while the page is at the top, back to its normal size once scrolled.
  const [big, setBig] = useState(true);
  // True in the browser only: the widget is portalled to <body> so no page
  // section (e.g. the banner) can sit on top of it or swallow its clicks.
  const inBrowser = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setBig(window.scrollY < 40);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
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
    const { videoWidth, videoHeight, duration: length } = event.currentTarget;
    if (videoWidth && videoHeight) setRatio(videoWidth / videoHeight);
    setDuration(formatDuration(length));
  };

  const playPreview = () => previewRef.current?.play().catch(() => {});
  const stopPreview = () => {
    const video = previewRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0.5;
  };

  return (
    <>
      {inBrowser
        ? createPortal(
      <div
        className={`cs_video_widget${minimized ? " is_min" : ""}${big ? " is_big" : ""}`}
      >
        {/* Compact launcher shown while the card is minimized (like a chat
            bubble): click to bring the card back. */}
        <button
          type="button"
          className="cs_video_pill"
          aria-label={`Show video: ${label}`}
          aria-hidden={!minimized}
          tabIndex={minimized ? 0 : -1}
          onClick={() => setMinimized(false)}
        >
          <span className="cs_video_pill_text">{label}</span>
          <span className="cs_video_pill_icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
        </button>

        <div className="cs_video_stage" inert={minimized}>
        <button
          type="button"
          className="cs_video_close_mini"
          aria-label="Minimize video"
          onClick={() => setMinimized(true)}
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
          <span className="cs_video_card_frame" style={{ "--cs-video-ratio": ratio }}>
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
          </span>
          <span className="cs_video_card_bar">
            <span className="cs_video_card_label">{label}</span>
            {duration ? <span className="cs_video_card_time">{duration}</span> : null}
          </span>
        </button>
        </div>
      </div>,
        document.body
      )
        : null}

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
