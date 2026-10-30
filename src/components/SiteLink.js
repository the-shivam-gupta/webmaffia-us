import Link from "next/link";

export const SITE_URL = "https://www.webmaffia.com";

// Only the home page lives in this project, so every internal path
// (/about, /services/..., /) points at the live site instead.
export function siteHref(href) {
  if (typeof href === "string" && href.startsWith("/") && !href.startsWith("//")) {
    return `${SITE_URL}${href}`;
  }
  return href;
}

export default function SiteLink({ href, ...props }) {
  return <Link href={siteHref(href)} {...props} />;
}
