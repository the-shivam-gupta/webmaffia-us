/** Normalize blog article HTML for consistent SSR/hydration. */
export function sanitizeBlogArticleHtml(html) {
  return html
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\s*<\/div>\s*<div class=["']blog_info["']>\s*$/i, "")
    .trim();
}
