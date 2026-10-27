import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { buildLocalizedAlternates } from "@/lib/blog-seo";
import { t } from "@/lib/dictionaries";
import { isLocale, localizePath } from "@/lib/i18n";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { getAuthors } from "@/lib/strapiPage";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    if (!isLocale(lang)) return {};

    return {
        title: t(lang, "meta.authors.title"),
        description: t(lang, "meta.authors.description"),
        // Authors are not translated in Strapi, so non-English URLs canonicalise to English.
        alternates: buildLocalizedAlternates({ lang, path: "/author", isFallback: true }),
        robots: {
            index: false,
            follow: false,
        },
    };
}

function getInitials(name) {
    return String(name ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
}

export default async function AuthorsPage({ params }) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();

    const authors = await getAuthors();

    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: t(lang, "breadcrumb.home"), path: "/" },
        { name: t(lang, "breadcrumb.authors"), path: localizePath(lang, "/author") },
    ]);

    return (
        <main className="wrapper">
            <JsonLd data={breadcrumbSchema} />
            <div className="author_page">
                <section className="author_list_hero">
                    <span className="author_label">{t(lang, "author.listLabel")}</span>
                    <h1>{t(lang, "author.listTitle")}</h1>
                </section>

                <section className="author_grid">
                    {authors.map((author) => {
                        const count = author.blogs.length;
                        const avatarUrl = author.profileImage?.url;

                        return (
                            <Link
                                key={author.id}
                                href={localizePath(lang, `/author/${author.slug}`)}
                                className="author_card"
                            >
                                <div className="author_avatar">
                                    {avatarUrl ? (
                                        <Image
                                            src={avatarUrl}
                                            alt={author.profileImage?.alternativeText || author.name}
                                            fill
                                            sizes="(max-width: 900px) 40vw, 20rem"
                                            className="author_avatar_img"
                                        />
                                    ) : (
                                        <span aria-hidden="true">{getInitials(author.name)}</span>
                                    )}
                                </div>
                                <div className="author_card_info">
                                    <div className="h5">{author.name}</div>
                                    {author.designation ? (
                                        <div className="author_designation">{author.designation}</div>
                                    ) : null}
                                    <span className="link blog_link">
                                        {count}{" "}
                                        {t(lang, count === 1 ? "author.articleOneUpper" : "author.articleManyUpper")}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            </div>
        </main>
    );
}
