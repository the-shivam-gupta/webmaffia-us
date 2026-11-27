"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Client sites (external links) open in a new tab; internal case studies stay in the same tab.
const EXTERNAL_PROPS = { target: "_blank", rel: "noopener noreferrer" };

export default function WorkListSection({ items }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (e) => {
    e.preventDefault();
    setExpanded((prev) => !prev);
  };

  return (
    <section data-section="work_section" className="work_section">
      <div className={`work_box${expanded ? " active" : ""}`}>
        {items.map((item) => (
          <div className="work_item" key={`${item.name}-${item.image}`}>
            <Link
              href={item.url || "#"}
              className="work_img"
              {...(item.external ? EXTERNAL_PROPS : {})}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={540}
                height={395}
              />
            </Link>
            <Link
              href={item.url || "#"}
              {...(item.external ? EXTERNAL_PROPS : {})}
            >
              <h2 className="work_name">{item.name}</h2>
              <div className="work_title">{item.title}</div>
            </Link>
          </div>
        ))}
      </div>
      <div className="cta_work">
        <a
          href="#"
          className={`cta_text${expanded ? " active" : ""}`}
          onClick={toggleExpanded}
        >
          View <span className="cta_span">All</span> <span>Work</span>
          <span className="active_span">Less</span>
        </a>
      </div>
    </section>
  );
}
