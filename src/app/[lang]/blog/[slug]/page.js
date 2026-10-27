import { notFound, permanentRedirect } from "next/navigation";
import BlogDetailPage from "@/components/BlogDetailPage";
import BlogStrapiArticle from "@/components/BlogStrapiArticle";
import JsonLd from "@/components/JsonLd";
import { buildFaqPageSchema, prepareStrapiArticleHtml } from "@/lib/blog-helpers";
import { buildLocalizedAlternates, localesForSlug } from "@/lib/blog-seo";
import { t } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, isLocale, localizePath } from "@/lib/i18n";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/schema";
import {
    formatBlogDate,
    getAllBlogCategories,
    getBlogBySlug,
    getBlogCategories,
    getBlogsByLocale,
    getPostAuthor,
    getRelatedStrapiPosts,
    getSeoFields,
    getStrapiImageUrl,
} from "@/lib/strapiPage";

function BlogTitle({ heading }) {
    const lines = String(heading ?? "").split("\n").filter(Boolean);
    if (lines.length <= 1) return heading;

    return lines.map((line, index) => (
        <span key={index}>
            {index > 0 ? <br /> : null}
            {line}
        </span>
    ));
}

// Runs once per locale from the [lang] layout. Only posts that really exist in
// a locale are prerendered; anything else (e.g. English fallback under /hi/...)
// renders on demand.
export async function generateStaticParams({ params }) {
    const { lang } = await params;
    const postsByLocale = await getBlogsByLocale();
    return (postsByLocale[lang] ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    if (!isLocale(lang)) return {};

    const post = await getBlogBySlug(slug, lang);

    if (!post) {
        return { title: t(lang, "meta.blog.title") };
    }

    const title = post.heading?.replace(/\n/g, " ") ?? t(lang, "blog.detail.fallbackTitle");
    const seo = getSeoFields(post.seo);
    const postsByLocale = await getBlogsByLocale();
    const alternates = buildLocalizedAlternates({
        lang,
        path: `/blog/${post.slug}`,
        isFallback: post.isFallback,
        availableLocales: localesForSlug(postsByLocale, post.slug),
    });

    return {
        title: seo.title ?? `${title} | Webmaffia`,
        description: seo.description ?? post.excerpt,
        ...(seo.keywords ? { keywords: seo.keywords } : {}),
        alternates: {
            ...alternates,
            canonical: seo.canonical ?? alternates.canonical,
        },
    };
}

function toAbsoluteUrl(url) {
    if (!url) return url;
    return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export default async function StrapiBlogPage({ params }) {
    const { lang, slug } = await params;
    if (!isLocale(lang)) notFound();

    const post = await getBlogBySlug(slug, lang);

    if (!post) {
        notFound();
    }

    if (post.slug !== slug) {
        permanentRedirect(localizePath(lang, `/blog/${post.slug}`));
    }

    const preparedArticle = prepareStrapiArticleHtml(post.description);
    const relatedPosts = await getRelatedStrapiPosts(post.slug, 3, lang);
    const categories = await getAllBlogCategories(lang);

    // Fallback content is English, so its structured data points at the English URL.
    const schemaLang = post.isFallback ? DEFAULT_LOCALE : lang;
    const schemaPostPath = localizePath(schemaLang, `/blog/${post.slug}`);

    const author = getPostAuthor(post);
    const headline = post.heading?.replace(/\n/g, " ") ?? "";
    const publishedAt = post.publishedAt || post.createdAt || null;
    const modifiedAt = post.updatedAt || publishedAt;

    const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}${schemaPostPath}`,
        },
        headline,
        description: post.excerpt ?? "",
        image: toAbsoluteUrl(getStrapiImageUrl(post.image)),
        author: author
            ? {
                "@type": "Person",
                name: author.name,
                url: `${SITE_URL}${localizePath(schemaLang, `/author/${author.slug}`)}`,
            }
            : {
                "@type": "Organization",
                name: "WebMaffia",
                url: `${SITE_URL}/`,
            },
        publisher: {
            "@type": "Organization",
            name: "WebMaffia",
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/assets/images/icons/webmaffia.webp`,
            },
        },
        ...(publishedAt ? { datePublished: publishedAt } : {}),
        ...(modifiedAt ? { dateModified: modifiedAt } : {}),
    };

    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: t(lang, "breadcrumb.home"), path: "/" },
        { name: t(lang, "breadcrumb.blog"), path: localizePath(schemaLang, "/blog") },
        { name: headline || post.slug, path: schemaPostPath },
    ]);

    const faqPageSchema = buildFaqPageSchema(post.description);

    return (
        <>
            <JsonLd data={blogPostingSchema} />
            <JsonLd data={breadcrumbSchema} />
            {faqPageSchema && <JsonLd data={faqPageSchema} />}
            <BlogDetailPage
                lang={lang}
                slug={post.slug}
                title={<BlogTitle heading={post.heading} />}
                date={formatBlogDate(post.date)}
                readTime={post.readTime}
                author={author}
                image={getStrapiImageUrl(post.image)}
                imageAlt={post.image?.alternativeText || post.heading || ""}
                stickyLinks={preparedArticle.stickyLinks}
                relatedPosts={relatedPosts}
                categories={categories}
                postCategory={getBlogCategories(post)[0] ?? null}
            >
                <BlogStrapiArticle html={preparedArticle.html} />
            </BlogDetailPage>
        </>
    );
}
