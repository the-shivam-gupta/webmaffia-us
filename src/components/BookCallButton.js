"use client";

import { useEffect } from "react";

// Where the "Book a 20-min call" button goes (Cal.com booking page).
const BOOK_CALL_URL =
  "https://cal.com/veera-ghyara-z4cnxq/schedule-a-20-minute-call";

const CALENDAR_ICON =
  '<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';

// Klaviyo renders the form (and its Submit button) asynchronously, outside
// React, so the call button is added next to Submit by watching the form box
// and re-adding it whenever Klaviyo re-renders.
export default function BookCallButton({ container: selector = ".banner_media__form" }) {
  useEffect(() => {
    const container = document.querySelector(selector);
    if (!container) return undefined;

    const makeLink = (extraClass = "") => {
      const link = document.createElement("a");
      link.className = `banner_book_call ${extraClass}`.trim();
      link.href = BOOK_CALL_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `${CALENDAR_ICON}<span>Book a 20-min call</span>`;
      return link;
    };

    const place = () => {
      const submit = container.querySelector("button.klaviyo-form-button");
      const standalone = container.querySelector(".banner_book_call--standalone");
      // Klaviyo may hide the form (not remove it) once it shows "Thank You".
      const formVisible = !!submit && submit.getClientRects().length > 0;

      if (formVisible) {
        // Form is showing: the call link sits beside Submit.
        standalone?.remove();
        if (!submit.parentElement.querySelector(".banner_book_call")) {
          submit.insertAdjacentElement("afterend", makeLink());
        }
        return;
      }

      // Klaviyo replaced the form with its "Thank You" message (no Submit
      // button): keep the call link, outside Klaviyo's tree so it survives.
      const mount = container.querySelector(".formWarpperx");
      const rendered = mount?.querySelector("[class*='klaviyo-form'] > *");
      if (rendered && !standalone) {
        mount.insertAdjacentElement("afterend", makeLink("banner_book_call--standalone"));
      }
    };

    place();
    const observer = new MutationObserver(place);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden"],
    });
    return () => observer.disconnect();
  }, [selector]);

  return null;
}
