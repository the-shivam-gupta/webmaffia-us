// "View Profile" link to a team leader's LinkedIn page, shown under their name.
export default function TeamLinkedIn({ href, name }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="team_link"
      aria-label={`View ${name}'s LinkedIn profile`}
    >
      View Profile
    </a>
  );
}
