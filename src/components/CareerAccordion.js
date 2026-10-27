"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

function OpeningMeta() {
  return <div />;
}

export default function CareerAccordion({ data }) {
  const [activeId, setActiveId] = useState(null);
  const [heights, setHeights] = useState({});

  const heading = data?.heading || "Current openings";
  const openings = data?.accordion || [];

  const toggle = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const measureRef = useCallback((id, el) => {
    if (el) {
      const scrollHeight = el.scrollHeight;
      setHeights((prev) => {
        if (prev[id] !== scrollHeight) {
          return { ...prev, [id]: scrollHeight };
        }
        return prev;
      });
    }
  }, []);

  if (!openings.length) {
    return (
      <div className="career_accordion">
        <h2 className="h2">{heading}</h2>
      </div>
    );
  }

  return (
    <div className="career_accordion">
      <h2 className="h2">{heading}</h2>
      <div>
        {openings.map((job) => {
          const id = `job-${job.id}`;
          const isActive = activeId === id;
          return (
            <div
              key={id}
              className={`accordion${isActive ? " active" : ""}`}
              onClick={() => toggle(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="accord_title">
                {job.jobTitle}{" "}
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
                    ? {
                        height: heights[id] ? `${heights[id]}px` : "auto",
                        opacity: 1,
                      }
                    : { height: 0, opacity: 0 }
                }
              >
                <div
                  className="accord_wrapper"
                  ref={(el) => measureRef(id, el)}
                >
                  {job.description && <p>{job.description}</p>}
                  <OpeningMeta />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
