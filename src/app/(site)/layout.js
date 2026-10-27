import RootShell, { siteMetadata } from "@/components/RootShell";

export const metadata = siteMetadata;

export default function SiteLayout({ children }) {
  return <RootShell lang="en" dir="ltr">{children}</RootShell>;
}
