"use client";

import { useEffect, useState } from "react";
import KlaviyoFormEmbed from "@/components/KlaviyoFormEmbed";

const HEADINGS = [
  "Turn Your Website into a Growth Engine",
  "Rank Higher with Expert SEO",
  "Design That Converts Visitors",
  "Grow Your Brand on Social Media",
  "Content That Wins Customers",
  "Influencer Campaigns That Deliver",
];
const SWAP_MS = 3500;

export default function BlogEnquiryForm() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % HEADINGS.length),
      SWAP_MS
    );
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="blog_enquiry"
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="blog_enquiry_top">
        <div className="blog_enquiry_tag">
          <i aria-hidden="true" />
          Let's work together
        </div>
        <div className="blog_enquiry_dots">
          {HEADINGS.map((heading, i) => (
            <button
              key={heading}
              type="button"
              className={i === index ? "is_on" : ""}
              aria-label={heading}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
      <div className="blog_enquiry_heading" aria-live="polite">
        <span key={index}>{HEADINGS[index]}</span>
      </div>

      <KlaviyoFormEmbed />
    </div>
  );
}
