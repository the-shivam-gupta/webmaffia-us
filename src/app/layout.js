import RootShell, { siteMetadata } from "@/components/RootShell";

export const metadata = siteMetadata;

export default function RootLayout({ children }) {
  return <RootShell lang="en" dir="ltr">{children}</RootShell>;
}
