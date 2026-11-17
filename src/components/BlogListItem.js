import Image from "next/image";
import { t } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { formatBlogDate, getBlogCategories, getStrapiImageUrl } from "@/lib/strapiPage";

// The blog lives on the main site (MAIN_DOMAIN), not in this project, so every
// link here points there and opens in a new tab.
const MAIN_DOMAIN = (process.env.MAIN_DOMAIN ?? "").trim().replace(/[/]+$/, "");
const EXTERNAL = MAIN_DOMAIN ? { target: "_blank", rel: "noopener noreferrer" } : {};

// `TitleTag` is the heading level of the card title: h2 on the blog list and
// author pages, h3 where the card sits under a section heading (service pages).
export default function BlogListItem({ post, lang = "en", TitleTag = "h2" }) {
  const href = `${MAIN_DOMAIN}${localizePath(lang, `/blog/${post.slug}`)}`;
  const imageUrl = getStrapiImageUrl(post.image);
  const category = getBlogCategories(post)[0];

  return (
    <div className="blog_item">
      <a href={href} {...EXTERNAL}>
        <div className="blog_item_image">
          <Image
            src={imageUrl}
            alt={post.image?.alternativeText || post.heading || t(lang, "blog.postAlt")}
            fill
            sizes="(max-width: 900px) 100vw, 67rem"
            className="blog_item_img"
          />
        </div>
      </a>
      {category ? (
        <a
          href={`${MAIN_DOMAIN}${localizePath(lang, "/blog")}?category=${category.slug}`}
          className="blog_category_badge"
          {...EXTERNAL}
        >
          {category.title}
        </a>
      ) : null}
      <div>
        <a href={href} {...EXTERNAL}>
          <TitleTag className="h5 blog_item_title h3_plain">{post.heading}</TitleTag>
          {post.excerpt ? <p>{post.excerpt}</p> : null}
          <div className="blog_para">
            <div className="blogs_date">
              <span>{formatBlogDate(post.date)}</span>
              <span>{post.readTime}</span>
            </div>
            <span className="link blog_link">{t(lang, "blog.readMore")}</span>
          </div>
        </a>
      </div>
    </div>
  );
}
