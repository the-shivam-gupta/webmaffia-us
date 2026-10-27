import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogListItem from "@/components/BlogListItem";
import JsonLd from "@/components/JsonLd";
import { buildLocalizedAlternates } from "@/lib/blog-seo";
import { t } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, isLocale, localizePath } from "@/lib/i18n";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/schema";
import { getAuthorBySlug, getAuthors } from "@/lib/strapiPage";

export const dynamicParams = true;

export async function generateStaticParams() {
    const authors = await getAuthors();
    return authors.map((author) => ({ slug: author.slug }));
}

function getInitials(name) {
    return String(name ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
}

function getAuthorDescription(lang, author) {
    if (author.bio?.trim()) return author.bio.trim();

    const role = author.designation
        ? t(lang, "author.roleAtWebmaffia", { designation: author.designation })
        : t(lang, "author.roleDefault");
    return t(lang, "author.metaDescription", { name: author.name, role });
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    if (!isLocale(lang)) return {};

    const author = await getAuthorBySlug(slug);

    if (!author) {
        return { title: t(lang, "author.metaFallbackTitle") };
    }

    return {
        title: t(lang, "author.metaTitle", { name: author.name }),
        description: getAuthorDescription(lang, author),
        // Authors are not translated in Strapi, so non-English URLs canonicalise to English.
        alternates: buildLocalizedAlternates({
            lang,
            path: `/author/${author.slug}`,
            isFallback: true,
        }),
    };
}

export default async function AuthorPage({ params }) {
    const { lang, slug } = await params;
    if (!isLocale(lang)) notFound();

    const author = await getAuthorBySlug(slug);

    if (!author) {
        notFound();
    }

    const { blogs } = author;
    const avatarUrl = author.profileImage?.url;
    const postCount = blogs.length;
    const authorUrl = `${SITE_URL}${localizePath(DEFAULT_LOCALE, `/author/${author.slug}`)}`;

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${authorUrl}#person`,
        name: author.name,
        url: authorUrl,
        ...(author.designation ? { jobTitle: author.designation } : {}),
        ...(author.bio?.trim() ? { description: author.bio.trim() } : {}),
        ...(avatarUrl ? { image: avatarUrl } : {}),
        worksFor: { "@type": "Organization", name: "WebMaffia", url: `${SITE_URL}/` },
    };

    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: t(lang, "breadcrumb.home"), path: "/" },
        { name: t(lang, "breadcrumb.blog"), path: localizePath(lang, "/blog") },
        { name: author.name, path: localizePath(lang, `/author/${author.slug}`) },
    ]);

    return (
        <main className="wrapper">
            <JsonLd data={personSchema} />
            <JsonLd data={breadcrumbSchema} />
            <div className="author_page">
                <section className="author_hero">
                    <div className="author_avatar">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={author.profileImage?.alternativeText || author.name}
                                fill
                                sizes="(max-width: 900px) 40vw, 20rem"
                                className="author_avatar_img"
                                priority
                            />
                        ) : (
                            <span aria-hidden="true">{getInitials(author.name)}</span>
                        )}
                    </div>
                    <div className="author_info">
                        <span className="author_label">{t(lang, "author.label")}</span>
                        <h1>{author.name}</h1>
                        {author.designation ? (
                            <div className="author_designation">{author.designation}</div>
                        ) : null}
                        {author.bio?.trim() ? <p className="author_bio">{author.bio.trim()}</p> : null}
                        <div className="author_count">
                            {postCount}{" "}
                            {t(lang, postCount === 1 ? "author.articleOne" : "author.articleMany")}
                        </div>
                    </div>
                </section>

                <section className="our_blog author_posts">
                    <h2 className="h5 author_posts_title">
                        {t(lang, "author.postsTitle", { name: author.name })}
                    </h2>
                    {postCount > 0 ? (
                        <div className="other_blogs">
                            {blogs.map((blog) => (
                                <BlogListItem key={blog.id} post={blog} lang={lang} />
                            ))}
                        </div>
                    ) : (
                        <p className="author_empty">
                            {t(lang, "author.emptyBefore")}{" "}
                            <Link href={localizePath(lang, "/blog")} className="link">
                                {t(lang, "author.emptyLink")}
                            </Link>
                            .
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}
