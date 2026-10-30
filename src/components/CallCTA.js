"use client";

import { useEffect, useRef, useState } from "react";

const PHONE_DISPLAY = "+1 866-984-9786";
const PHONE_HREF = "tel:+18669849786";

// Round call button under the chat button (bottom right). Colours and the
// light/dark/footer inversion are in ai-summary-cta.scss, next to the chat button.
export default function CallCTA() {
  const [onFooter, setOnFooter] = useState(false);
  const linkRef = useRef(null);

  // The footer is dark, so the black button disappears once it floats over it.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const footer = document.querySelector("footer");
      const link = linkRef.current;
      if (!footer || !link) return;
      const { top, height } = link.getBoundingClientRect();
      setOnFooter(top + height / 2 >= footer.getBoundingClientRect().top);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <a
      ref={linkRef}
      href={PHONE_HREF}
      aria-label={`Call us on ${PHONE_DISPLAY}`}
      className={`call-cta${onFooter ? " call-cta--on-footer" : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="26"
        height="26"
        fill="#ffffff"
        aria-hidden="true"
      >
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
      </svg>
    </a>
  );
}
