"use client";

import { useState } from "react";

// Single-open accordion: opening a question closes the previous one. The
// height animates through the grid-template-rows 0fr -> 1fr transition in
// team.scss, so no measuring is needed.
export default function TeamFaq({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="team_faq_list">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            className={`team_faq_item${isOpen ? " is_open" : ""}`}
            key={faq.question}
          >
            <button
              type="button"
              className="team_faq_question"
              aria-expanded={isOpen}
              aria-controls={`team-faq-${index}`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{faq.question}</span>
              <span className="team_faq_icon" aria-hidden="true" />
            </button>
            <div
              id={`team-faq-${index}`}
              className="team_faq_answer"
              role="region"
            >
              <div className="team_faq_answer_inner">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
