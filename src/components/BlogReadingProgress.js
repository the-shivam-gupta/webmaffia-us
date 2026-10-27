"use client";

import { useEffect, useRef, useState } from "react";

// Reading progress for the article: a thin bar at the top of the screen plus a
// small "% read" chip in the bottom-left corner. Both are fixed, so they are
// visible wherever the reader is on the page.
export default function BlogReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [nearFooter, setNearFooter] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const article = document.querySelector(".blog_page .blog_content");
    const footer = document.querySelector("footer");
    if (!article) return undefined;

    const update = () => {
      frameRef.current = null;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const done = window.innerHeight * 0.25 - rect.top;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
      if (footer) {
        setNearFooter(footer.getBoundingClientRect().top <= window.innerHeight - 60);
      }
    };

    const onScroll = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      <div className="reading_progress_bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div
        className={`reading_progress_chip${
          progress > 0 && !nearFooter ? " is_visible" : ""
        }`}
        role="status"
        aria-label={`${progress}% of the article read`}
      >
        <span className="reading_progress_value">{progress}%</span>
        <span className="reading_progress_text">read</span>
      </div>
    </>
  );
}
