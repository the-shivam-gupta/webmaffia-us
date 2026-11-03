"use client";

import { useState } from "react";

// Homepage FAQ: heading on the left, single-open accordion on the right.
// Items are { id, question, answer } (see src/lib/faqs.js).
export default function HomeFaq({ tagline, title, items }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!items?.length) return null;

  return (
    <section data-section="faqs" className="home_faqs">
      <div className="home_faqs_head">
        {tagline ? <h2 className="sub_title">{tagline}</h2> : null}
        {title ? <div className="sub_heading">{title}</div> : null}
      </div>
      <div className="home_faqs_list">
        {items.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              className={`home_faqs_item${isOpen ? " is_open" : ""}`}
              key={faq.id}
            >
              <button
                type="button"
                className="home_faqs_question"
                aria-expanded={isOpen}
                aria-controls={`home-faq-${faq.id}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="home_faqs_icon" aria-hidden="true" />
              </button>
              <div
                id={`home-faq-${faq.id}`}
                className="home_faqs_answer"
                role="region"
              >
                <div className="home_faqs_answer_inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
