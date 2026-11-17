"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "wm_cookie_consent";
const GA_IDS = ["G-T2G85GJLPP", "G-NNEH16QDF3"];
const CLARITY_ID = "z8b845gqq1";

function loadAnalytics() {
  if (window.__wmAnalyticsLoaded) return;
  window.__wmAnalyticsLoaded = true;

  // Google Analytics
  const ga = document.createElement("script");
  ga.async = true;
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_IDS[0]}`;
  document.head.appendChild(ga);
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag("js", new Date());
  GA_IDS.forEach((id) => window.gtag("config", id));

  // Microsoft Clarity
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_ID);
}

function readConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}

export default function CookieConsent({ privacyUrl = "/privacy-policy" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored === "accepted") loadAnalytics();
    else if (stored !== "declined") setVisible(true);
  }, []);

  // Flag the banner on <html> so the floating chat/call/AI buttons hide while it is open.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.setAttribute("data-cookie-banner", "");
    else root.removeAttribute("data-cookie-banner");
    return () => root.removeAttribute("data-cookie-banner");
  }, [visible]);

  const accept = () => {
    saveConsent("accepted");
    setVisible(false);
    loadAnalytics();
  };

  const decline = () => {
    saveConsent("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and privacy notice"
    >
      <div className="cookie-consent__inner">
        <div className="cookie-consent__content">
          <h2 className="cookie-consent__title">Your Privacy Choices</h2>
          <p className="cookie-consent__text">
            We use cookies and similar technologies, including Google Analytics
            and Microsoft Clarity, to understand how visitors use our site and
            to improve our services. These tools may collect information such
            as your IP address, device, browser and pages visited, and may
            share it with those providers, which can count as &ldquo;sharing&rdquo;
            under the California Consumer Privacy Act (CCPA/CPRA) and other US
            state privacy laws. We do not sell your personal information for
            money. Select &ldquo;Accept All&rdquo; to allow analytics cookies,
            or &ldquo;Decline&rdquo; to opt out. Strictly necessary cookies are
            always on. You can change your choice any time by clearing your
            browser data. Read our{" "}
            <a href={privacyUrl} target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          </p>
        </div>
        <div className="cookie-consent__actions">
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--ghost"
            onClick={decline}
          >
            Decline / Do Not Share
          </button>
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--solid"
            onClick={accept}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
