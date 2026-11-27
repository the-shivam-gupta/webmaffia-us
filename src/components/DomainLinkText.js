// Renders text and turns a bare domain (e.g. "sanyospecialsteel.in") into a
// plain clickable link. No hover effect, it just inherits the surrounding style.
const DOMAIN_RE = /^(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?)$/i;

export default function DomainLinkText({ text }) {
  const value = typeof text === "string" ? text.trim() : "";
  const match = value.match(DOMAIN_RE);
  if (!match) return text ?? null;

  const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return (
    <a
      className="domain_link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {value}
    </a>
  );
}
