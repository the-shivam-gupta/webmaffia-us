import { t } from "@/lib/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  return {
    title: t(lang, "meta.blog.title"),
    description: t(lang, "meta.blog.description"),
  };
}

export default function BlogLayout({ children }) {
  return children;
}
