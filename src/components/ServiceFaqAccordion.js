"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

/**
 * Renders `services-tech.fa-qs` items (pre-split into { id, question,
 * answer } by serviceContent.js) as a click-to-expand accordion, matching
 * the toggle/measure pattern CareerAccordion.js uses for career openings.
 */
export default function ServiceFaqAccordion({ heading, items }) {
  const [activeId, setActiveId] = useState(null);
  const [heights, setHeights] = useState({});

  const toggle = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const measureRef = useCallback((id, el) => {
    if (el) {
      const scrollHeight = el.scrollHeight;
      setHeights((prev) => (prev[id] !== scrollHeight ? { ...prev, [id]: scrollHeight } : prev));
    }
  }, []);

  if (!items?.length) return null;

  return (
    <div className="service_faqs">
      {heading ? <h2 className="h2">{heading}</h2> : null}
      <div>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <div
              key={item.id}
              className={`accordion${isActive ? " active" : ""}`}
              onClick={() => toggle(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(item.id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="accord_title">
                {item.question}{" "}
                <span>
                  <Image
                    src="/assets/images/icons/down_arrow.webp"
                    alt=""
                    width={27}
                    height={14}
                  />
                </span>
              </div>
              <div
                className="accord_container"
                style={
                  isActive
                    ? { height: heights[item.id] ? `${heights[item.id]}px` : "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
              >
                <div
                  className="accord_wrapper service_rich_text"
                  ref={(el) => measureRef(item.id, el)}
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
