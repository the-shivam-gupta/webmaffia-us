"use client";

import Link from "next/link";
import { scrollToContact } from "@/components/Header";

// Same behaviour as the header's "Let's Connect": smooth-scroll to the home
// contact section, or navigate there once — never stacking the hash.
const ContactNowLink = ({ title }) => (
  <Link href="/#home_contact" className="cta_text" onClick={scrollToContact}>
    {title} <span>Now</span>
  </Link>
);

export default ContactNowLink;
