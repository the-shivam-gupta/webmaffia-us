import BlogCategorySelect from "@/components/BlogCategorySelect";
import { localizePath } from "@/lib/i18n";

export default function BlogSearch({ defaultValue = "", category = "", categories = [], lang = "en" }) {
  return (
    <form className="blog_search" action={localizePath(lang, "/blog")} method="get" role="search">
      <div className="blog_search_bar">
        <div className="blog_search_field">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            name="q"
            defaultValue={defaultValue}
            placeholder="Search articles"
            aria-label="Search articles"
            autoComplete="off"
          />
        </div>
        <button type="submit">Search</button>
      </div>
      {categories.length ? <BlogCategorySelect categories={categories} value={category} /> : null}
    </form>
  );
}
