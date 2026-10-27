import Link from "next/link";
import { t } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";

function buildHref(lang, page, category, search) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("q", search);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  const base = localizePath(lang, "/blog");
  return qs ? `${base}?${qs}` : base;
}

function getPageNumbers(currentPage, totalPages) {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export default function BlogPagination({ currentPage, totalPages, category, query, lang = "en" }) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="blog_pagination" aria-label={t(lang, "blog.pagination.label")}>
      <Link
        href={buildHref(lang, currentPage - 1, category, query)}
        className={`blog_pagination_arrow ${currentPage === 1 ? "disabled" : ""}`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        {t(lang, "blog.pagination.prev")}
      </Link>

      <ul className="blog_pagination_list">
        {pageNumbers.map((page, index) => {
          const previous = pageNumbers[index - 1];
          const showEllipsis = previous !== undefined && page - previous > 1;

          return (
            <li key={page}>
              {showEllipsis ? <span className="blog_pagination_ellipsis">…</span> : null}
              <Link
                href={buildHref(lang, page, category, query)}
                className={`blog_pagination_number ${page === currentPage ? "active" : ""}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href={buildHref(lang, currentPage + 1, category, query)}
        className={`blog_pagination_arrow ${currentPage === totalPages ? "disabled" : ""}`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        {t(lang, "blog.pagination.next")}
      </Link>
    </nav>
  );
}
