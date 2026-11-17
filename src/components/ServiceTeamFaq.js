"use client";

import { useState } from "react";

// Same look as the /team FAQ (TeamFaq + the team_faq_* styles): heading on the
// left, single-open accordion on the right. Items come from the CMS
// `services-tech.fa-qs` section as { id, question, answer (HTML) }.
export default function ServiceTeamFaq({ tagline, heading, items }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!items?.length) return null;

  return (
    <div className="service_team_faq">
      <div className="team_faq_head">
        {tagline ? <h2 className="sub_title">{tagline}</h2> : null}
        {heading ? <div className="sub_heading">{heading}</div> : null}
      </div>
      <div className="team_faq_list">
        {items.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              className={`team_faq_item${isOpen ? " is_open" : ""}`}
              key={faq.id}
            >
              <h3 className="faq_heading">
                <button
                  type="button"
                  className="team_faq_question"
                  aria-expanded={isOpen}
                  aria-controls={`service-faq-${faq.id}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span className="team_faq_icon" aria-hidden="true" />
                </button>
              </h3>
              <div
                id={`service-faq-${faq.id}`}
                className="team_faq_answer"
                role="region"
              >
                <div className="team_faq_answer_inner">
                  <div
                    className="team_faq_rich"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
