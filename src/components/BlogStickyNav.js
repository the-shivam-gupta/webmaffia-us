"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HEADER_OFFSET = 100;
const MANUAL_SCROLL_LOCK_MS = 900;

export default function BlogStickyNav({ links }) {
  const [activeHref, setActiveHref] = useState(links[0]?.href ?? "");
  const isManualScrollRef = useRef(false);
  const manualScrollTimerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector(".sticky_link.selected");
    if (!nav || !active || nav.scrollHeight <= nav.clientHeight) return;
    const top = active.offsetTop - nav.clientHeight / 2 + active.offsetHeight / 2;
    nav.scrollTo({ top, behavior: "smooth" });
  }, [activeHref]);

  const setActiveHrefIfChanged = useCallback((href) => {
    setActiveHref((prev) => (prev === href ? prev : href));
  }, []);

  const lockManualScroll = useCallback(() => {
    isManualScrollRef.current = true;

    if (manualScrollTimerRef.current) {
      clearTimeout(manualScrollTimerRef.current);
    }

    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
      manualScrollTimerRef.current = null;
    }, MANUAL_SCROLL_LOCK_MS);
  }, []);

  const scrollToSection = useCallback(
    (href) => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;

      lockManualScroll();
      setActiveHrefIfChanged(href);

      const top =
        el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      window.history.replaceState(null, "", href);

      if (!prefersReducedMotion && "onscrollend" in window) {
        const onScrollEnd = () => {
          isManualScrollRef.current = false;
          if (manualScrollTimerRef.current) {
            clearTimeout(manualScrollTimerRef.current);
            manualScrollTimerRef.current = null;
          }
        };

        window.addEventListener("scrollend", onScrollEnd, { once: true });
      }
    },
    [lockManualScroll, setActiveHrefIfChanged]
  );

  const handleLinkClick = useCallback(
    (event, href) => {
      event.preventDefault();
      scrollToSection(href);
    },
    [scrollToSection]
  );

  useEffect(() => {
    if (!links.length) return undefined;

    const sections = links
      .map((link) => {
        const id = link.href.replace("#", "");
        const el = document.getElementById(id);
        return el ? { href: link.href, el } : null;
      })
      .filter(Boolean);

    const onScroll = () => {
      if (!sections.length || isManualScrollRef.current) return;
      const offset = window.innerHeight * 0.25;
      let current = sections[0].href;

      for (const section of sections) {
        if (section.el.getBoundingClientRect().top <= offset) {
          current = section.href;
        }
      }
      setActiveHrefIfChanged(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current);
      }
    };
  }, [links, setActiveHrefIfChanged]);

  if (!links.length) return null;

  return (
    <>
      <div className="sticky_top" />
      <div className="sticky_article_container">
        <div className="sticky_article" ref={navRef}>
          <div className="sticky_head">
            <span className="sticky_head_label">In this article</span>
          </div>
          <div className="sticky_progress" aria-hidden="true" />
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`h6 sticky_link${activeHref === link.href ? " selected" : ""}`}
              onClick={(event) => handleLinkClick(event, link.href)}
            >
              <span className="sticky_link_num">{String(index + 1).padStart(2, "0")}</span>
              <span className="sticky_link_text">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
