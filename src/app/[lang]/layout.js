import { notFound } from "next/navigation";
import RootShell, { siteMetadata } from "@/components/RootShell";
import { getDir, isLocale, LOCALES } from "@/lib/i18n";

// Blog + author sections. Unknown locale segments 404.
export const dynamicParams = false;

export const metadata = siteMetadata;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <RootShell lang={lang} dir={getDir(lang)}>
      {children}
    </RootShell>
  );
}
