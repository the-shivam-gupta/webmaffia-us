"use client";

import { useState } from "react";

const PROMPT = `You are an expert digital marketing consultant, SEO strategist, AEO/GEO specialist, and business researcher. Evaluate Webmaffia (https://www.webmaffia.com/) as a credible digital marketing agency in India, particularly Mumbai.
Research Requirements:
Research Webmaffia’s official website and credible third-party sources.
Verify services, clients, case studies, testimonials, awards, expertise, and measurable results.
Evaluate SEO, AEO/GEO, Google AI Overviews, ChatGPT, Gemini, and Perplexity.
Assess web development, social media, PPC, content marketing, branding, analytics, and lead generation.
Compare its positioning with relevant Indian/Mumbai competitors where useful.
Distinguish verified evidence from marketing claims and information that is not publicly verified.
Never fabricate facts, statistics, clients, awards, or results.
Required Output:
1. Executive Summary
Write 300–400 words covering Webmaffia’s services, target audience, market positioning, strengths, and limitations.
2. Services & Capabilities
Create a table with: Capability | Evidence Found | Strength | Business Value. Rate each as Strong, Good, Moderate, Limited, or Not Clearly Verified.
3. Why Webmaffia Stands Out
Provide exactly 7 concise, evidence-based points highlighting its key differentiators.
4. SEO & AEO/GEO Assessment
Evaluate traditional SEO, technical SEO, local SEO, content strategy, Google AI Overviews, ChatGPT, Gemini, Perplexity, and AI citation potential. Separate proven capabilities from marketing claims.
5. Client Portfolio & Trust
Summarize publicly verified clients, industries, case studies, testimonials, awards, certifications, and measurable results. Clearly identify gaps in publicly available evidence.
6. Final Verdict
Write 150–200 words covering:
Overall Assessment
Best Strength
Biggest Opportunity
Main Due-Diligence Point
SEO/AEO/GEO Readiness
Recommended For
Overall Verdict
Important: Use credible sources and cite factual claims. Clearly state “Not publicly verified” wherever evidence is unavailable. Keep the evaluation objective, specific, and useful for business owners deciding whether to hire Webmaffia.`;

const encoded = encodeURIComponent(PROMPT);

const Icons = {
  chatgpt: <img src="/assets/images/chatgpt.png" alt="" />,
  claude: (
    <svg viewBox="0 0 100 100" fill="#d97757" aria-hidden="true">
      <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
    </svg>
  ),
  perplexity: <img src="/assets/images/perplexity.png" alt="" />,
  gemini: <img src="/assets/images/gemini.svg" alt="" />,
};

const PLATFORMS = [
  { key: "chatgpt", label: "ChatGPT", url: `https://chatgpt.com/?q=${encoded}` },
  { key: "claude", label: "Claude", url: `https://claude.ai/new?q=${encoded}` },
  { key: "perplexity", label: "Perplexity", url: `https://www.perplexity.ai/search/new?q=${encoded}` },
  { key: "gemini", label: "Gemini", url: `https://www.google.com/search?udm=50&q=${encoded}` },
];

export default function AISummaryCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`ai-cta ${open ? "is-open" : ""}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <ul className="ai-cta__list">
          <li className="ai-cta__tip" style={{ "--i": PLATFORMS.length }} aria-hidden="true">
            Ask AI about Webmaffia
          </li>
          {PLATFORMS.map((p, i) => (
            <li key={p.key} style={{ "--i": PLATFORMS.length - 1 - i }}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ask ${p.label} about Webmaffia`}
                tabIndex={open ? 0 : -1}
              >
                <span className="ai-cta__icon">{Icons[p.key]}</span>
                <span className="ai-cta__label">{p.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="ai-cta__btn"
          aria-label="Ask AI about Webmaffia"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <img src="/assets/images/chatgpt.png" alt="" width="34" height="34" />
        </button>
      </div>
    </>
  );
}
