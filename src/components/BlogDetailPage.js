import Image from "next/image";
import Link from "next/link";
import BlogAudioPlayer from "./BlogAudioPlayer";
import BlogEnquiryForm from "./BlogEnquiryForm";
import BlogReadingProgress from "./BlogReadingProgress";
import BlogShare from "./BlogShare";
import BlogStickyNav from "./BlogStickyNav";
import { t } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";

function Lines({ text }) {
  return text.split("\n").map((line, index) => (
    <span key={index}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

const BLOG_SERVICES = [
  { href: "/services/digital-strategy", num: "01", labelKey: "blog.services.digitalStrategy" },
  {
    href: "/services/website-design-development-services",
    num: "02",
    labelKey: "blog.services.design",
  },
  { href: "/services/search-engine-optimization-services", num: "03", labelKey: "blog.services.seo" },
  { href: "/services/social-media-marketing-strategy", num: "04", labelKey: "blog.services.social" },
  { href: "/services/content-marketing-strategy", num: "05", labelKey: "blog.services.content" },
  { href: "/services/influencer-marketing", num: "06", labelKey: "blog.services.influencer" },
];

export default function BlogDetailPage({
  lang = "en",
  slug,
  title,
  date,
  readTime,
  author,
  image,
  imageAlt = "",
  stickyLinks: stickyLinksProp,
  relatedPosts: relatedPostsProp,
  latestPosts: latestPostsProp,
  categories: categoriesProp,
  postCategory,
  children,
}) {
  const stickyLinks = stickyLinksProp ?? [];
  const relatedPosts = relatedPostsProp ?? [];
  const categories = categoriesProp ?? [];
  const latestPosts = (latestPostsProp ?? relatedPosts).slice(0, 3);

  return (
    <main className="wrapper">
      <BlogReadingProgress />
      <div className="ml-setter blog_detail">
        <section className="blog_main" data-section="blog_main">
          <div className="blog_section">
            <div className="" id="mob_sticky_article" />
            <div className="blog_set">
              <div className="blog_page">
                <nav className="blog_breadcrumb" aria-label="Breadcrumb">
                  <Link href="/">{t(lang, "breadcrumb.home")}</Link>
                  <span aria-hidden="true">/</span>
                  <Link href={localizePath(lang, "/blog")}>{t(lang, "breadcrumb.blog")}</Link>
                </nav>
                <h1>{title}</h1>
                <div className="blog_meta">
                  <div className="blog_date">
                    <span>{date}</span>
                    <span>|</span>
                    <span>{readTime}</span>
                  </div>
                  <BlogShare title={title} />
                  <BlogShare title={title} variant="float" />
                </div>
                {author ? (
                  <div className="author_byline">
                    {t(lang, "blog.detail.by")}{" "}
                    <Link href={localizePath(lang, `/author/${author.slug}`)} className="link">{author.name}</Link>
                  </div>
                ) : null}
                {image ? (
                  <div className="blog_detail_img_wrap">
                    <Image
                      src={image}
                      alt={imageAlt}
                      width={1030}
                      height={709}
                      className="blog_detail_img"
                      priority
                    />
                    {postCategory ? (
                      <Link
                        href={`${localizePath(lang, "/blog")}?category=${postCategory.slug}`}
                        className="blog_category_badge"
                      >
                        {postCategory.title}
                      </Link>
                    ) : null}
                  </div>
                ) : null}
                <BlogAudioPlayer />
                <div className="blog_title" />
                <div className="blog_content">{children}</div>
                <div className="blog_info" />
              </div>
              <aside>
                {latestPosts.length > 0 ? (
                  <div className="blog_latest">
                    <div className="aside_title">Latest articles</div>
                    <div className="blog_latest_list">
                      {latestPosts.map((post) => (
                        <Link key={post.href} href={post.href} className="blog_latest_item">
                          <div className="blog_latest_image">
                            <Image
                              src={post.image}
                              alt={post.imageAlt || ""}
                              fill
                              sizes="(max-width: 900px) 40vw, 14rem"
                              className="blog_latest_img"
                            />
                          </div>
                          <div className="blog_latest_info">
                            <div className="blog_latest_heading">{post.title}</div>
                            <div className="blog_latest_meta">
                              <span>{post.date}</span>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="blog_services">
                  <div className="aside_title">
                    <Lines text={t(lang, "blog.detail.servicesTitle")} />
                  </div>
                  <div className="service_types">
                    {BLOG_SERVICES.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        data-service={service.num}
                        className="service_text"
                      >
                        <span className="service_label">{t(lang, service.labelKey)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="blog_toc_wrap">
                  <BlogStickyNav links={stickyLinks} />
                </div>
                {/* Same Google "preferred source" button as the footer. The script
                    (loaded in the footer) only scans the DOM once, so both
                    themes are rendered and toggled with CSS. */}
                <div className="blog_google_source">
                  <div className="blog_google_source_title">
                    Prefer our articles on Google?
                  </div>
                  <p className="blog_google_source_text">
                    See more of Webmaffia in the Top stories section when you
                    search on Google.
                  </p>
                  <div
                    className="blog_google_source_light"
                    google-add-preferred-source-btn=""
                    data-theme="light"
                  />
                  <div
                    className="blog_google_source_dark"
                    google-add-preferred-source-btn=""
                    data-theme="dark"
                  />
                </div>
                <div className="blog_enquiry_wrap">
                  <BlogEnquiryForm />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {relatedPosts.length > 0 && (
        <section
          className="other_detail_blogs"
          data-section="other_detail_blogs"
        >
          <div className="detail_title">
            <Lines text={t(lang, "blog.detail.relatedTitle")} />
          </div>
          <div className="other_blogs">
            {relatedPosts.map((post) => (
              <div className="blog_item" key={post.href}>
                <Link href={post.href}>
                  <div className="blog_item_image">
                    <Image
                      src={post.image}
                      alt={post.imageAlt || ""}
                      fill
                      sizes="(max-width: 900px) 100vw, 67rem"
                      className="blog_item_img"
                    />
                  </div>
                </Link>
                {post.category ? (
                  <Link
                    href={`${localizePath(lang, "/blog")}?category=${post.category.slug}`}
                    className="blog_category_badge"
                  >
                    {post.category.title}
                  </Link>
                ) : null}
                <div>
                  <Link href={post.href}>
                    <div className="h5 blog_item_title">{post.title}</div>
                    {post.excerpt ? <p>{post.excerpt}</p> : null}
                    <div className="blog_para">
                      <div className="blogs_date">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <span className="link blog_link">{t(lang, "blog.readMore")}</span>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
