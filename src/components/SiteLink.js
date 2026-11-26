import Link from "next/link";

export const SITE_URL = "https://www.webmaffia.com";

// Pages that live in this project stay on-site; every other internal path
// (/contact, /blog, ...) points at the live site instead.
const ONSITE = /^\/(services|case-study|about|clients)(\/|$|\?|#)/;

export function siteHref(href) {
  if (
    typeof href === "string" &&
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !ONSITE.test(href)
  ) {
    return `${SITE_URL}${href}`;
  }
  return href;
}

export default function SiteLink({ href, ...props }) {
  return <Link href={siteHref(href)} {...props} />;
}
