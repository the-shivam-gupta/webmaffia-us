import { sanitizeBlogArticleHtml } from "@/lib/sanitize-blog-html";

export default function BlogStrapiArticle({ html }) {
    if (!html) return null;

    const content = sanitizeBlogArticleHtml(html);

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
