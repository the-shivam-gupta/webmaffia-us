"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toggleTheme } from "@/lib/theme";
import KlaviyoFormEmbed from "@/components/KlaviyoFormEmbed";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SERVICE_LINKS = [
  { href: "/services/digital-strategy", label: "Digital Strategy" },
  { href: "/services/website-design-development-services", label: "Design and Development" },
  { href: "/services/search-engine-optimization-services", label: "SEO" },
  { href: "/services/ai-powered-solutions-services", label: "AI-Powered Solutions" },
  { href: "/services/social-media-marketing-strategy", label: "Social Media" },
  { href: "/services/content-marketing-strategy", label: "Content Marketing" },
  { href: "/services/app-store-optimization", label: "App Store Optimization" },
  { href: "/services/influencer-marketing", label: "Influencer Marketing" },
];

const Header = () => {
  const servicesSubRef = useRef(null);
  const campaignsSubRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [campaignsOpen, setCampaignsOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      const t = window.setTimeout(() => {
        document.body.style.overflow = "hidden";
      }, 450);
      return () => window.clearTimeout(t);
    }
    document.body.style.overflow = "auto";
  }, [menuOpen]);

  const openMenu = (e) => {
    e.preventDefault();
    setMenuOpen(true);
    if (window.matchMedia("(max-width: 540px)").matches) {
      setServicesOpen(true);
      setCampaignsOpen(true);
    }
  };

  const closeMenu = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    setServicesOpen(false);
    setCampaignsOpen(false);
  };

  const setServicesSubmenuOpen = (open) => {
    setServicesOpen(open);
  };

  const isMobileMenu = () =>
    window.matchMedia("(max-width: 540px)").matches;

  const handleSubmenuParentClick = (e, menu) => {
    if (menu === "campaigns") {
      e.preventDefault();
    }

    if (isMobileMenu()) {
      e.preventDefault();
      if (menu === "services") {
        setServicesOpen((open) => !open);
      } else {
        setCampaignsOpen((open) => !open);
      }
      return;
    }

    setMenuOpen(false);
  };

  const toggleServicesSubmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setServicesOpen((open) => !open);
  };

  const handleServicesMouseEnter = () => {
    if (window.matchMedia("(min-width: 541px)").matches) {
      setServicesSubmenuOpen(true);
    }
  };

  const handleServicesMouseLeave = () => {
    if (window.matchMedia("(min-width: 541px)").matches) {
      setServicesSubmenuOpen(false);
    }
  };

  const setCampaignsSubmenuOpen = (open) => {
    setCampaignsOpen(open);
  };

  const toggleCampaignsSubmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCampaignsOpen((open) => !open);
  };

  const handleCampaignsMouseEnter = () => {
    if (window.matchMedia("(min-width: 541px)").matches) {
      setCampaignsSubmenuOpen(true);
    }
  };

  const handleCampaignsMouseLeave = () => {
    if (window.matchMedia("(min-width: 541px)").matches) {
      setCampaignsSubmenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={menuOpen ? "opacity_0 menu_active" : "opacity_0"}
      >
        <Link href="/" className="logo">
          <Image
            src="/assets/images/icons/webmaffia.webp"
            alt="Webmaffia"
            width={166}
            height={26}
          />
        </Link>

        {/* Desktop-only quick links (hidden below 1025px via CSS) */}
        {/* <nav className="header_nav" aria-label="Main">
          <Link href="/about">About Us</Link>
          <div className="header_nav_item has_dropdown">
            <Link href="/services">Services</Link>
            <ul className="header_nav_dropdown">
              {SERVICE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/case-study">Our Work</Link>
          <Link href="/clients">Our Client</Link>
          <Link href="/blog">Blog</Link>
        </nav> */}

        <div className="right_menu">
          {/* Language switcher (blog + author pages only) */}
          {/* <LanguageSwitcher /> */}

          <a href="tel:+18669849786" className="header_phone">
            +1 866-984-9786
          </a>

          {/* Menu toggle */}
          {/* <a href="" className="menu" onClick={openMenu} aria-label="Open menu">
            <div>Menu</div>
            <Image
              src="/assets/images/icons/menu.webp"
              alt=""
              aria-hidden="true"
              width={26}
              height={14}
            />
          </a> */}

          <button type="button">
            <label className="toggle" htmlFor="switch">
              <input
                id="switch"
                className="input"
                type="checkbox"
                onClick={(e) => {
                  e.preventDefault();
                  toggleTheme();
                }}
                aria-label="Toggle dark mode"
              />
              <div className="icon icon--moon">
                <svg height="32" width="32" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div className="icon icon--sun">
                <svg height="32" width="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              </div>
            </label>
          </button>

          <a href="mailto:hello@webmaffia.com" className="cta">
            Let&apos;s Connect
          </a>
        </div>
      </header>

      {/* Overlay menu */}
      <div className={`menu_wrapper${menuOpen ? " active" : ""}`}>
        <a href="" className="cta_text close" onClick={closeMenu}>
          <span>Close</span>
        </a>

        <div className="menu_container">
          {/* ── Left: nav links ── */}
          <div className="left_container">
            <div className="menu_link" data-number="01">
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
            </div>

            <div
              className={`menu_link menu_btn${servicesOpen ? " active" : ""}`}
              data-number="02"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <Link
                href="/services"
                onClick={(e) => handleSubmenuParentClick(e, "services")}
              >
                Services
              </Link>

              <button
                type="button"
                className="menu_btn_toggle"
                aria-expanded={servicesOpen}
                aria-label={servicesOpen ? "Close services menu" : "Open services menu"}
                onClick={toggleServicesSubmenu}
              />

              <div className="sub_menu_content" ref={servicesSubRef}>
                <ul className="sub_menu">
                  {[
                    { href: "/services/digital-strategy", label: "Digital Strategy" },
                    { href: "/services/website-design-development-services", label: "Design and Development" },
                    { href: "/services/search-engine-optimization-services", label: "SEO" },
                    { href: "/services/ai-powered-solutions-services", label: "AI-Powered Solutions" },
                    { href: "/services/social-media-marketing-strategy", label: "Social Media" },
                    { href: "/services/content-marketing-strategy", label: "Content Marketing" },
                    { href: "/services/app-store-optimization", label: "App Store Optimization" },
                    { href: "/services/influencer-marketing", label: "Influencer Marketing" },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} onClick={() => setMenuOpen(false)}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* <div
              className={`menu_link menu_btn${campaignsOpen ? " active" : ""}`}
              data-number="03"
              onMouseEnter={handleCampaignsMouseEnter}
              onMouseLeave={handleCampaignsMouseLeave}
            >
              <Link href="#" onClick={(e) => handleSubmenuParentClick(e, "campaigns")}>
                Campaigns
              </Link>

              <button
                type="button"
                className="menu_btn_toggle"
                aria-expanded={campaignsOpen}
                aria-label={campaignsOpen ? "Close campaigns menu" : "Open campaigns menu"}
                onClick={toggleCampaignsSubmenu}
              />

              <div className="sub_menu_content" ref={campaignsSubRef}>
                <ul className="sub_menu">
                  {[
                    { href: "/case-study/tata-housing", label: "Tata Housing" },
                    { href: "/case-study/2baconil", label: "2Baconil" },
                    { href: "/case-study/birla-sun-life", label: "Birla Sun Life" },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} onClick={() => setMenuOpen(false)}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
            

            <div className="menu_link" data-number="03">
              <Link href="/case-study" onClick={() => setMenuOpen(false)}>
                Our Work
              </Link>
            </div>

            <div className="menu_link" data-number="04">
              <Link href="/clients" onClick={() => setMenuOpen(false)}>
                Our Client
              </Link>
            </div>

            <div className="menu_link" data-number="05">
              <Link href="/blog" onClick={() => setMenuOpen(false)}>
                Blog
              </Link>
            </div>

            <div className="menu_link" data-number="06">
              <Link href="/career" onClick={() => setMenuOpen(false)}>
                Career
              </Link>
            </div>

            <div className="menu_link" data-number="07">
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </div>

            {/* Office addresses */}
            <div className="country_container">
              <div className="country_region">
                <div className="region_text">Mumbai (India)</div>
                <address>
                  <a
                    href="https://maps.app.goo.gl/iPvLshVht1xP6hT1A"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    403 A Wing, Cello Triumph,
                    IB Patel Rd, Jay Prakash Nagar,
                    Goregaon (E), Mumbai - 400063
                  </a>
                </address>
                <div className="contact_info">
                  <a href="mailto:hello@webmaffia.com">hello@webmaffia.com</a>
                  <a href="tel:+919867625909">+91 9867625909</a>
                </div>
              </div>

              <div className="country_region">
                  <div className="region_text">Bangaluru</div>
                  <address>
                    <a
                      href="https://maps.app.goo.gl/iPvLshVht1xP6hT1A"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Brigade Exotica - Burgundy
                      Unit 2503,
                      Old Madras Road,
                      Bengaluru - 560049
                    </a>
                  </address>
                  <div className="contact_info">
                    <a href="mailto:hello@webmaffia.com">hello@webmaffia.com</a>
                    <a href="tel:+919867625909">+91 9867625909</a>
                  </div>
                </div>

              <div className="country_region">
                <div className="region_text">Dubai (UAE)</div>
                <address>
                  <a
                    href="https://maps.app.goo.gl/2qVqKVXrwNok34KH6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    JLT Cluster H
                    <br />
                    Dubai, United Arab Emirates
                  </a>
                </address>
                <div className="contact_info">
                  <a href="mailto:hello@webmaffia.com">hello@webmaffia.com</a>
                  <a href="tel:+971562722998">+971 56 272 2998</a>
                </div>
              </div>
            </div>

            {/* Social icons */}
            <div className="social_icons">
              {[
                { href: "https://www.instagram.com/webmaffia/?hl=en", src: "/assets/images/icons/insta.webp", alt: "Instagram" },
                { href: "https://www.facebook.com/Webmaffia/", src: "/assets/images/icons/fb.webp", alt: "Facebook" },
                { href: "https://in.linkedin.com/company/webmaffia", src: "/assets/images/icons/linkedin.webp", alt: "LinkedIn" },
              ].map(({ href, src, alt }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                  <Image src={src} alt={alt} width={50} height={50} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: contact form ── */}
          <div className="right_container">
            <div className="mail_title">Drop us a mail</div>
            <KlaviyoFormEmbed />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;